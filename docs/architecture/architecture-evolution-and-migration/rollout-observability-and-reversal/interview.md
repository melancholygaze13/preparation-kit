---
title: "Rollout, Observability, and Reversal: Interview Questions"
domain: "Architecture"
topic: "Architecture Evolution and Migration"
concept: "Rollout, Observability, and Reversal"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-07-12
tags:
  - rollout
  - observability
  - reversal
---

# Rollout, Observability, and Reversal: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you roll out an architectural change?](#q1-how-do-you-roll-out-an-architectural-change) | Senior | Staged exposure |
| [What do you measure during migration?](#q2-what-do-you-measure-during-migration) | Staff | Decision evidence |
| [What makes a rollback plan credible?](#q3-what-makes-a-rollback-plan-credible) | Staff | Reversal limits |

---

<a id="q1-how-do-you-roll-out-an-architectural-change"></a>
## Q1: How do you roll out an architectural change?

### Short Answer

I separate deployment from activation when risk justifies it. I start with a stable small
cohort, compare outcome and guardrail signals with the baseline, then increase exposure
through explicit gates. I keep a tested fallback until confidence and data compatibility
support removal.

### Expanded Answer

The cohort must become representative across relevant device, account, network, and app
version conditions. App Store phased release can limit automatic-update distribution, but
manual installs remain possible and an in-app path still needs its own control if required.

<a id="q2-what-do-you-measure-during-migration"></a>
## Q2: What do you measure during migration?

### Short Answer

I measure the intended outcome, safety guardrails, and migration behavior. Signals include
correctness, crashes, hangs, latency, resource use, selected path, fallback rate, result
differences, and affected cohort. Thresholds and decision owners are set before rollout.

### Trade-offs

An average can hide a serious segment regression. Too many dimensions create noise and
privacy cost. I choose segments that can change the rollout decision and include the path
and implementation version with each signal.

<a id="q3-what-makes-a-rollback-plan-credible"></a>
## Q3: What makes a rollback plan credible?

### Short Answer

It is tested, has a named operator and response time, and handles data and external
effects. A flag can reverse stateless code selection. It cannot undo an incompatible
schema write, payment, or message, which needs a reverse migration, compatible reader,
compensation, or forward repair.

### Example

Before enabling a new cache, I verify the old reader can tolerate new entries. Before a
destructive migration, I define the last safe rollback point and test restoration or
forward repair on a production-shaped data set.
