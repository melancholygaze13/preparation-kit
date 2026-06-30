---
title: "View Loading, Appearance, and Disappearance: Theory"
domain: "UIKit"
topic: "View Controller Lifecycle and Containment"
concept: "View Loading, Appearance, and Disappearance"
page_type: theory
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 8
status: reviewed
last_reviewed: 2026-06-30
---

# View Loading, Appearance, and Disappearance: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

UIKit separates view creation from visibility. A controller can exist before its
view is loaded. Its view can be loaded once, appear many times, disappear many
times, and still remain in memory.

```text
controller init
    -> loadView
    -> viewDidLoad
    -> viewWillAppear
    -> viewDidAppear
    -> viewWillDisappear
    -> viewDidDisappear
```

That sequence is common, but real apps add presentations, child containment,
interactive transitions, memory pressure, trait changes, and scene transitions.
Interview answers should explain the purpose of each callback instead of
memorizing one perfect order.

## View Loading

Use `loadView` when building the root view in code. Assign a view to `self.view`
and do not call `super.loadView()` in that case. If the controller uses a nib or
storyboard, UIKit loads the view from that resource instead.

Use `viewDidLoad` for setup that requires the view hierarchy to exist:

- adding child views that depend on outlets or root view references
- installing constraints
- configuring controls and accessibility labels
- binding one-time target-action or delegate relationships
- setting initial UI state

`viewDidLoad` is not a visibility callback. Starting a camera session,
subscribing to visible-only updates, or marking analytics impressions there can
be wrong because the screen may not be visible yet.

## Appearance and Disappearance

Appearance callbacks describe transitions into and out of the visible interface.
They can run repeatedly for the same controller as the user navigates away and
back, presents another screen, changes tabs, or completes an interactive
transition.

Use `viewWillAppear` for updates that should be current before the screen is
shown. Examples include refreshing labels from state, updating selection, or
reloading a list after a child flow changed data.

Use `viewDidAppear` when the screen must actually be visible. Examples include
starting focus, beginning visible-only timers, sending an impression event, or
starting a resource-heavy preview.

Use `viewWillDisappear` or `viewDidDisappear` to stop work that should not
continue while hidden. Examples include cancelling visible-only tasks, ending
editing, pausing media, stopping sensors, or clearing transient UI state.

Disappearance does not always mean the controller is gone. A pushed controller
disappears when another controller is pushed on top of it. A tab's root
controller disappears when the user switches tabs. Those controllers may remain
alive and appear again.

## Layout and Visible Updates

`viewDidLoad` is too early for final geometry. Auto Layout has not completed the
final layout for the current container. Use constraints for normal layout. Use
`viewDidLayoutSubviews` only when you must react to final bounds, such as updating
a gradient layer frame or a custom mask.

Avoid doing expensive work in layout callbacks. Layout can run often. A callback
that re-fetches data, rebuilds the whole hierarchy, or invalidates layout again
can cause hitches or loops.

## Engineering Decisions

Choose lifecycle placement by the lifetime of the work:

| Work | Best place | Reason |
|---|---|---|
| Build root view in code | `loadView` | Defines the controller's view |
| One-time view wiring | `viewDidLoad` | Requires views but not visibility |
| Refresh presentation before showing | `viewWillAppear` | Runs before each appearance |
| Start visible-only effects | `viewDidAppear` | Screen is on screen |
| Stop visible-only effects | `viewWillDisappear` or `viewDidDisappear` | Screen is leaving or hidden |
| Final bounds-dependent adjustment | `viewDidLayoutSubviews` | Layout has produced bounds |

For async work, separate loading data from displaying results. Data needed by a
feature may start before visibility if it is not expensive and has a clear owner.
Work that is only useful while visible should start and stop with appearance.
Always handle stale results because the user may leave before work completes.

## Production Application

Common production bugs come from treating callbacks as stronger guarantees than
they are:

- assuming `viewDidLoad` means visible
- assuming `viewWillAppear` runs only once
- assuming `viewDidDisappear` means the controller is deallocated
- using final frame values before layout
- starting duplicate subscriptions on every appearance without stopping them

In code review, ask whether the callback matches the lifetime of the work. That
single question catches many UIKit lifecycle bugs.

## References

- [UIViewController](https://developer.apple.com/documentation/uikit/uiviewcontroller)
- [Responding to View-Related Events](https://developer.apple.com/documentation/uikit/uiviewcontroller/responding-to-view-related-events)
- [View Controller Programming Guide for iOS](https://developer.apple.com/library/archive/featuredarticles/ViewControllerPGforiPhoneOS/)
