---
title: "Subscript Access and Domain Indexing"
domain: "Swift"
topic: "Subscripts"
page_type: concept-index
interview_priority: reference
estimated_read_minutes: 1
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Subscript Access and Domain Indexing

> A subscript maps one or more index values to element access; its index validity,
> failure behavior, complexity, and write semantics are part of the API contract.

## Quick Recall

- A subscript can accept one or more parameters of any suitable type and can be read-only or read-write.
- Parameter labels are omitted by default but can be declared when they clarify a multidimensional domain.
- Trapping access is appropriate for programmer-contract violations; optional or throwing
  APIs fit expected absence or untrusted input.
- A “safe” optional subscript should not silently clamp, wrap, or fabricate defaults.
- Document complexity and index stability; bracket syntax does not imply constant time.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Overloading, Type Subscripts, and API Evolution](../overloading-type-subscripts-and-api-evolution/README.md)
