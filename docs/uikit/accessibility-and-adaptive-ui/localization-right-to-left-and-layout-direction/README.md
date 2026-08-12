---
title: "Localization, Right-to-Left, and Layout Direction"
domain: "UIKit"
topic: "Accessibility and Adaptive UI"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: high
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-08-12
---

# Localization, Right-to-Left, and Layout Direction

> Localization adapts an interface to a language and region. It can change text,
> grammar, formatting, text length, and reading direction. UIKit screens should
> use complete localized messages and layouts that can grow or mirror.

## Quick Recall

- Localize user-facing strings, including accessibility labels and error text.
- Use leading and trailing constraints instead of left and right for mirrored UI.
- Use semantic content attributes only when a view needs a specific direction.
- Do not concatenate localized phrases from English-shaped fragments.
- Test long strings and right-to-left languages with realistic data.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
