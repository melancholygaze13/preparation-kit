---
title: "Navigation Controller Stack and Ownership: Interview Questions"
domain: "UIKit"
topic: "Navigation and Presentation"
concept: "Navigation Controller Stack and Ownership"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-07-01
---

# Navigation Controller Stack and Ownership: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When should you push versus present a view controller?](#q1-push-vs-present) | Senior | Navigation choice |
| [Who should own navigation decisions in a UIKit feature?](#q2-navigation-ownership) | Staff | Architecture boundary |
| [How would you handle deep linking into a navigation stack?](#q3-deep-link-stack) | Staff | Stack state |

---

<a id="q1-push-vs-present"></a>
## Q1: When should you push versus present a view controller?

### Short Answer

I push when the new screen is the next step in the same hierarchy or task. I
present when the screen is a separate modal task, interruption, or input flow
that should be completed or dismissed independently.

### Expanded Answer

A product detail from a list is usually a push because back returns to the list.
A sign-in prompt, share sheet, or edit form may be modal because it temporarily
interrupts the current context.

The decision should follow user meaning, not only visual style. If back and
dismiss mean different things, the navigation structure should make that clear.

---

<a id="q2-navigation-ownership"></a>
## Q2: Who should own navigation decisions in a UIKit feature?

### Short Answer

The flow owner should decide navigation. A child view controller can report user
intent, but it should not know too much about unrelated stack structure or
app-wide containers.

### Expanded Answer

In small UIKit apps, the parent view controller may be the flow owner. In larger
apps, a coordinator, router, or composition layer often owns this decision. The
important rule is that feature screens stay reusable and do not reach across the
stack to mutate siblings.

This also makes navigation easier to test. The screen can be tested for emitted
intent, while a flow test verifies push, pop, or replacement behavior.

---

<a id="q3-deep-link-stack"></a>
## Q3: How would you handle deep linking into a navigation stack?

### Short Answer

I would build a coherent stack for the target route, not just push a detail
screen onto whatever happens to be visible. The stack should make back navigation
meaningful.

### Expanded Answer

For example, a deep link to an order detail may create a stack with orders list
as root and order detail on top. If the link starts a special flow, it may
replace the current stack or present a modal flow instead.

### Trade-offs

Preserving the current stack can feel less disruptive, but it can create strange
back behavior. Replacing the stack is clearer when the deep link changes the
user's main context, but it should be deliberate because it discards navigation
history.
