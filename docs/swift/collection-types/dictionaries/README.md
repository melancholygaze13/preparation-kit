---
title: "Dictionaries"
domain: "Swift"
topic: "Collection Types"
page_type: concept-index
levels:
  - senior
interview_priority: high
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-22
---

# Dictionaries

> `Dictionary` maps each unique `Hashable` key to one value. Correct design needs
> stable keys, explicit absence, and a clear duplicate-key policy.

## Quick Recall

- Subscript lookup returns an optional because a key may be absent.
- Assigning `nil` through the basic subscript removes the key.
- The default-value subscript supports read-modify-write without optional binding.
- Dictionary iteration order is not a stable contract.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
