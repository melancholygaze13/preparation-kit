---
title: "Child Coordinators and Lifetime"
domain: "Architecture"
topic: "Coordinator and Navigation Architecture"
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
  - coordinators
  - lifetime
  - ownership
---

# Child Coordinators and Lifetime

> A parent strongly owns a child coordinator only while its flow is active. Completion,
> dismissal, or replacement removes the child and releases the entire feature graph.

## Quick Recall

- The coordinator tree should match active flow ownership, not merely the view hierarchy.
- Parent owns child; child reports a result without strongly owning the parent.
- Every exit path needs teardown: completion, cancel, back gesture, dismissal, scene
  closure, and failed startup.
- A navigation controller retaining screens does not replace explicit coordinator ownership.
- Teardown cancels feature-scoped tasks and subscriptions; durable operations move to
  a longer-lived owner first.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
