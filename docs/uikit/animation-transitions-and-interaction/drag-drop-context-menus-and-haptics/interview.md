---
title: "Drag and Drop, Context Menus, and Haptics: Interview Questions"
domain: "UIKit"
topic: "Animation, Transitions, and Interaction"
concept: "Drag and Drop, Context Menus, and Haptics"
page_type: interview
levels:
  - senior
  - staff
interview_priority: situational
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-07-10
---

# Drag and Drop, Context Menus, and Haptics: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Why does a drag item need an item provider and `localObject`?](#q1-drag-data) | Senior | Transfer boundaries |
| [How do you implement a safe move by drag and drop?](#q2-safe-drop) | Senior | Transaction and identity |
| [How should context menu actions be designed?](#q3-context-menu-actions) | Senior | Current policy and discovery |
| [How do you choose and operate haptic feedback?](#q4-haptic-feedback) | Senior | Semantic feedback |

---

<a id="q1-drag-data"></a>
## Q1: Why does a drag item need an item provider and `localObject`?

### Short Answer

The item provider carries transferable data across processes. `localObject` is an
optional same-app fast path and cannot be the only representation.

### Expanded Answer

I register a stable type representation with `NSItemProvider`. On drop I validate
the type and decode asynchronously. For a local drag, `localObject` can carry a
stable ID or model reference and avoid decoding.

Another app cannot access `localObject`. External provider data is untrusted, so the
destination checks size, decoding, authorization, and current state.

---

<a id="q2-safe-drop"></a>
## Q2: How do you implement a safe move by drag and drop?

### Short Answer

For an allowed in-app move, I validate and insert at the destination before removing
the source. Cross-app data is copied, not moved.

### Expanded Answer

A drag can cancel or leave the app, so I do not delete at drag start. UIKit permits
move only within the same app when the session allows it. The destination accepts
and persists the value before the source delegate removes the original.

Index paths may change during the interaction. I resolve items by identity and reject
a stale or unauthorized destination. Failure must leave a consistent source and
destination.

---

<a id="q3-context-menu-actions"></a>
## Q3: How should context menu actions be designed?

### Short Answer

Actions should be short, relevant to the selected item, built from current state, and
revalidated when executed. Important actions must also exist outside the menu.

### Expanded Answer

I use stable item identity rather than a captured index path. Permissions or item
state may change while the menu is open. Destructive actions are marked clearly and
placed consistently.

The menu is hidden by default, so it cannot be the only route to a required command.
UIKit should own the standard menu gesture and transition.

---

<a id="q4-haptic-feedback"></a>
## Q4: How do you choose and operate haptic feedback?

### Short Answer

I use selection feedback for selection changes, impact feedback for collision or
snap, and notification feedback for success, warning, or failure.

### Expanded Answer

I trigger at the semantic event, not at an arbitrary animation frame. If the event is
predictable, I call `prepare()` shortly before it to reduce latency. I avoid duplicate
feedback around system controls.

Haptic delivery is not guaranteed, so visual or spoken feedback carries the same
meaning. At team scale, I would define a small semantic vocabulary rather than let
features choose arbitrary styles and intensities.

### Trade-offs

Preparation can lower latency but uses power and only helps when called early enough.
Too much feedback becomes noise and weakens the meaning of important events.
