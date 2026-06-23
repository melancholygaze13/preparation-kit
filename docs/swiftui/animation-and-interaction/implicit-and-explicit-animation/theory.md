---
title: "Implicit and Explicit Animation: Theory"
domain: "SwiftUI"
topic: "Animation and Interaction"
concept: "Implicit and Explicit Animation"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-06-23
tags:
  - animation
  - transactions
  - reduce-motion
---

# Implicit and Explicit Animation: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

State changes immediately to its new logical value. An animation in the current
transaction tells SwiftUI how to interpolate affected animatable presentation values
from their current state to the new state.

Animation is presentation, not a timer for business logic. Code should remain correct
when animations are disabled, interrupted, or shortened.

## How It Works

### Explicit Animation

Use `withAnimation` around the mutation whose resulting visual changes should animate:

```swift
withAnimation(.smooth) {
    isExpanded.toggle()
}
```

The transaction can affect animatable changes in the updated subtree, not only the
line visually closest to the call. Scope state ownership and animation deliberately.

Use the completion form when a second state change must follow completion. Do not
sequence UI by sleeping for an assumed duration; interruptions and accessibility
settings make wall-clock assumptions fragile.

### Value-Scoped Implicit Animation

Attach `.animation(_:value:)` to a subtree when changes in a specific value should
animate:

```swift
Card(isExpanded: isExpanded)
    .animation(.smooth, value: isExpanded)
```

Avoid the legacy unscoped animation form. A broad modifier can animate unrelated
changes that happen in the same update. Place it close to the intended subtree and value.

### Interruption and Velocity

Animations are interruptible. A new target can arrive while motion is in progress,
and SwiftUI continues from the current presentation. This is essential for responsive
toggles, gestures, and rapidly changing data.

Do not keep a separate “animation is at 40%” model unless the interaction requires
scrubbing. The source state remains the target; the framework manages interpolation.

### What Animates

Only values with animatable representations interpolate. Opacity, scale, position,
many shapes, and layout values can animate. Some structural or discrete changes need
a transition or explicit phase states.

An animation cannot repair unstable identity. If a row receives a new ID, SwiftUI may
treat it as replacement rather than a change to the existing entity.

### Curves, Springs, and Timing

Choose timing from interaction meaning. Springs suit direct manipulation and
interruptible movement because they model settling toward a target. Duration-based
curves suit deliberate fades or progress where a bounded time matters visually.

Avoid scattering unrelated durations through views. Shared motion choices can be
semantic design tokens, while a feature may still choose a different animation when
its interaction demands it. Do not use an animation's nominal duration as an async
timeout or persistence schedule.

Animations can inherit velocity during retargeting depending on the animation and
context. Test repeated taps and reversals; an animation that looks correct only from
rest is not robust interaction design.

### State Scope

Keep the trigger state at the lowest owner that coordinates the visual result. Local
disclosure can remain `@State`; navigation or saved workflow state belongs to its
flow model. Animation should decorate that transition rather than create a duplicate
“isAnimating” source of truth.

An `isAnimating` flag is justified only when the UI truly needs a separate interaction
policy, such as temporarily preventing a conflicting gesture. Clear it through
documented completion semantics and keep cancellation or reduced-motion behavior valid.

### Performance

Animation creates repeated layout or drawing work across frames. Large blur regions,
shadows, masks, complex custom paths, and broad layout changes can hitch. Profile on
target hardware and narrow animation to the smallest meaningful subtree.

Prefer transforms when surrounding layout should not reflow. Use layout animation
when siblings must respond. The visual result may look similar but the work and
semantics differ.

Profile worst-case content and simultaneous animations. A smooth isolated preview
does not prove a scrolling collection or large accessibility layout can meet its frame budget.

### Accessibility

Read `accessibilityReduceMotion` and replace large spatial motion with opacity or a
smaller effect. Do not remove information or completion feedback. Motion must never be
the only signal that state changed.

Avoid endless or decorative motion that distracts from content. Preserve focus and
VoiceOver semantics while views animate or change structure.

## Constraints and Guarantees

- Logical state changes at mutation time; animation controls presentation interpolation.
- Animations can be interrupted and retargeted.
- Transaction scope can affect multiple descendants updated together.
- Not every property or structural change has an animatable representation.
- Correctness cannot depend on an animation finishing at an exact wall-clock time.

## Engineering Decisions

| Need | Approach |
|---|---|
| Animate one user mutation | `withAnimation` |
| Animate changes to one observed value | `.animation(_:value:)` |
| Insert or remove identity | Transition plus animated mutation |
| Multi-stage visual sequence | Completion, phase, or keyframe API |
| Reduced motion | Smaller motion or opacity alternative |
| Persistent business delay | Model timing, not animation completion |

## References

- [Animations](https://developer.apple.com/documentation/swiftui/animations)
- [`withAnimation`](https://developer.apple.com/documentation/swiftui/withanimation%28_%3A_%3Acompletion%3A%29)
- [Explore SwiftUI animation](https://developer.apple.com/videos/play/wwdc2023/10156/)
- [Human Interface Guidelines: Motion](https://developer.apple.com/design/human-interface-guidelines/motion)
