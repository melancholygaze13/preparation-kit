---
title: "Multiwindow, State Restoration, and Handoff"
domain: "UIKit"
topic: "App, Scene, Window, and System Integration"
page_type: concept-index
levels:
  - senior
  - staff
interview_priority: situational
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-10
---

# Multiwindow, State Restoration, and Handoff

> Treat each scene session as an independent user activity. Save stable identity
> and route state in a small `NSUserActivity`; keep durable content in the model or
> document store.

## Quick Recall

- Activate a new or existing scene with a user activity that identifies its
  content.
- Restore each scene from stable IDs and validate them against current data.
- Handoff transfers activity context, not a database or a large document payload.
- Coordinate shared model writes while keeping selection and navigation per scene.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related

- [Lifecycle, State Restoration, and System Events](../../view-controller-lifecycle-and-containment/lifecycle-state-restoration-and-system-events/README.md)
