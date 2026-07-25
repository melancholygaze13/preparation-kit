---
title: "Adaptive Layout, Size Classes, and Input"
domain: "SwiftUI"
topic: "Accessibility and Adaptive UI"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-07-25
tags:
  - adaptive-layout
  - size-classes
  - input
---

# Adaptive Layout, Size Classes, and Input

> Adaptive layout changes composition for current space and content. Size classes are
> coarse environment categories. Input includes touch, pointer, keyboard, remote, and
> assistive technology. Adapt to these facts, not a device name.

## Quick Recall

- Prefer container proposals and adaptive layouts over `UIScreen` bounds.
- Size classes are coarse hints, not device detection.
- Windows resize, split, rotate, and move across displays.
- Support touch, pointer, keyboard, focus, and accessibility activation.
- Preserve one feature state while presentation changes across environments.

The same iPad can host several window sizes and several input methods. A component may
also occupy only part of a window. Global screen bounds therefore do not describe the
space proposed by its parent.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
