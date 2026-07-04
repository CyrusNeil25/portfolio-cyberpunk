# Project 3: Distributed Workflow Orchestration Engine

## 1. One-Line Resume Pitch

"Built a distributed, DAG-based job orchestration engine in TypeScript with exactly-once execution guarantees, distributed locking, and horizontal worker scaling — a lightweight Temporal/Airflow alternative."

## 2. Problem / Why It Matters

Every backend system beyond a certain size needs *something* to reliably run multi-step background work: retries, scheduled jobs, fan-out/fan-in, and recovery from partial failures. Companies either buy Temporal/Airflow/Step Functions or build a smaller in-house version — and understanding *why* those tools are built the way they are (idempotency, distributed locks, at-least-once vs. exactly-once semantics) is a core distributed-systems competency that separates mid from senior backend engineers. This project deliberately has no AI dependency — it exists to prove you can reason about concurrency, failure, and scale in the abstract, which is exactly what gets tested in senior-level system design interviews.

## 3. Scope

**MVP:**
- Define workflows as DAGs of tasks (JSON/YAML or a small TypeScript DSL) with explicit dependencies
- A scheduler service that picks up runnable tasks (all dependencies satisfied) and dispatches them to a queue
- Worker processes that pull tasks from the queue, execute them, and report success/failure
- Automatic retry with exponential backoff on task failure (configurable max retries per task)
- Idempotency keys: each task execution is deduplicated by a key so a redelivered queue message doesn't re-run a completed task
- Basic persistence of workflow/task state (Postgres or DynamoDB) so the system survives restarts

**Stretch:**
- Distributed locking (Redis or DynamoDB conditional writes) to guarantee only one worker executes a given task instance at a time, even with multiple scheduler replicas
- Dead-letter handling: tasks that exhaust retries move to a DLQ with full failure context, plus an API to inspect and manually retry them
- Horizontal worker autoscaling based on queue depth (scale worker count up/down)
- A minimal read-only dashboard (workflow run history, current status, DAG visualization)
- Cron-style scheduled workflow triggers, not just on-demand runs

## 4. Architecture

```
Workflow Definition (JSON DAG)
         │
         ▼
   Scheduler Service ──> reads workflow_runs/task_state (Postgres)
         │                 determines runnable tasks (deps satisfied)
         ▼
      SQS Queue (task dispatch)
         │
   ┌─────┴─────┬─────────────┐
   ▼           ▼             ▼
 Worker 1   Worker 2      Worker N     (horizontally scaled, ECS service)
   │           │             │
   └─────┬─────┴─────────────┘
         ▼
  Task execution + idempotency check (dedupe key in Redis/Postgres)
         │
         ▼
  Report result -> update task_state -> scheduler re-evaluates DAG for next runnable tasks
         │
         ▼ (on failure, retries exhausted)
     Dead-letter queue (SQS DLQ)
```

The scheduler and workers are decoupled entirely through the queue and shared state store — either can be scaled or restarted independently, which is the core distributed-systems property being demonstrated.

## 5. Tech Stack

- **Language/framework:** TypeScript, Node.js, Express or Fastify for the API, `bullmq` is a reasonable reference implementation to study but **build the core scheduling/locking/retry logic yourself** rather than just using BullMQ wholesale — the point is demonstrating you understand the mechanics, not gluing together an off-the-shelf queue library (using BullMQ purely as the underlying Redis queue primitive, with your own DAG/idempotency/locking layer on top, is a reasonable middle ground)
- **Datastores:** Postgres (workflow/task state, source of truth), Redis (distributed locks, idempotency keys) or DynamoDB conditional writes as an alternative locking mechanism
- **Queueing:** SQS (or Redis Streams if you want to avoid an extra AWS dependency for the queue specifically)
- **Testing:** `vitest` or `jest`, plus chaos-style tests (kill a worker mid-task, verify no duplicate execution and no lost task)

## 6. Core Technical Challenges

- **Exactly-once-ish execution semantics** — queues are inherently at-least-once; the system must convert that into effectively-once execution via idempotency keys + distributed locks, and you should be able to explain precisely *where* the guarantee could still break (e.g., a worker crashing after completing work but before reporting success) and what mitigation you chose (e.g., a lease/heartbeat pattern).
- **Distributed locking correctness** — implement a Redis-based lock (e.g., SET NX PX + a Lua script for safe release) or DynamoDB conditional writes, and write a test that spins up multiple concurrent "workers" racing for the same task to prove only one wins.
- **DAG scheduling correctness** — a task should become runnable exactly when all its dependencies succeed, and a failed dependency should correctly block (or, per policy, skip) downstream tasks; test diamond-shaped DAGs (A→B, A→C, B+C→D) explicitly.
- **Backoff and retry storms** — naive fixed-interval retries across many failing tasks simultaneously can hammer a downstream dependency; implement exponential backoff with jitter and verify via a load test that retries spread out rather than clustering.
- **Crash recovery** — kill the scheduler process mid-run and restart it; the system must resume from persisted state without losing or double-running tasks. This is the single best thing to demo live.
- **Worker autoscaling (stretch)** — scaling decisions based on queue depth need hysteresis (don't scale up/down on every fluctuation); worth implementing a simple cooldown-based policy and explaining the tradeoff.

## 7. API / Data Model Sketch

```
POST /workflows                (register a DAG definition)
POST /workflows/{id}/runs      (trigger a run) -> {run_id, status: "running"}
GET  /workflows/{id}/runs/{run_id}  -> {status, task_states: [...]}
POST /runs/{run_id}/tasks/{task_id}/retry   (manual retry from DLQ)

workflow_runs table: run_id, workflow_id, status, started_at, finished_at
task_state table: run_id, task_id, status (pending/running/succeeded/failed/dead-lettered),
                  attempt_count, idempotency_key, last_error, updated_at
```

## 8. AWS Infra Plan

- **Compute:** ECS Fargate for both scheduler (1-2 replicas) and worker pool (autoscaled service)
- **Queue:** SQS standard queue + DLQ with redrive policy (max receive count → DLQ)
- **State:** RDS Postgres for workflow/task state; ElastiCache Redis for distributed locks
- **IaC:** Terraform for ECS services, SQS+DLQ, RDS, ElastiCache, autoscaling policies tied to SQS `ApproximateNumberOfMessagesVisible`

## 9. Observability & Testing

- **Metrics:** queue depth, task success/failure/retry rate, DAG completion time (p50/p95), worker utilization, DLQ size (alert if > 0 for extended period)
- **Tracing:** correlate a full workflow run as one trace ID spanning scheduler dispatch + all task executions, so you can see the critical path of a slow run
- **Testing:** unit tests for DAG resolution logic, integration tests with real Postgres+Redis (`testcontainers`), and — most importantly — chaos tests: kill a worker mid-task and assert exactly-once behavior; run the same task ID concurrently from two "workers" and assert the lock prevents double execution

## 10. Security Considerations

- Workflow definitions submitted via API should be validated/sandboxed if they can reference arbitrary code — for a portfolio project, restrict task types to a fixed registry (e.g., "http_call", "db_query") rather than allowing arbitrary code execution, which avoids building an RCE-as-a-service
- Standard API auth (API keys or JWT) on the control-plane endpoints
- Redis lock keys and idempotency keys should be namespaced per environment to avoid cross-environment collisions if reusing infra for staging/prod

## 11. Suggested Build Timeline

- **Weekend 1:** DAG definition format, scheduler that resolves runnable tasks, single-worker execution (no locking/retries yet), Postgres state
- **Weekend 2:** Add SQS-based dispatch, retries with backoff, idempotency keys
- **Weekend 3:** Distributed locking, multi-worker horizontal scaling, DLQ handling
- **Weekend 4 (stretch):** Chaos tests, autoscaling policy, minimal dashboard

## 12. Resume Bullets (draft)

- Designed and implemented a distributed DAG-based workflow orchestration engine in TypeScript with exactly-once task execution guarantees via distributed locking and idempotency keys.
- Built exponential-backoff retry logic with jitter, eliminating retry-storm failures observed under simulated concurrent-failure load testing.
- Validated crash-recovery correctness via chaos testing (mid-execution worker kills), confirming zero duplicate or lost task executions across N trial runs.
- Scaled worker pool horizontally to handle Nx baseline throughput via SQS-depth-based autoscaling with hysteresis to prevent scaling flap.

## 13. Demo / Portfolio Requirements

- Live/recorded demo: submit a diamond-shaped DAG, show execution order respecting dependencies, kill a worker mid-task, show recovery with no duplicate execution
- A short write-up specifically explaining the idempotency/locking design and its failure-mode boundaries (this is the artifact that reads as senior-level to a reviewer)
- Architecture diagram and README with local dev setup (docker-compose for Postgres+Redis)
