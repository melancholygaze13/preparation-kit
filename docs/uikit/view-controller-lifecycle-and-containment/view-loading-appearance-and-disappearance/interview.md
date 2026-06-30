---
title: "View Loading, Appearance, and Disappearance: Interview Questions"
domain: "UIKit"
topic: "View Controller Lifecycle and Containment"
concept: "View Loading, Appearance, and Disappearance"
page_type: interview
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-06-30
---

# View Loading, Appearance, and Disappearance: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What is the difference between `loadView`, `viewDidLoad`, and `viewWillAppear`?](#q1-loading-vs-appearance) | Senior | Lifecycle purpose |
| [Where would you start and cancel visible-only async work?](#q2-visible-async-work) | Senior | Lifetime and stale results |
| [Why is `viewDidLoad` too early for some layout work?](#q3-layout-timing) | Senior | Layout timing |
| [How do lifecycle callbacks affect analytics or subscriptions?](#q4-repeated-callbacks) | Staff | Production correctness |

---

<a id="q1-loading-vs-appearance"></a>
## Q1: What is the difference between `loadView`, `viewDidLoad`, and `viewWillAppear`?

### Short Answer

`loadView` creates the root view when the controller builds views in code.
`viewDidLoad` runs after the view hierarchy is loaded and is good for one-time
wiring. `viewWillAppear` runs before the screen becomes visible and can happen
many times.

### Expanded Answer

The difference is lifetime. View loading is about creating the view hierarchy.
Appearance is about visibility. A controller may load its view once and appear
many times as the user moves through navigation, tabs, or presentations.

I use `viewDidLoad` for constraints, targets, delegates, and initial UI state. I
use `viewWillAppear` to refresh state that may have changed while the screen was
away. I avoid starting visible-only work in `viewDidLoad` because the screen may
not be visible yet.

<a id="q2-visible-async-work"></a>
## Q2: Where would you start and cancel visible-only async work?

### Short Answer

I start work that requires a visible screen in `viewDidAppear` or
`viewWillAppear`, depending on whether it needs actual visibility. I cancel or
pause it in `viewWillDisappear` or `viewDidDisappear`, and I guard against stale
results.

### Expanded Answer

The right callback depends on the user-visible effect. A refresh that should be
ready before the screen appears can start in `viewWillAppear`. A camera preview,
focus action, or analytics impression may belong in `viewDidAppear` because the
screen must actually be visible.

Cancellation is not enough by itself. Async work may complete after cancellation
or after the user navigates away. I usually keep a task handle, request token, or
current model identifier so old results cannot update the wrong visible state.

<a id="q3-layout-timing"></a>
## Q3: Why is `viewDidLoad` too early for some layout work?

### Short Answer

`viewDidLoad` means the view hierarchy exists, not that Auto Layout has produced
final bounds. Work that depends on final size belongs in constraints,
`viewDidLayoutSubviews`, or a later layout-aware path.

### Expanded Answer

At `viewDidLoad`, the controller may not yet know its container size, safe area,
trait environment, or final bounds. Setting fixed frames there often breaks on
rotation, split view, dynamic type, or different devices.

Most layout should be expressed as constraints. If a layer mask or gradient needs
the final bounds, update it after layout and keep the work cheap because layout
callbacks can run frequently.

<a id="q4-repeated-callbacks"></a>
## Q4: How do lifecycle callbacks affect analytics or subscriptions?

### Short Answer

Callbacks such as `viewWillAppear` and `viewDidAppear` can run more than once, so
analytics and subscriptions must be idempotent or paired with cleanup. Otherwise
the app can double-count events or create duplicate observers.

### Expanded Answer

For analytics, I choose the callback that matches the event. A screen impression
usually means the screen actually appeared, so `viewDidAppear` is often a better
fit than `viewDidLoad`. For subscriptions, I pair start and stop callbacks or
store the subscription so repeated appearances do not create duplicates.

At team scale, lifecycle conventions should be explicit. Otherwise different
features will count impressions differently and manage observers inconsistently.
