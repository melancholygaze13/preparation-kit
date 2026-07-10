---
title: "Property Animators and Animation Options: Theory"
domain: "UIKit"
topic: "Animation, Transitions, and Interaction"
concept: "Property Animators and Animation Options"
page_type: theory
levels:
  - senior
  - staff
interview_priority: high
estimated_read_minutes: 6
status: reviewed
last_reviewed: 2026-07-10
---

# Property Animators and Animation Options: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

UIKit animations interpolate presentation from current values to final view or
layer values. The app's logical state should already describe the destination.
Animation controls how the change appears, not whether the change happened.

Choose the smallest API that provides the control you need:

| Need | Typical API |
|---|---|
| One-shot property or layout change | `UIView.animate` |
| Simple spring to a fixed destination | Spring `UIView.animate` overload |
| Pause, scrub, reverse, or retarget | `UIViewPropertyAnimator` |
| Several timed visual stages | `UIView.animateKeyframes` |
| Disable incidental animation | `UIView.performWithoutAnimation` |

Motion should explain space, state, or feedback. Frequent controls should stay brief
and responsive. Decorative motion that makes repeated work slower should be reduced
or removed.

## Animate Final Properties

An animation block contains final values. UIKit captures the starting presentation
and interpolates animatable properties such as `center`, `bounds`, `transform`,
`alpha`, and many colors.

Constraint constants are not visual properties. Update the constraint, then animate
a layout pass on the common ancestor:

```swift
func setExpanded(_ expanded: Bool, animated: Bool) {
    view.layoutIfNeeded()
    detailsHeight.constant = expanded ? 240 : 0

    let changes = {
        self.chevron.transform = expanded
            ? CGAffineTransform(rotationAngle: .pi)
            : .identity
        self.view.layoutIfNeeded()
    }

    guard animated, UIAccessibility.isReduceMotionEnabled == false else {
        UIView.performWithoutAnimation(changes)
        return
    }

    UIView.animate(
        withDuration: 0.25,
        delay: 0,
        options: [.beginFromCurrentState, .allowUserInteraction, .curveEaseOut],
        animations: changes
    )
}
```

The first layout call establishes the starting geometry. The call inside the block
produces the destination layout. Apply both calls to an ancestor that owns all
affected constraints.

`beginFromCurrentState` helps a new block animation continue from an in-flight
presentation. It is useful for quickly repeated state changes. A property animator
is clearer when the feature needs explicit pause, reversal, or progress control.

`allowUserInteraction` keeps hit testing available during the animation. That does
not make repeated actions logically safe. The handler must still tolerate another
tap, cancellation, or a new target.

## Property Animator Lifecycle

`UIViewPropertyAnimator` conforms to `UIViewAnimating` and
`UIViewImplicitlyAnimating`. It can start, pause, stop, reverse, and continue.
While paused, `fractionComplete` can scrub the animation.

```swift
let timing = UISpringTimingParameters(dampingRatio: 0.9)
let animator = UIViewPropertyAnimator(
    duration: 0.35,
    timingParameters: timing
)

animator.addAnimations {
    card.transform = .identity
    card.alpha = 1
}

animator.addCompletion { [weak self] position in
    self?.didSettle(at: position)
    self?.animator = nil
}

self.animator = animator
animator.startAnimation()
```

Retain an animator for as long as gestures or later events must control it. Clear the
stored animator on completion and avoid a closure retain cycle. A local animator is
sufficient for a fire-and-forget animation that UIKit retains while running.

The animator moves through inactive, active, and stopped states. Do not call control
methods without considering its current state. Completion receives a position such
as `.start`, `.end`, or `.current`; do not assume every completion means success at
the destination.

To continue a paused animation, call
`continueAnimation(withTimingParameters:durationFactor:)`. New timing parameters can
settle the remaining movement with a spring. For a gesture, normalize velocity by
the remaining distance so the continuation does not visibly lose momentum.

## Timing, Springs, and Keyframes

Use an ease-out curve for a short arrival or dismissal when quick response matters.
Use ease-in-out for movement whose acceleration and deceleration are both visible.
Linear timing is appropriate for direct progress or constant-rate motion, not most
button-driven transitions.

Spring damping controls oscillation. A damping ratio of `1` settles without
oscillation; lower values add more bounce. Bounce must fit the product and action.
A warning or destructive confirmation should not feel playful.

Spring initial velocity is normalized to total animation distance. If a pan ends at
100 points per second with 200 points left, the one-dimensional normalized velocity
is `0.5`. Handle zero remaining distance to avoid invalid values.

Use keyframes for a deliberate, finite visual sequence. They fit staged emphasis or
several coordinated properties. They fit poorly when a person can rapidly reverse
the state because restarting a sequence can jump or repeat old phases.

## Correctness, Accessibility, and Performance

Do not use an animation duration as a business timer. A transition may be disabled,
interrupted, accelerated, or changed by accessibility settings. Persist state and
start work from real state changes. Use completion only for presentation cleanup
that truly depends on the animation outcome.

When Reduce Motion is enabled, replace large spatial movement, zoom, and depth with a
fade, a smaller effect, or an immediate change. Preserve the information that motion
communicated. Observe preference changes for long-lived animation systems.

Transforms and opacity often avoid re-laying out surrounding views. Constraint,
blur, mask, shadow, and custom-drawing animations can create layout or rendering work
on every frame. That does not make them forbidden. Keep the animated region small and
profile worst-case content on target hardware.

## Engineering Decisions

Centralize semantic motion choices for shared components, but do not force one curve
and duration onto every interaction. Test repeated taps, reversal, app backgrounding,
rotation, large content, and Reduce Motion.

At Staff scope, shared motion APIs should make the safe path easy: current-state
retargeting, cancellation-aware completion, accessibility alternatives, and useful
performance signposts. They should not hide animator state behind a decorative DSL.

## References

- [`UIViewPropertyAnimator`](https://developer.apple.com/documentation/uikit/uiviewpropertyanimator)
- [`UIViewAnimating`](https://developer.apple.com/documentation/uikit/uiviewanimating)
- [`UIView.AnimationOptions.beginFromCurrentState`](https://developer.apple.com/documentation/uikit/uiview/animationoptions/beginfromcurrentstate)
- [`UISpringTimingParameters.initialVelocity`](https://developer.apple.com/documentation/uikit/uispringtimingparameters/initialvelocity)
- [Human Interface Guidelines: Motion](https://developer.apple.com/design/human-interface-guidelines/motion)
