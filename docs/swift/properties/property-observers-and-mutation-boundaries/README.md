---
title: "Property Observers and Mutation Boundaries"
domain: "Swift"
topic: "Properties"
page_type: concept-index
interview_priority: situational
estimated_read_minutes: 1
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-22
---

# Property Observers and Mutation Boundaries

> `willSet` and `didSet` synchronously observe assignments; they do not create an
> atomic transaction, reject invalid input, or synchronize concurrent writers.

## Quick Recall

- `willSet` receives the incoming value; `didSet` receives the old value.
- Observers run synchronously as part of assignment.
- Use an initializer or method to validate state before storage.
- Observers do not provide synchronization or transactional rollback.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Stored and Computed Properties](../stored-and-computed-properties/README.md)
- [Property Wrappers and Type Properties](../property-wrappers-and-type-properties/README.md)
