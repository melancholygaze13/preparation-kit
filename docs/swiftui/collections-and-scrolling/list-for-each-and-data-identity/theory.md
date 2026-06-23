---
title: "List, ForEach, and Data Identity: Theory"
domain: "SwiftUI"
topic: "Collections and Scrolling"
concept: "List, ForEach, and Data Identity"
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
  - list
  - foreach
  - identity
---

# List, ForEach, and Data Identity: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

`ForEach` maps identifiable data to repeated view descriptions. `List` is a
platform collection container with scrolling, row behavior, selection, editing, and
accessibility semantics. SwiftUI uses each data ID to associate new descriptions with
retained row state.

Identity answers “is this the same logical entity?” It is not the row's position or
the equality of every displayed field.

## How It Works

### Stable Domain IDs

Prefer `Identifiable` models with IDs supplied by the data source:

```swift
struct Message: Identifiable {
    let id: MessageID
    var subject: String
    var isRead: Bool
}

List(messages) { message in
    MessageRow(message: message)
}
```

The ID remains constant when the subject or read state changes. Do not create `UUID()`
in a computed `id`; every update would create new entities and reset row state.

Array offsets are appropriate only when position is true identity and the collection
cannot reorder, insert, or delete. For most domain lists, an offset changes meaning
after mutation and can attach state or animation to the wrong row.

IDs must also be unique in the relevant collection. Duplicate IDs make association
ambiguous and indicate the data should be normalized or given occurrence identity.

### Transform before Rendering

Filtering and sorting in the `List` initializer can repeat whenever the parent
evaluates:

```swift
List(model.visibleMessages) { message in
    MessageRow(message: message)
}
```

Compute the projection where its inputs change when the collection is large or the
transform is measured as expensive. Preserve the original entity IDs through sorting
and filtering. Do not store a derived copy in local state without invalidation for
source, query, locale, and sort policy.

### Row State and Mutation

Local row `@State` follows row identity. If the state represents domain truth, such
as whether a message is read, keep it in the model instead. Otherwise reused or
reconstructed rows can disagree with the source of truth.

For editable rows, a binding collection can give each row direct access to its model
value. Use semantic actions for operations with validation or side effects. A row
should emit `onDelete(message.id)` rather than changing unrelated loading or alert flags.

### List versus Custom Scroll Composition

Choose `List` when platform list semantics match: rows, separators, selection,
swipe actions, editing, sections, keyboard and accessibility behavior. Use a
`ScrollView` with lazy stacks or grids for custom composition that is not naturally a list.

Recreating list behavior manually adds work for focus, selection, accessibility,
editing, and platform adaptation. Conversely, forcing a visual canvas into `List`
can make layout customization harder. Choose semantics before microbenchmarking.

### Structural Identity inside Rows

Keep the row's structure stable when only a modifier value changes. Conditional
branches are correct for genuinely different content, but duplicating the same row
in two branches can replace local state and add update work.

Avoid `AnyView` in large changing collections unless an API boundary requires type
erasure. Prefer generics or `@ViewBuilder` so SwiftUI retains structural information.

### Updates and Animation

Apply insertions, deletions, moves, and content changes to the authoritative collection.
Stable IDs allow SwiftUI to associate those changes with rows. Animation describes
the transition; it cannot repair incorrect identity.

When the server returns a new page or snapshot, merge by ID and define update order,
duplicates, and deletions. Replacing the array is acceptable when identity remains
stable, but rebuilding IDs is not.

### Performance and Diagnostics

Rows should be cheap: no synchronous I/O, image decoding, broad geometry work, or
repeated large transforms. Dedicated row view types make dependencies clearer. Lazy
creation controls initial work but does not make an expensive row inexpensive.

When rows lose state, animate incorrectly, or update broadly, log stable IDs and
inspect the collection diff and SwiftUI update trace. Do not fix identity bugs with
manual index bookkeeping.

## Constraints and Guarantees

- `ForEach` requires stable identity for its data or an explicit ID key path.
- IDs associate logical values with retained framework state across updates.
- `List` behavior and appearance adapt by platform and environment.
- Row creation and appearance are framework-managed and not exactly-once events.
- Stable identity supports correct association but does not guarantee zero recomputation.

## Engineering Decisions

| Need | Choice |
|---|---|
| Platform collection behavior | `List` |
| Large custom vertical composition | `ScrollView` plus `LazyVStack` |
| Small fixed content | Eager stack may be simpler |
| Mutable domain row | Stable ID plus model-owned state |
| Expensive filtered projection | Derive at model/query boundary |
| Repeated visual occurrence of one entity | Separate stable occurrence identity if needed |

## References

- [`List`](https://developer.apple.com/documentation/swiftui/list)
- [`ForEach`](https://developer.apple.com/documentation/swiftui/foreach)
- [Demystify SwiftUI performance](https://developer.apple.com/videos/play/wwdc2023/10160/)
- [Displaying data in lists](https://developer.apple.com/documentation/swiftui/displaying-data-in-lists)
