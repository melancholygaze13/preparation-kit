---
title: "Dynamic Type and Content Sizing"
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
  - dynamic-type
  - content-sizing
  - typography
---

# Dynamic Type and Content Sizing

> Dynamic Type applies the user's preferred text size. Content sizing is the layout's
> response to the resulting text, controls, images, and available space. Use semantic
> fonts and change composition instead of shrinking essential text.

## Quick Recall

- Prefer semantic fonts and avoid fixed user-facing sizes.
- Treat accessibility sizes as different layouts, not scaled screenshots.
- Remove unsafe line limits and fixed heights for essential content.
- Let controls grow; maintain reachable actions and adequate targets.
- Test longest localization and every supported Dynamic Type category.

Large accessibility sizes are supported layouts, not edge cases. Essential text must
wrap, controls must remain reachable, and the screen may need to become vertical or
scrollable even when its default layout is horizontal.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
