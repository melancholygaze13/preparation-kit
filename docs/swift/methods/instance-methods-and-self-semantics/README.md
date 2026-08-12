---
title: "Instance Methods and Self Semantics"
domain: "Swift"
topic: "Methods"
page_type: concept-index
interview_priority: reference
estimated_read_minutes: 1
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-08-12
---

# Instance Methods and Self Semantics

> An instance method operates in the context of one value or instance; place it on
> the type only when that receiver owns the state, required rules, or capability involved.

## Quick Recall

- Put behavior on a type when it uses that receiver's state or keeps its rules true.
- Use `self` to resolve ambiguity or communicate capture/receiver intent; do not add it mechanically.
- A nonmutating struct or enum method cannot change value state, while a class method
  can mutate variable properties of the referenced instance.
- Method calls can hide cost and effects, so use names and `async`/`throws` to expose them.
- Actor-isolated methods serialize access to actor state, but assumptions must be
  revalidated after every suspension point.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Mutating Value Types and State Transitions](../mutating-value-types-and-state-transitions/README.md)
- [Type Methods and API Design](../type-methods-and-api-design/README.md)
