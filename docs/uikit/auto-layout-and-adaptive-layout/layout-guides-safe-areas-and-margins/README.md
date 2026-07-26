---
title: "Layout Guides, Safe Areas, and Margins"
domain: "UIKit"
topic: "Auto Layout and Adaptive Layout"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-26
---

# Layout Guides, Safe Areas, and Margins

> A layout guide is an invisible rectangle used only by constraints. Safe areas
> keep important content clear of system UI, while margins express readable
> spacing inside a container.

## Quick Recall

- `safeAreaLayoutGuide` is for content that must not sit under system bars,
  notches, home indicators, or other obscuring UI.
- `layoutMarginsGuide` is for content spacing inside a view.
- `readableContentGuide` helps long text avoid overly wide lines.
- Scroll views need careful constraints between the frame area and content area.
- Avoid hard-coded top and bottom constants that duplicate system geometry.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
