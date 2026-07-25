---
title: "Styles, Environment, and Design Tokens"
domain: "SwiftUI"
topic: "Component Design and Styling"
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
  - styles
  - environment
  - design-tokens
---

# Styles, Environment, and Design Tokens

> A style changes a family of SwiftUI controls. The environment carries typed values
> down a view hierarchy. A design token is an application-defined name for a repeated
> design decision such as spacing, color role, or corner shape.

## Quick Recall

- Prefer control styles over rebuilding controls from gestures.
- Use environment for contextual defaults, not as an untyped global service locator.
- Define custom environment entries with `@Entry` in modern SwiftUI.
- Tokens should express semantic roles, not copy every raw design value.
- System text styles, materials, and hierarchical foreground styles adapt automatically.

These tools solve different problems. Use styles for control appearance, environment
for hierarchy-scoped context, and tokens for named design choices. Do not combine them
into one global theme object with hidden dependencies.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
