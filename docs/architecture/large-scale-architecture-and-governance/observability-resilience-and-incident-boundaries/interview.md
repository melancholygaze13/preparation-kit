---
title: "Observability, Resilience, and Incident Boundaries: Interview Questions"
domain: "Architecture"
topic: "Large-Scale Architecture and Governance"
concept: "Observability, Resilience, and Incident Boundaries"
page_type: interview
levels:
  - staff
  - principal
interview_priority: situational
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-08-12
tags:
  - observability
  - resilience
  - incident-response
---

# Observability, Resilience, and Incident Boundaries: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you design observability for a mobile journey?](#q1-how-do-you-design-observability-for-a-mobile-journey) | Staff | End-to-end signals |
| [Where should resilience policy live?](#q2-where-should-resilience-policy-live) | Staff | Failure containment |
| [Who owns a cross-team incident?](#q3-who-owns-a-cross-team-incident) | Principal | Incident command |

---

<a id="q1-how-do-you-design-observability-for-a-mobile-journey"></a>
## Q1: How do you design observability for a mobile journey?

### Short Answer

I start with user outcomes such as correct completion, latency, freshness, and degraded
availability. I correlate app, network, and backend metrics, traces, logs, and diagnostics
with privacy-safe workflow context, app version, and implementation path.

### Expanded Answer

Component health explains the journey but does not replace its outcome. I control
cardinality and avoid secrets or unnecessary personal data in propagated context. Real-
device performance signals complement product correctness metrics.

<a id="q2-where-should-resilience-policy-live"></a>
## Q2: Where should resilience policy live?

### Short Answer

At owned dependency and product boundaries. Each call has a time budget, failure class,
cancellation, bounded retry, and fallback policy. The feature decides whether stale,
partial, queued, or unavailable behavior is valid for that user action.

### Expanded Answer

A lower-level client can classify transport failures and honor server retry guidance,
while the product owner decides whether repetition is safe and which degraded result is
honest. One end-to-end time budget prevents nested retries from multiplying latency and
load across services.

### Trade-offs

Retries at several layers can amplify an outage. A degraded recommendation is acceptable;
a stale permission or payment confirmation may not be. Resilience must preserve domain
correctness, not only return something.

<a id="q3-who-owns-a-cross-team-incident"></a>
## Q3: Who owns a cross-team incident?

### Short Answer

One incident commander owns the end-to-end user impact, mitigation, communication, and
decision cadence. Component owners investigate in parallel. Repository ownership alone
is insufficient when the failure crosses mobile, backend, and data systems.

### Expanded Answer

The incident boundary follows the user journey and dependency chain, not the org chart.
The commander maintains one timeline and prioritizes mitigation while specialists supply
evidence from their components. After recovery, durable actions address both the trigger
and gaps in detection, containment, or coordination.

### Example

After recovery, the review covers detection, containment, coordination, and communication,
not only the triggering defect. Actions have owners and verification so the same class of
failure becomes easier to detect or less damaging.
