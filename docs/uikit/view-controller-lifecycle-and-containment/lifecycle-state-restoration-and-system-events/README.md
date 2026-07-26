---
title: "Lifecycle, State Restoration, and System Events"
domain: "UIKit"
topic: "View Controller Lifecycle and Containment"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-26
---

# Lifecycle, State Restoration, and System Events

> A lifecycle describes when a screen connects, appears, disappears, or is
> released. State restoration saves enough durable identity to rebuild that
> screen later, not a copy of its live view hierarchy.

## Quick Recall

- Treat controllers as rebuildable presentation objects.
- Persist model identity and navigation position, not live UIKit objects.
- Scene lifecycle affects visibility and foreground work.
- State restoration is most useful for deep workflows and multiwindow apps.
- Restoration paths must tolerate missing, deleted, or stale model data.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
