---
title: "NavigationSplitView and Multicolumn Flows: Theory"
domain: "SwiftUI"
topic: "Navigation and Presentation"
concept: "NavigationSplitView and Multicolumn Flows"
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
  - navigation-split-view
  - adaptive-navigation
  - selection
---

# NavigationSplitView and Multicolumn Flows: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

`NavigationSplitView` presents two or three related columns. Leading-column
selection determines trailing-column content. In a narrow environment, SwiftUI can
collapse the columns into a single stack, but the application should retain one
coherent selection model.

```text
sidebar selection -> content selection -> detail
       expanded columns | collapsed stack
```

Adaptive navigation is not two unrelated implementations. It is one navigation
state rendered differently for the available environment.

## How It Works

### Selection Drives Columns

A two-column flow commonly binds a `List` selection and derives detail content:

```swift
@State private var selectedProjectID: Project.ID?

var body: some View {
    NavigationSplitView {
        List(projects, selection: $selectedProjectID) { project in
            NavigationLink(project.name, value: project.id)
        }
        .navigationTitle("Projects")
    } detail: {
        if let id = selectedProjectID {
            ProjectDetail(id: id)
        } else {
            ContentUnavailableView("Select a project", systemImage: "folder")
        }
    }
}
```

For three columns, the sidebar selection usually scopes content data, and the
content selection determines detail. When a parent selection changes, clear or
revalidate dependent selections. Otherwise, detail can show an item that does not
belong to the visible content context.

Use stable identifiers as selections and resolve current models from a repository.
An optional selection naturally represents the empty-detail state. On platforms
where multiple selection is appropriate, the selection type can be a set and the
detail policy must define how to represent that set.

Default selection is a product choice. Selecting the first item can reduce an empty
detail on wide screens, but doing it unconditionally can fight compact back
navigation or override restoration. Apply defaults only when loading is complete,
no valid restored or linked selection exists, and the current presentation policy
calls for one.

### Collapse and Compact Navigation

In narrow contexts, a split view collapses into one stack. SwiftUI usually chooses
which column appears, and value-based links support the compact push behavior. The
same state must make sense in both forms.

Test the transition from expanded to compact and back. A selected detail might be
visible as the top compact screen, while the back action reveals content or sidebar.
When the user backs out, bindings can change. Do not immediately restore a cleared
selection in `onAppear`, or the user can become unable to navigate back.

`preferredCompactColumn` lets the app express which column should appear on top in
the collapsed form. It is a preference within the container's behavior, not a
replacement for valid selection state. Use it for deliberate entry points such as a
deep link to detail, and observe how user navigation changes the binding.

### Column Visibility

Bind `NavigationSplitViewVisibility` when the app needs to request `.all`,
`.doubleColumn`, `.detailOnly`, or `.automatic`. Platform behavior varies, and not
every option is honored everywhere. The split view ignores expanded-column
visibility when it is collapsed.

Column visibility is presentation preference, not domain state. Hiding a sidebar
should not erase selection. Conversely, changing selection solely because a column
became hidden can destroy context when it reappears.

Column width modifiers also express preferred minimum, ideal, and maximum widths.
The system can adjust them for the window and platform. Design content that remains
valid outside the ideal width instead of relying on exact geometry.

Search, toolbar items, and navigation titles should be attached to the column whose
content they affect. A sidebar search may filter top-level collections, while a
content-column search filters children of the current selection. Explicit placement
keeps commands understandable when columns are visible together and when they are
collapsed.

### Nested Stacks

Each column already participates in split-view navigation. Add a `NavigationStack`
inside a detail column when that column has an independent push sequence, such as a
detail screen that drills into related records. Keep the nested path scoped to that
column.

Do not wrap the entire `NavigationSplitView` in another stack by habit. Nested
containers can produce unclear toolbar ownership, duplicate navigation bars, and
state that does not correspond to columns. Start with selection-driven split
navigation, then add the smallest path that represents a real nested flow.

### Deep Links and Restoration

A deep link into a three-column hierarchy should set the entire chain: sidebar
selection, content selection, and any nested detail path. Apply compatible values
as one state transition. If a project or child item no longer exists, keep the
longest valid prefix and show an intentional empty or unavailable state.

Restore selections and paths as stable IDs. Restore column visibility only when it
represents a meaningful user preference; automatic behavior is often more robust
across a different device or window size. Revalidate every selection after loading
current data.

### Ownership Across Features

The split-view root owns relationships between columns. Individual features own
their internal views and can emit selection or route intents. Avoid making detail
views read an unrelated global sidebar selection directly. Pass the selected ID or
a feature-scoped model through a clear boundary.

Represent dependent selection changes as one model operation. When a sidebar item
changes, the operation can validate a remembered child, choose a permitted default,
or clear it. Several independent `onChange` handlers can expose transient invalid
combinations and make deep links depend on callback ordering.

### Mutation and Empty States

List updates can invalidate any selected level. If a selected item is deleted, move
to a predictable sibling, parent, or empty state according to product policy. Do not
leave detail displaying a cached object that no longer exists in the current list.
The same rule applies when filtering hides a selection: decide whether filtering
preserves a hidden selection or clears it.

Each column needs a useful loading, empty, unavailable, and error state. These are
navigation outcomes, not only visual placeholders. A deep link may validly select a
parent while its children fail to load, and the user must retain a path back to
recover.

For multiwindow apps, each scene gets separate selection, visibility, and nested
paths. A global singleton would cause one window's selection to alter another.

## Constraints and Guarantees

- A split view presents two or three columns and can collapse in narrow contexts.
- Column visibility options are preferences with platform-specific behavior.
- Preferred compact column influences collapsed presentation but does not replace
  selection and path state.
- Column width requests can be adjusted by the system.
- Selection values must remain stable and valid for their lists.
- Expanded-to-compact transitions preserve application state only as well as the
  application's selection model allows.

## Engineering Decisions

| Need | Design |
|---|---|
| Master-detail flow | Two columns with optional stable selection |
| Hierarchical browser | Three columns with dependent selections |
| Detail-specific drill-down | Nested detail path owned by detail column |
| Deep link to leaf | Set full selection chain and nested path |
| User hides sidebar | Preserve selection; store visibility only if valuable |
| Parent selection changes | Clear or validate dependent selection atomically |

## Production Application

Test on iPhone, iPad, and supported desktop platforms; in narrow and wide windows;
and through live resize or rotation. Cover keyboard selection, sidebar commands,
back gestures, detail deletion, empty data, deep links, restoration, and multiple
scenes. Verify toolbars and search fields belong to the intended column.

Model tests should generate selection transitions for changing parent data and
assert that every resulting chain is valid. UI tests then focus on framework
adaptation: which column is visible, how back navigation updates selection, and
whether titles, search, and toolbars move with the correct content.

At Staff scope, specify an adaptive navigation contract: stable selection IDs,
empty-state behavior, invalidation rules, deep-link translation, and ownership of
nested paths. This lets features compose without assuming a fixed device class.

## References

- [`NavigationSplitView`](https://developer.apple.com/documentation/swiftui/navigationsplitview)
- [`NavigationSplitViewVisibility`](https://developer.apple.com/documentation/swiftui/navigationsplitviewvisibility)
- [`NavigationSplitViewColumn`](https://developer.apple.com/documentation/swiftui/navigationsplitviewcolumn)
- [Bringing robust navigation structure to your SwiftUI app](https://developer.apple.com/videos/play/wwdc2022/10054/)
- [Migrating to new navigation types](https://developer.apple.com/documentation/swiftui/migrating-to-new-navigation-types)
