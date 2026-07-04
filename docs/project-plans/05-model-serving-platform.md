# Project 5 (Stretch): Autoscaling Model Inference Platform

> **Note:** This is flagged as optional/stretch relative to projects 1-4. It requires GPU compute spend and deeper Kubernetes experience, so only build it if targeting ML-platform/infra-specific roles where that investment clearly pays off — otherwise projects 1-4 already form a strong, coherent portfolio on their own.

## 1. One-Line Resume Pitch

"Built a GPU-autoscaling model inference platform on Kubernetes serving open-source LLMs with canary deployments and request batching, cutting inference cost per token by X% versus a fixed-capacity baseline."

## 2. Problem / Why It Matters

Once a company moves beyond calling a hosted LLM API, they eventually need to self-host models (cost, latency, data residency, or fine-tuned-model reasons) — and self-hosting inference is an infrastructure problem, not a modeling problem: GPU instances are expensive and slow to provision, so capacity must scale with demand; naive one-request-at-a-time serving wastes GPU throughput badly, so requests need batching; and rolling out a new model version safely requires canary/shadow traffic, not a hard cutover. This is staff/senior-level platform engineering — proving you can operate ML infrastructure, not just call an API.

## 3. Scope

**MVP:**
- Deploy an open-source model (an embedding model or a small LLM, sized to fit the GPU budget you're willing to spend) behind a serving framework (vLLM or TorchServe) on a single GPU node
- Kubernetes deployment (EKS) with a basic HPA (horizontal pod autoscaler) based on request queue depth or GPU utilization
- A simple load generator to demonstrate autoscaling behavior under traffic bursts

**Stretch:**
- Karpenter-based node autoscaling (not just pod autoscaling) so GPU *nodes* themselves scale up/down with demand, using spot instances where feasible for cost savings
- Request batching at the serving layer (vLLM supports this natively — configuring and tuning it, and measuring the throughput improvement, is the demonstrable skill)
- Canary deployment: route a small percentage of traffic to a new model version, compare latency/quality metrics, before shifting 100%
- Cost dashboard: GPU-hours consumed vs. requests served, cost per 1k tokens, spot vs. on-demand savings realized

## 4. Architecture

```
Load Balancer (ALB / K8s Ingress)
         │
         ▼
  K8s Service ── routes ──> Deployment (vLLM pods, model version A) ── 90% traffic
                        └──> Deployment (vLLM pods, model version B) ── 10% traffic (canary)
         │
  HPA watches: request queue depth / GPU utilization (custom metrics via Prometheus adapter)
         │
  Karpenter watches: pending pods needing GPU nodes -> provisions/deprovisions EC2 GPU instances
         │
Prometheus + Grafana: latency, throughput, GPU utilization, cost-per-request dashboards
```

## 5. Tech Stack

- **Serving:** vLLM (demonstrates understanding of continuous batching / PagedAttention-style serving optimizations) or TorchServe
- **Orchestration:** Kubernetes (EKS), Karpenter for node-level autoscaling, standard HPA + a Prometheus custom-metrics adapter for pod-level autoscaling
- **Observability:** Prometheus + Grafana (self-hosted on the cluster, or AWS Managed Prometheus/Grafana)
- **IaC:** Terraform for EKS cluster, Karpenter provisioner config, IAM roles for service accounts (IRSA)

## 6. Core Technical Challenges

- **GPU cold-start latency** — provisioning a new GPU node takes minutes, not seconds; a naive autoscaler will let requests queue/time out during a burst. Mitigate with a warm-pool minimum node count and/or predictive pre-scaling, and be explicit about the tradeoff (idle GPU cost vs. burst latency).
- **Batching vs. latency tradeoff** — larger batch sizes improve throughput/cost-per-token but increase per-request latency; tune and document the chosen batching window against a target p95 latency SLO.
- **Autoscaling on the right signal** — CPU utilization is a poor autoscaling signal for GPU inference (GPU can be saturated while CPU is idle); use GPU utilization or, better, request queue depth as the scaling metric, and explain why.
- **Canary safety** — comparing model versions requires more than "no errors" — track latency and, if feasible, an automated output-quality proxy metric, before promoting a canary to 100%.
- **Cost attribution** — GPU nodes are expensive and often shared across workloads; build a cost-per-request calculation from node-hour cost ÷ requests served in that window, which is a genuinely hard FinOps-adjacent problem worth solving explicitly.

## 7. API / Data Model Sketch

```
POST /v1/completions  (OpenAI-compatible, routed via K8s service to vLLM pods)
GET  /metrics          (Prometheus scrape endpoint, per-pod)

Custom metrics tracked: vllm_request_queue_depth, gpu_utilization_pct,
                         requests_per_node_hour, cost_per_1k_tokens
```

## 8. AWS Infra Plan

- **Cluster:** EKS with a GPU-enabled managed node group or Karpenter-provisioned GPU nodes (g5.xlarge class is a reasonable cost/capability tradeoff for a portfolio project)
- **Autoscaling:** Karpenter for node provisioning (with spot instance support for cost), HPA + Prometheus adapter for pod scaling
- **Observability:** AWS Managed Prometheus + Grafana, or self-hosted via Helm charts on the cluster
- **IaC:** Terraform (EKS module, Karpenter Helm release, IAM roles for service accounts)

## 9. Observability & Testing

- **Metrics:** request latency (p50/p95/p99), GPU utilization, queue depth, node count over time (correlated with a load-test traffic pattern), cost per 1k tokens over time
- **Testing:** load test with a traffic-burst pattern (`k6` or `locust`) to demonstrate autoscaling response time and confirm the HPA/Karpenter combination scales up before requests start failing, and scales back down afterward to avoid idle GPU cost

## 10. Security Considerations

- Model weights and serving endpoints should not be publicly exposed without auth; put the inference API behind the same tenant-auth pattern as Project 1 if integrating the two
- IRSA (IAM roles for service accounts) rather than broad node-level IAM permissions, scoping exactly what each pod can access
- Set hard budget alerts (AWS Budgets) given GPU spend can escalate quickly during testing — this is as much a personal-cost-safety note as a portfolio one

## 11. Suggested Build Timeline

- **Weekend 1:** Single-node vLLM deployment on EKS, basic HPA, manual load test
- **Weekend 2:** Karpenter node autoscaling, Prometheus/Grafana dashboards, tuned autoscaling signal (queue depth, not CPU)
- **Weekend 3 (stretch):** Canary deployment setup, request batching tuning, cost-per-request dashboard

## 12. Resume Bullets (draft)

- Deployed a GPU-autoscaling LLM inference platform on EKS using vLLM and Karpenter, reducing idle GPU cost by X% versus a fixed-capacity baseline while maintaining p95 latency under Yms.
- Tuned continuous-batching parameters in vLLM, improving throughput per GPU by X% at an acceptable latency tradeoff, quantified via load testing.
- Implemented canary deployment routing for model version rollouts, enabling safe comparison of latency/quality before full traffic cutover.

## 13. Demo / Portfolio Requirements

- A load-test recording showing traffic burst → autoscaling response (new pods/nodes appearing) → latency stabilizing, with the Grafana dashboard visible
- Cost-per-request chart comparing fixed-capacity vs. autoscaled cost over a simulated traffic pattern
- Architecture diagram and README explicitly discussing the cold-start/warm-pool tradeoff decision
