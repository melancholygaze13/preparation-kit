---
title: "Responder Chain and Event Delivery: Interview Questions"
domain: "UIKit"
topic: "Controls, Events, Gestures, and Focus"
concept: "Responder Chain and Event Delivery"
page_type: interview
levels: [senior, staff, principal]
interview_priority: high
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-07-05
---

# Responder Chain and Event Delivery: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What is the responder chain?](#q1-responder-chain) | Senior | Event and action routing |
| [How does UIKit decide which view receives a touch?](#q2-hit-testing) | Senior | Hit testing |
| [When would you use a targetless action?](#q3-targetless-action) | Staff | Command routing |

---

<a id="q1-responder-chain"></a>
## Q1: What is the responder chain?

### Short Answer

The responder chain is UIKit's linked path of `UIResponder` objects. If an event
or targetless action is not handled by one responder, UIKit can ask the next one.

### Expanded Answer

Views, view controllers, windows, and the application are responders. The chain
lets the active context handle commands without every sender knowing the exact
target. It is common for editing commands, keyboard shortcuts, menus, and
document-style actions.

---

<a id="q2-hit-testing"></a>
## Q2: How does UIKit decide which view receives a touch?

### Short Answer

UIKit hit-tests from the window through the view hierarchy and chooses the
frontmost eligible view whose bounds contain the touch point.

### Expanded Answer

Hidden views, views with interaction disabled, views outside the point, and
effectively transparent views are skipped. Subviews are searched front to back.
After UIKit identifies the hit-test view, gesture recognizers and controls can
participate in handling the touch sequence.

If a touch is missing, I check hierarchy, bounds, overlays, interaction flags,
and gestures before changing application logic.

---

<a id="q3-targetless-action"></a>
## Q3: When would you use a targetless action?

### Short Answer

Use a targetless action when the command should go to the current active
responder, not to one hard-coded object.

### Expanded Answer

Examples include copy, paste, delete, undo, and keyboard commands. A menu item
can send a selector with `to: nil`, and UIKit routes it through the responder
chain. That keeps the command sender decoupled from the current editor or screen.

For simple buttons with one owner, an explicit target or closure output is often
clearer.
