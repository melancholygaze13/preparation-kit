---
title: "Navigation and Presentation"
domain: "UIKit"
page_type: topic-index
interview_priority: core
status: reviewed
last_reviewed: 2026-08-12
---

# Navigation and Presentation

UIKit navigation connects view controllers. A stack represents deeper steps in
one flow, while a modal starts a separate task over the current UI. Strong
interview answers separate these from adaptive containers and presentation
context instead of treating every transition as
"show a screen."

## Learning Path

### Rapid Review

1. [Navigation Controller Stack and Ownership](navigation-controller-stack-and-ownership/README.md)
2. [Tabs and Top-Level Navigation](tabs-and-top-level-navigation/README.md)
3. [Modal Presentation, Dismissal, and Ownership](modal-presentation-dismissal-and-ownership/README.md)

### Standard Preparation

4. [Split View Controller and Adaptive Navigation](split-view-controller-and-adaptive-navigation/README.md)
5. [Presentation Context, Popovers, and Sheets](presentation-context-popovers-and-sheets/README.md)

### Role-Specific Depth

For iPad, document, or desktop-class roles, deepen split-view adaptation,
multiwindow routing, popovers, and keyboard-driven navigation. Phone-focused
roles should still know how sheets and popovers adapt across size classes.

## Concepts

| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [Navigation Controller Stack and Ownership](navigation-controller-stack-and-ownership/README.md) | Defines who pushes, pops, and owns navigation state. | Core | 14 min |
| [Tabs and Top-Level Navigation](tabs-and-top-level-navigation/README.md) | Separates peer destinations and preserves independent flow state across tabs. | Core | 14 min |
| [Modal Presentation, Dismissal, and Ownership](modal-presentation-dismissal-and-ownership/README.md) | Keeps presentation and dismissal responsibilities coherent. | Core | 11 min |
| [Split View Controller and Adaptive Navigation](split-view-controller-and-adaptive-navigation/README.md) | Preserves navigation meaning across changing widths. | High | 9 min |
| [Presentation Context, Popovers, and Sheets](presentation-context-popovers-and-sheets/README.md) | Selects the correct presenter and adaptive presentation behavior. | High | 12 min |
