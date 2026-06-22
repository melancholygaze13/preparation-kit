---
title: "Freestanding and Attached Macro Semantics"
domain: "Swift"
topic: "Macros"
page_type: concept-index
interview_priority: situational
estimated_read_minutes: 1
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Freestanding and Attached Macro Semantics

> Freestanding macros expand where written with `#`; attached macros use `@` to add
> behavior or declarations in a role defined by the macro contract.

## Quick Recall

- Freestanding macros begin with `#` and produce an expression or declarations at the use site.
- Attached macros begin with `@` and expand according to roles such as peer, member,
  member-attribute, accessor, or extension.
- A macro declaration defines its signature and roles; a compiler plugin provides expansion.
- Declared generated-name constraints are part of collision prevention and API review.
- Use a generic, property wrapper, protocol, or function when runtime abstraction is sufficient.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Macro Implementation, Diagnostics, and Testing](../macro-implementation-diagnostics-and-testing/README.md)
- [Macro Adoption and API Evolution](../macro-adoption-and-api-evolution/README.md)
