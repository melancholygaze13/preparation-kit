---
title: "Range Operators"
domain: "Swift"
topic: "Basic Operators"
page_type: concept-index
levels:
  - senior
interview_priority: situational
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-22
tags:
  - ranges
  - collection-indices
  - slicing
---

# Range Operators

> A range describes boundaries. It does not prove that those boundaries are
> valid indices for a collection.

## Quick Recall

- `a...b` includes both bounds; `a..<b` excludes `b`.
- One-sided ranges get their missing boundary from the operation that uses them.
- A generic collection may not use zero-based integer indices.
- A slice usually keeps the original collection's indices.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
