---
title: "Retain Cycles, Delegates, and Closure Lifetimes"
domain: "UIKit"
topic: "Performance, Memory, and Diagnostics"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-26
---

# Retain Cycles, Delegates, and Closure Lifetimes

> A retain cycle occurs when strong references keep objects alive through a loop.
> Delegates and closures often complete that loop in UIKit. Draw the references,
> decide which one must be weak or temporary, and verify that the screen is
> released.

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
