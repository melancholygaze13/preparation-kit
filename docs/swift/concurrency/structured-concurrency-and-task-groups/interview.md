---
title: "Structured Concurrency and Task Groups: Interview Questions"
domain: "Swift"
topic: "Concurrency"
concept: "Structured Concurrency and Task Groups"
page_type: interview
interview_priority: core
estimated_read_minutes: 3
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Structured Concurrency and Task Groups: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When should you use async let versus a task group?](#q1-async-let-versus-group) | Senior | Work topology |
| [How do you bound a task group?](#q2-bounded-task-group) | Staff | Capacity policy |
| [How do fail-fast and partial-result groups differ?](#q3-failure-policy) | Staff | Error semantics |

---

<a id="q1-async-let-versus-group"></a>
## Q1: When Should You Use async let Versus a Task Group?

### Short Answer

Use `async let` for a fixed small set of independent results, including different types.
Use a task group for a dynamic number of same-result children, completion-order processing,
or explicit worker limits. Both keep child lifetime and cancellation inside the scope.

### Expanded Answer

Sequential awaits are correct for dependencies. Structured fan-out is for independent
work. Task groups yield completion order, so retain keys or indexes when output order matters.

### Trade-offs

- `async let` is concise but fixed.
- Groups are flexible but require aggregation, ordering, and capacity policy.

### Example

A screen concurrently loads profile, settings, and permissions using `async let`; a batch
of unknown asset IDs uses a bounded task group.

---

<a id="q2-bounded-task-group"></a>
## Q2: How Do You Bound a Task Group?

### Short Answer

Seed at most the allowed number of children, consume one completion, then add one new
child until input is exhausted. Derive the limit from downstream connections, memory,
rate limits, retries, and measured latency—not merely CPU count.

### Expanded Answer

Structured does not mean bounded. Adding all children eagerly can overload a service or
allocate all per-task state. A rolling window keeps active work within policy while still
allowing completion-order progress.

### Trade-offs

- Higher limits can improve throughput until a dependency saturates.
- Lower limits reduce pressure but increase queue time.
- One global limit is simple but can cause unfairness among tenants or operations.

### Example

Ten thousand downloads are capped to the URL-session connection and memory budget; active,
queued, and retry counts are observed to tune the limit.

---

<a id="q3-failure-policy"></a>
## Q3: How Do Fail-Fast and Partial-Result Groups Differ?

### Short Answer

For fail-fast behavior, let the first observed child error escape a throwing group and
cancel siblings. For partial results, catch inside each child and return a typed `Result`
with its input identity. Cancelled siblings still need to cooperate before scope exit.

### Expanded Answer

The choice is a product contract. All-or-nothing operations should not silently turn
errors into missing values. Best-effort operations need a result schema that distinguishes
success, failure, and cancellation and retains enough identity to reconcile completion order.

### Trade-offs

- Fail-fast reduces wasted work but loses useful successes unless recorded separately.
- Partial results improve resilience but complicate UX, retries, and idempotency.

### Example

A configuration bundle is all-or-nothing; a thumbnail grid returns per-item outcomes and
retries only failed IDs.
