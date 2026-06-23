---
title: "Selection, Editing, and Hierarchical Data: Theory"
domain: "SwiftUI"
topic: "Collections and Scrolling"
concept: "Selection, Editing, and Hierarchical Data"
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
  - selection
  - editing
  - outline-group
---

# Selection, Editing, and Hierarchical Data: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Collection interaction is state over stable IDs. Single selection is usually an
optional ID; multiple selection is a set of IDs; expansion is a set of node IDs.
The collection owner keeps those values valid when data changes.

Index sets are temporary UI coordinates. Convert them to stable model operations
before asynchronous work or further collection mutation.

## How It Works

### Selection

Bind `List` selection to the appropriate value:

```swift
@State private var selectedID: Project.ID?

List(projects, selection: $selectedID) { project in
    NavigationLink(project.name, value: project.id)
}
```

A set supports multiple selection where platform and product semantics allow it.
Selection state belongs to the flow that coordinates detail, commands, or navigation,
not necessarily the row.

When selected data is deleted, filtered, becomes unauthorized, or moves under a
different parent, validate the selection. Choose a nearby item, clear it, or show an
unavailable detail according to product policy.

### Editing and Index Sets

`onDelete` and `onMove` callbacks commonly provide indices into the exact displayed
collection. If the view shows a filtered or sorted projection, those indices are not
indices into the source array.

Capture stable IDs from the displayed projection and send them to the model:

```swift
func delete(at offsets: IndexSet) {
    let ids = offsets.map { visibleItems[$0].id }
    model.delete(ids: ids)
}
```

The model performs authorization, persistence, optimistic update, rollback, and
selection repair. Never retain offsets across an `await`; the collection can change.

For moves, define whether order is global, within a filter, or within a parent. A
displayed move may need fractional positions or a server reorder operation rather
than direct source-array mutation.

### Optimistic Mutation

Optimistic delete or reorder improves responsiveness when failure is rare and
reversal is safe. Keep enough information to roll back, associate the result with the
operation, and prevent an old failure from undoing newer edits.

For destructive or high-risk operations, confirm before commit and use idempotency.
An error should identify what remained or was restored rather than leaving selection
pointing to missing content.

### Hierarchical Data

`OutlineGroup`, disclosure-based lists, and hierarchical initializers represent trees
whose nodes have stable IDs and optional children. Distinguish a leaf from a node whose
children have not loaded yet; `nil`, empty, and loading can have different meanings.

Store expansion by node ID when it must survive updates or restoration. If a parent
is removed, clear descendant selection and expansion state. For very large trees,
load children on demand and cache according to ownership and freshness policy.

Avoid recursively flattening a large tree during every `body` evaluation. Compute the
visible projection when tree or expansion inputs change, preserving node identity.

### Navigation and Multicolumn Flows

In a split view, sidebar selection scopes content selection, which scopes detail.
Changing a parent validates descendants in one transition. The same IDs should remain
meaningful when the split view collapses into compact navigation.

Deep links set the complete valid chain. Restoration keeps the longest valid prefix
when a node no longer exists.

### Commands and Accessibility

Editing may come from swipe actions, context menus, keyboard commands, toolbar buttons,
drag and drop, or assistive technology. Route every entry point through the same model
operation so validation and analytics remain consistent.

Custom rows need clear selection and editing labels, adequate targets, and correct
focus. Do not hide critical operations behind gestures alone. Test keyboard and
VoiceOver behavior on platforms the feature supports.

### Performance

Large selection sets and trees should use hashable stable IDs. Update only affected
branches and avoid copying full model graphs into each row. Image, layout, and row
work remain subject to the same scroll-performance constraints as flat lists.

Batch model changes where domain semantics allow, but preserve intermediate user
feedback for long operations. Profile expansion and collapse with realistic depth.

## Constraints and Guarantees

- Selection bindings identify values; collection membership can still invalidate them.
- Delete and move offsets refer to the displayed collection at callback time.
- Platform editing and multiple-selection behavior varies with environment and input device.
- Hierarchical IDs must be unique within the rendered tree.
- Expansion, navigation, and domain ownership are application policies, not inferred automatically.

## Engineering Decisions

| Situation | State or operation |
|---|---|
| Single detail selection | Optional stable ID |
| Multiple command targets | Set of stable IDs |
| Delete filtered rows | Convert offsets to IDs immediately |
| Persist user order | Model/server reorder contract |
| Lazy hierarchy | Explicit unloaded/loading/loaded child state |
| Parent changes | Validate child selection and expansion atomically |

## References

- [`List`](https://developer.apple.com/documentation/swiftui/list)
- [`OutlineGroup`](https://developer.apple.com/documentation/swiftui/outlinegroup)
- [Displaying data in lists](https://developer.apple.com/documentation/swiftui/displaying-data-in-lists)
- [Bringing robust navigation structure to your SwiftUI app](https://developer.apple.com/videos/play/wwdc2022/10054/)
