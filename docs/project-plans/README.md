# Backend / AI / Cloud Project Plans

This directory holds detailed build plans for portfolio projects targeting **SDE2-ready / senior backend engineer** roles, with a deliberate lean into AI infrastructure and cloud platform engineering — the areas where the market is currently hiring hardest and where "I built a CRUD app" no longer differentiates a candidate.

None of these are implemented yet. Each doc is a self-contained spec detailed enough to build from directly: architecture, tech stack, the specific hard problems it proves you can solve, AWS wiring, observability/testing approach, security considerations, a realistic solo-build timeline, and draft resume bullets to lift once it's built.

## Why these five

Hiring bars for SDE2/senior backend roles in 2026 aren't just "can you write an API" — they're "can you reason about failure modes, cost, multi-tenancy, and observability at scale." AI-adjacent infra roles specifically want people who've gone past calling `openai.ChatCompletion.create()` and into the operational reality of running LLM/ML systems in production: rate limits, caching, evals, streaming, GPU cost, data pipelines. These five projects are chosen to cover that ground without overlapping:

| # | Project | Stack | Proves |
|---|---------|-------|--------|
| 1 | [LLM Gateway & Observability Platform](./01-llm-gateway.md) | Python/FastAPI | Multi-tenant API infra, rate limiting, caching, provider abstraction, tracing |
| 2 | [RAG-as-a-Service Pipeline](./02-rag-pipeline.md) | Python/FastAPI | Event-driven data pipelines, retrieval systems, ML evaluation rigor |
| 3 | [Distributed Workflow Orchestrator](./03-workflow-orchestrator.md) | TypeScript/Node.js | Core distributed-systems fundamentals (no AI dependency — proves general backend depth) |
| 4 | [Real-Time Feature Store](./04-feature-store.md) | TypeScript/Node.js + streaming | Streaming systems, dual online/offline storage, MLOps data engineering |
| 5 *(stretch)* | [Autoscaling Model Inference Platform](./05-model-serving-platform.md) | Python + Kubernetes | GPU infra, cost engineering, staff-level platform scope |

Projects 1-4 are the core set (pick at minimum 2-3 to actually build; all 4 together tell a coherent "I built an internal AI platform" story). Project 5 is flagged as an optional stretch goal — it requires GPU spend and Kubernetes depth that may not be worth the cost/effort unless targeting ML-platform-specific roles.

## Suggested narrative for a portfolio/resume

These four can be framed as pieces of one internal platform, if useful for storytelling:

```
Feature Store ──feeds──> RAG Pipeline ──answers via──> LLM Gateway
                              ▲
                     orchestrated by
                              │
                    Workflow Orchestrator
```

- The **Orchestrator** schedules the RAG pipeline's re-indexing jobs.
- The **Feature Store** could optionally feed personalization signals into RAG retrieval ranking.
- The **LLM Gateway** is the single point every AI feature (RAG answers, evals) routes through, giving unified cost/observability.

You don't have to build them as one system — each stands alone as a resume line — but presenting them as a connected platform in a portfolio write-up signals systems thinking, which is exactly the senior-vs-mid differentiator.

## How to use these docs

1. Pick 1 project to start (recommend **#1, LLM Gateway** — smallest surface area, highest resume signal per hour invested).
2. Build the MVP scope only first; treat "stretch features" as v2.
3. Once built, each doc's "Demo/Portfolio Requirements" section tells you what to capture (screenshots, a short Loom-style walkthrough, an architecture diagram) for the portfolio's Projects section.
4. Lift the "Resume Bullets" section directly, editing in real metrics once you have them (latency numbers, cache hit rate, cost saved).
