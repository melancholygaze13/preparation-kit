---
title: "Incremental Replacement and Compatibility Boundaries: Interview Questions"
domain: "Architecture"
topic: "Architecture Evolution and Migration"
concept: "Incremental Replacement and Compatibility Boundaries"
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
  - incremental-migration
  - compatibility
  - architecture-evolution
---

# Incremental Replacement and Compatibility Boundaries: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How would you replace a legacy subsystem safely?](#q1-how-would-you-replace-a-legacy-subsystem-safely) | Senior | Incremental replacement |
| [Where should a compatibility boundary live?](#q2-where-should-a-compatibility-boundary-live) | Senior | Seam design |
| [When is dual writing acceptable?](#q3-when-is-dual-writing-acceptable) | Staff | Data consistency |

---

<a id="q1-how-would-you-replace-a-legacy-subsystem-safely"></a>
## Q1: How would you replace a legacy subsystem safely?

### Short Answer

I define the outcome, place a stable consumer-facing contract in front of the legacy
path, and add the replacement behind it. I migrate representative vertical slices,
compare behavior and health, increase exposure, then remove the old implementation and
temporary routing.

### Expanded Answer

I keep each stage releasable and preserve one reversal path. Characterization tests
protect important current behavior. The migration inventory includes adapters, flags,
remaining callers, compatibility windows, owners, and deletion milestones.

<a id="q2-where-should-a-compatibility-boundary-live"></a>
## Q2: Where should a compatibility boundary live?

### Short Answer

At a seam that expresses a stable capability needed by callers, such as a repository,
feature factory, navigation entry point, or service facade. It should hide implementation
selection without copying legacy concepts into every new caller.

### Trade-offs

A broad abstraction supports more migration paths but can freeze the old design. A narrow
slice-specific contract teaches faster and is easier to revise. I keep business policy
out of temporary adapters so they remain removable.

<a id="q3-when-is-dual-writing-acceptable"></a>
## Q3: When is dual writing acceptable?

### Short Answer

Only when one transactional write authority is impossible and the migration justifies
the consistency cost. I define ordering, idempotency, partial-failure handling,
reconciliation, conflict authority, observability, and an end date before enabling it.

### Example

For a local schema migration, I prefer writing the new store and keeping a backward-
compatible reader. If both stores must receive writes, a durable operation ID and a
reconciler detect and repair partial success.
