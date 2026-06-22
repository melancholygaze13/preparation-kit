---
title: "String Indexing and Substrings"
domain: "Swift"
topic: "Strings and Characters"
page_type: concept-index
interview_priority: high
estimated_read_minutes: 1
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-22
tags:
  - string-index
  - substring
  - slicing
  - performance
---

# String Indexing and Substrings

> Swift string positions are Unicode-aware boundaries, not integer offsets.
> Correct code derives indices from the current string, respects invalidation,
> and treats `Substring` as a short-lived view unless ownership is made explicit.

## Quick Recall

- String indices are not integer offsets.
- Derive positions with `startIndex`, `endIndex`, and index-navigation APIs.
- Mutation can invalidate saved indices.
- Convert a long-lived `Substring` to `String` to own its storage explicitly.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Prerequisites

- [String and Unicode Model](../string-and-unicode-model/README.md)
- [Range Operators](../../basic-operators/range-operators/README.md)
