---
title: "RIB Trees, Lifecycle, and Scoping: Interview Questions"
domain: "Architecture"
topic: "RIBs"
concept: "RIB Trees, Lifecycle, and Scoping"
page_type: interview
levels:
  - senior
  - staff
interview_priority: situational
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-07-12
tags:
  - ribs
  - lifecycle
  - dependency-scoping
---

# RIB Trees, Lifecycle, and Scoping: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What does the active RIB tree represent?](#q1-what-does-the-active-rib-tree-represent) | Senior | Business lifetime |
| [What must happen when a child RIB detaches?](#q2-what-must-happen-when-a-child-rib-detaches) | Senior | Teardown correctness |
| [How should sibling RIBs communicate?](#q3-how-should-sibling-ribs-communicate) | Staff | Ownership boundaries |

---

<a id="q1-what-does-the-active-rib-tree-represent"></a>
## Q1: What does the active RIB tree represent?

### Short Answer

It represents currently active business scopes. A signed-in subtree, checkout flow, or
active-trip scope exists for its business lifetime even if the visible view hierarchy has
a different shape. Parent routers own child attachment and detachment.

### Expanded Answer

Tree transitions should follow business state and be idempotent. A repeated state must
not attach duplicate children. Deep links build and validate the required parent scopes
before attaching a destination.

<a id="q2-what-must-happen-when-a-child-rib-detaches"></a>
## Q2: What must happen when a child RIB detaches?

### Short Answer

The parent removes routing ownership, the child stops subscriptions and tasks, scoped
dependencies become releasable, and any view is removed. I test teardown explicitly
because retained work can keep an inactive subtree alive.

### Trade-offs

Cancellation is cooperative, so a late result still needs to verify that its scope is
active before committing. External side effects may require reconciliation rather than
only cancellation.

<a id="q3-how-should-sibling-ribs-communicate"></a>
## Q3: How should sibling RIBs communicate?

### Short Answer

Through their nearest common owner. A child reports a typed outcome to its parent, which
updates owned state or routes another child. Shared domain state belongs in an explicit
parent capability, not direct sibling references or a global event bus.

### Example

An editor child reports `.saved(id)` to the parent. The parent decides whether the list
child should reload, rather than giving the editor a direct reference to list internals.
