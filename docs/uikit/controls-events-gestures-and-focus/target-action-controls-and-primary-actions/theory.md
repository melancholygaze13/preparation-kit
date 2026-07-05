---
title: "Target-Action, Controls, and Primary Actions: Theory"
domain: "UIKit"
topic: "Controls, Events, Gestures, and Focus"
concept: "Target-Action, Controls, and Primary Actions"
page_type: theory
levels: [senior, staff, principal]
interview_priority: high
estimated_read_minutes: 6
status: reviewed
last_reviewed: 2026-07-05
---

# Target-Action, Controls, and Primary Actions: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

UIKit controls are event emitters. A button, switch, slider, text field, or menu
item should report user intent. The screen owner decides what that intent means.

The interview answer is: use target-action or `UIAction` for control events,
keep handlers small, route business decisions out of reusable controls, and be
careful with closure lifetimes.

## How It Works

`UIControl` sends actions for named events:

```swift
final class SettingsViewController: UIViewController {
    private let notificationsSwitch = UISwitch()

    override func viewDidLoad() {
        super.viewDidLoad()
        notificationsSwitch.addTarget(
            self,
            action: #selector(notificationsChanged(_:)),
            for: .valueChanged
        )
    }

    @objc private func notificationsChanged(_ sender: UISwitch) {
        viewModel.setNotificationsEnabled(sender.isOn)
    }
}
```

The selector should usually translate UI state into screen intent. It should not
perform unrelated networking, navigation, and persistence all inside the control
callback.

`UIAction` lets you configure controls with closures:

```swift
let saveAction = UIAction(title: "Save") { [weak self] _ in
    self?.save()
}

navigationItem.rightBarButtonItem = UIBarButtonItem(primaryAction: saveAction)
```

The closure is retained by the action, and the action is retained by the control
or item. If the controller owns that control and the closure captures the
controller strongly, the graph can cycle. Capture weakly when the action can
live as long as the screen owner.

## Primary Actions and Menus

A primary action is the main action for a control. `UIButton` and
`UIBarButtonItem` can be created with a primary action, which keeps title,
image, enabled state, and handler together for simple commands.

Menus and commands also use actions. They are useful when the same intent is
available from touch, keyboard, pointer, or system menus. For commands that
belong to the active responder, use a targetless selector instead of closing over
one controller.

## Engineering Decisions

Choose the boundary based on ownership:

| Situation | Good fit | Reason |
|---|---|---|
| One screen owns the control | Target-action to controller | Simple and explicit |
| Reusable view emits intent | Closure, delegate, or control event output | Keeps reusable view independent |
| Command applies to active context | Targetless responder action | Avoids hard-coded target |
| Simple bar button or menu item | `UIAction` or primary action | Keeps command metadata together |

Reusable controls should not know navigation, analytics policy, or persistence.
They can expose semantic actions such as `didTapRetry` or `valueChanged`. The
owner can then decide whether to navigate, update state, or start async work.

For Staff and Principal roles, consistency matters. A codebase that mixes
selectors, closures, coordinators, and responder actions without ownership rules
becomes hard to test. Pick conventions by layer and document where each pattern
belongs.

## Production Application

Common bugs are straightforward:

| Bug | Cause | Fix |
|---|---|---|
| Button does nothing | Wrong control event or selector not connected | Check registration and selector signature |
| Handler fires twice | Multiple registrations during reuse or reconfiguration | Register once or remove old actions |
| Screen leaks | `UIAction` closure captures owner strongly | Capture weakly or move action ownership |
| Reusable view owns too much | Control callback performs app-level work | Emit intent to the screen owner |

For cell controls, reset or replace handlers during configuration with care.
Cells are reused, so an action should refer to the current item identity, not an
old model captured during a previous configuration.

## References

- [UIControl](https://developer.apple.com/documentation/uikit/uicontrol)
- [Target-action](https://developer.apple.com/library/archive/documentation/General/Conceptual/Devpedia-CocoaApp/TargetAction.html)
- [UIAction](https://developer.apple.com/documentation/uikit/uiaction)
- [UIButton.Configuration](https://developer.apple.com/documentation/uikit/uibutton/configuration)
