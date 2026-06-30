---
title: "Lifecycle, State Restoration, and System Events: Theory"
domain: "UIKit"
topic: "View Controller Lifecycle and Containment"
concept: "Lifecycle, State Restoration, and System Events"
page_type: theory
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 6
status: reviewed
last_reviewed: 2026-06-30
---

# Lifecycle, State Restoration, and System Events: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

UIKit controllers are presentation objects. The system can interrupt, hide,
discard, or recreate parts of the interface. A robust app stores the durable
state needed to rebuild the user's place rather than depending on controller
instances living forever.

For restoration, think in identifiers:

```text
selected account id + route + draft id -> rebuild controllers -> reload views
```

Do not think in live views:

```text
old labels + table cell instances + controller pointers
```

Views and controllers are implementation details of the current session. Model
identity and route state are the restorable part.

## Scene and Controller Lifecycles

Modern UIKit apps often use scenes. A scene owns a window and a visible UI
session. Scene callbacks tell the app whether that UI session is foreground,
background, active, or disconnected. View controller callbacks tell each screen
whether its own view is loading, appearing, or disappearing.

Those lifecycles overlap but do not replace each other. A scene can move to the
background while a controller is still on the navigation stack. A controller can
disappear while the scene remains active. Choose the owner based on scope:

| State or work | Owner |
|---|---|
| Current navigation stack for one window | Scene or flow coordinator |
| Visible-only screen work | View controller |
| Cross-scene account session | App or shared model layer |
| Draft tied to one workflow | Feature model, saved by identifier |

## Restoration Data

State restoration should save small, durable facts:

- route or selected tab
- selected model identifier
- scroll or selection position when it matters
- draft identifier
- editing mode or filter state

It should not save live UIKit objects, transient cells, or data that can be
reloaded from a source of truth. Restoration must handle failure. The selected
item may have been deleted. The user may no longer have permission. A draft may
be invalid. In those cases, rebuild to the nearest valid screen instead of
crashing or showing broken state.

## Engineering Decisions

Full restoration is not free. It is most valuable when users can lose meaningful
work or context:

- multi-step editing flows
- document-style apps
- multiwindow iPad apps
- deep navigation stacks
- expensive search or filtering context

For short, read-only screens, it may be enough to restore the main tab and reload
fresh data. The interview point is not that every controller needs full state
restoration. The point is that a senior engineer can choose the depth based on
user impact and implementation cost.

Use route models or coordinator state when possible. They make restoration
testable without UIKit. The UIKit layer can then translate restored route state
into controllers.

## Production Application

Restoration interacts with async loading. A restored screen often appears before
all data is available. Design for a loading state, then resolve the saved
identifier to current data. If the data is missing, show a clear fallback such as
the parent list or an error state with recovery.

For Staff-level ownership, define which layer owns route persistence and how
features encode restorable state. Without a convention, one feature may restore
controllers, another may restore models, and another may restore nothing. That
makes multiwindow and deep-link behavior inconsistent.

## References

- [Scenes](https://developer.apple.com/documentation/uikit/scenes)
- [Restoring Your App's State](https://developer.apple.com/documentation/uikit/restoring-your-app-s-state)
- [Preserving Your App's UI Across Launches](https://developer.apple.com/documentation/uikit/preserving-your-app-s-ui-across-launches)
