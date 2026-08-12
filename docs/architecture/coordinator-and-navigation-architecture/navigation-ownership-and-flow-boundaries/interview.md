---
title: "Navigation Ownership and Flow Boundaries: Interview Questions"
domain: "Architecture"
topic: "Coordinator and Navigation Architecture"
concept: "Navigation Ownership and Flow Boundaries"
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
  - coordinators
  - navigation
  - ownership
---

# Navigation Ownership and Flow Boundaries: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What problem does a coordinator solve?](#q1-what-problem-does-a-coordinator-solve) | Senior | Navigation ownership |
| [What belongs in a coordinator?](#q2-what-belongs-in-a-coordinator) | Senior | Responsibility boundaries |
| [When is a coordinator unnecessary?](#q3-when-is-a-coordinator-unnecessary) | Senior | Proportional design |

---

<a id="q1-what-problem-does-a-coordinator-solve"></a>
## Q1: What problem does a coordinator solve?

### Short Answer

A coordinator owns a user journey, destination construction, and navigation mechanism
so screens do not know what comes next or how it is presented. This makes flow policy,
dependency composition, deep links, and cross-screen lifetime explicit.

### Expanded Answer

The screen reports intent. The coordinator interprets it within current flow state and
creates the destination. Parent coordinators delegate coherent journeys to children
instead of one app coordinator knowing every screen.

<a id="q2-what-belongs-in-a-coordinator"></a>
## Q2: What belongs in a coordinator?

### Short Answer

Route decisions, destination construction, child-flow ownership, framework navigation,
and flow results belong there. Product validation belongs in use cases, screen display
logic in view models, and durable data policy in repositories.

### Expanded Answer

Routes carry stable identifiers and meaningful outcomes. The coordinator also handles
interactive pop or dismissal so its child graph matches the visible hierarchy. It
must not become a global service locator or business-rules container.

<a id="q3-when-is-a-coordinator-unnecessary"></a>
## Q3: When is a coordinator unnecessary?

### Short Answer

It is unnecessary for local presentation with no cross-screen policy, special lifetime,
deep-link, or restoration need. A SwiftUI feature can own a small path or optional
destination directly. I add a coordinator when navigation becomes a distinct workflow.

### Expanded Answer

The key question is whether navigation has independent policy and ownership. A simple
sheet tied to one feature state does not need another object. A coordinator earns its
place when several screens form a reusable journey, dependencies must be assembled, or
back and deep-link behavior needs one owner.

### Trade-offs

Coordinators reduce screen coupling and support reuse, but add route contracts, wiring,
and lifecycle synchronization. Forcing every sheet through a coordinator creates more
ceremony than control.
