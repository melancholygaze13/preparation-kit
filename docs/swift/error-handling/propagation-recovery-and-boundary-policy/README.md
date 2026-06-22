---
title: "Propagation, Recovery, and Boundary Policy"
domain: "Swift"
topic: "Error Handling"
page_type: concept-index
interview_priority: core
estimated_read_minutes: 1
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Propagation, Recovery, and Boundary Policy

> Propagate until a layer can retry, translate, compensate, or present; catching
> without policy usually destroys information and observability.

## Quick Recall

- Let an error propagate until a layer can act on it.
- Preserve the underlying cause when translating errors.
- Treat cancellation separately from ordinary failure when appropriate.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Error Modeling and Throwing APIs](../error-modeling-and-throwing-apis/README.md)
