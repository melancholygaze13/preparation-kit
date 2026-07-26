---
title: "Drag and Drop, Context Menus, and Haptics: Theory"
domain: "UIKit"
topic: "Animation, Transitions, and Interaction"
concept: "Drag and Drop, Context Menus, and Haptics"
page_type: theory
levels:
  - senior
  - staff
interview_priority: situational
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-07-26
---

# Drag and Drop, Context Menus, and Haptics: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

UIKit handles the standard gestures, previews, animation, and input adaptation.
App code decides what data can move, which actions are allowed, and what result to
show. Dragging or a hidden menu must not be the only way to perform an important
task.

## Drag Data, Not View Objects

A `UIDragItem` wraps an `NSItemProvider`. The provider describes transferable data
that may cross process boundaries. Export a stable representation with an accurate
type identifier, and validate imported data before using it.

```swift
func dragItem(for document: Document) -> UIDragItem {
    let provider = NSItemProvider(object: document.title as NSString)
    let item = UIDragItem(itemProvider: provider)
    item.localObject = document.id
    return item
}
```

`localObject` is a same-process fast path for an ID or model reference. It cannot
replace the item provider because another app cannot access it.

On drop, decide whether the session is allowed and whether it means copy, move, or
cancel. Load an accepted representation asynchronously. Treat external data as
untrusted: validate type, size, decoding, authorization, and current destination
state. Do not mutate the durable model when the drag begins because a drag can leave
the app or cancel.

For lists, preserve stable item identity while rows move. Index paths can change
during a drag, so resolve the item by identity before committing.

## Define What a Drop Means

UIKit allows a move only within the same app and only when the drag session permits
it. Data shared with another app is copied. For an in-app move, validate and persist
the destination first, then remove the source after the move commits. The drag and
drop delegates must cooperate; UIKit does not move the model for you.

Offer another route through buttons, menus, keyboard commands, or accessibility drag
and drop descriptors. Precise dragging may not be available to every person or input
method.

## Context Menus Reflect Current State

Use `UIContextMenuInteraction` for a custom view, or list delegate APIs for items. A
configuration provides the preview and a menu of actions.

Build the menu from the selected item's current identity and permissions. The item
may change while the menu is visible, so revalidate important conditions when an
action runs. Mark destructive actions and keep the menu short and relevant.

Context menu actions are hidden by default. Important commands must also appear in
the main interface, an edit menu, or a keyboard-accessible command path. Do not use a
context menu as the only discovery path.

Keep action closures from retaining a screen or coordinator longer than intended.
The action should call a current command boundary rather than capture a stale index
path or a large view hierarchy.

## Haptics Communicate Meaning

Choose a feedback generator by event:

| Generator | Meaning |
|---|---|
| `UISelectionFeedbackGenerator` | Selection moved to another value |
| `UIImpactFeedbackGenerator` | Collision, snap, or physical impact |
| `UINotificationFeedbackGenerator` | Success, warning, or failure result |

Trigger feedback when the meaningful event happens, not at an unrelated animation
frame. For example, success feedback belongs after the operation succeeds.

Call `prepare()` shortly before a predictable event to reduce latency. Preparing and
triggering immediately gives the system no preparation time. Do not keep preparing
forever; it costs power and the system may return the engine to idle.

Haptic delivery is not guaranteed. Pair it with visual state, text, sound when
appropriate, or an accessibility announcement. Avoid duplicating feedback from a
system control.

## Production Decisions

Cells can be reused while a provider loads, and item permissions can change while a
menu is open. Resolve callbacks through stable identity and current policy.

Test provider encoding and decoding, copy versus move rules, invalid drops, stale
identity, and action permission changes. UI-test one representative drag or menu flow
on supported inputs. Verify accessible alternatives manually.

At Staff scope, define transferable schemas, action naming, haptic vocabulary, and
cross-app compatibility ownership. Shared helpers should express product meaning,
not expose arbitrary haptic intensity throughout the app.

## References

- [Data delivery with drag and drop](https://developer.apple.com/documentation/uikit/data-delivery-with-drag-and-drop)
- [`UIDropOperation.move`](https://developer.apple.com/documentation/uikit/uidropoperation/move)
- [Human Interface Guidelines: Drag and drop](https://developer.apple.com/design/human-interface-guidelines/drag-and-drop)
- [Adding context menus in your app](https://developer.apple.com/documentation/uikit/adding-context-menus-in-your-app)
- [Human Interface Guidelines: Context menus](https://developer.apple.com/design/human-interface-guidelines/context-menus)
- [`UIFeedbackGenerator`](https://developer.apple.com/documentation/uikit/uifeedbackgenerator)
