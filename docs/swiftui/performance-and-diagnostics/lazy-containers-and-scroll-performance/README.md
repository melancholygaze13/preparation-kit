---
title: "Lazy Containers and Scroll Performance"
domain: "SwiftUI"
topic: "Performance and Diagnostics"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-23
tags:
  - lazy-containers
  - scrolling
  - list-identity
---

# Lazy Containers and Scroll Performance

> Lazy containers defer child creation, but smooth scrolling still requires stable
> identity, cheap rows, bounded resources, predictable layout, and measured image work.

## Quick Recall

- Use lazy stacks or `List` for large data, not as a universal replacement for stacks.
- Row IDs must be stable and unique across mutations.
- Keep row construction and `body` free of repeated transforms and synchronous I/O.
- Decode and resize images near their display size, then cache with limits.
- Diagnose scroll hitches in release-like builds with realistic data and interactions.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
