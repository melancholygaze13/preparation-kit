---
title: "Error Modeling and Throwing APIs"
domain: "Swift"
topic: "Error Handling"
page_type: concept-index
interview_priority: core
estimated_read_minutes: 1
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Error Modeling and Throwing APIs

> Throw errors for recoverable failures that require caller policy; use optionals for
> simple absence and assertions or preconditions for programmer-contract violations.

## Quick Recall

- Throw when the caller can choose a recovery policy.
- Use an optional for expected absence without useful failure detail.
- Do not convert programmer errors into ordinary recoverable errors.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Propagation, Recovery, and Boundary Policy](../propagation-recovery-and-boundary-policy/README.md)
