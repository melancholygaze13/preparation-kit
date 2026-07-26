---
title: "Keyboard Avoidance and Scroll Coordination"
domain: "UIKit"
topic: "Text Input, Keyboard, and Forms"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: high
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-26
---

# Keyboard Avoidance and Scroll Coordination

> Keyboard avoidance moves or scrolls content so the keyboard does not cover the
> active input. The goal is to keep the focused
> input visible while preserving scroll position and system animation timing.

## Quick Recall

- Prefer `keyboardLayoutGuide` on modern UIKit views when constraints can express
  the relationship.
- For scroll views, adjust insets and scroll indicators with keyboard movement.
- Use keyboard animation timing from UIKit notifications when supporting older
  approaches.
- Scroll to the focused field after layout knows the final visible area.
- Avoid hard-coded keyboard heights; keyboards vary by device, language,
  floating mode, hardware keyboard, and split view.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
