---
title: "Model-View and Missing Boundaries"
domain: "Architecture"
topic: "Architectural Foundations and Trade-offs"
page_type: concept-index
levels:
  - senior
interview_priority: reference
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-06-29
---

# Model-View and Missing Boundaries

> Model-View is a useful baseline separation, not usually enough architecture for
> a non-trivial iOS feature. It separates data from rendering, but it does not say
> who owns effects, validation, navigation, formatting, or testable state changes.

## Quick Recall

- The model represents domain or application data; the view renders and collects
  user input.
- MV is acceptable for simple static UI, examples, prototypes, and isolated
  components with little behavior.
- As soon as async work, navigation, validation, formatting, or shared state
  appears, the missing boundary must be named.
- The next boundary could be a view model, controller, reducer, coordinator, use
  case, or service depending on the problem.
- In interviews, use MV to explain why architecture should be proportional rather
  than automatic.

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

If asked about Model-View, do not oversell it as a complete iOS architecture.
Answer that it is the smallest useful separation, then describe the first pressure
that makes another role necessary.

Example answer:

> "Model-View is fine when the view only displays data and sends simple events.
> It breaks down when behavior needs ownership. For a real iOS screen I would ask
> where validation, async loading, navigation, and state transitions live. The
> answer determines whether I add a view model, coordinator, reducer, or use-case
> boundary."

