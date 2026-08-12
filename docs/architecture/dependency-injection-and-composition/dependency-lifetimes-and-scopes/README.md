---
title: "Dependency Lifetimes and Scopes"
domain: "Architecture"
topic: "Dependency Injection and Composition"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-08-12
tags:
  - dependency-injection
  - lifetime
  - scopes
---

# Dependency Lifetimes and Scopes

> A dependency should live exactly as long as the state and operations it owns. Scope
> is an ownership decision, not merely whether a container returns a singleton.

## Quick Recall

- Common scopes are process, account session, scene, feature flow, and operation.
- Share infrastructure designed for concurrency; do not share mutable feature state globally.
- Logout, scene closure, flow completion, and account switch are explicit scope teardown events.
- Factories and providers must state whether they return a shared, scoped, or new instance.
- A singleton simplifies access but can mix users, windows, tests, and concurrent mutation.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
