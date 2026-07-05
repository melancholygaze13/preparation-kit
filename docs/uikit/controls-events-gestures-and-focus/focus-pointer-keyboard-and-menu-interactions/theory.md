---
title: "Focus, Pointer, Keyboard, and Menu Interactions: Theory"
domain: "UIKit"
topic: "Controls, Events, Gestures, and Focus"
concept: "Focus, Pointer, Keyboard, and Menu Interactions"
page_type: theory
levels: [senior, staff, principal]
interview_priority: high
estimated_read_minutes: 6
status: reviewed
last_reviewed: 2026-07-05
---

# Focus, Pointer, Keyboard, and Menu Interactions: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

UIKit supports several input styles. Touch is only one of them. iPad users may
use a pointer and keyboard. tvOS users navigate focus. iOS users can trigger
menus, hardware keyboard shortcuts, and accessibility actions.

The interview answer is: expose user intent once, then connect touch, keyboard,
pointer, focus, and menu entry points to that same intent where appropriate.

## Focus

Focus is the system's current navigation target for non-touch movement. UIKit
decides which item can become focused based on the focus environment, preferred
focus, and movement direction.

Focus matters most on tvOS and keyboard-driven interfaces, but iPad and Catalyst
apps also benefit from predictable focus behavior. Custom containers should avoid
trapping focus or making movement depend on visual tricks that the focus engine
cannot understand.

Use focus updates to adjust appearance, not to change business state
unexpectedly. Focus can move because of keyboard navigation, system restoration,
or layout changes. Selection should usually remain a separate explicit action.

## Pointer and Hover

Pointer interactions give pointer-capable devices hover feedback. They should
communicate affordance: this object can be clicked, dragged, resized, or opened.
The pointer effect should match the control's real behavior.

Do not create pointer-only functionality. A pointer can improve precision and
discoverability, but the same command should usually be available through touch,
keyboard, or menu where the platform expects it.

## Keyboard Commands and Menus

Keyboard commands are useful for frequent, reversible, or document-style actions:
save, search, delete, escape, next item, previous item, and undo. They should not
steal keystrokes from text input. If a text field is editing, normal typing and
editing commands should keep working.

Menus expose commands without adding visible controls for every action. Menus
also work well with responder-chain routing because the active editor or screen
can answer whether a command is currently available.

```swift
override var keyCommands: [UIKeyCommand]? {
    [
        UIKeyCommand(
            title: "Search",
            action: #selector(focusSearch),
            input: "f",
            modifierFlags: .command
        )
    ]
}

@objc private func focusSearch() {
    searchField.becomeFirstResponder()
}
```

Keep keyboard commands discoverable through menus or command overlays when the
platform supports them.

## Engineering Decisions

Use this boundary:

| Input style | Good use | Avoid |
|---|---|---|
| Focus | Navigate selectable elements | Changing data just because focus moved |
| Pointer | Show hover affordance | Pointer-only commands |
| Keyboard | Frequent commands and navigation | Capturing text input unexpectedly |
| Menus | Secondary and contextual commands | Hiding primary required actions |

For Staff and Principal roles, non-touch input is a product-quality standard.
Teams should share command names, keyboard shortcuts, menu placement, and focus
behavior for common actions. Otherwise each feature teaches a different control
model.

## Production Application

When adding non-touch input, start with the intent:

1. What user command is being exposed?
2. Which inputs should trigger it?
3. Which responder owns the active context?
4. Is the command enabled only when valid?
5. Does accessibility still expose the same action?

This avoids separate code paths where touch works, but keyboard or menu commands
skip validation, analytics, undo registration, or state updates.

## References

- [UIFocusEnvironment](https://developer.apple.com/documentation/uikit/uifocusenvironment)
- [UIPointerInteraction](https://developer.apple.com/documentation/uikit/uipointerinteraction)
- [UIKeyCommand](https://developer.apple.com/documentation/uikit/uikeycommand)
- [UIMenu](https://developer.apple.com/documentation/uikit/uimenu)
