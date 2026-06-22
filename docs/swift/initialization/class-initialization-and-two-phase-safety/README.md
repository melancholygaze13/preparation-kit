---
title: "Class Initialization and Two-Phase Safety"
domain: "Swift"
topic: "Initialization"
page_type: concept-index
interview_priority: high
estimated_read_minutes: 1
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Class Initialization and Two-Phase Safety

> Designated initializers establish class storage up the hierarchy; only after phase
> one may customization safely use the complete instance.

## Quick Recall

- A designated initializer initializes its class and delegates to its superclass.
- A convenience initializer must delegate across to another initializer in its class.
- Phase one establishes storage; phase two allows customization through `self`.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Stored-Property Initialization and Delegation](../stored-property-initialization-and-delegation/README.md)
- [Failable, Required, and Evolving Initializers](../failable-required-and-evolving-initializers/README.md)
