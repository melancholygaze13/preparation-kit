---
title: "Localization, Right-to-Left, and Reduced Motion"
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
  - localization
  - right-to-left
  - reduce-motion
---

# Localization, Right-to-Left, and Reduced Motion

> Localization adapts language, grammar, and formatting. Right-to-left layout changes
> reading direction. Reduced Motion is a user preference to limit certain motion.
> Support all three without changing the feature's meaning.

## Quick Recall

- Do not build localized sentences by concatenating fragments.
- Use format styles and automatic grammar where supported.
- Prefer leading/trailing and directional symbols over hard-coded left/right.
- Test mixed-direction content, long strings, and locale-specific formats.
- Replace large spatial motion while preserving state feedback and hierarchy.

Localize complete messages instead of joining fragments. Use leading and trailing for
directional layout. Replace large movement with a fade, smaller effect, or immediate
change while keeping the same result and feedback.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
