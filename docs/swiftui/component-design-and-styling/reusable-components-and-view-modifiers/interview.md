---
title: "Reusable Components and View Modifiers: Interview Questions"
domain: "SwiftUI"
topic: "Component Design and Styling"
concept: "Reusable Components and View Modifiers"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-06-23
tags:
  - reusable-components
  - view-modifier
  - component-api
---

# Reusable Components and View Modifiers: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When do you extract a reusable component?](#q1-when-do-you-extract-a-reusable-component) | Senior | Abstraction threshold |
| [When do you use a ViewModifier?](#q2-when-do-you-use-a-viewmodifier) | Senior | Reusable transformation |
| [How would you design a shared component API?](#q3-how-would-you-design-a-shared-component-api) | Staff | Semantics and evolution |

---

<a id="q1-when-do-you-extract-a-reusable-component"></a>
## Q1: When do you extract a reusable component?

### Short Answer

When it has a meaningful visual or interaction responsibility, repeated contract,
complex layout, or useful dependency boundary. I do not create a public abstraction
for every repeated modifier chain before the variation is understood.

### Expanded Answer

The component receives semantic values and actions, or narrow bindings for real
editing. Generic content slots preserve composition when callers supply structure.
It owns accessibility and adaptation as part of its contract.

<a id="q2-when-do-you-use-a-viewmodifier"></a>
## Q2: When do you use a ViewModifier?

### Short Answer

When arbitrary caller content needs the same focused transformation, such as a
surface, loading treatment, or small behavior. I use a dedicated `View` when the
abstraction owns structure or semantic interaction.

### Expanded Answer

Modifier application order remains significant. I expose a named view extension for
discoverability and avoid modifiers that hide networking, global navigation, or
unrelated feature state.

For semantic controls, a control style is often better because it retains the control's
pressed, disabled, role, focus, and accessibility behavior.

<a id="q3-how-would-you-design-a-shared-component-api"></a>
## Q3: How would you design a shared component API?

### Short Answer

I begin from supported use cases and semantic variants, keep inputs small, preserve
standard control semantics, and document layout, accessibility, localization, and
state behavior. The API has an owner and evolves with compatibility discipline.

### Expanded Answer

I start internal and promote only after real reuse validates the contract. I avoid
Boolean option matrices and feature-specific dependencies. Previews cover content
length, Dynamic Type, locale, enabled, loading, error, and interaction states.

At package scope, public API and visual changes need review, migration, and regression
coverage. Success is consistent accessible behavior, not only identical pixels.
