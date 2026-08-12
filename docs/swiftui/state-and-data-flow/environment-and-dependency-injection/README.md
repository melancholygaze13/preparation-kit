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
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-08-12
tags:
  - environment
  - dependency-injection
  - composition-root
---

# Environment and Dependency Injection

> SwiftUI's environment is inherited, overridable context for a view subtree. Use
> explicit initializer injection for required feature dependencies, and use the
> environment for values or actions that are genuinely ambient across many levels.

Dependency injection means supplying a dependency from outside the view instead
of constructing the live implementation inside it.

## Quick Recall

- Descendants inherit environment values; the closest override wins.
- Reading an environment value creates an update dependency on that value.
- Use `@Entry` to define modern custom environment values.
- The environment can retain a model reference, but it does not decide the model's
  lifecycle policy.
- Override dependencies in previews and tests at the smallest useful root.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
