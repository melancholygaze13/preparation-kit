---
title: "Async Functions, Suspension, and Executors"
domain: "Swift"
topic: "Concurrency"
page_type: concept-index
interview_priority: core
estimated_read_minutes: 1
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Async Functions, Suspension, and Executors

> `async` allows a function to suspend. It does not mean background execution or
> parallel work.

## Quick Recall

- `await` marks a possible suspension point.
- Suspension releases the thread; blocking keeps the thread occupied.
- Consecutive awaited calls are sequential unless child tasks add concurrency.
- Actor isolation and executor rules decide where synchronous work runs.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
