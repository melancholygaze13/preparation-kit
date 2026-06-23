---
title: "Feature Boundaries and View Modeling: Interview Questions"
domain: "SwiftUI"
topic: "Architecture and Dependencies"
concept: "Feature Boundaries and View Modeling"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 6
status: reviewed
last_reviewed: 2026-06-23
tags:
  - feature-boundaries
  - view-modeling
  - observation
---

# Feature Boundaries and View Modeling: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When does a SwiftUI view need a view model?](#q1-when-does-a-swiftui-view-need-a-view-model) | Senior | Proportional boundaries |
| [What state stays in a view?](#q2-what-state-stays-in-a-view) | Senior | Ownership and lifetime |
| [How should a reusable child communicate with a feature?](#q3-how-should-a-reusable-child-communicate-with-a-feature) | Senior | Values, bindings, and actions |
| [How would you define a feature boundary for a large team?](#q4-how-would-you-define-a-feature-boundary-for-a-large-team) | Staff | Ownership and contracts |

---

<a id="q1-when-does-a-swiftui-view-need-a-view-model"></a>
## Q1: When does a SwiftUI view need a view model?

### Short Answer

When state or policy needs an identity beyond simple view-local presentation: async
coordination, validation, shared transitions, navigation workflow, or independent
testing. A small stateless or locally stateful view does not need a class by default.

### Expanded Answer

I keep layout and simple derived display values in the view. A main-actor observable
model owns feature state and semantic operations such as submit or retry. The view
that creates it stores it in `@State` so reconstruction does not recreate ownership.

The model should not become a mirror of every label and color. Its value is preserving
feature invariants and separating policy from presentation.

<a id="q2-what-state-stays-in-a-view"></a>
## Q2: What state stays in a view?

### Short Answer

Transient state owned by one presentation, such as focus, disclosure, local selection,
or animation control. State moves outward only when another component must coordinate
it, preserve it longer, restore it, or apply domain policy.

### Expanded Answer

I identify one source of truth and avoid copying derived values. A binding shares
mutation with a child but does not transfer ownership. Durable domain data belongs
in a repository or feature model, not in the view merely because the view displays it.

The scope should match lifetime: view, feature, flow, scene, or app. Moving everything
to app scope reduces clarity and causes unrelated screens to invalidate or couple.

<a id="q3-how-should-a-reusable-child-communicate-with-a-feature"></a>
## Q3: How should a reusable child communicate with a feature?

### Short Answer

Pass immutable display values down and semantic actions up. Use a binding for a narrow
two-way edit when direct mutation is the component's contract. Avoid giving a generic
child the entire feature model or global router.

### Expanded Answer

`OrderRow(item:onRemove:)` is easier to preview and reuse than a row that reads a
checkout model and navigation environment. An action such as `onDelete` communicates
intent; the feature decides authorization, confirmation, effects, and state changes.

A feature-specific child can receive the model when it truly participates in the same
state machine. The decision is about coupling, not a blanket ban.

<a id="q4-how-would-you-define-a-feature-boundary-for-a-large-team"></a>
## Q4: How would you define a feature boundary for a large team?

### Short Answer

I align it with a user capability and one accountable owner. The boundary exposes
entry configuration, route intents, and required capabilities while hiding internal
views, state, and infrastructure. Dependency direction and release ownership are explicit.

### Expanded Answer

I examine which code changes together, which team operates the outcome, and which
models cross the boundary. Shared domain contracts should be smaller than either
feature implementation. Cross-feature navigation goes through typed entry intents.

I start with a source boundary and tests, then use a module only when independent
build, enforcement, or distribution has measurable value. Architecture rules include
an exception and migration process so teams do not bypass them under delivery pressure.

### Trade-offs

Larger boundaries reduce API and build-graph overhead but allow more internal coupling.
Smaller boundaries improve enforcement and ownership only until coordination, public
API maintenance, and build costs exceed the change-isolation benefit.
