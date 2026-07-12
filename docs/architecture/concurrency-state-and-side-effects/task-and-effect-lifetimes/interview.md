---
title: "Task and Effect Lifetimes: Interview Questions"
domain: "Architecture"
topic: "Concurrency, State, and Side Effects"
concept: "Task and Effect Lifetimes"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-07-11
tags:
  - task-lifetime
  - structured-concurrency
  - side-effects
---

# Task and Effect Lifetimes: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Who should own an asynchronous effect?](#q1-who-should-own-an-asynchronous-effect) | Senior | Lifetime design |
| [When is an unstructured task appropriate?](#q2-when-is-an-unstructured-task-appropriate) | Senior | Task ownership |
| [Should work continue after a screen disappears?](#q3-should-work-continue-after-a-screen-disappears) | Staff | Business lifetime |

---

<a id="q1-who-should-own-an-asynchronous-effect"></a>
## Q1: Who should own an asynchronous effect?

### Short Answer

The smallest scope that matches the work's required lifetime should own it. A request
awaits its child work, a screen owns replaceable presentation work, a session owns
account observation, and durable business intent belongs in persistent state rather
than only in a task.

### Expanded Answer

The owner starts the work, observes errors, cancels it, and decides when results may
commit. I prefer structured child tasks because their lifetime and cancellation follow
the parent scope. If I create an unstructured task, I make its handle and stop policy
part of an explicit owner.

<a id="q2-when-is-an-unstructured-task-appropriate"></a>
## Q2: When is an unstructured task appropriate?

### Short Answer

At a synchronous-to-async boundary, such as a button action or delegate callback, or for
work intentionally owned beyond the current async scope. I keep the task handle, handle
errors inside it, and cancel it when its owner ends or replaces it.

### Trade-offs

`Task {}` inherits actor context, priority, and task-local values, but it is not a child
of the creating task. Cancellation does not automatically flow from that caller. I use
`Task.detached` only when intentionally giving up inherited context is required.

<a id="q3-should-work-continue-after-a-screen-disappears"></a>
## Q3: Should work continue after a screen disappears?

### Short Answer

Only if its business owner outlives the screen. I cancel searches and previews. I may
continue a checkout flow under a feature owner. An accepted offline mutation should be
persisted and reconciled even if the initiating screen disappears.

### Example

For “send message,” leaving the screen can cancel UI observation without deleting the
outbox entry. The message remains queued until acknowledged, failed, or explicitly
cancelled through a supported business operation.
