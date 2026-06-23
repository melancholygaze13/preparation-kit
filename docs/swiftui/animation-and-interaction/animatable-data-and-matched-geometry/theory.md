---
title: "Animatable Data and Matched Geometry: Theory"
domain: "SwiftUI"
topic: "Animation and Interaction"
concept: "Animatable Data and Matched Geometry"
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
  - animatable
  - matched-geometry
  - interpolation
---

# Animatable Data and Matched Geometry: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Custom animation requires a numeric representation SwiftUI can interpolate between
old and new values. Matched geometry instead connects the frames and visual properties
of separate view instances that represent one semantic element across a structural change.

Neither mechanism owns product state. State selects the source and destination;
animation describes presentation between them.

## How It Works

### Animatable Values

Use the modern `@Animatable` macro for custom types. Stored values that can interpolate
participate automatically; mark non-animating values with `@AnimatableIgnored`.

```swift
@Animatable
struct ProgressRing: Shape {
    var progress: Double

    func path(in rect: CGRect) -> Path {
        // Build path from the current interpolated progress.
    }
}
```

The path can be evaluated many times during animation. Keep it deterministic and
cheap, and avoid side effects. Clamp or normalize inputs according to the shape's contract.

Discrete values such as Booleans, IDs, and modes should not be forced into numeric
interpolation. Use them to choose state or phases and animate the continuous properties.

### Multiple Values

When several properties animate, each must be represented. The macro reduces manual
`AnimatablePair` nesting and synchronization. All animatable values need compatible
semantics throughout the interpolation range.

For angles, colors, and paths, consider wraparound, color space, and topology. The
shortest numeric path is not always the intended visual path. Test intermediate states,
not only endpoints.

### Matched Geometry

`matchedGeometryEffect` uses a namespace and stable ID to relate source and destination
views. It can animate position and size while the application changes structure:

```swift
@Namespace private var namespace

Thumbnail(item: item)
    .matchedGeometryEffect(id: item.id, in: namespace)
```

The views must coexist in a hierarchy arrangement where SwiftUI can coordinate the
transition. IDs must be unique within the namespace, and source designation must not
be ambiguous.

Matched geometry does not move one actual view between parents. Two view descriptions
represent the same semantic element and SwiftUI creates the visual relationship.
State, focus, tasks, and accessibility lifetime still follow the actual hierarchy.

### Layout and Modifier Order

Placement relative to frame, clip, and other modifiers affects which geometry is
captured and animated. Apply matching at the layer whose size and position should
connect. If clipping or backgrounds jump, match or animate the relevant wrapper rather
than only the inner content.

Reduce the effect to position first when diagnosing. Then add size, clipping, and
decoration. Complex nested matches can conflict or become visually ambiguous.

### Navigation and Hero Motion

Matched transitions can clarify continuity from a collection item to detail. Do not
use them when the source might be offscreen, deleted, or unavailable without a fallback.
Navigation state remains authoritative and must work without the animation.

Preserve accessibility focus and avoid duplicate spoken elements during overlap.
Provide a reduced-motion alternative such as a fade or standard navigation transition.

### Performance

Custom shapes, masks, large images, blur, and many simultaneous matches can consume
layout and rendering budgets. Profile on target devices. Simplify paths, constrain
effect area, and avoid animating invisible elements.

Do not cache a path merely because it animates; every interpolated value may require a
different result. Cache invariant inputs or precompute stable geometry when measurement
shows benefit.

## Constraints and Guarantees

- Animatable values must support meaningful continuous interpolation.
- Custom animation code can run repeatedly per frame and must avoid side effects.
- Matched geometry requires stable IDs and namespace-scoped uniqueness.
- Matched visuals do not merge view identity, task lifetime, or model ownership.
- Correct navigation and accessibility cannot depend on the animation being available.

## Engineering Decisions

| Need | Mechanism |
|---|---|
| Animate custom numeric shape property | `@Animatable` type |
| Discrete multi-stage state | Phase animation |
| Relate source and destination frames | Matched geometry |
| Move one view without layout reflow | Transform or offset |
| Preserve sibling layout response | Animate layout values |
| Reduce Motion | Fade, simplify, or use standard transition |

## References

- [`Animatable`](https://developer.apple.com/documentation/swiftui/animatable)
- [`matchedGeometryEffect`](https://developer.apple.com/documentation/swiftui/view/matchedgeometryeffect%28id%3Ain%3Aproperties%3Aanchor%3Aissource%3A%29)
- [Explore SwiftUI animation](https://developer.apple.com/videos/play/wwdc2023/10156/)
- [Wind your way through advanced animations in SwiftUI](https://developer.apple.com/videos/play/wwdc2023/10157/)
