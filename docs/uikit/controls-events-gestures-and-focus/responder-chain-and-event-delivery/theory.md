---
title: "Responder Chain and Event Delivery: Theory"
domain: "UIKit"
topic: "Controls, Events, Gestures, and Focus"
concept: "Responder Chain and Event Delivery"
page_type: theory
levels: [senior, staff, principal]
interview_priority: high
estimated_read_minutes: 6
status: reviewed
last_reviewed: 2026-07-26
---

# Responder Chain and Event Delivery: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

UIKit interaction has two related paths. Event delivery starts with hit testing:
UIKit finds the view under the touch or the object that owns the input context.
Action routing can then use the responder chain when the sender does not name a
specific target.

That distinction matters in interviews. A button tap is usually a control event.
A menu command or keyboard shortcut may be a targetless action. A raw touch may
be handled by a view, a gesture recognizer, or a control.

## How It Works

`UIResponder` is the base class for views, view controllers, windows, and the
application object. Each responder points to a `next` responder. Those links form
the responder chain. UIKit uses it to route events and actions that the current
responder does not handle.

For touch input, UIKit starts at the window and hit-tests the view hierarchy.
Views that are hidden, disabled for interaction, outside the hit-test point, or
effectively transparent are skipped. The selected view and its gesture
recognizers participate in the touch sequence.

For targetless actions, UIKit sends the selector through the chain:

```swift
UIApplication.shared.sendAction(
    #selector(DocumentEditing.deleteSelection(_:)),
    to: nil,
    from: self,
    for: nil
)
```

When `to` is `nil`, UIKit looks for a responder that can handle the action. This
is how keyboard commands, menu items, edit commands, and some system actions can
work without every sender knowing the active controller.

## First Responder

The first responder is the object that currently receives key input and starts
many command lookups. Text fields and text views often become first responder
when editing begins. Custom views can become first responder when they return `true`
from `canBecomeFirstResponder` and successfully call `becomeFirstResponder()`.

Use first responder status for current interaction ownership, not for global app
state. A controller should not need to search arbitrary views to know business
state. The responder chain is useful for routing commands to the active context.

## Engineering Decisions

Use explicit targets when the sender has one clear owner. A button inside a view
controller can call that controller or use a closure output to the controller.

Use responder-chain routing when the command should apply to whichever object is
currently active. Common examples are delete, copy, paste, undo, keyboard
commands, and menu actions.

Override event methods or hit testing only when the view owns that behavior.
Examples include expanding a small touch target or forwarding touches through a
local overlay. Avoid broad container overrides that make unrelated controls
depend on hidden routing rules.

For Staff and Principal roles, responder-chain decisions are architecture
decisions. A document-style app can use responder routing to keep commands
decoupled from specific screens. A simple form may be clearer with explicit
actions and delegate outputs.

## Production Application

When an action does not fire, debug in this order:

1. Is the view hittable and inside the expected hierarchy?
2. Is a gesture recognizer cancelling or delaying the touch?
3. Is the control registered for the correct event or primary action?
4. If the action is targetless, who is first responder?
5. Does any responder in the chain implement and enable the selector?

When a touch goes to the wrong view, use the view debugger and coordinate
conversion before changing the responder chain. Many routing bugs are really
hierarchy, bounds, or overlay bugs.

## References

- [UIResponder](https://developer.apple.com/documentation/uikit/uiresponder)
- [Using responders and the responder chain to handle events](https://developer.apple.com/documentation/uikit/using-responders-and-the-responder-chain-to-handle-events)
- [UIApplication.sendAction(_:to:from:for:)](https://developer.apple.com/documentation/uikit/uiapplication/sendaction(_:to:from:for:))
