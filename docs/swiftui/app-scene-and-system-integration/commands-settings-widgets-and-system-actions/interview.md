---
title: "Commands, Settings, Widgets, and System Actions: Interview Questions"
domain: "SwiftUI"
topic: "App, Scene, and System Integration"
concept: "Commands, Settings, Widgets, and System Actions"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: situational
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-06-23
tags:
  - commands
  - widgets
  - app-intents
---

# Commands, Settings, Widgets, and System Actions: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How should commands work in a multiwindow app?](#q1-how-should-commands-work-in-a-multiwindow-app) | Senior | Focused scene routing |
| [How is a widget different from an app view?](#q2-how-is-a-widget-different-from-an-app-view) | Senior | Timeline lifecycle |
| [How would you share a capability across the app and App Intents?](#q3-how-would-you-share-a-capability-across-the-app-and-app-intents) | Staff | Integration boundaries |

---

<a id="q1-how-should-commands-work-in-a-multiwindow-app"></a>
## Q1: How should commands work in a multiwindow app?

### Short Answer

Commands should resolve the capability from the focused scene. I publish focused values,
bindings, or actions from each window and disable a command when the active scene cannot
perform it. I do not capture one global document or navigation model.

### Expanded Answer

The command invokes the same validated application operation as other entry points.
Focus changes, window closure, and keyboard invocation are normal cases. Tests move
focus between windows and verify that Save, Undo, or Duplicate reaches the correct one.

<a id="q2-how-is-a-widget-different-from-an-app-view"></a>
## Q2: How is a widget different from an app view?

### Short Answer

A widget is system-managed, timeline-driven UI in a separate extension. It renders
entries and cannot assume continuous execution or an in-memory app model. Refresh
requests are hints, and interactive controls perform bounded App Intents.

### Expanded Answer

The provider supplies placeholders, snapshots, and dated entries. Shared durable data
needs an extension-safe store such as an App Group with a versioned schema. The widget
must render useful stale, locked, redacted, and unavailable states.

<a id="q3-how-would-you-share-a-capability-across-the-app-and-app-intents"></a>
## Q3: How would you share a capability across the app and App Intents?

### Short Answer

I put the authorized domain operation behind an interface independent of SwiftUI. The
app view, command, widget intent, and shortcut adapter translate their inputs into that
operation and translate its result for their surface.

### Expanded Answer

Intent parameters use stable identifiers and resolve current data at execution time.
The operation handles retries, expired authorization, deleted entities, and persistence.
Adapters own presentation; the capability does not attempt to dismiss a view or mutate
a global navigation path.

### Trade-offs

A shared operation prevents policy drift, but each system surface still needs a narrow
adapter because runtime, privacy, latency, and interaction constraints differ. A common
schema also requires coordinated versioning across the app and extensions.
