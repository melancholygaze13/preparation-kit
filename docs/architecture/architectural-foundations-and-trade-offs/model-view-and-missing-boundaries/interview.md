---
title: "Model-View and SwiftUI State Ownership: Interview Questions"
domain: "Architecture"
topic: "Architectural Foundations and Trade-offs"
concept: "Model-View and SwiftUI State Ownership"
page_type: interview
levels:
  - senior
  - staff
interview_priority: high
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-07-11
tags:
  - model-view
  - swiftui
  - state-ownership
---

# Model-View and SwiftUI State Ownership: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Is Model-View enough for a SwiftUI app?](#q1-is-model-view-enough-for-a-swiftui-app) | Senior | Fit and judgment |
| [When would you add a view model?](#q2-when-would-you-add-a-view-model) | Senior | Presentation boundary |
| [Who should own async work in Model-View?](#q3-who-should-own-async-work-in-model-view) | Senior | Lifetime and cancellation |
| [How would you standardize SwiftUI architecture across teams?](#q4-how-would-you-standardize-swiftui-architecture-across-teams) | Staff | Consistency without ceremony |

---

<a id="q1-is-model-view-enough-for-a-swiftui-app"></a>
## Q1: Is Model-View enough for a SwiftUI app?

### Short Answer

Yes, when models own state and rules and views only render and send clear actions.
SwiftUI does not require MVVM. I keep Model-View while ownership, async lifetime,
navigation, and tests remain clear, then add a focused boundary when a real pressure
appears.

### Expanded Answer

Observation lets a view depend directly on a model and update from the properties it
reads. A model method can enforce behavior without a forwarding view model. The view
can own local focus or disclosure, while product state lives in a model whose lifetime
matches the feature.

Model-View is not enough when views coordinate several services, hide task policy,
own workflow navigation, or contain rules testable only through UI. I name that
missing responsibility and extract only the boundary it needs.

<a id="q2-when-would-you-add-a-view-model"></a>
## Q2: When would you add a view model?

### Short Answer

I add a view model when a screen has meaningful presentation state or coordination
that should not enter the domain model or remain in the view. Examples include input
validation flow, derived display state, request phases, and combining several model
dependencies.

### Expanded Answer

The view model should translate between view intent and model behavior. It should not
exist only to rename and forward every property. Navigation may still belong to a
coordinator, durable synchronization to a repository, and reusable business rules to
a domain model or use case.

I check whether the new type improves tests and ownership. If removing SwiftUI from
the test still leaves behavior worth verifying, the boundary is likely meaningful.

### Trade-offs

A view model can isolate display policy and make tests fast. It also adds observation,
mapping, lifecycle, and synchronization cost. For a small screen, direct Model-View
can be clearer.

<a id="q3-who-should-own-async-work-in-model-view"></a>
## Q3: Who should own async work in Model-View?

### Short Answer

The component whose lifetime and policy match the operation should own it. A feature
model can own screen-scoped loading, cancellation, and stale-result protection. Work
that must survive navigation or termination belongs in a longer-lived service,
repository, or durable operation owner.

### Expanded Answer

The view can use `.task` to connect work to view lifetime, but the model should own
request state and result acceptance. I define whether repeated appearance restarts,
shares, or skips work. For searches, I cancel or identify requests so an old result
cannot replace a newer query.

A detached task with an unowned lifetime is a warning sign. Moving it into a view
model does not solve the problem unless that view model has the correct lifetime and
clear cancellation behavior.

<a id="q4-how-would-you-standardize-swiftui-architecture-across-teams"></a>
## Q4: How would you standardize SwiftUI architecture across teams?

### Short Answer

I would standardize ownership and dependency rules, not require a view model for
every view. I would publish supported examples for small Model-View features and for
the thresholds that justify presentation, navigation, effect, and data boundaries.
Reviews and metrics would focus on the risks those rules protect.

### Expanded Answer

Useful rules include no business policy in `body`, explicit async owners, one source
of truth per fact, dependency injection at feature boundaries, and important behavior
testable below UI. A reference feature can show how Model-View grows into MVVM or a
reducer without a rewrite.

I would inspect common incidents and development friction before adding enforcement.
Teams need an exception path because feature complexity differs. A uniform folder
shape is less valuable than consistent answers about state, lifetime, navigation,
effects, and ownership.
