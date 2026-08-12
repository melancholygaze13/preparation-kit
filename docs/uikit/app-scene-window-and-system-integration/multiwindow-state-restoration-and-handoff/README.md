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
last_reviewed: 2026-08-12
---

# Multiwindow, State Restoration, and Handoff

> Multiwindow means the app can have several independent scene sessions. State
> restoration rebuilds a scene after disconnection or termination. Handoff lets
> another device continue the activity. Save stable identity and route state,
> while keeping durable content in the model or document store.

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
