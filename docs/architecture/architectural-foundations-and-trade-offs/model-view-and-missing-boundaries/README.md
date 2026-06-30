---
title: "Model-View and SwiftUI State Ownership"
domain: "Architecture"
topic: "Architectural Foundations and Trade-offs"
page_type: concept-index
levels:
  - senior
  - staff
interview_priority: high
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-06-30
---

# Model-View and SwiftUI State Ownership

> Model-View can be a valid modern SwiftUI architecture when state ownership,
> side effects, navigation, and dependencies are still explicit. It is not enough
> when the view becomes the hidden owner of feature behavior.

## Quick Recall

- The model represents domain or application data; the view renders and collects
  user input.
- MV is common in SwiftUI when views bind directly to observable models or value
  state.
- MV works when the model owns real state and the view stays mostly declarative.
- As soon as async work, navigation, validation, formatting, or shared state
  appears, the missing boundary must be named.
- The next boundary could be a view model, controller, reducer, coordinator, use
  case, or service depending on the problem.
- In interviews, present MV as proportional architecture, not as a beginner-only
  pattern.

## When MV Fits

Model-View fits a SwiftUI feature when the view can describe UI from existing
state and send simple user intents. The model may be an `@Observable` object, a
value model owned by a parent, a store-like dependency, or a domain object exposed
through a small service.

The important rule is not the name. The important rule is ownership. The model
owns state and rules. The view reads state, shows it, and calls explicit actions.
If the view starts owning loading policy, retries, formatting rules, or navigation
decisions, the architecture has gained hidden roles without naming them.

## Pros and Cons

| Pros | Cons |
|---|---|
| Low ceremony for SwiftUI screens. | Behavior can drift into large view bodies. |
| Easy to read when state and actions are local. | Async work needs a clear lifecycle owner. |
| Works well with observation, bindings, and previews. | Navigation and shared state can become unclear. |
| Avoids view models that only forward data. | Testing can become UI-heavy if rules stay in the view. |

## Decision Guide

| Choose MV when | Add another boundary when |
|---|---|
| The feature mostly displays and edits local state. | Several screens share the same state or workflow. |
| User actions map to simple model methods. | Loading, cancellation, retries, or caching need policy. |
| Formatting is small and close to display. | Formatting becomes business or localization policy. |
| Navigation is local and obvious. | Deep links, restoration, or multi-step flows need ownership. |
| Tests can cover behavior through the model. | Important behavior is only testable through UI. |

## Boundary Check

| Question | If the answer is unclear |
|---|---|
| Who validates input? | Add a presentation or domain policy boundary. |
| Who starts and cancels async work? | Add a lifecycle owner. |
| Who decides navigation? | Add a coordinator, router, or flow owner. |
| Who formats model data for display? | Add a presenter, view model, or formatter. |
| Who owns retries and side effects? | Add use cases, services, or effect handlers. |
| How is behavior tested without UI? | Move behavior behind a testable boundary. |

## Interview Use

If asked about Model-View, do not dismiss it as only a toy pattern. Answer that it
can be a good SwiftUI choice when state and actions have clear owners. Then
describe the first pressure that makes another role necessary.

Example answer:

> "Model-View can be enough for a SwiftUI feature when the model owns state and
> rules, and the view only renders and sends clear actions. I would keep it if
> tests can cover behavior through the model. I would add a view model, reducer,
> coordinator, or use-case boundary when async work, navigation, shared state, or
> validation needs a separate owner."
