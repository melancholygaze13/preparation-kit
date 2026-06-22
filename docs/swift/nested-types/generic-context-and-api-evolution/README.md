---
title: "Generic Context and API Evolution"
domain: "Swift"
topic: "Nested Types"
page_type: concept-index
interview_priority: reference
estimated_read_minutes: 1
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Generic Context and API Evolution

> A public nested type's qualified name and enclosing generic context are part of its
> API; moving or exposing it requires compatibility and dependency review.

## Quick Recall

- Nested types can use generic parameters available from their enclosing declaration.
- Qualification can disambiguate identically named nested types from different owners.
- Public nested types create source dependencies on the enclosing type and module.
- A typealias can ease some source migrations, but it does not solve every ABI, reflection, or serialization contract.
- Avoid using qualified type names as persisted or wire-format identity.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Scoped Domain Modeling](../scoped-domain-modeling/README.md)
