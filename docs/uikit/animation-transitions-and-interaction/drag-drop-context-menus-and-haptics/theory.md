---
title: "Drag and Drop, Context Menus, and Haptics: Theory"
domain: "UIKit"
topic: "Animation, Transitions, and Interaction"
concept: "Drag and Drop, Context Menus, and Haptics"
page_type: theory
levels:
  - senior
  - staff
interview_priority: high
estimated_read_minutes: 6
status: reviewed
last_reviewed: 2026-07-10
---

# Drag and Drop, Context Menus, and Haptics: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Drag and drop, context menus, and haptics are system interaction layers. UIKit should
own the standard gesture recognition, preview, animation, and input adaptation. App
code should own the data contract, action policy, and semantic feedback.

These interactions enhance a feature. They should not become the only way to move
content, discover an action, or understand a result.

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

`localObject` is a same-process optimization. It can carry an ID or model reference
for a fast local path. It is not a substitute for the item provider because it is not
available to another app or process.

On drop, first decide whether the session is allowed and whether the proposal means
copy, move, or cancel. Then load an accepted representation asynchronously. Treat
external data as untrusted: validate type, size, decoding, authorization, and the
destination's current state.

Do not mutate the durable model when the drag begins. A drag can leave the app,
cancel, or land at another destination. Commit a move only after an accepted drop,
then render the list from the updated model or snapshot.

For table and collection views, use their drag and drop delegates. Preserve stable
item identity while rows move. Index paths can change during a drag, so resolve the
item by identity before committing the mutation.

## Make Drop Semantics Explicit

Users need predictable copy and move behavior. A same-container reorder commonly
moves; a cross-container or cross-app drop commonly copies. Destructive movement
needs a transaction that cannot lose the source when destination insertion fails.

A robust cross-boundary flow is:

1. Validate the proposed destination and representation.
2. Load and decode the transferable value.
3. Insert or persist the destination value.
4. Remove the source only when a move has committed.
5. Report failure without leaving half-applied UI state.

Support cancellation and progress for large asynchronous loads. Keep model updates
on their owning actor and UI updates on the main actor.

Offer another route through buttons, menus, keyboard commands, or accessibility drag
and drop descriptors. Precise dragging may not be available to every person or input
method.

## Context Menus Reflect Current State

Use `UIContextMenuInteraction` for a custom view, or table and collection view
delegate APIs for items. A `UIContextMenuConfiguration` can provide an identifier,
preview controller, and `UIMenu` of `UIAction` values.

Build the menu from the selected item's current identity and permissions. The item
may change while the menu is visible, so revalidate important conditions when an
action runs. Mark destructive actions and keep the menu short and relevant.

Context menu actions are hidden by default. Important commands must also appear in
the main interface, an edit menu, or a keyboard-accessible command path. Do not use a
context menu as the only discovery path.

Let UIKit animate the menu and preview. A `UITargetedPreview` can match the source
shape and visible parameters when customization is needed. Incorrect clipping makes
rounded content visibly change shape during the system transition.

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

Trigger feedback at the semantic event, not when an arbitrary animation starts. A
selection haptic belongs at the accepted selection change. An impact belongs where a
drag snaps into place. A success notification belongs after the operation succeeds.

Call `prepare()` shortly before a predictable event to reduce latency. Preparing and
triggering immediately gives the system no preparation time. Do not keep preparing
forever; it costs power and the system may return the engine to idle.

Haptic delivery is not guaranteed and may be unavailable. Never make it the only
confirmation. Pair it with visual state, text, sound when appropriate, or an
accessibility announcement. Avoid adding feedback where a system control already
provides it.

## Production Decisions

These interactions create lifecycle and async boundaries. A cell may be reused while
a provider loads. The underlying item may be deleted while a menu is open. A drop may
arrive after permissions change. Resolve every callback through stable identity and
current policy.

Test provider encoding and decoding, copy versus move rules, invalid drops, stale
identity, and action permission changes. UI-test one representative drag or menu flow
on supported inputs. Verify accessible alternatives manually.

At Staff scope, define transferable schemas, action naming, haptic vocabulary, and
ownership of cross-app compatibility. Schema evolution needs backward-compatible
decoding or a clear rejection path. A shared haptic helper should express meaning,
not expose arbitrary intensity calls throughout the app.

## References

- [Data delivery with drag and drop](https://developer.apple.com/documentation/uikit/data-delivery-with-drag-and-drop)
- [Human Interface Guidelines: Drag and drop](https://developer.apple.com/design/human-interface-guidelines/drag-and-drop)
- [Adding context menus in your app](https://developer.apple.com/documentation/uikit/adding-context-menus-in-your-app)
- [Human Interface Guidelines: Context menus](https://developer.apple.com/design/human-interface-guidelines/context-menus)
- [`UIFeedbackGenerator`](https://developer.apple.com/documentation/uikit/uifeedbackgenerator)
