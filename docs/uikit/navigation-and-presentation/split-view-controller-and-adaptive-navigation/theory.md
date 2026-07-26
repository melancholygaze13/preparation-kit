---
title: "Split View Controller and Adaptive Navigation: Theory"
domain: "UIKit"
topic: "Navigation and Presentation"
concept: "Split View Controller and Adaptive Navigation"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-07-26
---

# Split View Controller and Adaptive Navigation: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

`UISplitViewController` is an adaptive container for related navigation columns.
It is useful when users benefit from seeing context and detail together, such as
mailboxes and messages, sidebars and documents, or settings categories and
panels.

The key design rule is that columns are a presentation of navigation state. The
app still needs explicit state for selection, detail identity, and restoration.

## Columns and Meaning

Modern split navigation often uses sidebar, content, and detail roles. The exact
number of visible columns can change with width, presentation style, and device
context.

Create the container, then assign one controller to each column role. The
split view controller owns those children:

```swift
let split = UISplitViewController(style: .tripleColumn)

let accounts = UINavigationController(
    rootViewController: AccountListViewController(store: store)
)
let messages = UINavigationController(
    rootViewController: MessageListViewController(store: store)
)
let detail = UINavigationController(
    rootViewController: EmptyMessageViewController()
)

split.setViewController(accounts, for: .primary)
split.setViewController(messages, for: .supplementary)
split.setViewController(detail, for: .secondary)
```

`primary` usually holds the broadest navigation level, `supplementary` the next
selection level, and `secondary` the detail. Those names describe roles, not a
promise that three columns are visible.

Do not make business state depend on a column being visible. For example, the
selected account, selected folder, and selected message should be model or route
state. The split view reads that state and displays the right columns when space
allows.

## Collapse and Expansion

In compact space, a split interface may collapse into a stack-like experience.
When it expands again, the app should restore the user's context. That means a
selected item should still select the correct detail, and a missing detail should
show a useful placeholder or empty state.

Deep links also need complete navigation meaning. A link to a document should set
the sidebar selection and the detail route, not only show a detail controller
with no context.

When a child requests navigation, prefer adaptive container operations such as
`show(_:sender:)` or `showDetailViewController(_:sender:)` when they express the
intent. UIKit can then choose a column or a compact navigation path. Directly
pushing onto a guessed visible stack ties the feature to one current layout.

The split view delegate can influence collapse, expansion, and the top column in
compact mode. Add delegate policy only when the default loses important context.
Keep the selected IDs in route state either way; delegate callbacks are about
presentation, not the source of truth.

## Engineering Decisions

Use split navigation when the task benefits from persistent context or
side-by-side comparison. Avoid it when a simple stack would be faster and clearer
on every target device.

| Fit | Not a fit |
|---|---|
| Mail, files, settings, dashboards | Short linear checkout |
| Frequent switching between items | One-off modal edit |
| iPad, Mac Catalyst, external display support | Phone-only flow with no context |

At Staff and Principal scope, split navigation is also a state-management
problem. Teams should define route state in a way that works for compact stacks,
wide split layouts, and restoration.

## Production Application

The common failure is tying detail state to a visible controller instance. That
breaks when columns collapse, controllers are recreated, or a scene is restored.
Prefer route state such as selected IDs and mode flags.

Test split navigation across width changes, scene restoration, deep links, empty
states, and deletion of the selected item. Deleting the selected item should
choose a clear next state instead of leaving a stale detail screen.

## References

- [UISplitViewController](https://developer.apple.com/documentation/uikit/uisplitviewcontroller)
- [View Controller Programming Guide: The View Controller Hierarchy](https://developer.apple.com/library/archive/featuredarticles/ViewControllerPGforiPhoneOS/TheViewControllerHierarchy.html)
- [View Controller Programming Guide: The Adaptive Model](https://developer.apple.com/library/archive/featuredarticles/ViewControllerPGforiPhoneOS/TheAdaptiveModel.html)
