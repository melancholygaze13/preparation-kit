---
title: "Reusable Components and View Modifiers: Theory"
domain: "SwiftUI"
topic: "Component Design and Styling"
concept: "Reusable Components and View Modifiers"
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
  - reusable-components
  - view-modifier
  - component-api
---

# Reusable Components and View Modifiers: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A reusable component owns a meaningful visual and interaction contract. A
`ViewModifier` applies one reusable transformation to arbitrary content. Extract to
reduce conceptual duplication, not merely repeated syntax.

The API should expose semantic variation and preserve SwiftUI composition. It should
not leak one feature's model, navigation, or infrastructure into every caller.

## How It Works

### Choose the Abstraction

Use a dedicated `View` when the element has structure, interaction, content slots, or
its own accessibility behavior. Use a `ViewModifier` when callers keep their content
and apply the same decoration or behavior. Use a style protocol when customizing a
family of semantic controls while preserving control state.

Small private repetition can remain local until a stable concept emerges. Premature
public components accumulate options and compatibility cost.

### Component Inputs

Prefer semantic values and actions:

```swift
struct StatusCard<Content: View>: View {
    let title: LocalizedStringKey
    let status: Status
    @ViewBuilder let content: Content

    var body: some View { /* composition */ }
}
```

Pass the entire feature model only when the component is feature-specific and shares
that state machine. Generic rows, cards, and controls are easier to preview and reuse
with small values, bindings, and action closures.

Bindings expose direct mutation authority. Use them for genuine two-way editing.
Use semantic actions for submit, delete, retry, or navigation intent so the feature
retains policy.

### Content Builders

Generic `@ViewBuilder` content lets callers supply structure without `AnyView`. Store
the built content value when deferred construction is unnecessary:

```swift
struct Card<Content: View>: View {
    @ViewBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading) { content }
            .padding()
            .background(.background.secondary)
            .clipShape(.rect(cornerRadius: 12))
    }
}
```

Too many generic slots can make call sites and diagnostics difficult. Provide the
smallest slots matching real variation. A configuration value or optional accessory
may be clearer than several nested builders.

### View Modifiers

A modifier works well for shared decoration, loading overlays, focus behavior, or
small cross-cutting presentation:

```swift
struct CardSurface: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding()
            .background(.background.secondary)
            .clipShape(.rect(cornerRadius: 12))
    }
}
```

Expose a named `View` extension for discoverability. Keep order explicit because the
modifier wraps the state at its application point. Avoid modifiers that secretly
perform networking, own navigation, or depend on distant global state.

### Preserve Semantics

Build reusable actions from `Button`, toggles from `Toggle`, and selections from
`Picker`. Styling a semantic control retains accessibility, keyboard, focus, enabled,
role, and platform behavior that a gesture-based imitation must rebuild.

A component API includes labels, roles, disabled and loading behavior, Dynamic Type,
localization, right-to-left layout, contrast, reduced motion, pointer, and keyboard
behavior. Visual consistency without semantic consistency is incomplete reuse.

### Adaptation and Layout

Do not bake screen bounds or fixed device assumptions into a shared component. Accept
the parent proposal and use adaptive layout. Fixed dimensions are safe only for
content whose size contract is controlled and accessibility requirements still fit.

Use system text styles and `Label` where they express semantics. Prefer hierarchical
styles and asset colors that adapt. A component should document supported content
length, size range, and overflow policy.

### State Ownership

Keep temporary state private when the component owns it, such as disclosure or hover.
Expose a binding when the caller must coordinate or restore it. Do not copy an input
binding into local state unless it represents a deliberate draft with commit semantics.

Async work belongs to the feature or a model with the correct lifetime. A reusable
image component may call an image pipeline, but its cancellation, caching, and error
contract must be explicit.

### API Evolution

Start internal. Promote a component after multiple use cases confirm the shared
contract. Prefer semantic variants over Boolean combinations such as `compact`,
`outlined`, `dense`, and `special`, which can represent unsupported combinations.

For a shared package, use access control, previews, snapshot or visual regression
coverage where appropriate, and a deprecation path. Keep feature-specific policy out
of the design-system API.

## Constraints and Guarantees

- Generic content preserves static view types but can increase API complexity.
- Modifier order remains visible at the call site and affects behavior.
- Reuse does not guarantee performance; shared components still need realistic profiling.
- Standard controls provide semantics that custom gestures do not automatically replicate.
- Public component APIs create compatibility and ownership obligations.

## Engineering Decisions

| Repeated need | Abstraction |
|---|---|
| Structured visual element | Dedicated `View` |
| Transformation of arbitrary content | `ViewModifier` |
| Appearance of semantic controls | Style protocol |
| Feature-specific child | Feature view with model or scoped state |
| Small one-off composition | Keep local |
| Cross-team shared primitive | Versioned component with owner and tests |

## References

- [`ViewModifier`](https://developer.apple.com/documentation/swiftui/viewmodifier)
- [View styles](https://developer.apple.com/documentation/swiftui/view-styles)
- [Creating performant scrollable stacks](https://developer.apple.com/documentation/swiftui/creating-performant-scrollable-stacks)
- [Build an app with SwiftUI](https://developer.apple.com/videos/play/wwdc2022/10052/)
