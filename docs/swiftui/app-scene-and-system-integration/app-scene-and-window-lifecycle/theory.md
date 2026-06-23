---
title: "App, Scene, and Window Lifecycle: Theory"
domain: "SwiftUI"
topic: "App, Scene, and System Integration"
concept: "App, Scene, and Window Lifecycle"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: situational
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-06-23
tags:
  - app-lifecycle
  - scenes
  - multiwindow
---

# App, Scene, and Window Lifecycle: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

`App` is the SwiftUI entry point and declares scene configurations. The system creates,
activates, backgrounds, and discards scene instances. A `WindowGroup` is a recipe for
windows, not a single global window.

Separate three lifetimes:

| Lifetime | Typical ownership |
|---|---|
| Process or account | Auth session, repositories, durable cache |
| Scene or window | Navigation path, selection, presented item |
| View | Temporary control and animation state |

An app can have one process with several active scenes. A global navigation model makes
those windows fight over one path or selection.

## Scene Construction and Ownership

Shared dependencies can be created at the app composition root and passed through the
environment. Scene-local models should be created for each scene's root content. With
Observation, use `@State` for an owned `@Observable` model and `@Environment` or
`@Bindable` for access lower in the hierarchy.

`WindowGroup` supports repeated instances of its content. Identified or value-based
window groups let `openWindow` target a kind of window or a value, such as a document
or inspector identifier. The value should be stable, small, and sufficient to rebuild
the destination; do not pass a transient view object as restoration state.

Use `openWindow` and `dismissWindow` through environment actions so the system remains
the owner of window creation and dismissal. Design for requests to be repeated and for
the target data to have changed before a restored window appears.

## Lifecycle Reactions

Read `scenePhase` from the environment to observe `.active`, `.inactive`, and
`.background`. Inactive is a transition or interruption state; background means the
scene is no longer visible. The phase is a signal, not a complete process-lifecycle
state machine.

Use phase changes to pause display-driven work, release replaceable resources, or
request a final synchronization. Do not wait for a background transition to persist
user data. The process can terminate without another callback, so durable mutations
should be saved as part of the normal data workflow.

Tasks attached with `.task` follow view lifetime and receive cancellation when their
view disappears. Long-running shared work needs explicit ownership outside a transient
view and a policy for background execution. Entering the background does not grant
unlimited execution time.

External events such as universal links or custom URLs can select or create a scene.
Route the URL into a validated application destination, then let the target scene apply
its own navigation state. Avoid letting a URL handler mutate an arbitrary global path.

## Production Decisions

Test several windows showing the same account, including edits from both windows,
backgrounding one scene, closing and restoring another, and signing out globally.
Shared stores need coherent update delivery; scene models need independent navigation.

At Staff or Principal scope, define which state is process-wide, per scene, durable,
or disposable. Document deep-link routing, conflict behavior, observability, and the
minimum restoration token. Lifecycle code should be idempotent because events can
arrive repeatedly and in sequences the feature did not initiate.

## References

- [`App`](https://developer.apple.com/documentation/swiftui/app)
- [`Scene`](https://developer.apple.com/documentation/swiftui/scene)
- [`WindowGroup`](https://developer.apple.com/documentation/swiftui/windowgroup)
- [`ScenePhase`](https://developer.apple.com/documentation/swiftui/scenephase)
- [`OpenWindowAction`](https://developer.apple.com/documentation/swiftui/openwindowaction)
- [Bringing multiple windows to your SwiftUI app](https://developer.apple.com/documentation/swiftui/bringing-multiple-windows-to-your-swiftui-app)
