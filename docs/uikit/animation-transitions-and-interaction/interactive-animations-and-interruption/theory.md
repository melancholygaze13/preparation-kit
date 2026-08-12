---
title: "Interactive Animations and Interruption: Theory"
domain: "UIKit"
topic: "Animation, Transitions, and Interaction"
concept: "Interactive Animations and Interruption"
page_type: theory
levels:
  - senior
  - staff
interview_priority: high
estimated_read_minutes: 6
status: reviewed
last_reviewed: 2026-08-12
---

# Interactive Animations and Interruption: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

An interactive animation maps input to visual progress. It is not a fixed animation
with a gesture attached. The person may stop, reverse, cancel, or begin again before
the UI reaches a destination.

A reliable design separates three values:

- **model state:** the last committed product state;
- **target state:** the destination if the interaction finishes;
- **presentation progress:** the current visual position between them.

Commit the target only when the product contract says the interaction completed.
Cancellation must restore the previous hierarchy and model state.

## Percent-Driven View-Controller Transitions

`UIPercentDrivenInteractiveTransition` controls a view-controller transition with a
progress value from `0` to `1`. A gesture starts navigation or presentation and
calls `update(_:)` as the value changes. It ends by calling `finish()` or `cancel()`.

```swift
@MainActor
final class PopInteraction: UIPercentDrivenInteractiveTransition {
    private(set) var isActive = false
    weak var navigationController: UINavigationController?

    func handle(_ gesture: UIPanGestureRecognizer) {
        let width = max(gesture.view?.bounds.width ?? 0, 1)
        let translation = gesture.translation(in: gesture.view).x
        let progress = min(max(translation / width, 0), 1)

        switch gesture.state {
        case .began:
            isActive = true
            navigationController?.popViewController(animated: true)

        case .changed:
            update(progress)

        case .ended:
            let velocity = gesture.velocity(in: gesture.view).x
            let shouldFinish = progress > 0.4 || velocity > 700
            shouldFinish ? finish() : cancel()
            isActive = false

        case .cancelled, .failed:
            cancel()
            isActive = false

        default:
            break
        }
    }
}
```

The numbers are product choices, not UIKit requirements. Use points and velocities
that feel correct on target devices. Account for layout direction and gesture
direction instead of assuming positive `x` always means back.

The navigation delegate should return this interaction controller only when
`isActive` is true. Returning it for a normal button-driven transition can make UIKit
wait for progress that never arrives.

During the interactive phase, UIKit maps progress linearly. Configure the completion
curve or timing curve for the remaining noninteractive settlement. Call finish or
cancel once for each started transition.

## Decide with Distance and Velocity

A fixed halfway threshold makes a fast flick near the start feel ignored. Velocity
alone can finish after an accidental movement. Combine them:

1. Normalize translation into clamped progress.
2. Project intent from direction-aware velocity.
3. Finish when distance is sufficient or a deliberate flick points toward the end.
4. Cancel for system cancellation, failed recognition, or opposing intent.

Add resistance when the gesture moves beyond a natural boundary. A hard visual stop
can feel disconnected from touch. Progress should move in one direction with the
gesture and stay between `0` and `1` before you pass it to UIKit.

Gesture recognizers also need arbitration. Decide how the custom gesture works with
scroll views, the navigation controller's system back gesture, and nested horizontal
content. Prefer preserving system behavior unless the custom interaction provides a
clear product benefit.

## Direct Manipulation with Property Animators

For an in-place view interaction, create one `UIViewPropertyAnimator`, pause it, and
drive `fractionComplete`. On release, set `isReversed` when returning to the start,
then call `continueAnimation(withTimingParameters:durationFactor:)`.

Do not recreate the animator on every pan update. That restarts interpolation and
loses continuity. Do not set model state from every fraction unless progress itself
is meaningful product data.

Use spring timing to preserve release velocity. Normalize the gesture velocity by
the remaining distance. If distance is zero, use zero velocity. Test the result when
the person reverses several times, not only from rest.

`fractionComplete` is a control value, not evidence that a transition committed.
Use the animator's completion position and your chosen finish policy to update final
state and remove temporary views.

## Interruption and Cancellation

An interruption can come from another gesture, a new target, app backgrounding,
rotation, a system presentation, or Reduce Motion changing. Choose a policy:

| Situation | Possible policy |
|---|---|
| Same control chooses a new target | Retarget from current presentation |
| Gesture reverses before release | Scrub back continuously |
| System cancels the recognizer | Cancel to last committed state |
| Layout changes mid-gesture | Recompute geometry or cancel safely |
| Feature disappears | Stop, release temporary views, preserve model state |

Avoid disabling all input until motion ends. That makes the interface feel blocked
and does not solve state correctness. If two actions truly conflict, gate the narrow
command and restore it on every completion and cancellation path.

For view-controller transitions, read `transitionWasCancelled` or the transition
coordinator's context. An animation completion only says that the animation stopped;
it does not say whether UIKit kept the new controller hierarchy.

## Accessibility, Testing, and Performance

Reduce Motion does not require direct manipulation to become disconnected from the
gesture. Keep progress under the person's control, but reduce large travel, depth,
zoom, blur, and bounce. A fade or smaller translation can preserve continuity.

Test progress and finish decisions as pure calculations. Add integration tests for
delegate wiring and cancellation cleanup. Use UI tests for a small number of real
gestures. Profile on hardware because simulator input and frame timing are not enough.

At Staff scope, shared interaction controllers should expose state, cancellation,
and diagnostics. Define ownership for conflicts with system gestures. A reusable
transition that breaks interactive back navigation is not a safe platform standard.

## References

- [`UIPercentDrivenInteractiveTransition`](https://developer.apple.com/documentation/uikit/uipercentdriveninteractivetransition)
- [`UIViewAnimating`](https://developer.apple.com/documentation/uikit/uiviewanimating)
- [`UIViewPropertyAnimator`](https://developer.apple.com/documentation/uikit/uiviewpropertyanimator)
- [`UISpringTimingParameters.initialVelocity`](https://developer.apple.com/documentation/uikit/uispringtimingparameters/initialvelocity)
- [Human Interface Guidelines: Motion](https://developer.apple.com/design/human-interface-guidelines/motion)
