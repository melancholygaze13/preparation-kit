---
title: "MVC and View Controller Boundaries: Interview Questions"
domain: "UIKit"
topic: "State, Architecture, and Dependencies"
concept: "MVC and View Controller Boundaries"
page_type: interview
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-07-05
---

# MVC and View Controller Boundaries: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What should a UIKit view controller own?](#q1-view-controller-ownership) | Senior | UIKit MVC responsibilities |
| [How do you avoid massive view controllers?](#q2-avoid-massive-view-controllers) | Senior | Boundary decisions |
| [When would you introduce a view model or presenter?](#q3-view-model-or-presenter) | Staff | Testability and state |
| [How would you improve boundaries in a large legacy UIKit screen?](#q4-legacy-boundary-improvement) | Principal | Migration and risk |

---

<a id="q1-view-controller-ownership"></a>
## Q1: What should a UIKit view controller own?

### Short Answer

A UIKit view controller should own screen coordination. It manages the view
hierarchy, responds to lifecycle and user events, updates visible UI, and
coordinates navigation. It should not own reusable domain rules or long-lived app
state.

### Expanded Answer

I treat the controller as the adapter between UIKit and the rest of the feature.
It can translate a button tap into a command, apply a loading state, or validate
simple input before passing it on. Business rules, persistence, networking, and
shared state should sit behind model, service, or view-model boundaries.

---

<a id="q2-avoid-massive-view-controllers"></a>
## Q2: How do you avoid massive view controllers?

### Short Answer

I separate responsibilities by reason to change. View setup and lifecycle stay
near UIKit. Formatting, state transitions, service calls, navigation flow, and
domain rules move into smaller objects with clear ownership.

### Expanded Answer

I do not extract code only because a file is long. I extract when the controller
mixes unrelated concerns or becomes hard to test. For example, a price rule
belongs in the domain layer, a request belongs behind a service, and multi-screen
flow ownership may belong in a coordinator.

### Trade-offs

Extra layers add naming, wiring, and indirection. They are worth it when they
reduce coupling, make tests faster, or stop one controller from owning behavior
that several screens depend on.

---

<a id="q3-view-model-or-presenter"></a>
## Q3: When would you introduce a view model or presenter?

### Short Answer

I introduce one when presentation state or state transitions are complex enough
to test outside UIKit. The view model or presenter owns screen state and rules
for changing it, while the view controller renders that state.

### Expanded Answer

Good triggers include several loading and error states, derived display values,
async result ordering, permission gates, or repeated behavior across screens. The
controller should still own UIKit lifecycle. The extracted object should not
become a hidden view controller with UIKit imports and navigation side effects.

### Example

In a profile screen, the view model can decide whether the save button is
enabled, submit the update, and expose an error message. The controller binds
that state to text fields, buttons, and alerts.

---

<a id="q4-legacy-boundary-improvement"></a>
## Q4: How would you improve boundaries in a large legacy UIKit screen?

### Short Answer

I would first identify the highest-risk mixed responsibility, extract that
behavior behind a small tested boundary, and keep the view controller as the
UIKit adapter. I would avoid a large rewrite unless the current design blocks
safe change.

### Expanded Answer

For a large team, the migration plan matters as much as the target shape. I
would look for rules that change often, bugs caused by lifecycle or stale state,
and code that several screens copy. Then I would extract one boundary at a time,
add tests, and keep the screen behavior stable during rollout.

### Trade-offs

Incremental extraction is slower than a rewrite, but it lowers regression risk
and lets the team learn where the real boundaries are. A rewrite can be right
when the screen is isolated and already scheduled for major product change.
