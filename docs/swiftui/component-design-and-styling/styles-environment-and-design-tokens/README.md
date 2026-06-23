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
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-23
tags:
  - styles
  - environment
  - design-tokens
---

# Styles, Environment, and Design Tokens

> Styles adapt standard controls while preserving their semantics. Environment values
> carry hierarchy-scoped context, and tokens centralize intentional design decisions.

## Quick Recall

- Prefer control styles over rebuilding controls from gestures.
- Use environment for contextual defaults, not as an untyped global service locator.
- Define custom environment entries with `@Entry` in modern SwiftUI.
- Tokens should express semantic roles, not copy every raw design value.
- System text styles, materials, and hierarchical foreground styles adapt automatically.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
