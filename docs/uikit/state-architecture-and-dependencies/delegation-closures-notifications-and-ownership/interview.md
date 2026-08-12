---
title: "Delegation, Closures, Notifications, and Ownership: Interview Questions"
domain: "UIKit"
topic: "State, Architecture, and Dependencies"
concept: "Delegation, Closures, Notifications, and Ownership"
page_type: interview
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-08-12
---

# Delegation, Closures, Notifications, and Ownership: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you choose between a delegate and a closure?](#q1-delegate-vs-closure) | Senior | Communication shape |
| [When are notifications appropriate?](#q2-notifications) | Senior | Decoupling trade-offs |
| [What ownership bugs do callbacks create?](#q3-callback-ownership) | Senior | Memory and reuse |
| [How would you set team rules for communication patterns?](#q4-team-rules) | Staff | Consistency |

---

<a id="q1-delegate-vs-closure"></a>
## Q1: How do you choose between a delegate and a closure?

### Short Answer

I use a delegate for a stable one-to-one relationship, especially when the child
needs several named callbacks or a return value. I use a closure for a small local
callback with one clear action.

### Expanded Answer

UIKit delegates work well for customization and decisions, such as allowing text
input or providing table data. Closures work well for local events like a retry
button tap. If a closure list starts becoming a protocol informally, I would
make the protocol explicit.

---

<a id="q2-notifications"></a>
## Q2: When are notifications appropriate?

### Short Answer

Notifications fit one-to-many events where the sender should not know the
receivers. They are not a good default for routine communication inside one
feature.

### Expanded Answer

For example, an account change may need several independent screens or services
to react. A notification or shared state publisher can make sense there. For a
child view telling its owner that a button was tapped, a delegate or closure is
easier to trace and test.

### Trade-offs

Notifications reduce direct dependencies, but they hide control flow and can
make payloads less type-safe. Overuse makes a codebase harder to debug.

---

<a id="q3-callback-ownership"></a>
## Q3: What ownership bugs do callbacks create?

### Short Answer

The common bugs are retain cycles, callbacks firing after reuse, observers being
registered more than once, and results arriving after the receiver is gone or no
longer interested.

### Expanded Answer

If a view controller owns a view and the view stores a closure that captures the
controller strongly, neither may deallocate. In reusable cells, callbacks and
tasks must be reset or tied to the current model identity. Notification
observers should have clear registration and cancellation ownership.

---

<a id="q4-team-rules"></a>
## Q4: How would you set team rules for communication patterns?

### Short Answer

I would define defaults by relationship: delegates for typed one-to-one control,
closures for local one-off callbacks, and notifications only for broad events.
I would also require explicit lifetime ownership.

### Expanded Answer

At team scale, inconsistent communication is a maintenance problem. Code review
should ask whether the relationship is local or broadcast, whether the callback
can retain its owner, whether the receiver can disappear first, and where
observation is cancelled.
