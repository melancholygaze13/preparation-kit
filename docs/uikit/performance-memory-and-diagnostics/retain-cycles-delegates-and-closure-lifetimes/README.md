---
title: "Retain Cycles, Delegates, and Closure Lifetimes"
domain: "UIKit"
topic: "Performance, Memory, and Diagnostics"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-05
---

# Retain Cycles, Delegates, and Closure Lifetimes

> UIKit memory bugs are usually ownership bugs. A strong answer names the object
> graph, explains which reference should not keep the other object alive, and
> proves teardown with Instruments or a focused test.

## Quick Recall

- ARC releases class instances when no strong references remain.
- A retain cycle happens when objects keep each other alive through strong paths.
- Delegates are usually `weak` because the owner should not retain its callback.
- Closures capture strongly by default; choose `weak`, `unowned`, or strong based
  on the real lifetime relationship.
- Timers, display links, notifications, tasks, and cells often hide long-lived
  references.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
