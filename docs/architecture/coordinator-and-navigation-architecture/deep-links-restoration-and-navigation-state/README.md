---
title: "Deep Links, Restoration, and Navigation State"
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
  - deep-links
  - restoration
  - navigation-state
---

# Deep Links, Restoration, and Navigation State

> Parse external input into a typed route, validate it against current app state, and
> let the owning flow build the nearest valid destination. Persist stable route data,
> not a live view hierarchy.

## Quick Recall

- URL parsing, route validation, prerequisite resolution, and presentation are separate steps.
- Treat deep links and restoration data as untrusted, versioned input.
- Authentication, authorization, missing data, and unsupported routes need explicit outcomes.
- Restore identifiers and drafts that can be recreated; never encode services, tasks,
  view controllers, or transient alerts.
- Navigation is usually per scene. A global path breaks multiple-window ownership.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
