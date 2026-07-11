---
title: "Inputs, Outputs, Bindings, and Observation: Interview Questions"
domain: "Architecture"
topic: "MVVM"
concept: "Inputs, Outputs, Bindings, and Observation"
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
  - observation
  - bindings
---

# Inputs, Outputs, Bindings, and Observation: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you design view-model inputs and outputs?](#q1-how-do-you-design-view-model-inputs-and-outputs) | Senior | Presentation contract |
| [When should a view bind directly to view-model state?](#q2-when-should-a-view-bind-directly-to-view-model-state) | Senior | Controlled mutation |
| [How do Observation property wrappers express ownership?](#q3-how-do-observation-property-wrappers-express-ownership) | Senior | SwiftUI data flow |

---

<a id="q1-how-do-you-design-view-model-inputs-and-outputs"></a>
## Q1: How do you design view-model inputs and outputs?

### Short Answer

I expose outputs as the smallest valid presentation state and inputs as user intents.
Computed values derive from authoritative facts, and only the view model mutates
request phases. This prevents invalid combinations and makes tests read as behavior:
given an input, assert the next output.

### Expanded Answer

For a request screen, I prefer an enum for loading, content, and failure when those
states are exclusive. A form can be a mutable draft, while submission is a method
because it validates and starts an effect. I avoid exposing transport models or a
collection of unrelated public setters.

One-time events need separate delivery rules. An alert can be identified presentation
state with an explicit dismissal input. A true event stream must define buffering,
replay, and subscription lifetime.

<a id="q2-when-should-a-view-bind-directly-to-view-model-state"></a>
## Q2: When should a view bind directly to view-model state?

### Short Answer

I use direct bindings for simple editing of state the view model already owns, such
as a form field. I use an intent method when a change needs validation, affects other
state, starts an effect, or has product meaning. A binding shares mutation access; it
does not transfer ownership.

### Expanded Answer

Broad bindings can let children bypass required transitions. Passing a value and
action narrows the contract. If a SwiftUI control requires a binding, I can adapt its
setter to an intent while keeping the getter side-effect free.

<a id="q3-how-do-observation-property-wrappers-express-ownership"></a>
## Q3: How do Observation property wrappers express ownership?

### Short Answer

For an `@Observable` model, `@State` means the view manages an instance it creates.
An ancestor-owned model can be passed as a normal property. `@Bindable` provides
bindings to its properties, and `@Environment` distributes a deliberately shared
dependency. None of these chooses the feature architecture.

### Expanded Answer

SwiftUI tracks observable properties read by `body` and updates the affected view
when they change. I keep access narrow and avoid injecting every required feature
dependency through the environment.

For older targets using `ObservableObject`, the equivalent ownership distinction is
`@StateObject` for view-created lifetime and `@ObservedObject` for an externally owned
instance. During migration, I preserve the owner first, then change observation APIs.
