---
title: "Opaque Type Identity and Underlying Types"
domain: "Swift"
topic: "Opaque and Boxed Protocol Types"
page_type: concept-index
interview_priority: situational
estimated_read_minutes: 1
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Opaque Type Identity and Underlying Types

> An opaque type hides its concrete name from clients while preserving one compiler-known underlying type and its relationships.

## Quick Recall

- Every reachable return path must produce the same underlying type.
- Calls to the same opaque declaration preserve one opaque identity for the same generic substitutions.
- Clients can use only stated constraints, not the hidden concrete API.
- `some P` in a parameter declaration is shorthand for an unnamed generic parameter chosen by the caller.
- Changing the constraints is an API change; changing a non-inlinable hidden implementation type can preserve the public abstraction.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Prerequisites

- [Generic Abstraction and Constraints](../../generics/generic-abstraction-and-constraints/README.md)

## Related Concepts

- [Associated Types and Type Relationships](../../generics/associated-types-and-type-relationships/README.md)
- [Boxed Protocol Types and Existential Semantics](../boxed-protocol-types-and-existential-semantics/README.md)
