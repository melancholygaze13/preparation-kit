---
title: "Subclassing and Override Semantics"
domain: "Swift"
topic: "Inheritance"
page_type: concept-index
interview_priority: situational
estimated_read_minutes: 1
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Subclassing and Override Semantics

> A subclass inherits accessible behavior and may override supported extension points;
> `override`, `super`, and `final` make that relationship explicit.

## Quick Recall

- Use `override` for inherited instance/type methods, properties, and subscripts.
- Use `super` to invoke the superclass implementation when the extension contract requires composition.
- A subclass may add observers to an inherited property and may override a read-only
  property as read-write, but not a read-write property as read-only.
- `final` prevents overriding a member or subclassing a class.
- Initialization and deinitialization have separate inheritance rules and belong to their dedicated topics.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Behavioral Contracts and Substitutability](../behavioral-contracts-and-substitutability/README.md)
- [Inheritance Boundaries and Framework Evolution](../inheritance-boundaries-and-framework-evolution/README.md)
