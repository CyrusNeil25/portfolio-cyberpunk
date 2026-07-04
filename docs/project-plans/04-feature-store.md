# Project 4: Real-Time Feature Store for ML/Analytics

## 1. One-Line Resume Pitch

"Built a real-time feature store ingesting streaming events into low-latency online storage and point-in-time-correct offline storage, closing the training/serving skew gap common in ML pipelines."

## 2. Problem / Why It Matters

Any company running ML models in production (recommendations, fraud detection, personalization) hits the same problem: the features used to train a model (computed in bulk over historical data) must exactly match the features computed at serving time (computed in real time, per request) — and they usually don't, causing "training/serving skew" that silently degrades model quality. Solving this well requires a feature store: a system that computes features once, serves them with millisecond latency for online inference, and also stores them in a form usable for offline training with correct point-in-time semantics (you must not let a model train on a feature value that includes future data). This is squarely "ML Platform Engineer" / senior data-infrastructure territory.

## 3. Scope

**MVP:**
- Event ingestion API accepting typed events (e.g., `user_click`, `purchase`) with a timestamp, written to a Kinesis stream
- A stream-processing consumer computing simple aggregations over sliding/tumbling windows (e.g., "purchases in last 1h", "click count in last 10 min") per entity (e.g., per user_id)
- Online store: write computed features to DynamoDB (or Redis) keyed by entity ID, with low-latency read API for serving-time feature lookup
- Offline store: also persist raw events (and/or computed feature snapshots) to S3 in Parquet, queryable via Athena, for training-data generation

**Stretch:**
- Point-in-time correct training-data generation: given a list of (entity_id, label_timestamp) pairs, generate a training dataset where each row's features reflect only data available *before* that timestamp (the single hardest and most valuable feature-store problem to solve correctly)
- Feature versioning/schema registry: track feature definitions (name, computation logic, version) so serving and training code reference the same definition
- Backfill capability: recompute historical features from raw event history when a feature definition changes
- A simple feature-freshness monitor (alert if a feature hasn't updated within its expected SLA)

## 4. Architecture

```
Event producers (apps) ──POST /events──> Ingestion API (Node/TS) ──put──> Kinesis stream
                                                                              │
                                                          ┌───────────────────┴───────────────────┐
                                                          ▼                                        ▼
                                              Stream processor (KCL / Lambda)          Kinesis Firehose
                                              windowed aggregation per entity                       │
                                                          │                                          ▼
                                                          ▼                                 S3 (raw events, Parquet)
                                              Online store (DynamoDB/Redis)                          │
                                                          ▲                                          ▼
                                                          │                                   Athena / Glue
Serving-time client ──GET /features/{entity_id}──────────┘                          (offline feature computation,
                                                                                       point-in-time training sets)
```

## 5. Tech Stack

- **Language/framework:** TypeScript/Node.js for the ingestion API and any orchestration glue; the stream processor can be Node (Kinesis Client Library / `aws-sdk` consumer) or a Lambda function (Node or Python — Python is fine here since the aggregation logic benefits from `pandas`/`pyarrow` if writing Parquet directly)
- **Streaming:** AWS Kinesis Data Streams (ingestion) + Kinesis Data Firehose (S3 delivery for offline path)
- **Online store:** DynamoDB (single-digit-ms reads, TTL support for feature expiry) — Redis as an alternative if you want to demonstrate that instead
- **Offline store:** S3 + Parquet, queried via Athena/Glue Catalog
- **Testing:** `vitest`/`jest` for ingestion logic, a dedicated correctness test suite for the point-in-time join logic (this is the part worth testing hardest)

## 6. Core Technical Challenges

- **Windowed aggregation correctness** — implementing sliding/tumbling window aggregation correctly (handling late-arriving events, out-of-order events within a tolerance window) is a real streaming-systems problem; document your chosen watermark/lateness policy explicitly.
- **Point-in-time correctness (the hardest, most valuable problem here)** — when generating a training dataset, a naive "join current feature value to historical label" approach leaks future information into training data (a classic, extremely common real-world ML bug). Implement an "as-of" join: for each (entity, label_timestamp), select the feature value as it existed at that timestamp, not the latest value. Being able to explain this problem and demonstrate the fix is the single highest-signal piece of this whole project for ML-platform-adjacent roles.
- **Online/offline consistency** — the same aggregation logic (e.g., "count in last 1h") must produce consistent semantics whether computed by the streaming path (online) or recomputed from raw S3 events (offline/backfill); a shared feature-definition module (not duplicated logic in two places) is the correct design here.
- **Write throughput and hot partitions** — DynamoDB (or any KV store) can hit throttling on hot entity IDs (e.g., a viral post's like count); discuss/demonstrate a mitigation (write sharding, or accepting eventual consistency with periodic flush from an in-memory aggregator).
- **Backfill without downtime** — recomputing historical features (e.g., after fixing a bug in a feature definition) must not disrupt live serving reads; process backfills into a separate versioned key space and cut over atomically.

## 7. API / Data Model Sketch

```
POST /events  {"entity_id": str, "event_type": str, "timestamp": iso8601, "payload": {...}}
GET  /features/{entity_id}  -> {"purchase_count_1h": 3, "click_count_10m": 12, "computed_at": "..."}
POST /training-dataset  {"entity_label_pairs": [{"entity_id", "label_timestamp"}]}
     -> generates a point-in-time-correct feature snapshot per row (async job, result in S3)

online_features (DynamoDB): pk=entity_id, sk=feature_name, value, computed_at, ttl
raw_events (S3/Parquet, partitioned by event date): entity_id, event_type, timestamp, payload
```

## 8. AWS Infra Plan

- **Ingestion:** Kinesis Data Stream (on-demand mode to avoid shard-management overhead for a portfolio-scale project)
- **Processing:** Lambda consumer (Kinesis event source mapping) for windowed aggregation, writing to DynamoDB
- **Offline delivery:** Kinesis Firehose → S3 (Parquet conversion via Firehose's built-in format conversion, backed by a Glue table schema)
- **Query:** Athena over the Glue Catalog table for ad-hoc and training-set queries
- **API:** ECS Fargate (or Lambda + API Gateway) for the ingestion/feature-serving API
- **IaC:** Terraform for Kinesis stream, Firehose delivery stream, Lambda + event source mapping, DynamoDB table, Glue Catalog table, Athena workgroup

## 9. Observability & Testing

- **Metrics:** ingestion rate, Kinesis iterator age (lag indicator — critical streaming metric), DynamoDB throttle count, feature-serving read latency (p50/p95/p99), offline pipeline freshness (time since last Firehose delivery)
- **Testing:** unit tests for window aggregation (including out-of-order/late event cases), a dedicated correctness test for the point-in-time join (construct a small synthetic event history, assert the training-set generator returns exactly the features that existed at each label timestamp — no future leakage), load test the ingestion API and measure Kinesis iterator age under load

## 10. Security Considerations

- Ingestion API should validate event schemas strictly (reject malformed/oversized payloads) to protect downstream consumers from poison-pill records
- IAM roles scoped per-service (Lambda consumer only needs Kinesis read + DynamoDB write; ingestion API only needs Kinesis put) — least-privilege as a demonstrated practice, not just a checkbox
- If events contain PII, document a retention/TTL policy on both the online store (DynamoDB TTL) and offline store (S3 lifecycle rules)

## 11. Suggested Build Timeline

- **Weekend 1:** Ingestion API → Kinesis, a simple Lambda consumer computing one aggregation, DynamoDB online store, feature-read API
- **Weekend 2:** Firehose → S3 Parquet offline path, Athena querying, a couple more feature definitions
- **Weekend 3 (the important one):** Point-in-time training-dataset generation with a correctness test suite proving no future-data leakage
- **Weekend 4 (stretch):** Backfill capability, feature versioning/schema registry, freshness monitoring

## 12. Resume Bullets (draft)

- Built a real-time feature store ingesting events via Kinesis into a DynamoDB online store with sub-Xms p99 read latency for serving-time feature lookups.
- Implemented point-in-time-correct training dataset generation, eliminating future-data leakage present in the naive current-value-join approach, validated via a dedicated correctness test suite.
- Designed a shared feature-definition layer ensuring consistent aggregation semantics between the real-time streaming path and offline S3/Athena backfill path.
- Instrumented Kinesis consumer lag and DynamoDB throttling metrics, enabling proactive detection of ingestion pipeline degradation before feature staleness impacted downstream models.

## 13. Demo / Portfolio Requirements

- Demo: send a burst of synthetic events, show the online feature value update in near-real-time via the read API, then show the same data queryable via Athena in the offline store
- The standout artifact: a small notebook/script demonstrating the point-in-time join bug (show a naive join leaking future data) vs. the correct as-of join, side by side
- Architecture diagram, README covering the online/offline consistency design decision
