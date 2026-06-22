---
title: "Lifecycle Architecture and Leak Diagnosis: Interview Questions"
domain: "Swift"
topic: "Automatic Reference Counting"
concept: "Lifecycle Architecture and Leak Diagnosis"
page_type: interview
interview_priority: core
estimated_read_minutes: 3
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Lifecycle Architecture and Leak Diagnosis: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you distinguish a leak from expected retention?](#q1-leak-versus-retention) | Senior | Lifecycle evidence |
| [What belongs in an ARC regression test?](#q2-release-test) | Staff | Release and behavior |
| [How do you govern lifetime across a large architecture?](#q3-lifetime-governance) | Principal | Ownership standards |

---

<a id="q1-leak-versus-retention"></a>
## Q1: How Do You Distinguish a Leak from Expected Retention?

### Short Answer

Define when the object should become unnecessary, reproduce that terminal event, verify it remains
alive, and trace strong paths from roots. Correlate those paths with active tasks, registrations,
caches, and operations. Memory growth or a cycle snapshot alone does not establish invalid retention.

### Expanded Answer

Repeat the lifecycle to establish trend, use weak probes and object counts, inspect memory graphs,
and profile allocation stacks. A legitimate operation may retain the graph; an unbounded cache may
be a policy bug rather than an ARC cycle.

### Trade-offs

- Snapshot tools accelerate local root analysis.
- Lifecycle telemetry explains whether the root is still valid.

### Example

Editors accumulate after dismissal. Graphs show each is owned by an active upload. Some uploads are
valid; failed uploads never terminate. The fix is timeout/cancellation ownership, not weak editor state.

---

<a id="q2-release-test"></a>
## Q2: What Belongs in an ARC Regression Test?

### Short Answer

Create the graph, execute realistic use, drive completion/cancellation and queued work, remove intended
owners, then assert eventual deallocation through a weak probe. Also assert required work completed,
so a weak-reference change cannot make the release test pass by dropping behavior.

### Expanded Answer

Cover success, failure, cancellation, replacement, reentrancy, and early owner disappearance. Keep
timeouts bounded and control executors where possible. Test explicit resource shutdown separately
from memory release.

### Trade-offs

- Focused probes are deterministic and cheap.
- End-to-end repeated workflows catch framework roots and integration behavior.

### Example

A subscription test checks event delivery, cancellation, token release, and subscriber deallocation.
It fails both if the subscriber leaks and if callbacks stop before cancellation.

---

<a id="q3-lifetime-governance"></a>
## Q3: How Do You Govern Lifetime Across a Large Architecture?

### Short Answer

Define root owners and retention contracts for services, UI flows, tasks, caches, delegates, and
registrations; standardize cancellation/token patterns; require lifecycle telemetry and release tests;
and review ownership changes as cross-module semantic migrations.

### Expanded Answer

Ownership should follow release cadence and responsibility. Required work lives in durable operation
owners; transient UI observes it. APIs document whether callbacks/delegates are retained and who
cancels. Memory budgets and incident playbooks connect graph tools to lifecycle signals.

### Trade-offs

- Standards reduce repeated leak classes and improve diagnosis.
- Overcentralized owners can become service locators or retain too much, so boundaries need capacity and teardown.

### Example

A platform introduces a common subscription token with idempotent cancellation, owner IDs, and metrics.
Feature teams migrate from ad hoc stored closures, reducing both leaks and missing callbacks.
