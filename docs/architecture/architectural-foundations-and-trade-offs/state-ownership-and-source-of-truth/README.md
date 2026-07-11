---
title: "State Ownership and Source of Truth"
domain: "Architecture"
topic: "Architectural Foundations and Trade-offs"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-11
tags:
  - state-ownership
  - source-of-truth
  - data-flow
---

# State Ownership and Source of Truth

> Every mutable fact needs one authoritative owner. Other components receive a
> value, a read view, or a controlled way to request change; they do not create a
> second competing truth.

## Quick Recall

- Ownership means responsibility for storage, valid transitions, lifetime,
  persistence, and conflict policy—not merely the ability to mutate a property.
- Store facts once and derive display values. Duplicate only when a boundary needs
  an intentional snapshot, draft, cache, or replica with a reconciliation rule.
- Keep transient UI state near the least common ancestor that needs it. Keep durable
  product state outside a screen whose lifetime may end.
- Bindings share access to existing storage. They do not transfer ownership or make
  unrestricted two-way mutation safe.
- Model loading, empty, refreshing, failure, and stale data explicitly when those
  states produce different user or retry behavior.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
