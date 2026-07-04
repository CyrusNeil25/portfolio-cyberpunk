# Project 1: Multi-Tenant LLM Gateway & Observability Platform

## 1. One-Line Resume Pitch

"Built a multi-tenant LLM gateway handling provider failover, per-tenant rate limiting, and semantic caching, cutting redundant LLM spend by 30%+ while maintaining sub-100ms routing overhead."

## 2. Problem / Why It Matters

Every company adopting LLMs eventually needs a control-plane layer between their applications and LLM providers (Anthropic, OpenAI, Bedrock) — otherwise every team calls providers directly, with no shared rate limiting, no cost visibility, no caching, and no resilience when a provider has an outage. This is exactly the "AI platform team" problem that senior/staff engineers are hired to solve at companies scaling up AI features. Building this proves you understand LLM APIs as *just another backend dependency* that needs the same reliability engineering as a database or payments provider — not magic.

## 3. Scope

**MVP (build this first):**
- Reverse-proxy API accepting OpenAI-compatible chat completion requests
- Routes to 2+ backend providers (e.g., Anthropic + OpenAI, or Anthropic + Bedrock) via a provider adapter interface
- Per-tenant API keys with request-per-minute and token-per-day quotas (Redis-backed sliding window)
- Response streaming (SSE) passthrough
- Basic cost tracking per tenant (tokens in/out × provider pricing table, stored in Postgres)
- Structured request/response logging (with configurable field redaction for PII)

**Stretch (v2):**
- Semantic caching: embed incoming prompts, check a vector cache (pgvector/Redis) for a near-duplicate prior request within a similarity threshold, return cached response
- Automatic failover: if primary provider errors or times out, retry against a fallback provider with the same prompt (circuit breaker pattern, not naive retry)
- Prompt-injection / jailbreak detection middleware (regex + classifier heuristics) with configurable block/flag modes
- A small admin dashboard (read-only) showing per-tenant spend, latency percentiles, and error rates
- Model routing policies (e.g., route "cheap/fast" requests to Haiku-class models, "complex" requests to larger models, based on a request-tagged tier)

## 4. Architecture

```
Client apps
   │  (OpenAI-compatible request + tenant API key)
   ▼
┌─────────────────────────────┐
│   FastAPI Gateway (ECS)     │
│  ┌────────────────────────┐ │
│  │ AuthN middleware        │ │──> DynamoDB (tenant keys/quotas config)
│  │ Rate limiter (Redis)    │ │──> ElastiCache Redis (sliding window counters)
│  │ Semantic cache lookup   │ │──> pgvector (RDS) [stretch]
│  │ Provider router         │ │
│  │  ├─ Anthropic adapter   │ │──> Anthropic API
│  │  ├─ OpenAI adapter      │ │──> OpenAI API
│  │  └─ Bedrock adapter     │ │──> AWS Bedrock
│  │ Circuit breaker         │ │
│  │ Cost/usage recorder     │ │──> RDS Postgres (usage_events table)
│  │ OTel instrumentation    │ │──> CloudWatch / X-Ray (traces+metrics)
│  └────────────────────────┘ │
└─────────────────────────────┘
```

Requests are stateless at the gateway layer (horizontally scalable); all shared state (quotas, cache, usage) lives in Redis/Postgres so any instance can serve any tenant.

## 5. Tech Stack

- **Language/framework:** Python 3.12, FastAPI, `httpx` (async provider calls), `pydantic` v2 for request/response schemas
- **Datastores:** ElastiCache (Redis) for rate-limit counters + cache; RDS Postgres for usage/cost events and tenant config; optional pgvector extension for semantic cache
- **Queueing:** none required for MVP (synchronous proxy); consider SQS for async usage-event writes if write volume becomes a bottleneck
- **Observability:** OpenTelemetry SDK → AWS X-Ray (traces) + CloudWatch (metrics/logs)
- **Testing:** `pytest` + `pytest-asyncio`, `respx` for mocking provider HTTP calls, `locust` for load testing

## 6. Core Technical Challenges (the senior-signal part)

- **Sliding-window rate limiting under concurrency** — a naive `INCR`+`EXPIRE` in Redis has race conditions at the window boundary; implement using a Redis Lua script (atomic) for a sliding-window log or token-bucket algorithm, and load-test it with concurrent requests to confirm no over-admission.
- **Streaming through a proxy without buffering the whole response** — must proxy SSE chunks to the client as they arrive from the upstream provider while *also* accumulating them to compute final token counts for billing after the stream closes, without adding significant latency per chunk.
- **Provider abstraction that doesn't leak provider quirks** — normalize Anthropic's, OpenAI's, and Bedrock's differing request/response shapes, error codes, and streaming formats behind one internal interface, so adding a 4th provider requires only a new adapter class, not gateway changes.
- **Circuit breaker correctness** — track per-provider error rates over a rolling window; trip the breaker to stop sending traffic to a failing provider (and fall back), but half-open/retry periodically to detect recovery, without flapping.
- **Idempotent, exactly-once cost recording** — a request that gets retried internally (failover) must not double-bill the tenant; use a request ID and upsert-on-conflict semantics in the usage table.
- **Semantic cache correctness (stretch)** — embedding-similarity cache hits can return subtly wrong answers if the similarity threshold is too loose; needs an evaluation step (sampled human/LLM-judge review) to tune the threshold, and must never cache across tenants (data isolation).

## 7. API / Data Model Sketch

```
POST /v1/chat/completions          (OpenAI-compatible; tenant auth via Bearer key)
GET  /v1/usage?tenant_id=...        (usage/cost summary, admin-scoped)
GET  /v1/health                     (liveness/readiness)

usage_events table:
  id (uuid, pk), tenant_id, request_id (unique), provider, model,
  tokens_in, tokens_out, cost_usd, latency_ms, cache_hit (bool), created_at

tenant_config table:
  tenant_id (pk), api_key_hash, rpm_limit, daily_token_limit, allowed_models[]
```

## 8. AWS Infra Plan

- **Compute:** ECS Fargate service (2+ tasks, autoscaled on CPU/request count) behind an ALB
- **Cache:** ElastiCache for Redis (single-node for MVP, cluster mode for stretch)
- **DB:** RDS Postgres (db.t4g.micro is enough for a portfolio project) with `pgvector` extension if building semantic cache
- **Secrets:** provider API keys in AWS Secrets Manager, injected into ECS task definition
- **Observability:** CloudWatch Logs (structured JSON logs), CloudWatch Metrics (custom metrics for cache hit rate, rate-limit rejections), X-Ray for distributed tracing
- **IaC:** Terraform modules for VPC, ECS service, ALB, ElastiCache, RDS, IAM roles — keep it in a `terraform/` folder in the project repo so the infra itself is part of the portfolio artifact

## 9. Observability & Testing

- **Metrics:** request rate, p50/p95/p99 latency by provider, cache hit rate, rate-limit rejection rate, cost per tenant per hour, provider error rate
- **Tracing:** one trace per request spanning auth → rate-limit check → cache lookup → provider call → response, so a slow request's bottleneck is immediately visible
- **SLOs:** define e.g. "p95 gateway overhead (excluding provider latency) < 50ms", "99.9% of requests correctly rate-limited under load test"
- **Testing:** unit tests per adapter (mocked provider responses, including error/timeout cases), integration test hitting a local Redis+Postgres via `testcontainers`, load test with `locust` simulating multiple tenants to verify rate limiter correctness under concurrency

## 10. Security Considerations

- Tenant API keys stored as hashes (never plaintext) in DynamoDB/Postgres; rotate via an admin endpoint
- All provider credentials in Secrets Manager, never in env vars committed to config
- PII redaction option on logged prompts/responses (configurable regex-based scrubber for emails/SSNs/etc. before logging)
- Rate limiting itself is a DoS defense; add a global (cross-tenant) circuit breaker so one runaway tenant can't exhaust shared provider quota
- If building prompt-injection detection, document clearly that it's a best-effort heuristic layer, not a guarantee — avoid overclaiming security properties

## 11. Suggested Build Timeline (solo, part-time)

- **Weekend 1:** FastAPI skeleton, single provider adapter (Anthropic), basic auth, deploy to ECS
- **Weekend 2:** Add second provider, rate limiting (Redis sliding window), usage/cost tracking to Postgres
- **Weekend 3:** Streaming support, OTel tracing/metrics, load testing, README + architecture diagram
- **Weekend 4 (stretch):** Semantic caching, circuit breaker/failover, mini admin dashboard

## 12. Resume Bullets (draft — fill in real numbers once built)

- Designed and built a multi-tenant LLM gateway in FastAPI routing requests across 2+ LLM providers with automatic failover, reducing p99 error rate during simulated provider outages from X% to Y%.
- Implemented Redis-backed sliding-window rate limiting handling N concurrent requests/sec with zero over-admission under load testing.
- Instrumented the full request pipeline with OpenTelemetry/X-Ray, reducing mean time to diagnose latency regressions from ad-hoc log-grepping to single-trace root-cause in under 2 minutes.
- (If semantic cache built) Implemented embedding-based semantic caching, achieving a X% cache hit rate and reducing redundant LLM API spend by $Y/month at simulated production traffic.

## 13. Demo / Portfolio Requirements

- Architecture diagram (can reuse the ASCII one above, redrawn cleanly)
- A short terminal/GIF demo: send a request, show it hit provider A; kill provider A's connectivity (or point to an invalid endpoint), send again, show automatic failover to provider B
- A screenshot of a Grafana/CloudWatch dashboard showing live request rate, cache hit rate, and per-tenant cost
- README with setup instructions, a `docker-compose.yml` for local dev (Redis + Postgres), and the Terraform plan for AWS deploy
