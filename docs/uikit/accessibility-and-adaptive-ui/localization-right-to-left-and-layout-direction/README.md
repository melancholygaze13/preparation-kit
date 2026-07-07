---
title: "Localization, Right-to-Left, and Layout Direction"
domain: "UIKit"
topic: "Accessibility and Adaptive UI"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: high
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-06
---

# Localization, Right-to-Left, and Layout Direction

> Localization changes both language and layout pressure. UIKit screens should
> use localized strings, leading and trailing layout, and explicit direction
> choices only where the content requires them.

## Quick Recall

- Localize user-facing strings, including accessibility labels and error text.
- Use leading and trailing constraints instead of left and right for mirrored UI.
- Use semantic content attributes only when a view needs a specific direction.
- Do not concatenate localized phrases from English-shaped fragments.
- Test long strings and right-to-left languages with realistic data.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
