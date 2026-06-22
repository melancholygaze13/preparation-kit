---
title: "Assertions and Preconditions"
domain: "Swift"
topic: "Language Basics"
page_type: concept-index
levels:
  - senior
interview_priority: situational
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-22
---

# Assertions and Preconditions

> Assertions detect internal mistakes during development. Preconditions enforce
> API requirements in normal production builds. Neither handles recoverable input.

## Quick Recall

- `assert` is intended for debug-time internal checks.
- `precondition` states a required condition for correct use.
- `fatalError` stops execution for an unrecoverable path.
- Validate untrusted input before it reaches a precondition.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
