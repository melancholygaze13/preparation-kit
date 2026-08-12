---
title: "Delegation, Closures, Notifications, and Ownership: Theory"
domain: "UIKit"
topic: "State, Architecture, and Dependencies"
concept: "Delegation, Closures, Notifications, and Ownership"
page_type: theory
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 8
status: reviewed
last_reviewed: 2026-08-12
---

# Delegation, Closures, Notifications, and Ownership: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

UIKit apps use several communication styles because object relationships have
different shapes. The interview decision is not "which syntax is nicer?" It is
"who needs to know about whom, and who owns the lifetime?"

Choose the narrowest mechanism that fits the relationship.

| Mechanism | Relationship | Best use |
|---|---|---|
| Delegate | One object coordinates another | UIKit customization and decisions |
| Closure | Local one-off callback | Button handlers, completion callbacks |
| Notification | One-to-many broadcast | App-wide events with unknown observers |
| Direct method | Strong known dependency | Same feature boundary |

## Delegation

Delegation is a one-to-one relationship. A framework or child object calls a
delegate to report an event, ask for data, or ask whether an action should
continue.

In UIKit, delegates are usually controller-facing. A `UITableView` asks its data
source for cells. A text field asks its delegate whether editing should change.
The delegating object should not usually own the delegate, so delegate
properties are commonly weak.

Delegation fits when the caller needs a typed protocol and may need a return
value. It is also good when the relationship is part of an object's stable API.

```swift
@MainActor
protocol RetryViewDelegate: AnyObject {
    func retryViewDidRequestRetry(_ retryView: RetryView)
}

final class RetryView: UIView {
    weak var delegate: RetryViewDelegate?

    @objc private func retryTapped() {
        delegate?.retryViewDidRequestRetry(self)
    }
}

final class ErrorViewController: UIViewController, RetryViewDelegate {
    func retryViewDidRequestRetry(_ retryView: RetryView) {
        reloadContent()
    }

    private func reloadContent() {
        // Start the screen-owned retry operation.
    }
}
```

The class-only protocol permits a weak reference. `@MainActor` matches the UIKit
event boundary. The view reports a typed event, while its controller owns the retry
operation.

## Closures

Closures fit small local callbacks. They avoid creating a protocol for one
action and keep call sites compact:

```swift
final class BannerView: UIView {
    var onRetryTapped: (() -> Void)?

    @objc private func retryTapped() {
        onRetryTapped?()
    }
}
```

The main risk is lifetime. If a view controller owns a view, and the view owns a
closure that captures the controller strongly, the two objects can retain each
other. Use `[weak self]` when the closure is stored by something the controller
owns or by something that may outlive the controller.

Closures become less clear when there are many callbacks, optional decisions, or
shared contracts across several types. That is where a delegate protocol can be
better.

## Notifications

Notifications are broadcasts. The posting object does not need to know who is
listening. This is useful for events such as significant app changes, account
changes, or shared system notifications.

The trade-off is hidden control flow. It can be hard to find all observers, the
payload may be weakly typed, and delivery timing can surprise a feature that
assumes an event is isolated.

`NotificationCenter.post` delivers to matching observers synchronously on the
posting thread unless a block observer was registered with another operation queue.
Do not assume a notification arrives on the main actor. A block-based observer token
also stays registered until code removes it, so store the token and remove it when
its owner ends.

```swift
extension Notification.Name {
    static let accountDidChange = Notification.Name("accountDidChange")
}

final class AccountBannerController: UIViewController {
    private var accountObserver: NSObjectProtocol?

    override func viewDidLoad() {
        super.viewDidLoad()
        accountObserver = NotificationCenter.default.addObserver(
            forName: .accountDidChange,
            object: nil,
            queue: .main
        ) { [weak self] _ in
            Task { @MainActor [weak self] in
                self?.renderCurrentAccount()
            }
        }
    }

    deinit {
        if let accountObserver {
            NotificationCenter.default.removeObserver(accountObserver)
        }
    }

    private func renderCurrentAccount() {
        // Read current account state and update this screen.
    }
}

NotificationCenter.default.post(name: .accountDidChange, object: nil)
```

The `.main` queue selects the main operation queue. The `@MainActor` task makes
Swift concurrency isolation explicit; a queue choice alone is not a compiler
guarantee. The token and weak captures make the lifetime visible. A different
observer may choose a different queue, so the notification itself does not promise
main-actor delivery.

Use notifications for broad events, not for routine parent-child communication.
If a child needs to tell its owner that a button was tapped, a delegate or
closure is easier to trace.

## Engineering Decisions

Use this decision table in interviews:

| Situation | Prefer | Reason |
|---|---|---|
| Child asks parent whether to allow an action | Delegate | Typed return value and clear owner |
| View reports a single tap | Closure | Simple local callback |
| Many features observe login changes | Notification or shared state publisher | Sender should not know observers |
| Feature object calls its own service | Direct dependency | No need to decouple local code |

For Staff and Principal roles, the concern is consistency. Teams should agree on
when broadcasts are allowed, how payloads are typed, where observers are stored,
and how callbacks are cancelled during reuse.

There is no best mechanism for every relationship. Delegates add protocol code,
closures can hide retain cycles, and notifications hide the list of receivers. Use
the narrowest choice that makes ownership and delivery easy to trace.

## Production Application

Most bugs come from lifetime mismatch:

| Bug | Cause | Fix |
|---|---|---|
| View controller never deallocates | Stored closure captures `self` strongly | Use weak capture or break the callback |
| Cell shows old result | Reused cell keeps old callback or task | Reset callbacks and cancel work in reuse |
| Event fires twice | Observer registered more than once | Register once and hold the token |
| Hard-to-trace side effect | Notification used for local child-parent event | Replace with delegate or closure |

Ownership should be visible in code review. Ask who owns the callback, whether
the receiver can disappear first, and whether the sender needs a return value.

## References

- [Cocoa Core Competencies: Delegation](https://developer.apple.com/library/archive/documentation/General/Conceptual/DevPedia-CocoaCore/Delegation.html)
- [Cocoa Core Competencies: Notification](https://developer.apple.com/library/archive/documentation/General/Conceptual/DevPedia-CocoaCore/Notification.html)
- [NotificationCenter](https://developer.apple.com/documentation/foundation/notificationcenter)
- [UIControl](https://developer.apple.com/documentation/uikit/uicontrol)
