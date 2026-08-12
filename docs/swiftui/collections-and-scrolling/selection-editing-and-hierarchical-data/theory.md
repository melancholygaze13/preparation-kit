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
estimated_read_minutes: 7
status: reviewed
last_reviewed: 2026-08-12
tags:
  - selection
  - editing
  - outline-group
---

# Selection, Editing, and Hierarchical Data: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

**Selection** records which items the user chose. **Editing** inserts, deletes, moves,
or changes collection items. **Hierarchical data** arranges items as a tree of parents
and children rather than one flat sequence.

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

```swift
@State private var selectedIDs: Set<Project.ID> = []

List(projects, selection: $selectedIDs) { project in
    Text(project.name)
}
```

The exact interaction for multiple selection depends on platform, edit mode, keyboard,
and pointing-device support. Test the supported environments instead of assuming one
gesture works everywhere.

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

The 2027 SwiftUI releases add reordering to lists, stacks, grids, and custom layouts.
Mark the generated content as reorderable, then define the enclosing container's move
contract:

```swift
LazyVStack {
    ForEach(projects) { project in
        ProjectRow(project: project)
    }
    .reorderable()
}
.reorderContainer(for: Project.self) { difference in
    model.applyReorder(difference)
}
```

The identifiers for reordered items must be `Hashable` and `Sendable`.
`ReorderDifference` describes item IDs and their destination, so the model can
apply the intent even if synchronization changed array indices during the drag. For
several sections, use collection identifiers and define whether cross-section moves
are legal. These APIs are beta while the 2027 systems are in beta; keep existing
`onMove` or drag-and-drop behavior for earlier deployments.

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

For data whose children use the same node type, `OutlineGroup` can create the repeated
hierarchy:

```swift
struct Folder: Identifiable {
    let id: UUID
    var name: String
    var children: [Folder]?
}

OutlineGroup(folders, children: \.children) { folder in
    Label(folder.name, systemImage: "folder")
}
```

Here, `nil` means the value has no supplied child collection. A production model may
need an explicit enum to distinguish a true leaf from children that are not loaded,
currently loading, or failed.

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

On the 2027 platforms, `swipeActionsContainer()` coordinates swipe actions for
rows in a custom `ScrollView`, stack, grid, or layout. It keeps one row open and
dismisses actions on scrolling or outside taps. `List` already does this:

```swift
ScrollView {
    LazyVStack {
        ForEach(projects) { project in
            ProjectRow(project: project)
                .swipeActions {
                    Button("Delete", role: .destructive) {
                        model.delete(project.id)
                    }
                }
        }
    }
}
.swipeActionsContainer()
```

Swipe remains only one input path. Keep a menu, button, keyboard command, or named
accessibility action for essential operations.

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
- An index is valid only for the collection snapshot that produced it. Swift does not
  preserve its meaning after mutation.

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
- [Reordering items in lists, stacks, grids, and custom layouts](https://developer.apple.com/documentation/swiftui/reordering-items-in-lists-stacks-grids-and-custom-layouts)
- [`swipeActionsContainer`](https://developer.apple.com/documentation/swiftui/view/swipeactionscontainer%28%29)
- [SwiftUI updates](https://developer.apple.com/documentation/updates/swiftui)
- [Displaying data in lists](https://developer.apple.com/documentation/swiftui/displaying-data-in-lists)
- [Bringing robust navigation structure to your SwiftUI app](https://developer.apple.com/videos/play/wwdc2022/10054/)
