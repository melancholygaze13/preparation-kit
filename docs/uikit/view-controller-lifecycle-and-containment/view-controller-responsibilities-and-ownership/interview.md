---
title: "View Controller Responsibilities and Ownership: Interview Questions"
domain: "UIKit"
topic: "View Controller Lifecycle and Containment"
concept: "View Controller Responsibilities and Ownership"
page_type: interview
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-08-12
---

# View Controller Responsibilities and Ownership: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What should a UIKit view controller own?](#q1-controller-ownership) | Senior | Responsibilities and boundaries |
| [How do you keep a view controller from becoming too large?](#q2-large-controller) | Senior | Refactoring judgment |
| [How do you avoid retain cycles around controllers?](#q3-retain-cycles) | Senior | Ownership and lifetime |
| [How would you standardize controller boundaries across a large app?](#q4-team-boundaries) | Staff | Cross-feature consistency |

---

<a id="q1-controller-ownership"></a>
## Q1: What should a UIKit view controller own?

### Short Answer

A view controller should own the lifecycle and presentation for one screen or
screen region. It owns its root view, updates view state, handles UI events, and
coordinates navigation or child controllers. It should not own unrelated
business rules, persistence, or long-lived app state.

### Expanded Answer

The controller is the boundary between UIKit and the feature. UIKit calls it for
view loading, layout, appearance, rotation, presentation, and containment. That
makes it the right place for UI wiring and lifecycle decisions.

The controller should delegate work that does not need UIKit. Validation,
formatting policy, networking, and persistence are easier to test when they use
plain Swift types. The controller can still coordinate those objects and apply
their results to views.

<a id="q2-large-controller"></a>
## Q2: How do you keep a view controller from becoming too large?

### Short Answer

I first separate UIKit wiring from feature decisions. I keep view setup and
lifecycle in the controller, then move state transitions, formatting, validation,
loading, and navigation rules behind smaller objects when they need tests or
reuse.

### Expanded Answer

I do not split code only because the file is long. I split when there are mixed
reasons to change. A table controller may need many small methods for UIKit
delegates. That can be fine if the behavior is still simple.

The warning sign is a controller that owns several lifetimes at once. For
example, if it validates forms, builds requests, performs networking, parses
responses, decides navigation, and updates views, each change risks a regression.
Moving those decisions into plain objects makes unit tests cheaper and makes the
controller easier to reason about.

### Trade-offs

Too little structure creates a large controller. Too much structure creates many
files with unclear ownership. I choose the smallest boundary that makes the
screen testable and readable.

<a id="q3-retain-cycles"></a>
## Q3: How do you avoid retain cycles around controllers?

### Short Answer

I make delegate references weak, cancel or release long-lived work when the
controller lifetime ends, and avoid strong closure captures from objects that may
outlive the controller.

### Expanded Answer

UIKit ownership is usually strong from parent to child and from controller to
view. Cycles appear when a child, service, gesture handler, timer, notification
observer, or closure also keeps the controller alive.

With closures, the key question is lifetime. A closure stored by a view and
released with the view may safely capture the controller in some cases. A closure
stored by a service, task, timer, or data source can outlive the screen, so I
usually capture `self` weakly and handle dismissal or cancellation explicitly.

<a id="q4-team-boundaries"></a>
## Q4: How would you standardize controller boundaries across a large app?

### Short Answer

I would define where dependencies enter, where navigation decisions live, how
async work is cancelled, and what lower layers may know about UIKit. Then I would
apply those rules through templates, examples, code review, and migration of the
highest-risk screens first.

### Expanded Answer

The goal is not to force every feature into the same number of types. The goal is
to make ownership predictable. Teams should know whether controllers create
services directly, receive dependencies from composition, call routers, and store
screen state locally or in a model.

For migration, I would avoid rewriting every controller. I would start with
screens that leak, are hard to test, or change often. New code should follow the
standard first, then older screens can move when there is product reason to touch
them.
