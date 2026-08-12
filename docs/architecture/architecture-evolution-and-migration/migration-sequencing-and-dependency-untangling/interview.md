---
title: "Migration Sequencing and Dependency Untangling: Interview Questions"
domain: "Architecture"
topic: "Architecture Evolution and Migration"
concept: "Migration Sequencing and Dependency Untangling"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-08-12
tags:
  - migration-sequencing
  - dependencies
  - architecture-evolution
---

# Migration Sequencing and Dependency Untangling: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you sequence a large architecture migration?](#q1-how-do-you-sequence-a-large-architecture-migration) | Staff | Dependency order |
| [How do you break a dependency cycle?](#q2-how-do-you-break-a-dependency-cycle) | Senior | Boundary correction |
| [How do you measure migration progress?](#q3-how-do-you-measure-migration-progress) | Staff | Completion evidence |

---

<a id="q1-how-do-you-sequence-a-large-architecture-migration"></a>
## Q1: How do you sequence a large architecture migration?

### Short Answer

I map code, runtime, data, release, and team dependencies. Then I create the target seam,
break blocking cycles, and migrate independently releasable vertical slices. Each slice
is verified in production before I switch more callers and delete the old edge.

### Expanded Answer

I choose an early slice that is representative, reversible, and limited in blast radius.
I separate mechanical moves from behavior changes where possible. Data schemas and old
installed clients often extend the dependency sequence beyond source imports.

<a id="q2-how-do-you-break-a-dependency-cycle"></a>
## Q2: How do you break a dependency cycle?

### Short Answer

I identify the capability causing the cycle and move its contract toward the consumer or
a lower stable module. Composition moves upward. Another option is a typed result or
event boundary. If both sides always change together, I consider merging them instead.

### Expanded Answer

I first name which side owns the policy. The owning side publishes the contract; the
composition root supplies the implementation. This replaces a bidirectional compile-time
edge with a dependency that follows ownership, rather than hiding the cycle in a new
generic shared package.

### Trade-offs

A generic shared module can remove the visible cycle while creating an unowned dumping
ground. The extracted contract needs a clear purpose, stable ownership, and a dependency
direction that matches policy ownership.

<a id="q3-how-do-you-measure-migration-progress"></a>
## Q3: How do you measure migration progress?

### Short Answer

By outcomes: production slices on the new path, callers switched, dependency edges and
legacy traffic at zero, and old modules, schemas, flags, or adapters deleted. File count
or code copied does not prove that the old architecture can be removed.

### Expanded Answer

I track progress from first containment through final deletion. Each remaining caller or
runtime path needs an owner and blocker. Product and reliability signals show whether the
new path is safe, while deletion metrics prove that the migration actually reduced the
system rather than duplicating it.

### Example

A useful dashboard lists each legacy API, consuming team, runtime traffic, blocker,
owner, and removal milestone. “No new consumers” is an early gate; deletion is the final
one.
