---
title: "Invalidation and Body Recomputation: Theory"
domain: "SwiftUI"
topic: "Performance and Diagnostics"
concept: "Invalidation and Body Recomputation"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 8
status: reviewed
last_reviewed: 2026-06-23
tags:
  - invalidation
  - body-recomputation
  - observation
---

# Invalidation and Body Recomputation: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

SwiftUI view values are descriptions. When a tracked dependency changes, SwiftUI
invalidates dependent views, reevaluates their `body`, compares the new description
with retained framework state, and applies necessary updates.

A `body` call is not equivalent to recreating every underlying view or redrawing the
whole screen. Optimize the expensive work and excessive propagation revealed by
measurement, not recomputation itself.

## How It Works

### Dependency Tracking

SwiftUI records dynamic properties and observable values read while evaluating a
view. A change can invalidate the consumers of that value. With Observation, property
access can narrow updates compared with broadcasting every change from an entire object.

Read state as close as practical to the view that needs it. A root view that reads a
rapidly changing timer and passes only a derived Boolean can still become the update
source for a large subtree. A focused child reading the timer may limit reevaluation.

Do not split views mechanically. A dedicated `View` type creates a clearer dependency
and identity boundary than a computed `some View` property on the same parent, but the
split should also improve ownership or readability.

### Keep Evaluation Cheap

`body` can run frequently. It must not perform I/O, mutate state, start tasks, decode
data, or execute expensive sorting and filtering:

```swift
var body: some View {
    List(model.visibleItems) { item in
        ItemRow(item: item)
    }
}
```

The model or a stable derived-value owner computes `visibleItems` when its inputs
change. Small pure expressions are appropriate in `body`; moving every condition into
a class merely adds indirection.

View initializers are also part of the hot construction path. They should assign
inputs, not synchronously load or transform them. Start async work in `.task` and
commit results to owned state.

### Structural Identity

Changing structure can replace a subtree and its associated state:

```swift
if isEnabled {
    Label("Account", systemImage: "person")
} else {
    Label("Account", systemImage: "person")
        .opacity(0.5)
}
```

When only a modifier value changes, prefer one stable structure:

```swift
Label("Account", systemImage: "person")
    .opacity(isEnabled ? 1 : 0.5)
```

Conditional branches remain correct when they represent genuinely different UI.
Do not contort unrelated screens into one modifier chain merely to preserve identity.

Avoid `AnyView` in frequently updated collections unless type erasure is required at
an API boundary. Generics, `@ViewBuilder`, and `Group` preserve more structural
information. Measure before treating isolated `AnyView` use as a bottleneck.

### Data Identity

`ForEach` and `List` use IDs to associate new values with retained row state. IDs must
be unique and stable for the logical entity. Array offsets and regenerated UUIDs make
insertion look like widespread replacement, reset row state, and increase work.

Identity is not full equality. An item keeps the same ID while its title changes.
Mutable display fields should not participate in identity unless changing them truly
creates a different entity.

### Observation Scope

Passing a large observable model is not automatically slow. Cost depends on which
properties a view reads and what work follows invalidation. However, a view that
reads many unrelated properties becomes coupled to their update rates.

Project small value inputs into reusable leaves. Keep feature-specific children on
the model when they legitimately participate in the same state machine. Do not
duplicate observable values into local state merely to avoid updates; that creates
stale synchronization problems.

### Equality as an Optimization

Equatable view comparison can skip work when inputs compare equal, but it adds an
equality contract and comparison cost. Use it only after a trace identifies repeated
expensive reevaluation with unchanged relevant inputs. Incorrect equality can leave
the UI stale.

Prefer fixing broad dependency reads, unstable identity, or expensive work first.
They address cause rather than adding a manual skip over unclear inputs.

### Transactions and Animation

Animations can make updates more expensive because layout and drawing occur across
many frames. An animation applied too high in the hierarchy can animate unrelated
changes. Scope animation to the value and subtree that need it.

A transition intentionally inserts or removes structure. Preserve identity for state
that should survive; use a transition when replacement is the desired behavior.

### Closure and Component Construction

Reusable generic components should generally store their already built content value
rather than an escaping `@ViewBuilder` closure that they invoke repeatedly. This makes
the component a straightforward view value and avoids extending captures without need.

```swift
struct Card<Content: View>: View {
    @ViewBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading) { content }
            .padding()
    }
}
```

This is an API design preference, not a universal performance rule. A container that
semantically needs deferred content construction may store a closure. Make capture
and invocation lifetime deliberate, and profile frequently repeated container paths.

### Update Frequency and Input Rate

Sometimes dependency scope is correct but the producer emits faster than the UI can
usefully present. Coalesce progress, location, sensor, or typing updates according to
domain semantics. Prefer the latest value when intermediate values have no meaning;
preserve every value only when correctness requires it.

Rate control belongs near the producer or feature model, not as random throttles in
leaf views. It reduces repeated state transitions while keeping rendering code simple.

### Diagnosing Updates

Reproduce the slow interaction, then inspect SwiftUI update causes and Time Profiler
samples. Ask:

1. Which state changes?
2. Which views depend on it?
3. How often are they reevaluated?
4. What synchronous work runs in those evaluations?
5. Does identity cause replacement or state loss?
6. Does the update trigger costly layout or rendering?

Temporary counters or `Self._printChanges()` can help local debugging, but underscored
APIs are diagnostic tools, not production contracts. Instruments provides stronger
evidence about duration and call stacks.

Also inspect the cause of the mutation itself. A timer that publishes while its screen
is inactive, a repository that replaces equal arrays, or a binding setter that writes
on every keystroke can create valid but unnecessary update traffic upstream.

## Constraints and Guarantees

- SwiftUI may evaluate `body` whenever required; call count is not an application contract.
- View values are transient descriptions while framework-managed state persists by identity.
- Observation tracks accessed properties, but dependency scope still follows view structure.
- Stable IDs preserve logical association; they do not guarantee a row avoids reevaluation.
- Skipping updates through equality is safe only when equality covers every rendered input.

## Engineering Decisions

| Symptom | First investigation |
|---|---|
| Parent updates on every tick | Move dependency read closer to consumer |
| Rows lose state after insertion | Verify stable entity IDs |
| `body` is CPU-heavy | Move repeated transform to input-change boundary |
| Large subtree changes type | Check structural branches and type erasure |
| Animation hitches | Narrow animated value and profile layout/render work |
| Repeated equal inputs are expensive | Consider equality only after measurement |

## Production Application

Profile the same interaction in a release-like build with realistic update rates.
Record signposts for product events so update traces can be tied to user actions.
Compare before and after using the same device, data, and gesture.

At Staff scope, provide shared diagnostics and performance budgets rather than rules
such as “body may run only once.” Review state ownership and identity in component
APIs so teams avoid common propagation problems without premature micro-optimization.

## References

- [Understanding and improving SwiftUI performance](https://developer.apple.com/documentation/swiftui/understanding-and-improving-swiftui-performance)
- [Demystify SwiftUI performance](https://developer.apple.com/videos/play/wwdc2023/10160/)
- [Optimize SwiftUI performance with Instruments](https://developer.apple.com/videos/play/wwdc2025/306/)
- [Discover Observation in SwiftUI](https://developer.apple.com/videos/play/wwdc2023/10149/)
