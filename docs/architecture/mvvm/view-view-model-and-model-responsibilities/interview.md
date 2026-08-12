---
title: "View, View Model, and Model Responsibilities: Interview Questions"
domain: "Architecture"
topic: "MVVM"
concept: "View, View Model, and Model Responsibilities"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-08-12
tags:
  - mvvm
  - responsibilities
  - presentation
---

# View, View Model, and Model Responsibilities: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What belongs in an MVVM view model?](#q1-what-belongs-in-an-mvvm-view-model) | Senior | Responsibility boundaries |
| [How do you keep a view model from becoming massive?](#q2-how-do-you-keep-a-view-model-from-becoming-massive) | Senior | Delegation and cohesion |
| [When would you choose MVVM over Model-View?](#q3-when-would-you-choose-mvvm-over-model-view) | Senior | Fit and trade-offs |

---

<a id="q1-what-belongs-in-an-mvvm-view-model"></a>
## Q1: What belongs in an MVVM view model?

### Short Answer

A view model owns presentation state, display transformation, and coordination of
user inputs. It delegates reusable product rules to models or use cases, data policy
to repositories, and flow navigation to a coordinator. It should not hold view
instances or expose transport details.

### Expanded Answer

I shape outputs around what the view can render: loading, content, failure, validation,
and display-ready values. Inputs use intent names such as `retryTapped()` rather than
public setters. That lets the view model maintain valid transitions.

I keep a rule in the view model only when it is presentation-specific. Purchase
eligibility belongs in the domain if another flow needs it; whether to show an inline
message or disable a button belongs in presentation.

<a id="q2-how-do-you-keep-a-view-model-from-becoming-massive"></a>
## Q2: How do you keep a view model from becoming massive?

### Short Answer

I give it one presentation scope and delegate by responsibility. Repositories own
data-source policy, use cases own product operations, coordinators own flows, and
child view models own independently reusable presentation state. I do not split it
only to reduce line count.

### Expanded Answer

Warning signs are unrelated dependencies, several independent lifetimes, navigation
for multiple flows, and methods that mainly implement persistence or networking. I
extract the boundary that has a distinct reason to change and keep orchestration in
the parent.

A child view does not automatically require a child view model. Static or purely
rendering children can receive values and actions. I add a child model when it owns
state, behavior, identity, or lifetime that can be composed independently.

<a id="q3-when-would-you-choose-mvvm-over-model-view"></a>
## Q3: When would you choose MVVM over Model-View?

### Short Answer

I choose MVVM when presentation has meaningful state or coordination: input flow,
derived display values, several dependencies, or async phases. I keep Model-View when
the model already exposes clear state and actions and a view model would only forward
them.

### Expanded Answer

SwiftUI does not require a view model. Observation supports direct model dependencies.
MVVM becomes valuable when direct use would move screen-specific behavior into the
domain model or leave it in view closures.

### Trade-offs

MVVM creates a focused, fast test boundary and can keep views declarative. It also
adds mapping, observation, lifecycle, and synchronization work. The decision should
follow feature pressure, not a one-type-per-screen rule.
