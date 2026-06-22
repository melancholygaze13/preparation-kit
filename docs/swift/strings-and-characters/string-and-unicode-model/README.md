---
title: "String and Unicode Model"
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
  - strings
  - unicode
  - grapheme-clusters
  - text-encoding
---

# String and Unicode Model

> Swift `String` is a value-semantic collection of Unicode extended grapheme
> clusters. User-visible characters, Unicode scalars, and encoded bytes are
> different views with different correctness and interoperability contracts.

## Quick Recall

- A Swift `Character` is an extended grapheme cluster.
- One visible character can contain several Unicode scalars or bytes.
- Canonically equivalent strings compare equal in Swift.
- Choose a Unicode-scalar or encoding view only when the boundary requires it.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Prerequisites

- [Constants and Variables](../../language-basics/constants-and-variables/README.md)
- [Assignment, Arithmetic, and Comparison](../../basic-operators/assignment-arithmetic-and-comparison/README.md)

## Related Concepts

- [String Indexing and Substrings](../string-indexing-and-substrings/README.md)
