---
title: "View Model Scope and Composition: Interview Questions"
domain: "Architecture"
topic: "MVVM"
concept: "View Model Scope and Composition"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-07-11
tags:
  - mvvm
  - composition
  - scope
---

# View Model Scope and Composition: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Should every view have its own view model?](#q1-should-every-view-have-its-own-view-model) | Senior | Scope criteria |
| [How do parent and child view models communicate?](#q2-how-do-parent-and-child-view-models-communicate) | Senior | Composition and ownership |
| [How do you scope view models in a large app?](#q3-how-do-you-scope-view-models-in-a-large-app) | Staff | Runtime and team boundaries |

---

<a id="q1-should-every-view-have-its-own-view-model"></a>
## Q1: Should every view have its own view model?

### Short Answer

No. A view model should own meaningful presentation state or behavior, not mirror the
view tree. A stateless child can receive values and actions. I add a child view model
when it has independent transitions, dependencies, lifetime, reuse, or tests.

### Expanded Answer

One reference model per row can add memory, observation, and identity problems. For a
large list, values and actions are often enough. Editable drafts or rows with their
own effects can justify stable child models keyed by domain identifiers.

<a id="q2-how-do-parent-and-child-view-models-communicate"></a>
## Q2: How do parent and child view models communicate?

### Short Answer

The parent owns child lifetime and coordinates feature-level behavior. Children expose
narrow state, validated values, and intent callbacks. I avoid copying all child state
into the parent or letting children mutate unrelated parent state directly.

### Expanded Answer

Shared facts should come from one injected model or repository. A child-to-parent
callback should not create a retain cycle; the child does not normally own its parent.
Navigation intent can travel upward to a parent or coordinator that owns the flow.

### Trade-offs

Child models isolate behavior and tests but add wiring and identity. Direct values
keep the graph small but can overload a parent when the child has real independent
policy.

<a id="q3-how-do-you-scope-view-models-in-a-large-app"></a>
## Q3: How do you scope view models in a large app?

### Short Answer

I align runtime scope with state lifetime and feature ownership. Feature composition
roots construct view models from explicit dependencies; repositories and session
models own shared state; coordinators own cross-feature flows. Modules enforce only
boundaries that need independent ownership or dependency control.

### Expanded Answer

I avoid one app-wide view model and hidden global service lookup. Both make mutation,
teardown, and team ownership unclear. Feature roots make creation and cancellation
visible and support incremental migration.

At scale, shared contracts need owners and compatibility policy. I use dependency
graphs, change history, and memory diagnostics to find scopes that are too broad or
cycles that keep features alive. Standards should define ownership and construction,
not require identical internal class trees.
