---
title: "Lifecycle, State Restoration, and System Events"
domain: "UIKit"
topic: "View Controller Lifecycle and Containment"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-30
---

# Lifecycle, State Restoration, and System Events

> UIKit screens must survive system-driven lifecycle changes. Save enough
> restorable identity to rebuild the screen, not snapshots of the view hierarchy.

## Quick Recall

- Treat controllers as rebuildable presentation objects.
- Persist model identity and navigation position, not live UIKit objects.
- Scene lifecycle affects visibility and foreground work.
- State restoration is most useful for deep workflows and multiwindow apps.
- Restoration paths must tolerate missing, deleted, or stale model data.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
