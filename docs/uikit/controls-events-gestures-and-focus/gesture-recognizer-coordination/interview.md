---
title: "Gesture Recognizer Coordination: Interview Questions"
domain: "UIKit"
topic: "Controls, Events, Gestures, and Focus"
concept: "Gesture Recognizer Coordination"
page_type: interview
levels: [senior, staff, principal]
interview_priority: high
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-07-26
---

# Gesture Recognizer Coordination: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do gesture recognizers work?](#q1-gesture-recognizers) | Senior | Gesture state |
| [How do you resolve conflicts between gestures?](#q2-gesture-conflicts) | Senior | Delegate coordination |
| [How do gestures interact with scroll views and controls?](#q3-scroll-controls) | Staff | Production conflicts |

---

<a id="q1-gesture-recognizers"></a>
## Q1: How do gesture recognizers work?

### Short Answer

A gesture recognizer observes touch events and changes state when the touches
match its gesture. The handler responds to states such as began, changed, ended,
failed, and cancelled.

### Expanded Answer

Discrete gestures like tap usually recognize once. Continuous gestures like pan
or pinch update over time. Good handlers account for cancellation and failure,
not only the happy path.

I prefer recognizers over broad custom touch handling when the interaction maps
to a standard gesture.

---

<a id="q2-gesture-conflicts"></a>
## Q2: How do you resolve conflicts between gestures?

### Short Answer

Decide which gesture should win or whether both may succeed. Then use delegate
methods or failure requirements to express that rule.

### Expanded Answer

If two gestures can both be valid, allow simultaneous recognition. If one should
win, require the other to fail or block recognition in
`gestureRecognizerShouldBegin(_:)`. For tap conflicts, a single tap may wait for
a double tap to fail.

The wrong fix is adding random delays or parent touch overrides without a clear
policy.

---

<a id="q3-scroll-controls"></a>
## Q3: How do gestures interact with scroll views and controls?

### Short Answer

Scroll views and controls already have interaction behavior. A custom gesture
must decide whether it cooperates with them, waits for them, or ignores touches
that belong to them.

### Expanded Answer

For a custom pan inside a scroll view, I would decide whether vertical scrolling
or the custom gesture wins. For a tap-to-dismiss recognizer, I would usually
ignore touches inside controls so buttons still work.

I also check `cancelsTouchesInView` and delegate filters, but I do not disable
cancellation blindly. Sometimes cancelling touches is the correct gesture
behavior.
