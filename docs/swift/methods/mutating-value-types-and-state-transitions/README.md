---
title: "Mutating Value Types and State Transitions"
domain: "Swift"
topic: "Methods"
page_type: concept-index
interview_priority: reference
estimated_read_minutes: 1
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Mutating Value Types and State Transitions

> A `mutating` method can change a structure or enumeration—including replacing
> `self`—but the mutation is safe only when one owner validates the whole transition.

## Quick Recall

- Structures and enumerations require `mutating` for methods that change value state.
- A mutating method cannot be called through a `let` binding.
- Assigning to `self` is useful when a transition naturally replaces the complete value.
- Mutation APIs should validate before commit and represent failure explicitly.
- Value semantics prevent mutation from propagating to independent copies, but do not
  make a shared variable atomic or nested reference state independent.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Instance Methods and Self Semantics](../instance-methods-and-self-semantics/README.md)
- [Type Methods and API Design](../type-methods-and-api-design/README.md)
