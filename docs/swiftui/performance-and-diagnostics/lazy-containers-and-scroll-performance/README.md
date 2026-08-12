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
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-08-12
tags:
  - lazy-containers
  - scrolling
  - list-identity
---

# Lazy Containers and Scroll Performance

> A lazy container creates child descriptions near the visible region instead of
> creating every child at once. It reduces eager work, but smooth scrolling still
> needs stable identity, cheap rows, bounded resources, and measured image work.

## Quick Recall

- Use lazy stacks or `List` for large data, not as a universal replacement for stacks.
- Row IDs must be stable and unique across mutations.
- Keep row construction and `body` free of repeated transforms and synchronous I/O.
- Keep one item mapped to a stable direct-child structure; filter before `ForEach`.
- Treat absolute lazy-stack size and offset as estimates, not stable business state.
- Diagnose scroll hitches in release-like builds with realistic data and interactions.

Laziness is a scheduling strategy, not a row-lifetime guarantee. SwiftUI decides how
far ahead to create content and when to release it. Put important state in an owner
whose lifetime does not depend on an offscreen row being destroyed.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
