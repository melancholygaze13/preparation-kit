---
title: "Overloading, Type Subscripts, and API Evolution"
domain: "Swift"
topic: "Subscripts"
page_type: concept-index
interview_priority: reference
estimated_read_minutes: 1
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Overloading, Type Subscripts, and API Evolution

> Overloads and type subscripts can express distinct lookup domains, but each form
> must remain unambiguous and must not conceal ownership, I/O, or mutable global state.

## Quick Recall

- Subscripts can be overloaded by parameter or return types, but context-dependent return overloads are fragile.
- Type subscripts use `static`; classes can use `class` when overriding is intentional.
- Labels can disambiguate coordinate roles and prevent swapped arguments.
- A type subscript backed by mutable static state still needs explicit isolation and lifecycle.
- Adding an overload can change type inference or make existing source ambiguous.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Subscript Access and Domain Indexing](../subscript-access-and-domain-indexing/README.md)
