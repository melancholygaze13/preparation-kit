---
title: "Gesture Recognizer Coordination"
domain: "UIKit"
topic: "Controls, Events, Gestures, and Focus"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: high
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-26
---

# Gesture Recognizer Coordination

> A gesture recognizer watches touches and reports a gesture such as a tap, pan,
> or pinch through a series of states. The hard part
> is not adding a recognizer; it is deciding which gestures may recognize
> together, which must wait, and which should fail.

## Quick Recall

- Gesture recognizers move through states such as possible, began, changed,
  ended, failed, and cancelled.
- Use delegate methods to allow simultaneous recognition or require failure.
- Scroll views already own several gestures; custom gestures must cooperate with
  them.
- `cancelsTouchesInView`, delays, and failure requirements affect controls.
- Prefer clear gesture priority over ad hoc touch handling in parent views.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
