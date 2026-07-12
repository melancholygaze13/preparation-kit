---
title: "Memory Safety Fundamentals"
domain: "Swift"
topic: "Language Basics"
page_type: concept-index
levels:
  - senior
interview_priority: situational
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-12
---

# Memory Safety Fundamentals

> Safe Swift prevents invalid memory access through initialization, bounds,
> lifetime, and exclusive-access rules. Unsafe APIs move part of that proof to you.

## Quick Recall

- Values must be initialized before use.
- Safe collection access checks bounds.
- Conflicting overlapping access to the same storage is not allowed.
- Unsafe pointers require manual lifetime and bounds guarantees.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Deeper Study

- [Memory Safety](../../memory-safety/README.md)
