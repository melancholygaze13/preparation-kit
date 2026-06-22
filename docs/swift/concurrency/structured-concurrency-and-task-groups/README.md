---
title: "Structured Concurrency and Task Groups"
domain: "Swift"
topic: "Concurrency"
page_type: concept-index
interview_priority: core
estimated_read_minutes: 1
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Structured Concurrency and Task Groups

> Structured concurrency keeps child tasks inside a parent scope. The parent
> cannot finish until its children finish or are cancelled.

## Quick Recall

- Use `async let` for a fixed number of independent results.
- Use a task group for a dynamic number of child tasks.
- A task group does not limit concurrency by itself.
- Define how errors, partial results, and cancellation should behave.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
