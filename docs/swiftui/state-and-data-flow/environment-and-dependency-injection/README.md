---
title: "Environment and Dependency Injection"
domain: "SwiftUI"
topic: "State and Data Flow"
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
  - environment
  - dependency-injection
  - composition-root
---

# Environment and Dependency Injection

> SwiftUI's environment is inherited, overridable context for a view subtree. Use
> explicit initializer injection for required feature dependencies, and use the
> environment for values or actions that are genuinely ambient across many levels.

## Quick Recall

- Descendants inherit environment values; the closest override wins.
- Reading an environment value creates an update dependency on that value.
- Use `@Entry` to define modern custom environment values.
- The environment supplies dependencies but does not own observable model lifetime.
- Override dependencies in previews and tests at the smallest useful root.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
