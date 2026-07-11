---
title: "Child Coordinators and Lifetime: Interview Questions"
domain: "Architecture"
topic: "Coordinator and Navigation Architecture"
concept: "Child Coordinators and Lifetime"
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
  - coordinators
  - lifetime
  - ownership
---

# Child Coordinators and Lifetime: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Who owns a child coordinator?](#q1-who-owns-a-child-coordinator) | Senior | Retention and completion |
| [How do you prevent coordinator leaks?](#q2-how-do-you-prevent-coordinator-leaks) | Senior | Cycles and teardown |
| [What happens to async work when a flow ends?](#q3-what-happens-to-async-work-when-a-flow-ends) | Senior | Scope and cancellation |

---

<a id="q1-who-owns-a-child-coordinator"></a>
## Q1: Who owns a child coordinator?

### Short Answer

The parent coordinator strongly owns the child while its flow is active. The child
reports one completion result without strongly owning the parent. Completion or
interactive dismissal makes the parent remove the child and release its feature graph.

### Expanded Answer

I prefer typed child ownership when possible. The navigation controller retaining a
screen is not the coordinator ownership model. Every exit path, including a back
gesture and failed startup, must reach idempotent teardown.

<a id="q2-how-do-you-prevent-coordinator-leaks"></a>
## Q2: How do you prevent coordinator leaks?

### Short Answer

I define one ownership direction, use weak callbacks where children must not own
parents, remove child storage on every exit, and cancel tasks and subscriptions. I
verify repeated start and finish with memory graph and deallocation diagnostics.

### Expanded Answer

Common cycles pass through view controllers, view models, route closures, tasks, and
subscriptions. Weak capture helps only after ownership is clear; otherwise it can hide
a missing owner and drop events.

<a id="q3-what-happens-to-async-work-when-a-flow-ends"></a>
## Q3: What happens to async work when a flow ends?

### Short Answer

Feature-scoped work is canceled and late results are rejected using flow identity.
Work that must continue after navigation belongs in a longer-lived repository or
durable operation service. The coordinator can stop observing it without stopping the
operation.

### Expanded Answer

An upload or payment should not retain an invisible screen graph. Persisted operation
identity lets a later flow resume status. Parallel scenes also need distinct scope IDs
so ending one child cannot cancel another instance's work.
