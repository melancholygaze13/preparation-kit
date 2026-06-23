---
title: "Adaptive Layout, Size Classes, and Input: Interview Questions"
domain: "SwiftUI"
topic: "Accessibility and Adaptive UI"
concept: "Adaptive Layout, Size Classes, and Input"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-06-23
tags:
  - adaptive-layout
  - size-classes
  - input
---

# Adaptive Layout, Size Classes, and Input: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you build an adaptive SwiftUI layout?](#q1-how-do-you-build-an-adaptive-swiftui-layout) | Senior | Container and content |
| [What are size classes good for?](#q2-what-are-size-classes-good-for) | Senior | Environmental hints |
| [How do you support multiple input methods?](#q3-how-do-you-support-multiple-input-methods) | Senior | Interaction adaptation |

---

<a id="q1-how-do-you-build-an-adaptive-swiftui-layout"></a>
## Q1: How do you build an adaptive SwiftUI layout?

### Short Answer

I respond to the actual container proposal and content using flexible stacks, grids,
`ViewThatFits`, container-relative sizing, or custom layout. I avoid device checks and
global screen bounds.

### Expanded Answer

Breakpoints come from when content fails, including localization and Dynamic Type.
The same feature state survives presentation changes, and I test live resize, split
view, rotation, keyboard, and accessibility sizes.

<a id="q2-what-are-size-classes-good-for"></a>
## Q2: What are size classes good for?

### Short Answer

They are coarse hints for choosing meaningful composition or navigation behavior.
They are not reliable device detection or exact width measurements.

### Expanded Answer

Two windows with the same class can have different usable space. I combine class with
container-driven layout where needed and keep selection and routes independent from
the compact or expanded presentation.

<a id="q3-how-do-you-support-multiple-input-methods"></a>
## Q3: How do you support multiple input methods?

### Short Answer

I use semantic controls, logical focus, adequate touch targets, pointer behavior,
keyboard commands, and accessibility actions. Essential functionality never depends
only on hover, right-click, drag, or a precise gesture.

### Expanded Answer

Every entry point uses the same model operation and policy. I test coexistence—such
as hardware keyboard with touch—and ensure visible focus, shortcut safety, and
alternatives for drag-and-drop.
