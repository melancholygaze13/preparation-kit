---
title: "Error Handling Fundamentals"
domain: "Swift"
topic: "Language Basics"
page_type: concept-index
levels:
  - senior
interview_priority: high
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-22
---

# Error Handling Fundamentals

> A thrown error represents recoverable failure. Let it propagate until a layer
> has enough context to recover, translate, retry, or present it.

## Quick Recall

- `throws` makes possible failure visible in a function signature.
- `try?` discards error detail and returns an optional.
- `try!` traps when an error is thrown.
- Catch an error only when the current layer can make a policy decision.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Deeper Study

- [Error Handling](../../error-handling/README.md)
