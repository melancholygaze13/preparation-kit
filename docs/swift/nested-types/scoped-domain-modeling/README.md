---
title: "Scoped Domain Modeling"
domain: "Swift"
topic: "Nested Types"
page_type: concept-index
interview_priority: reference
estimated_read_minutes: 1
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Scoped Domain Modeling

> Nest a type when its name is meaningful only within one enclosing domain and the
> qualified name makes ownership clearer than a top-level declaration.

## Quick Recall

- Classes, structures, and enumerations can contain nested types.
- Refer to a nested type from outside with `Outer.Inner`.
- Nesting communicates ownership and avoids globally ambiguous names.
- A nested type does not automatically capture or receive an enclosing instance.
- Keep independently reusable or cross-domain concepts top-level rather than hiding them under one owner.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Generic Context and API Evolution](../generic-context-and-api-evolution/README.md)
