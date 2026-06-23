---
title: "Reusable Components and View Modifiers"
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
  - reusable-components
  - view-modifier
  - component-api
---

# Reusable Components and View Modifiers

> Extract a component when it has a meaningful visual responsibility or repeated
> contract. Use a `ViewModifier` for a reusable transformation of arbitrary content.

## Quick Recall

- Prefer small semantic inputs over passing an entire feature model.
- Use generic `@ViewBuilder` content when callers must supply structure.
- Store the built content value unless deferred construction is required.
- Do not make every one-off style a public component.
- A reusable API includes accessibility, adaptation, previews, and supported states.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
