---
title: "Keyboard Avoidance and Scroll Coordination: Theory"
domain: "UIKit"
topic: "Text Input, Keyboard, and Forms"
concept: "Keyboard Avoidance and Scroll Coordination"
page_type: theory
levels: [senior, staff, principal]
interview_priority: high
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-07-06
---

# Keyboard Avoidance and Scroll Coordination: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

The keyboard changes the visible editing area. Good UIKit code reacts to that
area, not to a guessed keyboard height.

The interview answer is: constrain fixed controls to the keyboard layout guide
when possible, adjust scroll view insets when content scrolls, and scroll the
focused input into view using the final visible rect.

## How It Works

Modern UIKit gives each view a `keyboardLayoutGuide`. You can constrain bottom
content to that guide so the system moves it with the keyboard:

```swift
NSLayoutConstraint.activate([
    formView.leadingAnchor.constraint(equalTo: view.layoutMarginsGuide.leadingAnchor),
    formView.trailingAnchor.constraint(equalTo: view.layoutMarginsGuide.trailingAnchor),
    submitButton.bottomAnchor.constraint(
        equalTo: view.keyboardLayoutGuide.topAnchor,
        constant: -16
    )
])
```

This works well for fixed bottom controls such as submit buttons or accessory
areas. It also avoids manual conversion from keyboard frame coordinates.

For scrollable forms, the common approach is different. The scroll view needs
enough bottom inset so focused content can move above the keyboard:

```swift
func keyboardWillChangeFrame(_ note: Notification) {
    guard let frameValue = note.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue else {
        return
    }

    let keyboardFrame = view.convert(frameValue.cgRectValue, from: nil)
    let overlap = max(0, view.bounds.maxY - keyboardFrame.minY)

    scrollView.contentInset.bottom = overlap
    scrollView.verticalScrollIndicatorInsets.bottom = overlap

    if let activeField {
        let rect = activeField.convert(activeField.bounds, to: scrollView)
        scrollView.scrollRectToVisible(rect.insetBy(dx: 0, dy: -16), animated: true)
    }
}
```

In this example, `activeField` is screen-owned state updated from editing
callbacks. The boundary is the important part: compute visible space in the
owning coordinate system, update scroll insets, and then reveal the current
first responder.

## Constraints and Guarantees

Do not hard-code a keyboard height. The keyboard can be undocked, floating,
split, hidden because of a hardware keyboard, or different across languages and
input modes. The screen can also be in split view or Stage Manager.

Keyboard notifications report frame changes and animation information. If you
use notifications, read the final frame and animation timing from the
notification instead of inventing a separate duration.

Safe areas and keyboards are different concepts. The safe area handles permanent
system UI such as home indicator space. The keyboard is transient input UI. A
layout can need both.

## Engineering Decisions

Choose the strategy by layout shape:

| Layout | Better strategy | Reason |
|---|---|---|
| Fixed bottom button | `keyboardLayoutGuide` constraint | Keeps layout declarative |
| Long form in scroll view | Adjust content and indicator insets | Keeps fields reachable |
| Chat composer | Keyboard guide plus scroll anchoring | Keeps composer and messages coordinated |
| Old deployment target | Keyboard notifications | Works before keyboard layout guide |

For forms embedded in navigation flows, avoid each child view controller owning
a separate global keyboard policy. A shared form container or base coordinator
can own consistent inset behavior, while each screen decides which field should
become focused.

## Production Application

Common failures are easy to describe in interviews:

| Failure | Cause | Fix |
|---|---|---|
| Field remains behind keyboard | Insets never update | Adjust scroll insets or use keyboard guide |
| Content jumps twice | Manual animation fights Auto Layout | Use one layout path and system timing |
| Button overlaps home indicator | Keyboard and safe area are mixed up | Respect both layout guides |
| Wrong scroll target | Reused field or stale responder reference | Find the current first responder at scroll time |

When the keyboard appears during a validation error, finish layout before
scrolling to the field. Otherwise the scroll view may calculate visibility using
old bounds or old content size.

## References

- [UIView.keyboardLayoutGuide](https://developer.apple.com/documentation/uikit/uiview/keyboardlayoutguide)
- [UIResponder.keyboardWillChangeFrameNotification](https://developer.apple.com/documentation/uikit/uiresponder/keyboardwillchangeframenotification)
- [UIScrollView.contentInset](https://developer.apple.com/documentation/uikit/uiscrollview/contentinset)
- [UIScrollView.scrollRectToVisible(_:animated:)](https://developer.apple.com/documentation/uikit/uiscrollview/scrollrecttovisible(_:animated:))
