---
title: "Child Coordinators and Lifetime: Theory"
domain: "Architecture"
topic: "Coordinator and Navigation Architecture"
concept: "Child Coordinators and Lifetime"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 7
status: reviewed
last_reviewed: 2026-08-12
tags:
  - coordinators
  - lifetime
  - ownership
---

# Child Coordinators and Lifetime: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A child coordinator is a runtime scope for one active flow. It owns the screens,
view models, presentation state, and feature-scoped work needed by that flow. Its parent
owns it strongly until the child completes or is dismissed.

<figure class="schematic-figure">
  <iframe class="schematic-frame" src="../diagram.html" style="--schematic-aspect: 960 / 524" title="Child Coordinators and Lifetime" loading="lazy"></iframe>
  <figcaption><a href="../diagram.html">Open the Child Coordinators and Lifetime diagram</a></figcaption>
</figure>

The active ownership tree may change while the app runs. It should not keep completed
flows alive or require children to own their parents.

## Establish One Ownership Direction

Typical UIKit ownership:

```swift
final class AppCoordinator {
    private var children: [ObjectIdentifier: AnyObject] = [:]

    func startCheckout(cartID: Cart.ID) {
        let child = CheckoutCoordinator(cartID: cartID)
        let id = ObjectIdentifier(child)
        children[id] = child

        child.onFinish = { [weak self, weak child] result in
            guard let child else { return }
            self?.children[ObjectIdentifier(child)] = nil
            self?.handleCheckout(result)
        }
        child.start()
    }
}
```

The parent retains the child. The closure does not make the child own the parent.
The precise storage can be a typed property, enum, dictionary, or collection. Prefer
typed ownership when the possible flows are known; an untyped child array can hide
incorrect duplicates and removal bugs.

Do not rely on a navigation controller retaining a child's root screen to retain the
coordinator indirectly. That ownership is easy to break and makes teardown invisible.

## Cover Every Exit Path

A flow can end through:

- successful completion or explicit cancel;
- interactive back gesture or modal dismissal;
- replacement by another root or authentication state;
- deep-link redirection;
- scene or window closure;
- startup failure before the first screen appears.

Centralize completion so it runs at most once, removes delegate relationships, cancels
feature work, and tells the parent to release the child. Observe UIKit navigation and
presentation delegates for user-driven exits. In state-driven SwiftUI, child state
removal is the lifetime signal.

## Avoid Retain Cycles

Common cycles include:

- parent -> child -> completion closure -> parent;
- coordinator -> navigation controller -> view controller -> coordinator;
- coordinator -> view model -> route closure -> coordinator;
- view model -> task -> view model;
- subscription owner -> callback -> subscription owner.

Use weak references where the callback target is not owned by the caller. More
important, define which object should outlive which. Weak references used without an
ownership design can make callbacks disappear unexpectedly.

Use Xcode's memory graph, deinitialization diagnostics in debug builds, and repeated
start/finish tests. A child that never deinitializes often retains its view models,
tasks, cached images, and screen hierarchy too.

## Tie Work to the Correct Scope

When a child ends, cancel tasks and streams whose result is useful only to that flow.
Ignore late callbacks using flow or request identity. Do not let a removed child
mutate a newly created flow that happens to use the same screen type.

Work that must survive the flow—payment submission, uploads, offline writes—belongs
in a repository or durable operation service. The child observes its status and can
be released safely.

## Handle Parallel and Reentrant Flows

On iPad, multiple scenes, or repeated universal links, several instances of a flow may
be valid. Give each instance stable scope identity. Cancellation IDs, analytics, and
child storage must not assume a single global checkout or editor.

Define whether a repeated route focuses an existing flow, updates it, creates another
instance, or is rejected. The parent owns that policy.

## Engineering Decisions

Test lifetime separately from visual navigation. Start a child, drive each exit path,
assert one completion, cancellation, removal, and deallocation. Integration tests cover
interactive gestures and platform delegate callbacks.

At Staff scope, provide shared coordinator lifecycle conventions, memory diagnostics,
and per-scene ownership rules. Avoid a base coordinator class that hides behavior or
forces every feature into untyped child storage. Standardize outcomes, not inheritance.

## References

- [NavigationStack — SwiftUI](https://developer.apple.com/documentation/swiftui/navigationstack)
- [Restoring your app's state](https://developer.apple.com/documentation/uikit/restoring-your-app-s-state)
- [Automatic Reference Counting — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/)
