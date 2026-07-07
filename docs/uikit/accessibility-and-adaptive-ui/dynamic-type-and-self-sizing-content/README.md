---
title: "Dynamic Type and Self-Sizing Content"
domain: "UIKit"
topic: "Accessibility and Adaptive UI"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: high
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-06
---

# Dynamic Type and Self-Sizing Content

> Dynamic Type means the layout must adapt when text grows. A good UIKit screen
> scales fonts, lets content reflow, and avoids fixed heights that clip important
> text.

## Quick Recall

- Use text styles and `adjustsFontForContentSizeCategory` for automatic scaling.
- Use `UIFontMetrics` when a custom font must scale with Dynamic Type.
- Prefer constraints that allow wrapping, vertical growth, and self-sizing cells.
- Test accessibility text sizes, not only the default size.
- Decide which content can truncate and which content must stay fully readable.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
