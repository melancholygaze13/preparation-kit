---
title: "Unidirectional Data Flow: Interview Questions"
domain: "SwiftUI"
topic: "Architecture and Dependencies"
concept: "Unidirectional Data Flow"
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
  - unidirectional-data-flow
  - state-transitions
  - actions
---

# Unidirectional Data Flow: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What does unidirectional data flow mean in SwiftUI?](#q1-what-does-unidirectional-data-flow-mean-in-swiftui) | Senior | State, events, and ownership |
| [Do bindings violate one-way data flow?](#q2-do-bindings-violate-one-way-data-flow) | Senior | Scoped mutation |
| [When would you introduce a reducer?](#q3-when-would-you-introduce-a-reducer) | Senior | Proportional architecture |
| [How would you scale data flow across features?](#q4-how-would-you-scale-data-flow-across-features) | Staff | Composition and standards |

---

<a id="q1-what-does-unidirectional-data-flow-mean-in-swiftui"></a>
## Q1: What does unidirectional data flow mean in SwiftUI?

### Short Answer

State flows down into view descriptions, views emit user or system events upward,
and one owner applies each transition. Effects start at an explicit boundary and
their results return as events before relevant state is committed.

### Expanded Answer

It creates one source of truth and a traceable mutation path. A feature can implement
this with `@State`, bindings, and an observable model; no external store is required.

I use semantic events such as submit or retry. The owner preserves invariants,
handles cancellation, and prevents stale async results from committing. Views stay
focused on rendering and interaction.

<a id="q2-do-bindings-violate-one-way-data-flow"></a>
## Q2: Do bindings violate one-way data flow?

### Short Answer

No. A binding is a narrow mutation capability back to the owner. It fits simple
two-way editing. For mutations with validation, side effects, or domain meaning, a
semantic action is clearer and keeps policy in one place.

### Expanded Answer

I pass `$draft.title` to a text field because editing text is the contract. I pass
`onSubmit` rather than a binding to `isSubmitting`, because the feature must validate,
start work, and control the resulting state.

A local draft is not accidental duplication if it intentionally represents
uncommitted input with defined save and cancel behavior.

<a id="q3-when-would-you-introduce-a-reducer"></a>
## Q3: When would you introduce a reducer?

### Short Answer

When a feature has many interacting transitions, effects, cancellation paths, or a
strong need for deterministic state-transition tests and composition. For a small
screen, semantic methods on an observable model are usually clearer.

### Expanded Answer

A reducer makes the state-action transition explicit and can return effects for an
orchestrator to run. The cost is action and effect ceremony, indirection, and a new
composition model.

I introduce it based on measured complexity and team needs, not merely because the
app uses SwiftUI. The architecture can vary proportionally by feature behind stable
boundaries.

### Trade-offs

Reducers improve traceability and exhaustive transition testing. They can also turn
simple local interaction into several files and make framework knowledge a delivery
dependency.

<a id="q4-how-would-you-scale-data-flow-across-features"></a>
## Q4: How would you scale data flow across features?

### Short Answer

Each feature owns its state and events. Parents scope inputs to children and translate
cross-feature events such as navigation. Shared capabilities expose narrow contracts;
they do not require one global application store.

### Expanded Answer

I standardize action naming, cancellation, dependency injection, and observability
where consistency pays off. Feature teams can choose simpler or stronger transition
machinery while preserving entry and output contracts.

I avoid a root state containing every screen because it expands invalidation,
ownership conflicts, and migration cost. App-level state is reserved for genuinely
app-level concerns such as session and scene routing.

### Trade-offs

One store enables centralized tooling but becomes an organizational and performance
hotspot. Feature-local stores improve autonomy but need explicit composition and
cross-feature event rules.
