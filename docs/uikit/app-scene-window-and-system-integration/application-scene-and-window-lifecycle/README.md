---
title: "Application, Scene, and Window Lifecycle"
domain: "UIKit"
topic: "App, Scene, Window, and System Integration"
page_type: concept-index
levels:
  - senior
  - staff
interview_priority: high
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-08-12
---

# Application, Scene, and Window Lifecycle

> The app is the running process. A scene is one UI session, and its window holds
> that scene's view hierarchy. Put process-wide setup in the app delegate,
> scene-specific composition in the scene delegate, and screen behavior in view
> controllers.

## Quick Recall

- Scene-based lifecycle is required for apps built with the latest iOS 27 SDK.
- The app delegate configures shared services and scene types; the scene delegate
  builds and manages one UI session.
- Create a window for its `UIWindowScene`; do not choose a global "first" window.
- Disconnection releases scene-owned resources but does not mean the session was
  permanently discarded.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related

- [Lifecycle, State Restoration, and System Events](../../view-controller-lifecycle-and-containment/lifecycle-state-restoration-and-system-events/README.md)
