---
title: "Transitions, Transactions, and Phase Animation: Theory"
domain: "SwiftUI"
topic: "Animation and Interaction"
concept: "Transitions, Transactions, and Phase Animation"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 6
status: reviewed
last_reviewed: 2026-06-23
tags:
  - transitions
  - transactions
  - phase-animator
---

# Transitions, Transactions, and Phase Animation: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A transition describes how a view enters or leaves the hierarchy. A transaction
carries animation context through an update. Phase and keyframe APIs describe
multi-stage presentation without turning business state into animation bookkeeping.

## How It Works

### Transitions Need Identity Change

```swift
if showsDetails {
    DetailView()
        .transition(.opacity.combined(with: .scale))
}
```

The `if` inserts or removes `DetailView`. The mutation of `showsDetails` must occur in
an animated transaction for the transition to animate. Applying a transition to a
view that never enters or leaves does not animate ordinary property changes.

Stable surrounding identity matters. If an ancestor also changes type or ID, the
framework can replace more of the hierarchy than intended.

### Asymmetric Transitions

Insertion and removal can use different effects. This is useful when new content
arrives from a navigation direction but old content should fade. Keep direction and
meaning clear; asymmetric motion that contradicts navigation can confuse users.

Transitions affect presentation, not ownership. Removed views and their view-scoped
tasks are leaving the hierarchy even while pixels animate out.

### Transactions

A `Transaction` carries animation and other update context. A subtree can inspect or
modify it to replace or disable animation for specific descendants:

```swift
content.transaction { transaction in
    transaction.animation = nil
}
```

Use this when one descendant should not animate as part of a broader update. Avoid
disabling animation globally to solve one local problem.

Transactions are per-update context, not persistent model state. Do not store them
or depend on undocumented traversal order.

When diagnosing unexpected animation, inspect which state mutations share the same
transaction. Separating unrelated mutations or narrowing the animation-bearing
subtree is usually clearer than overriding transactions throughout the hierarchy.

### Phase Animation

A phase animator cycles through discrete values such as idle, emphasized, and settled.
Each phase maps to view properties and can have its own animation. It fits a finite,
presentation-only sequence triggered by state.

Keep product state separate. For example, `isFavorite` is domain/UI state; a brief
confirmation pulse is a phase sequence derived from the favorite action.

### Keyframes

Keyframes define timed tracks for properties that need precise multi-stage motion.
They are appropriate when phase-to-phase animation is insufficient, such as overshoot,
pause, or coordinated property tracks.

Do not use keyframes to schedule network work or persistence. If the sequence must
wait for business completion, the model owns that state and triggers the next visual
state when the result arrives.

### Sequencing and Interruption

Use `withAnimation` completion or animation sequence APIs instead of `Task.sleep`.
Decide what happens if the trigger repeats: restart, ignore, queue, or retarget. The
policy should prevent overlapping sequences from leaving inconsistent presentation state.

Animation completion criteria can differ when motion is logically complete versus
visually removed. Use the API's completion semantics deliberately and keep model
correctness independent.

### Accessibility and Performance

Replace large moves, zooms, or repeated motion when Reduce Motion is enabled. Preserve
state feedback with opacity, symbol change, or immediate result.

Transitions and multi-stage animations can cause repeated layout and rendering.
Profile complex effects, large blurred surfaces, and many simultaneously animated
rows. Scope the animated subtree and avoid animating offscreen or unrelated content.

## Constraints and Guarantees

- A transition applies to insertion or removal of a view identity.
- An animation transaction is needed for the transition to interpolate.
- Transactions are contextual values for an update, not durable state.
- Phase and keyframe animation manage presentation sequences, not domain workflows.
- Removal can end view lifetime while its transition is visually completing.

## Engineering Decisions

| Need | Mechanism |
|---|---|
| Insert/remove one view | Transition plus animated mutation |
| Different entry and exit | Asymmetric transition |
| Suppress one descendant animation | Modify its transaction |
| Discrete visual sequence | Phase animator |
| Precisely timed property tracks | Keyframe animator |
| Sequence dependent on async result | Model state, then trigger presentation |

## References

- [`Transition`](https://developer.apple.com/documentation/swiftui/transition)
- [`Transaction`](https://developer.apple.com/documentation/swiftui/transaction)
- [`phaseAnimator`](https://developer.apple.com/documentation/swiftui/view/phaseanimator%28_%3Atrigger%3Acontent%3Aanimation%3A%29)
- [Wind your way through advanced animations in SwiftUI](https://developer.apple.com/videos/play/wwdc2023/10157/)
