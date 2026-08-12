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
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-08-12
tags:
  - reusable-components
  - view-modifier
  - component-api
---

# Reusable Components and View Modifiers

> A reusable component is a `View` with a stable visual or interaction contract. A
> `ViewModifier` applies one reusable transformation to caller-owned content. Extract
> a concept, not every repeated line of syntax.

## Quick Recall

- Prefer small semantic inputs over passing an entire feature model.
- Use generic `@ContentBuilder` content when callers must supply structure.
- Store the built content value unless deferred construction is required.
- Do not make every one-off style a public component.
- A reusable API includes accessibility, adaptation, previews, and supported states.

Use a component when the abstraction owns structure. Use a modifier when the caller's
content stays central. Use a control style when standard controls need shared appearance
without losing their roles and interaction behavior.

`@ContentBuilder` is the Xcode 27 spelling. Existing `@ViewBuilder` source remains
compatible when a package must build with an earlier toolchain.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
