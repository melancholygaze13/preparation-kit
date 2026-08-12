---
title: "Accessibility Tree, Labels, and Actions"
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
last_reviewed: 2026-08-12
tags:
  - accessibility-tree
  - voiceover
  - accessibility-actions
---

# Accessibility Tree, Labels, and Actions

> The accessibility tree is the semantic interface exposed to assistive technology.
> Labels name elements, and actions describe what users can do. Expose meaning and
> operations rather than every decorative visual layer.

## Quick Recall

- Start with standard controls and meaningful text labels.
- Hide decorative images; label informative images by meaning.
- Group visual fragments when they form one understandable element.
- Provide named actions for gesture-only or contextual operations.
- Verify order, focus, values, traits, and actions with real assistive technology.

Start with `Button`, `Toggle`, `Text`, and other semantic views. Add accessibility
modifiers only when the derived tree does not express the intended meaning. A visually
complex row may be one element, several controls, or a container of both.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
