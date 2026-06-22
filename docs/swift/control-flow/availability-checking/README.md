---
title: "Availability Checking"
domain: "Swift"
topic: "Control Flow"
page_type: concept-index
interview_priority: high
estimated_read_minutes: 1
levels:
  - senior
  - staff
  - principal
status: reviewed
last_reviewed: 2026-06-22
tags:
  - availability
  - deployment-target
  - compatibility
---

# Availability Checking

> Swift availability checking combines declaration metadata, deployment targets,
> compile-time diagnostics, and runtime conditions. It prevents calls to APIs that
> may not exist, but it does not prove that a feature is configured, permitted, or
> operational.

## Quick Recall

- The SDK controls which APIs the compiler knows.
- The deployment target sets the oldest supported OS version.
- `#available` checks the current runtime before using a newer API.
- Availability does not prove permission, configuration, or service capability.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Prerequisites

- [Guard and Deferred Cleanup](../guard-and-deferred-cleanup/README.md)

## Related Concepts

- [Conditional Branching and Pattern Matching](../conditional-branching-and-pattern-matching/README.md)
