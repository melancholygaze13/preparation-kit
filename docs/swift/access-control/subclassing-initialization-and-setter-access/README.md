---
title: "Subclassing, Initialization, and Setter Access"
domain: "Swift"
topic: "Access Control"
page_type: concept-index
interview_priority: situational
estimated_read_minutes: 1
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Subclassing, Initialization, and Setter Access

> Construction, mutation, and overridability are separate capabilities; publish each only where its invariants are supported.

## Quick Recall

- A subclass cannot be more accessible than its superclass.
- External subclassing requires an open class; external overriding requires an open member.
- `final` closes inheritance/override even where access would otherwise permit it.
- Synthesized initializers do not automatically become public for public structs/classes.
- A setter can be less accessible than its getter, such as `public private(set)`.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Prerequisites

- [Subclassing and Override Semantics](../../inheritance/subclassing-and-override-semantics/README.md)
- [Stored Property Initialization and Delegation](../../initialization/stored-property-initialization-and-delegation/README.md)

## Related Concepts

- [Inheritance Boundaries and Framework Evolution](../../inheritance/inheritance-boundaries-and-framework-evolution/README.md)
