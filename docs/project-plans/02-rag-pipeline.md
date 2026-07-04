# Project 2: RAG-as-a-Service Pipeline

## 1. One-Line Resume Pitch

"Built an async, event-driven RAG pipeline processing document ingestion through hybrid retrieval to citation-grounded generation, with an automated evaluation harness catching retrieval regressions before deploy."

## 2. Problem / Why It Matters

Almost every company adding "AI search" or "chat with your docs" features needs a RAG pipeline, and almost all first attempts are a Jupyter notebook that chunks documents naively and never gets re-evaluated. The senior-level version of this problem is: ingestion has to be incremental and async (you can't re-embed a 100k-document corpus synchronously on every upload), retrieval has to combine keyword and semantic search (pure vector search misses exact-match queries like part numbers or names), and — most importantly — you need a way to *measure* whether retrieval quality is actually good, because "it looks right when I tried it" doesn't scale. Building this proves data-pipeline engineering and ML evaluation discipline, not just gluing together a vector DB and an LLM call.

## 3. Scope

**MVP:**
- Document ingestion API: accepts PDF/text/markdown uploads, stores raw file in S3
- Async chunking + embedding worker (SQS-triggered): chunks documents (recursive character splitting with overlap), generates embeddings (Bedrock Titan or OpenAI `text-embedding-3`), writes to a vector store
- Vector store: pgvector on RDS (or OpenSearch Serverless if you want to demonstrate that service specifically)
- Query API: takes a question, retrieves top-k chunks by vector similarity, constructs a grounded prompt, calls an LLM, returns answer + source citations (chunk IDs / document references)
- Basic ingestion status tracking (pending/processing/done/failed per document)

**Stretch:**
- Hybrid search: combine BM25 (keyword) score with vector similarity score (reciprocal rank fusion), demonstrably improving recall on exact-match test queries
- Incremental re-indexing: detect changed documents (hash comparison) and only re-embed diffs, not the whole corpus
- Evaluation harness: a fixed set of question/expected-answer pairs, run automatically (e.g., in CI or on-demand) scoring groundedness (does the answer only use retrieved content?) and relevance (RAGAS-style metrics or a custom LLM-judge rubric), with results tracked over time so retrieval/prompt changes can be measured, not guessed at
- Re-ranking step: run a cross-encoder re-ranker on the top-N vector search results before the final top-k, to improve precision

## 4. Architecture

```
Client
  │ POST /documents (upload)
  ▼
Ingestion API (FastAPI) ──> S3 (raw docs) ──> emits event ──> SQS (ingestion queue)
                                                                    │
                                                                    ▼
                                                        Ingestion Worker (ECS/Lambda)
                                                          chunk → embed → upsert
                                                                    │
                                                                    ▼
                                                     Vector Store (pgvector / OpenSearch)
                                                                    ▲
Client                                                             │
  │ POST /query {"question": "..."}                                │
  ▼                                                                │
Query API (FastAPI) ── retrieve top-k ──────────────────────────────┘
  │
  ├─ (stretch) BM25 keyword search (OpenSearch) → fuse scores
  ├─ (stretch) re-rank top-N
  ▼
Build grounded prompt (retrieved chunks + citations) → LLM call → answer + sources
```

## 5. Tech Stack

- **Language/framework:** Python 3.12, FastAPI, `boto3`, LangChain or LlamaIndex *only* for chunking utilities (not as a black-box framework wrapping the whole pipeline — write the retrieval/generation logic yourself so it's clear you understand it, not just imported it)
- **Datastores:** S3 (raw docs), RDS Postgres + pgvector (or OpenSearch Serverless) for vectors, DynamoDB or Postgres for ingestion job status
- **Queueing:** SQS for ingestion events, optionally Lambda as the worker for cost efficiency at low volume, or an ECS worker for more control
- **Embeddings/LLM:** AWS Bedrock (Titan embeddings + Claude), keeping everything AWS-native for the infra story
- **Evaluation:** a small custom harness, or `ragas` library, run as a script (and optionally a GitHub Actions job)

## 6. Core Technical Challenges

- **Chunking strategy tradeoffs** — naive fixed-size chunking splits sentences/tables mid-way, hurting retrieval; implement recursive/semantic-aware chunking and be able to articulate *why* the strategy was chosen (measured against the eval harness, not vibes).
- **Idempotent ingestion** — re-uploading the same document (or a retried SQS message) must not create duplicate vector entries; use a content hash as the upsert key.
- **Backpressure on the ingestion queue** — a bulk upload of thousands of documents must not overwhelm the embedding provider's rate limits; implement worker-side concurrency limiting and exponential backoff on embedding API 429s.
- **Retrieval quality measurement** — this is the differentiator. Build a small labeled eval set (20-50 question/answer pairs against your test corpus) and a scoring script that runs automatically, so any pipeline change (chunk size, k, re-ranking) can be measured as "improved retrieval precision from X% to Y%" instead of asserted.
- **Grounding / hallucination control** — the generation prompt must instruct the model to answer *only* from retrieved context and cite sources; test this explicitly with adversarial questions outside the corpus and confirm the system says "I don't know" rather than hallucinating.
- **Hybrid search fusion (stretch)** — combining BM25 and vector scores correctly (reciprocal rank fusion, not naive score averaging across different scales) is a real, well-known hard problem worth demonstrating you understand.

## 7. API / Data Model Sketch

```
POST /documents                     (multipart upload) -> {document_id, status: "pending"}
GET  /documents/{id}/status         -> {status: "processing"|"done"|"failed"}
POST /query {"question": str, "top_k": int}
     -> {"answer": str, "sources": [{"document_id", "chunk_id", "excerpt", "score"}]}

documents table: id, s3_key, content_hash, status, uploaded_at
chunks table: id, document_id, chunk_text, embedding (vector), token_count
eval_runs table: id, run_at, avg_groundedness, avg_relevance, config_snapshot (json)
```

## 8. AWS Infra Plan

- **Storage:** S3 bucket for raw documents (versioned)
- **Queue:** SQS standard queue for ingestion events, with a DLQ for failed chunk/embed jobs after N retries
- **Compute:** Lambda for the ingestion worker (scales to zero, cost-efficient for a portfolio project) or ECS Fargate if you want longer-running batch jobs for large documents
- **Vector store:** RDS Postgres + pgvector extension (cheapest, most transparent to demonstrate you understand vector search internals) — OpenSearch Serverless as an alternative if you want that service on the resume specifically
- **LLM/embeddings:** Bedrock (keeps IAM-based auth instead of separate API keys, good AWS-native story)
- **IaC:** Terraform for S3, SQS (+DLQ), Lambda, RDS, IAM roles

## 9. Observability & Testing

- **Metrics:** ingestion queue depth, embedding job success/failure rate, average time-to-ingest per document, query latency (retrieval time vs. generation time split out), eval scores over time
- **Testing:** unit tests for the chunker (edge cases: empty docs, huge docs, tables), integration test for the full ingest→query loop against a local Postgres+pgvector via `testcontainers`, the eval harness itself serves as a regression test — run it in CI on any retrieval-affecting change

## 10. Security Considerations

- Document access control: if multi-tenant, vector search must filter by tenant/document ACL, not just similarity — a very common real-world RAG security bug is cross-tenant data leakage through retrieval
- Validate/sanitize uploaded file types (don't blindly parse arbitrary file types; restrict to PDF/txt/md and handle parser errors gracefully — malformed files are a common crash vector)
- Prompt construction must clearly delimit retrieved content from instructions to reduce prompt-injection risk from malicious document content (e.g., a PDF containing "ignore previous instructions")

## 11. Suggested Build Timeline

- **Weekend 1:** Ingestion API + S3 upload + basic synchronous chunk/embed (no queue yet) + pgvector store
- **Weekend 2:** Move ingestion to async via SQS + Lambda/worker, add status tracking, query API with basic retrieval + generation
- **Weekend 3:** Build the eval harness with a labeled test set, measure baseline retrieval quality
- **Weekend 4 (stretch):** Hybrid search, re-ranking, incremental re-indexing, tune based on eval scores

## 12. Resume Bullets (draft)

- Built an async RAG ingestion pipeline (S3 → SQS → Lambda) processing document uploads into a pgvector store with idempotent, content-hash-based deduplication.
- Designed a retrieval evaluation harness scoring groundedness and relevance across a labeled test set, enabling data-driven tuning that improved retrieval precision from X% to Y%.
- Implemented hybrid BM25 + vector retrieval with reciprocal rank fusion, improving exact-match query recall by X% over vector-only search.
- Reduced hallucination rate on out-of-corpus adversarial test questions from X% to near-zero by enforcing citation-grounded prompt construction.

## 13. Demo / Portfolio Requirements

- A short demo: upload a document, show ingestion status transition pending → done, then ask a question and show the answer with clickable source citations
- A results table/chart from the eval harness (before/after a retrieval change) — this is the single most senior-signaling artifact in the whole project
- Architecture diagram, plus a README explaining the chunking strategy and why it was chosen
