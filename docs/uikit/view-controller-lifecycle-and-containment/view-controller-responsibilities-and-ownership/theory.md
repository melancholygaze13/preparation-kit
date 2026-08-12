---
title: "View Controller Responsibilities and Ownership: Theory"
domain: "UIKit"
topic: "View Controller Lifecycle and Containment"
concept: "View Controller Responsibilities and Ownership"
page_type: theory
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 7
status: reviewed
last_reviewed: 2026-08-12
---

# View Controller Responsibilities and Ownership: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A `UIViewController` is the object that connects UIKit lifecycle to a piece of
interface. It owns the root view for that screen region, reacts to user events,
updates presentation state, and coordinates navigation or child controllers.

The controller should not become the default home for every decision. In a
production app, its job is usually coordination:

<figure class="schematic-figure">
  <iframe class="schematic-frame" src="../diagram.html" style="--schematic-aspect: 960 / 600" title="View Controller Responsibilities and Ownership" loading="lazy"></iframe>
  <figcaption><a href="../diagram.html">Open the View Controller Responsibilities and Ownership diagram</a></figcaption>
</figure>

That boundary matters in interviews because many UIKit problems are ownership
problems disguised as lifecycle problems. A controller that owns data loading,
formatting, validation, navigation, and persistence is hard to test and easy to
leak.

## Controller Responsibilities

A controller is a good place for responsibilities that are tied to UIKit:

- creating or loading its view hierarchy
- installing constraints and configuring controls
- reacting to lifecycle callbacks
- translating UI events into feature actions
- coordinating presentations, navigation, and child controllers
- updating view state from a model or view model

It is a weaker place for responsibilities that should survive UI replacement:

- business rules
- persistence decisions
- network protocol details
- cross-feature state ownership
- complicated formatting or validation policy

This does not mean every UIKit screen needs a formal architecture. A simple
settings screen may be clear with a small controller and a service dependency.
The decision changes when the controller starts mixing lifecycle code with rules
that need independent tests or reuse.

## Ownership Rules

UIKit view controllers normally have strong ownership over their root view and
their child view controllers. A parent owns children added with containment. A
navigation controller owns the controllers on its stack. A presenting controller
does not become the business owner of everything the presented controller does;
it coordinates the presentation and dismissal relationship.

Delegates are usually weak. The object sending delegate callbacks should not keep
its coordinator alive by accident. Closures need the same care. If a controller
passes a closure to a long-lived service or model object, capture `self` weakly
unless the lifetime relationship is clearly shorter than the controller.

```swift
protocol ProfileLoading {
    func loadDisplayName() async throws -> String
}

final class ProfileViewController: UIViewController {
    private let loader: ProfileLoading
    private let nameLabel = UILabel()
    private var task: Task<Void, Never>?

    init(loader: ProfileLoading) {
        self.loader = loader
        super.init(nibName: nil, bundle: nil)
    }

    required init?(coder: NSCoder) {
        fatalError("Use init(loader:)")
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)

        task?.cancel()
        task = Task { [weak self] in
            guard let self else { return }
            do {
                let displayName = try await loader.loadDisplayName()
                try Task.checkCancellation()
                nameLabel.text = displayName
            } catch is CancellationError {
                // Leaving the screen made this result unnecessary.
            } catch {
                nameLabel.text = "Could not load profile"
            }
        }
    }

    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        task?.cancel()
        task = nil
    }
}
```

The controller owns the UI lifetime and rendering. The loader owns loading
behavior. The protocol makes that dependency visible at initialization. The task
is useful only while this screen is visible, so the controller cancels it at the
matching lifecycle boundary. Cancellation is cooperative, so a real screen should
also reject a result if its model identity has changed.

## Engineering Decisions

Use a plain controller when the screen is mostly UIKit wiring and the behavior is
small. Add a view model or presenter when state transitions, formatting, or
validation need deterministic tests. Add a coordinator or router when navigation
decisions span multiple screens or need reuse.

Avoid moving UIKit objects into lower layers. A view model that stores
`UIButton`, `UIViewController`, or `UINavigationController` has usually absorbed
the wrong responsibility. Prefer plain values and commands at the boundary.

At Staff or Principal scope, the important question is consistency. A codebase
can tolerate a few small controllers with local decisions. It struggles when
every feature invents a different ownership model for navigation, dependencies,
and async work. Shared conventions should describe where dependencies enter,
where navigation is decided, and how controllers cancel work.

## Production Application

Large UIKit controllers usually fail in three ways:

| Symptom | Likely ownership issue | Better boundary |
|---|---|---|
| Hard-to-test validation | Rules live in delegate callbacks | Plain validator or view model |
| Retain cycle after dismissal | Closure or delegate owns controller | Weak delegate or weak capture |
| Stale UI after navigation | Async result outlives screen | Lifecycle-tied cancellation or result token |
| Navigation scattered across buttons | Flow ownership is local and duplicated | Coordinator or typed route API |

When reviewing a controller, ask which object owns each lifetime. Views own
subviews. Controllers own screen lifecycle. Services own work that can outlive a
screen. App or scene objects own cross-screen state. Clear answers prevent many
UIKit bugs.

## References

- [UIViewController](https://developer.apple.com/documentation/uikit/uiviewcontroller)
- [View Controller Programming Guide for iOS](https://developer.apple.com/library/archive/featuredarticles/ViewControllerPGforiPhoneOS/)
