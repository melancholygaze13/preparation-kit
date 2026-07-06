---
title: "Text Fields, Text Views, and Delegate Boundaries: Theory"
domain: "UIKit"
topic: "Text Input, Keyboard, and Forms"
concept: "Text Fields, Text Views, and Delegate Boundaries"
page_type: theory
levels: [senior, staff, principal]
interview_priority: high
estimated_read_minutes: 6
status: reviewed
last_reviewed: 2026-07-06
---

# Text Fields, Text Views, and Delegate Boundaries: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

UIKit text inputs are editing surfaces. They should collect text and expose
editing events. The screen owner decides how that text affects form state,
validation, navigation, analytics, and persistence.

The interview answer is: choose `UITextField` for focused single-line input,
choose `UITextView` for longer or styled text, keep delegates small, and move
durable state outside reusable views.

## How It Works

`UITextField` is usually the right control for names, email addresses, search
terms, one-time codes, and other short values. It supports return-key behavior,
placeholder text, clear buttons, secure entry, and text input traits.

`UITextView` is closer to a scrollable text editor. Use it for long comments,
notes, message drafts, or attributed text. It has its own scrolling behavior, so
it needs more care inside table or collection view cells.

Both controls use delegates for editing decisions and lifecycle events:

```swift
final class ProfileViewController: UIViewController, UITextFieldDelegate {
    private let nameField = UITextField()

    override func viewDidLoad() {
        super.viewDidLoad()
        nameField.delegate = self
        nameField.addTarget(
            self,
            action: #selector(nameChanged(_:)),
            for: .editingChanged
        )
    }

    @objc private func nameChanged(_ sender: UITextField) {
        viewModel.updateName(sender.text ?? "")
    }

    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        emailField.becomeFirstResponder()
        return true
    }
}
```

Use delegate methods for editing rules that must happen at the editing boundary.
For example, a field may reject characters that cannot be represented by the
field's format. Use `.editingChanged` or equivalent callbacks to update form
state after UIKit has applied the change.

## Constraints and Guarantees

`textField(_:shouldChangeCharactersIn:replacementString:)` and the matching
`UITextViewDelegate` method run before UIKit commits the edit. Returning `false`
prevents the edit. That makes these methods useful for hard input rules, but
they are not a complete validation model.

For example, rejecting every non-digit in a phone field can be reasonable.
Rejecting a temporarily incomplete email address is usually hostile. The user
needs time to type an invalid intermediate value before it becomes valid.

Text changes can come from typing, paste, dictation, hardware keyboards,
AutoFill, undo, or programmatic updates. Avoid assuming every change comes from
one key press. If a rule must inspect the final string, calculate the proposed
string from the current text, range, and replacement.

## Engineering Decisions

Choose the boundary by lifetime:

| Situation | Good boundary | Reason |
|---|---|---|
| One screen owns a simple field | View controller delegate | Explicit and easy to follow |
| Reusable form row | Closure, delegate, or event output | Keeps row independent of the screen |
| Complex form with validation | View model or form model | Preserves state across view reloads |
| Cell-hosted input | Stable item identity plus external state | Avoids losing text during reuse |

Reusable input views should not know persistence, navigation, or service calls.
They can expose semantic events such as `didChangeEmail`, `didSubmit`, or
`didBeginEditing`. The owner decides whether to show an error, move focus, save
a draft, or start async work.

For Staff and Principal roles, the bigger issue is consistency. A large app
needs a form pattern that works in plain UIKit screens, list cells, and hybrid
SwiftUI screens. Without that rule, teams often duplicate validation logic in
delegates, view models, and service request builders.

## Production Application

Common failures come from putting too much state in the input view:

| Failure | Cause | Better design |
|---|---|---|
| Text disappears during scrolling | Cell owns draft text | Store text by item identity outside the cell |
| Validation feels broken | Delegate rejects normal intermediate input | Allow typing and validate on change or submit |
| Return key is inconsistent | Each field handles focus ad hoc | Centralize field order in the screen owner |
| Input view is hard to reuse | Delegate performs navigation or networking | Emit intent and let the owner handle side effects |

When a text view grows with content, coordinate it with layout deliberately.
For cells, prefer a clear sizing strategy and update the list layout when the
text height changes. Avoid layout loops where a text change changes height,
which triggers another configuration, which changes text again.

## References

- [UITextField](https://developer.apple.com/documentation/uikit/uitextfield)
- [UITextFieldDelegate](https://developer.apple.com/documentation/uikit/uitextfielddelegate)
- [UITextView](https://developer.apple.com/documentation/uikit/uitextview)
- [UITextViewDelegate](https://developer.apple.com/documentation/uikit/uitextviewdelegate)
- [UIControl.Event.editingChanged](https://developer.apple.com/documentation/uikit/uicontrol/event/editingchanged)
