---
title: "Retain Cycles, Delegates, and Closure Lifetimes: Theory"
domain: "UIKit"
topic: "Performance, Memory, and Diagnostics"
concept: "Retain Cycles, Delegates, and Closure Lifetimes"
page_type: theory
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 8
status: reviewed
last_reviewed: 2026-08-12
---

# Retain Cycles, Delegates, and Closure Lifetimes: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A UIKit screen is a group of objects connected by references. View controllers own
views, and views own subviews. Controllers often also own view models, tasks, timers,
and subscriptions. A retain cycle forms when strong references make a loop, so none
of the objects in that loop can be released.

The interview answer is not "always use `[weak self]`." It is: identify the
owner, identify the callback or retained work, and decide whether that callback
is allowed to keep the owner alive.

## How It Works

Swift uses Automatic Reference Counting for class instances. Strong references
keep an instance alive. Weak references do not keep it alive and become `nil`
when the instance is released. Unowned references also do not keep it alive, but
they assume the referenced object outlives the reference.

UIKit uses delegates as callback channels. The object that exposes a delegate
usually should not own the delegate because the delegate often already owns the
object or participates in the same screen graph.

```swift
protocol PhotoPickerDelegate: AnyObject {
    func photoPicker(_ picker: PhotoPickerViewController, didPick image: UIImage)
}

final class PhotoPickerViewController: UIViewController {
    weak var delegate: PhotoPickerDelegate?
}
```

Closures are different because they are values that can be retained by another
object. A closure captures referenced objects strongly by default:

```swift
final class ProfileViewController: UIViewController {
    private let service: ProfileService

    func reload() {
        service.loadProfile { [weak self] result in
            guard let self else { return }
            self.render(result)
        }
    }
}
```

The weak capture is useful if the service may finish after the controller should
be gone. The callback should not extend the screen lifetime just so it can render
a result nobody can see.

Strong captures are sometimes correct. For example, a short animation owned by a
visible view can capture the view while the animation is running. The key
question is whether the closure is retained by something with the same or longer
lifetime than the object it captures.

## UIKit Lifetime Traps

Several UIKit-adjacent APIs hide retaining behavior:

| API or pattern | Why it leaks | Usual fix |
|---|---|---|
| `Timer` or `CADisplayLink` | The run loop retains the timer, and the timer retains its target or block. | Invalidate on teardown or use a weak proxy/block capture. |
| Repeating animation or observer token | A long-lived object retains a callback. | Store the token and cancel or remove it. |
| Notification block observer | The notification center retains the observer block. | Keep and remove the token when the owner ends. |
| Cell image completion | A loader retains a closure that captures a reused cell. | Capture weakly and check cell identity before rendering. |
| Stored `Task` | A task closure can keep a controller or model alive. | Cancel on lifecycle end and avoid needless strong captures. |

Task cancellation is cooperative. Calling `cancel()` sets a flag, but the task may
keep its captures until its operation observes cancellation and returns. The async
operation therefore needs a real cancellation path as well as a stored task handle.

View controllers are useful leak sentinels. If `deinit` does not run after
dismissal or navigation pop, something still owns the screen graph. Do not use
`deinit` logging as the only proof, but it is a fast local signal before opening
Instruments.

## Engineering Decisions

Use `weak` when the reference is optional or the target may disappear first.
Delegates are the common example.

Use `unowned` only when the relationship is guaranteed by design and a crash is
better than silently ignoring a broken lifetime rule. Parent-child helper objects
can sometimes use `unowned` back-references, but UIKit screen code rarely needs
it. If the lifetime proof depends on a network request, user navigation, or a
future refactor, use `weak`.

Use a strong capture when the closure is short-lived and should keep the object
alive for the operation. For example, a command object may capture an immutable
dependency strongly. The mistake is not strong capture by itself. The mistake is
a strong cycle or a callback retained beyond the useful lifetime of the object.

For Staff and Principal interviews, discuss ownership boundaries. A module that
standardizes delegate weakness, cancellation tokens, and subscription lifetimes
reduces leaks across many screens. It also makes teardown testable during
migrations from callback APIs to Swift concurrency.

## Production Application

A practical leak investigation starts with the reproduction path. Push and pop
the screen several times, then check whether old controllers, view models, or
cells remain. Use the memory graph debugger or Instruments to find the retaining
path. Fix the ownership edge that should not be strong.

Avoid "weak everywhere" as a style rule. It can hide useful lifetime mistakes and
drop work unexpectedly. Prefer a spoken rule:

> A closure may retain `self` when `self` does not also retain the closure's owner,
> or when the closure definitely ends before `self` should be released.

That rule handles delegates, cells, timers, and async callbacks with one mental
model.

## References

- [Automatic Reference Counting](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/)
- [Delegation](https://developer.apple.com/library/archive/documentation/General/Conceptual/DevPedia-CocoaCore/Delegation.html)
- [NotificationCenter](https://developer.apple.com/documentation/foundation/notificationcenter)
