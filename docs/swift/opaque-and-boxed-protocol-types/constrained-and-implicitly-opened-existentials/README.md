---
title: "Constrained and Implicitly Opened Existentials"
domain: "Swift"
topic: "Opaque and Boxed Protocol Types"
page_type: concept-index
interview_priority: situational
estimated_read_minutes: 1
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Constrained and Implicitly Opened Existentials

> Constrained existentials retain selected associated-type facts; implicit opening temporarily binds one boxed value's dynamic type to a generic parameter.

## Quick Recall

- Primary associated-type arguments constrain relationships; they are not generic arguments to the protocol itself.
- A constrained existential can store different conformers that agree on the published associated types.
- Swift can implicitly open an existential argument and bind its dynamic concrete type to a generic parameter.
- The opened type is local to the call and cannot freely escape into source-visible types.
- Results are erased to the most specific representable upper bound, which can lose relationships.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Prerequisites

- [Associated Types and Type Relationships](../../generics/associated-types-and-type-relationships/README.md)
- [Boxed Protocol Types and Existential Semantics](../boxed-protocol-types-and-existential-semantics/README.md)

## Related Concepts

- [Generic Abstraction and Constraints](../../generics/generic-abstraction-and-constraints/README.md)
- [Protocol Extensions and Dispatch](../../protocols/protocol-extensions-and-dispatch/README.md)
