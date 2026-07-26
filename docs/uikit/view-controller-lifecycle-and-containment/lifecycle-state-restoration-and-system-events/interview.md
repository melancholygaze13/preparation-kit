---
title: "Lifecycle, State Restoration, and System Events: Interview Questions"
domain: "UIKit"
topic: "View Controller Lifecycle and Containment"
concept: "Lifecycle, State Restoration, and System Events"
page_type: interview
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-07-26
---

# Lifecycle, State Restoration, and System Events: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What state should a UIKit app restore after termination?](#q1-restorable-state) | Senior | Durable state selection |
| [How do scene lifecycle and view controller lifecycle differ?](#q2-scene-vs-controller) | Senior | Scope and ownership |
| [How would you restore a deep navigation flow safely?](#q3-deep-flow) | Senior | Rebuild and failure handling |
| [When is full state restoration not worth it?](#q4-restoration-cost) | Staff | Product and architecture trade-off |

---

<a id="q1-restorable-state"></a>
## Q1: What state should a UIKit app restore after termination?

### Short Answer

Restore durable user context: route, selected model identifiers, drafts, filters,
and important editing position. Do not restore live views, cells, controller
instances, or data that should be reloaded from durable model storage.

### Expanded Answer

The restored state should be enough to rebuild the interface. For example, save
that the user was editing draft `123` in the messages flow, not the old text view
object or the old controller pointer.

Restoration also needs fallback behavior. If the model no longer exists or the
user no longer has access, rebuild to a valid parent screen or show a recoverable
error. Restoration should improve continuity, not make launch fragile.

<a id="q2-scene-vs-controller"></a>
## Q2: How do scene lifecycle and view controller lifecycle differ?

### Short Answer

Scene lifecycle describes a whole UI session, usually a window. View controller
lifecycle describes one screen or screen region. Scene callbacks are right for
window-level foreground and background work. Controller callbacks are right for
screen-level loading and visibility.

### Expanded Answer

A scene can move to the background while a controller is still on its navigation
stack. A controller can disappear while the scene remains active because another
controller was pushed or presented.

I choose the owner by scope. Cross-screen state and route restoration usually
belong to the scene or coordinator. Visible-only tasks, view refresh, and local
presentation cleanup belong to the controller.

<a id="q3-deep-flow"></a>
## Q3: How would you restore a deep navigation flow safely?

### Short Answer

I would restore a route model with stable identifiers, validate each step against
current data and permissions, then rebuild the navigation stack from those
validated states. If a step is invalid, I would fall back to the closest valid
screen.

### Expanded Answer

For example, a saved route might be account list, account detail, transaction
detail. On launch, I would resolve the selected account and transaction by ID.
If the transaction still exists, rebuild the stack. If it does not, show the
account detail or account list instead.

This is safer than trying to archive controllers. Controllers contain temporary
UIKit state and dependencies that may not be valid in a new process or scene.

<a id="q4-restoration-cost"></a>
## Q4: When is full state restoration not worth it?

### Short Answer

Full restoration may not be worth it for short, read-only, or easily recreated
screens. I would spend the effort where losing context or work hurts the user,
such as editing flows, document apps, multiwindow apps, or deep workflows.

### Expanded Answer

Restoration has design and testing cost. Every saved route needs validation,
loading states, and fallback behavior. If a screen can reload quickly and the
main tab is enough context, simpler restoration may be the better trade-off.

At app scale, I still want a consistent route model. Even if some screens choose
not to restore deeply, the app should make that choice intentionally rather than
through accidental controller lifetime assumptions.
