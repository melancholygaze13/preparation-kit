---
title: "Dependency Tracking and Update Propagation: Interview Questions"
domain: "SwiftUI"
topic: "View System and Rendering"
concept: "Dependency Tracking and Update Propagation"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-06-23
tags:
  - observation
  - invalidation
  - dependency-tracking
---

# Dependency Tracking and Update Propagation: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How does SwiftUI decide which views to update?](#q1-how-does-swiftui-decide-which-views-to-update) | Senior | Dependency graph and invalidation |
| [How does `@Observable` narrow updates?](#q2-how-does-observable-narrow-updates) | Senior | Property-access tracking |
| [Why might a model mutation not update the UI?](#q3-why-might-a-model-mutation-not-update-the-ui) | Senior | Ownership and observation diagnosis |
| [How would you investigate excessive view updates?](#q4-how-would-you-investigate-excessive-view-updates) | Staff | Measurement and boundary design |

---

<a id="q1-how-does-swiftui-decide-which-views-to-update"></a>
## Q1: How does SwiftUI decide which views to update?

### Short Answer

SwiftUI tracks dependencies between view descriptions and their inputs. These
include values produced by parents and dynamic values such as state and environment.
When a dependency changes, SwiftUI invalidates affected work, refreshes dynamic
properties, evaluates affected bodies, and propagates updates toward leaf views.

### Expanded Answer

I separate invalidation from rendering. An invalidated view is eligible for
reevaluation; it does not imply an immediate body call or full redraw. SwiftUI owns
the schedule and can combine changes. After reevaluation, it may find that later
layout or drawing work is unnecessary.

The application should therefore make `body` a cheap function of current inputs.
It must not depend on execution count or use reevaluation as an event callback.
Identity determines which graph element and local state the update applies to.

### Example

A view reading `@Environment(\.locale)` becomes dependent on the locale. When that
value changes, SwiftUI updates the affected view hierarchy without requiring the
application to traverse and mutate every text element.

<a id="q2-how-does-observable-narrow-updates"></a>
## Q2: How does `@Observable` narrow updates?

### Short Answer

While evaluating `body`, SwiftUI records which properties it reads from which
`@Observable` instances. A later change to one of those properties invalidates the
view. A change to an unread property on the same model does not invalidate that
view through Observation.

### Expanded Answer

Tracking follows property access, including stored observable properties reached
through a computed property. It is also instance-specific, so reading the title of
one observable row model does not subscribe the row to every model of that type.
Conditional paths record the properties used by the current evaluation and are
tracked again when the body reevaluates.

`@State`, `@Environment`, and `@Bindable` still express ownership, injection, and
binding needs. A view that only reads an injected observable model can store it as
a plain property. Observation does not imply that the model is thread-safe; actor
isolation is a separate design decision.

### Trade-offs

Fine-grained tracking reduces unnecessary invalidation, but a large model can still
create unclear ownership and actor boundaries. I would not use Observation as a
reason to expose an entire application model to every feature.

<a id="q3-why-might-a-model-mutation-not-update-the-ui"></a>
## Q3: Why might a model mutation not update the UI?

### Short Answer

I check whether the view read a supported observable dependency, whether the code
mutated that same instance, and whether identity and ownership remained stable.
Plain reference mutation, hidden external storage, copied local state, or changing
the wrong instance can all leave the UI stale.

### Expanded Answer

I trace the value from the mutation back to the exact property read in `body`.
For an `@Observable` model, the mutation must pass through tracked accessors. A
computed property backed only by unreported external state needs an explicit
Observation integration or a different model boundary.

I also check whether a parent copied an input into `@State`. State initialization
does not keep that value synchronized. If the parent owns the truth, the child
needs a value or binding. Finally, I verify actor isolation and ensure an identity
reset did not replace the expected state and dependency graph.

### Example

Adding `.id(UUID())` may appear to refresh stale content, but it replaces the view
and resets local state. That masks the missing observation edge instead of fixing
it.

<a id="q4-how-would-you-investigate-excessive-view-updates"></a>
## Q4: How would you investigate excessive view updates?

### Short Answer

I reproduce the user-visible hitch, measure it, and identify which bodies or model
changes dominate the update. Then I narrow broad inputs, remove expensive work from
`body`, or extract a meaningful dependency boundary. I remeasure before keeping the
change.

### Expanded Answer

I start with Instruments rather than counting console prints. I inspect model
mutation frequency, view inputs, environment reads, and substantial transforms in
`body`. Apple demonstrates `Self._printChanges()` for temporary debugging, but it
is unsupported and must not ship.

Passing a full value model to a small image view can make unrelated field changes
produce new view values. Passing the image itself creates a narrower contract.
With Observation, extracted views also track only the properties their bodies
read. I balance this against component fragmentation and large-value copying.

### Trade-offs

Fewer body evaluations are useful only when they reduce measured cost. A cheap
reevaluation can be preferable to a complex cache with stale-data risk. At Staff
scope, I also look for systemic causes: oversized shared models, unclear actor
ownership, high-frequency publishers, and missing performance telemetry.
