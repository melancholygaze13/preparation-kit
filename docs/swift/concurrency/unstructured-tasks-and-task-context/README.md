---
title: "Unstructured Tasks and Task Context"
domain: "Swift"
topic: "Concurrency"
page_type: concept-index
interview_priority: core
estimated_read_minutes: 1
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Unstructured Tasks and Task Context

> An unstructured task can outlive the scope that creates it. A clear owner must
> store its handle, observe errors, and cancel it when needed.

## Quick Recall

- `Task {}` inherits actor context, priority, and task-local values.
- `Task.detached` does not inherit actor isolation or task-local context.
- Neither form creates structured parent-child lifetime.
- Do not discard a handle when cancellation or errors matter.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
