---
title: "Keyboard Avoidance and Scroll Coordination: Interview Questions"
domain: "UIKit"
topic: "Text Input, Keyboard, and Forms"
concept: "Keyboard Avoidance and Scroll Coordination"
page_type: interview
levels: [senior, staff, principal]
interview_priority: high
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-07-26
---

# Keyboard Avoidance and Scroll Coordination: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you keep a text field visible when the keyboard appears?](#q1-keep-field-visible) | Senior | Keyboard avoidance |
| [When would you use `keyboardLayoutGuide`?](#q2-keyboard-layout-guide) | Senior | Modern layout |
| [Why is hard-coding keyboard height unsafe?](#q3-hard-coded-height) | Senior | Device adaptation |

---

<a id="q1-keep-field-visible"></a>
## Q1: How do you keep a text field visible when the keyboard appears?

### Short Answer

For a scrollable form, update the scroll view's bottom inset for the keyboard
overlap and scroll the focused field into the visible area.

### Expanded Answer

The important part is to react to the final visible area, not a fixed keyboard
height. I convert the keyboard frame into the screen's coordinate space, update
content and indicator insets, then scroll the current first responder into
view after layout has the right bounds.

For fixed bottom controls, I would usually prefer constraints to
`keyboardLayoutGuide`.

---

<a id="q2-keyboard-layout-guide"></a>
## Q2: When would you use `keyboardLayoutGuide`?

### Short Answer

Use `keyboardLayoutGuide` when Auto Layout can describe how content should move
with the keyboard, such as a bottom submit button or composer.

### Expanded Answer

The constraint describes the relationship directly and avoids manually tracking
keyboard frames. It is especially useful when a view should sit above the keyboard.

For long scrollable forms, I may still need scroll view inset logic so every
field remains reachable.

---

<a id="q3-hard-coded-height"></a>
## Q3: Why is hard-coding keyboard height unsafe?

### Short Answer

Keyboard size is not fixed. It changes with device, input language, hardware
keyboard, floating keyboard, split view, and system UI.

### Expanded Answer

Hard-coded heights make the layout fail in common real devices states. A strong
implementation uses the keyboard layout guide or the frame from UIKit keyboard
notifications.

It also treats keyboard space separately from safe area space. Those two layout
constraints can both matter.
