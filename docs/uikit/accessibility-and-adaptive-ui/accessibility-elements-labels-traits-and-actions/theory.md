---
title: "Accessibility Elements, Labels, Traits, and Actions: Theory"
domain: "UIKit"
topic: "Accessibility and Adaptive UI"
concept: "Accessibility Elements, Labels, Traits, and Actions"
page_type: theory
levels: [senior, staff, principal]
interview_priority: high
estimated_read_minutes: 6
status: reviewed
last_reviewed: 2026-07-06
---

# Accessibility Elements, Labels, Traits, and Actions: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

UIKit builds an accessibility tree from views and explicit accessibility
objects. Assistive technologies use that tree to describe the interface and
perform actions.

The interview answer is: expose meaningful elements, give each element a clear
label, value, traits, and actions, and test the result as a user interaction
path rather than as a visual afterthought.

## How It Works

Many UIKit controls already expose useful accessibility behavior. A `UIButton`
has button traits. A `UISwitch` exposes a value. A `UILabel` can provide text.
Custom views, composed cells, and gesture-heavy views often need explicit work:

```swift
final class AccountSummaryView: UIView {
    private let nameLabel = UILabel()
    private let balanceLabel = UILabel()

    override init(frame: CGRect) {
        super.init(frame: frame)
        isAccessibilityElement = true
        accessibilityTraits = [.button]
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    func configure(name: String, balance: String) {
        nameLabel.text = name
        balanceLabel.text = balance

        accessibilityLabel = name
        accessibilityValue = "Balance \(balance)"
        accessibilityHint = "Opens account details"
    }
}
```

This example groups several visual subviews into one accessible object because
the row acts as one account summary. If each subview had its own focus stop, the
user would hear fragments instead of the row's meaning.

Use custom actions when the visual UI uses gestures or row actions that are not
easy to discover through VoiceOver:

```swift
accessibilityCustomActions = [
    UIAccessibilityCustomAction(name: "Archive") { [weak self] _ in
        self?.archive()
        return true
    }
]
```

## Constraints and Guarantees

An accessibility label should identify the element. It should not include the
control type when the trait already provides that role. For example, prefer
"Save" with button traits over "Save button".

The value should describe changing state, such as "On", "42 percent", or a
selected account name. The hint should explain the result of activating the
element only when that result is not obvious.

Accessibility identifiers are for automation. They are not spoken to users.
Do not use identifiers as a replacement for labels, values, traits, and actions.

## Engineering Decisions

Choose the accessibility boundary by user meaning:

| UI shape | Better accessibility model | Reason |
|---|---|---|
| Standard control | Use built-in behavior, adjust only when needed | UIKit already knows the role |
| Composed row | One grouped element with value and actions | Prevents noisy focus stops |
| Data chart | Summary element plus selected-data actions | Exposes meaning beyond pixels |
| Gesture-only affordance | Custom action or visible control | Makes the operation discoverable |

For reusable cells, update accessibility state during configuration. A reused
cell must not keep an old label, value, selected trait, or custom action from a
previous item.

For Staff and Principal roles, accessibility needs ownership. Design systems can
standardize labels, traits, action names, error announcements, and test fixtures.
That prevents each feature team from solving the same interaction pattern in a
different way.

## Production Application

Common failures are usually boundary errors:

| Failure | Cause | Fix |
|---|---|---|
| VoiceOver reads fragments | Visual subviews are separate elements | Group the useful unit |
| Button has no clear purpose | Label repeats icon name or is missing | Use a task-based label |
| Swipe action is unreachable | Action exists only as a gesture | Add a custom accessibility action |
| UI test is stable but VoiceOver is poor | Identifier exists, label is wrong | Test user-facing labels separately |

Manual testing still matters. UI tests can prove identifiers and basic flows,
but they do not replace listening to the screen with VoiceOver, large content
sizes, and real navigation order.

## References

- [UIAccessibility](https://developer.apple.com/documentation/uikit/uiaccessibility)
- [UIAccessibilityElement](https://developer.apple.com/documentation/uikit/uiaccessibilityelement)
- [UIAccessibilityTraits](https://developer.apple.com/documentation/uikit/uiaccessibilitytraits)
- [UIAccessibilityCustomAction](https://developer.apple.com/documentation/uikit/uiaccessibilitycustomaction)
- [Accessibility - Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/accessibility)
