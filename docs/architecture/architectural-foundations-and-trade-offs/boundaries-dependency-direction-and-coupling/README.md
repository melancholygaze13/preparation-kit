---
title: "Boundaries, Dependency Direction, and Coupling"
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
  - boundaries
  - dependency-direction
  - coupling
---

# Boundaries, Dependency Direction, and Coupling

> A useful boundary contains a reason to change and exposes a small contract.
> Dependency direction decides which side can change without forcing the other
> side to change.

## Quick Recall

- Coupling is the cost of one component knowing about or changing with another.
- Group code that changes together. Separate code that changes for different
  reasons, at different rates, or under different ownership.
- Point dependencies toward stable product policy and away from volatile UI,
  storage, transport, and third-party details when that isolation has value.
- A protocol helps only when it expresses a consumer-owned need. A protocol that
  copies one concrete API can preserve the same coupling with more indirection.
- Enforce important boundaries with access control, modules, dependency checks,
  and tests. A folder name alone does not prevent unwanted dependencies.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
