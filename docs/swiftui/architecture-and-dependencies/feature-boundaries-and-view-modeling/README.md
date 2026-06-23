---
title: "Feature Boundaries and View Modeling"
domain: "SwiftUI"
topic: "Architecture and Dependencies"
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
  - feature-boundaries
  - view-modeling
  - observation
---

# Feature Boundaries and View Modeling

> A feature owns a user outcome, its state transitions, and its dependencies. Views
> describe presentation; a model coordinates policy only when the feature needs it.

## Quick Recall

- Start with the smallest boundary that keeps one source of truth.
- Keep transient presentation state local to the view that owns it.
- Use an observable model for shared policy, async work, or coordinated state.
- Pass values and actions to reusable leaf views instead of the entire feature model.
- Split by behavior and ownership, not by arbitrary file size or screen count.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
