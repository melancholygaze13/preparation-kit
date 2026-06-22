---
title: "View Identity and Lifetime: Theory"
domain: "SwiftUI"
topic: "View System and Rendering"
concept: "View Identity and Lifetime"
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
  - view-identity
  - state-lifetime
  - identifiable
---

# View Identity and Lifetime: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

SwiftUI creates many short-lived values from a view declaration. Identity connects
the values that represent one conceptual UI element over time:

```text
same identity + new value -> update the existing element
new identity              -> remove one element and insert another
```

The lifetime of framework-managed state follows that identity. When identity ends,
local state and other identity-scoped resources end with it.

## How It Works

### Value, Identity, and Lifetime Are Different

A view value is one description produced for the current inputs. SwiftUI can
replace that value during the next update while treating both values as the same
view. This continuity is what lets a text field retain its edit state or a toggle
remain on while surrounding values change.

Identity does not mean object identity for the view struct. SwiftUI views are
usually values without a stable pointer. The framework derives identity from
structure or from identifiers supplied by the application.

A view's lifetime lasts while its identity remains present in the hierarchy. The
exact storage and reconciliation implementation is private. Code should depend on
the documented effects of identity, not internal graph layout.

### Structural Identity

SwiftUI normally identifies a view by its concrete type and position in the view
hierarchy. This is structural identity:

```swift
VStack {
    AccountHeader(account: account)
    ActivityList(items: activity)
}
```

The header and list occupy different structural positions and have different
types. Re-evaluating this body with new values normally preserves each position's
identity.

Control flow becomes part of the structure. These branches represent distinct
identities even though both construct `EditorView`:

```swift
if isEditing {
    EditorView(mode: .editing)
} else {
    EditorView(mode: .readOnly)
}
```

Switching branches removes one identity and inserts the other. Any local state in
`EditorView` resets. That is correct when the branches represent distinct elements.
When they are two configurations of the same element, preserve structure and vary
the input or modifier instead:

```swift
EditorView(mode: isEditing ? .editing : .readOnly)
```

This is a semantic choice, not a rule to remove every conditional. Distinct login
and account screens should usually have distinct identities. A button changing
between enabled and disabled should normally retain one identity.

### Explicit Identity

Data-driven containers need identity that survives insertion, deletion, movement,
and sorting. `ForEach` uses an element's `Identifiable.ID` or an explicit `id` key
path:

```swift
struct Message: Identifiable {
    let id: MessageID
    let author: String
    let body: String
}

ForEach(messages) { message in
    MessageRow(message: message)
}
```

The identifier should represent the domain entity. A database primary key or
server-issued immutable ID is usually appropriate. The ID must stay stable while
the data represents the same entity and must be unique among siblings in that
container.

Position is not entity identity. Using array indices for editable or reorderable
data can associate row state with the wrong element after an insertion or move.
Likewise, a computed `UUID()` creates a new identity on every access and turns
updates into replacements. `\.self` is suitable only when each value is unique and
the entire value is its stable identity.

### State Storage Follows Identity

`@State` declares storage managed by SwiftUI. The initial value is used when the
storage is first created for a view identity. Later body evaluations retrieve the
existing storage:

```swift
struct DraftEditor: View {
    @State private var text = ""

    var body: some View {
        TextField("Draft", text: $text)
    }
}
```

Changing an unrelated parent input creates a new `DraftEditor` value but normally
preserves `text` because the identity remains. Removing the editor, switching to a
different structural branch, or changing an attached `.id` ends that state
lifetime.

This also explains why state initialized from a parent value is not a live copy of
that input. The initializer can provide the first value for a new identity; it does
not overwrite established state on every parent update. If the parent owns the
truth, pass a value or binding. If the child intentionally owns a draft, define
when that draft resets or synchronizes.

### Using id(_:) Deliberately

The `.id(value)` modifier binds a view's identity to a hashable value. When the
value changes, SwiftUI resets that view's identity and state:

```swift
EditorView(document: document)
    .id(document.id)
```

This can be correct when changing documents should create a fresh editor session.
It can also destroy in-progress input, focus, scroll position, animations, and
identity-scoped tasks. Do not add `.id(UUID())` to force refreshes. Fix missing
observation or ownership instead.

Some APIs also use IDs as references, such as scrolling to an element. That use
still requires stable, unique identifiers, but an ID does not globally identify a
view outside the relevant container or API scope.

### Lifetime Affects More Than State

Identity influences insertion and removal transitions, animation continuity,
focus, and the lifecycle of view-scoped asynchronous work. A task created with
`.task` is cancelled when its view disappears; changing identity can therefore
cancel and restart the task. Cancellation remains cooperative, so model operations
must still handle it correctly and prevent stale results.

`onAppear` and `onDisappear` are visibility-related event hooks, not constructors
or destructors for the view struct. They can run more than once during a conceptual
screen flow. Put durable application data in a model or persistence layer rather
than relying on view identity to preserve it.

## Constraints and Guarantees

- Every view has identity, whether structural or explicitly supplied.
- Structural identity depends on concrete type and position in the hierarchy.
- Changing the value passed to `.id` resets the identity and associated state.
- A `ForEach` element whose ID changes loses the generated content's state and
  animation continuity.
- `@State` storage is local to a view identity and is not persistent application
  storage.
- SwiftUI does not guarantee a particular internal diffing algorithm, platform-
  view reuse strategy, or event-hook count.

## Engineering Decisions

| Situation | Identity decision |
|---|---|
| Same element, different styling or mode | Preserve structure; vary values or modifiers |
| Mutually exclusive conceptual screens | Separate structural branches are appropriate |
| Rows represent domain entities | Use stable domain IDs |
| Static, immutable unique values | `\.self` can be sufficient |
| Reset local state for a new session | Change `.id` intentionally at the session boundary |
| UI fails to update | Repair observation; do not randomize identity |

Make reset behavior explicit in component APIs. A reusable editor should document
whether a model change preserves the draft, merges it, asks for confirmation, or
starts a new session. At Staff and Principal scope, identity policy belongs in
shared collection, navigation, and design-system conventions because a poor ID can
produce data loss and incorrect actions across many features.

## Production Application

Identity bugs often appear as lost text, rows displaying another row's state,
incorrect animations, repeated loads, or focus and scroll jumps. Reproduce them
with insertion, deletion, reordering, filtering, duplicate data, and rapid
navigation. Log stable domain IDs and lifecycle events when diagnosis requires it;
do not use transient view addresses as identifiers.

Test reducers and models separately from identity behavior. Focused UI tests should
verify that editing follows the intended entity through list changes and that
switching sessions resets only the state that should reset. Migration from unstable
IDs may invalidate cached UI state, restoration data, or navigation paths, so
coordinate the identifier contract across persistence and deep-link boundaries.

## References

- [Demystify SwiftUI](https://developer.apple.com/videos/play/wwdc2021/10022/)
- [`id(_:)`](https://developer.apple.com/documentation/swiftui/view/id%28_%3A%29)
- [`ForEach`](https://developer.apple.com/documentation/swiftui/foreach)
- [`ForEach.init(_:content:)`](https://developer.apple.com/documentation/swiftui/foreach/init%28_%3Acontent%3A%29-6oy5i)
- [`State`](https://developer.apple.com/documentation/swiftui/state)
- [Managing user interface state](https://developer.apple.com/documentation/swiftui/managing-user-interface-state)
