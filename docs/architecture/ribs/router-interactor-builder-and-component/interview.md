---
title: "Router, Interactor, Builder, and Component: Interview Questions"
domain: "Architecture"
topic: "RIBs"
concept: "Router, Interactor, Builder, and Component"
page_type: interview
levels:
  - senior
  - staff
interview_priority: situational
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-07-12
tags:
  - ribs
  - dependency-injection
  - business-logic
---

# Router, Interactor, Builder, and Component: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What are the core RIB roles?](#q1-what-are-the-core-rib-roles) | Senior | Responsibility boundaries |
| [Why can a RIB exist without a view?](#q2-why-can-a-rib-exist-without-a-view) | Senior | Business-driven tree |
| [How do dependencies enter a RIB?](#q3-how-do-dependencies-enter-a-rib) | Senior | Scoped construction |

---

<a id="q1-what-are-the-core-rib-roles"></a>
## Q1: What are the core RIB roles?

### Short Answer

The interactor owns business behavior. The router attaches and detaches child RIBs. The
builder constructs and connects the scope. The component provides scoped dependencies
and satisfies child contracts. View and presenter roles are optional.

### Expanded Answer

The interactor decides that business state requires a child; the router performs that
tree change. The builder receives declared parent dependencies rather than finding them
globally. These boundaries support isolated tests and lifetime-aware dependency injection.

<a id="q2-why-can-a-rib-exist-without-a-view"></a>
## Q2: Why can a RIB exist without a view?

### Short Answer

Because the RIB tree models active business scopes rather than screens. Authentication,
an active trip, or a safety capability may own logic and children without adding a view
level. This keeps business lifetime independent from presentation structure.

### Trade-offs

Separate business and view trees give flexibility but add a debugging model. Teams need
tree inspection and clear ownership so engineers can connect active scopes to visible UI.

<a id="q3-how-do-dependencies-enter-a-rib"></a>
## Q3: How do dependencies enter a RIB?

### Short Answer

A child declares a narrow parent-dependency contract. Its builder receives an object that
satisfies that contract and creates a scoped component. The component provides values to
the interactor and dependencies to child builders.

### Example

The signed-in component can provide account identity and an authenticated client. A
checkout component adds a flow-scoped draft without exposing that draft through the
application root.
