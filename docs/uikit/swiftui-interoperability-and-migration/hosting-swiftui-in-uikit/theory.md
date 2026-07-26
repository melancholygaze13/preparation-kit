---
title: "Hosting SwiftUI in UIKit: Theory"
domain: "UIKit"
topic: "SwiftUI Interoperability and Migration"
concept: "Hosting SwiftUI in UIKit"
page_type: theory
levels:
  - senior
  - staff
interview_priority: situational
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-07-26
---

# Hosting SwiftUI in UIKit: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

`UIHostingController` adapts a SwiftUI view hierarchy to UIKit's controller model.
UIKit can present it, push it, or contain it like any other view controller. SwiftUI
renders inside the controller's view, but that view must stay connected to its
hosting controller because SwiftUI features rely on the controller hierarchy.

The bridge does not choose architecture. Before embedding it, decide who owns the
model, navigation, dismissal, side effects, and lifetime.

## Preserve Controller Containment

For a full screen, present or push the hosting controller normally. For a region
inside another controller, use complete containment:

```swift
let host = UIHostingController(rootView: SummaryView(model: model))

addChild(host)
container.addSubview(host.view)
host.view.translatesAutoresizingMaskIntoConstraints = false
NSLayoutConstraint.activate([
    host.view.leadingAnchor.constraint(equalTo: container.leadingAnchor),
    host.view.trailingAnchor.constraint(equalTo: container.trailingAnchor),
    host.view.topAnchor.constraint(equalTo: container.topAnchor),
    host.view.bottomAnchor.constraint(equalTo: container.bottomAnchor)
])
host.didMove(toParent: self)
```

Retain the controller for as long as the embedded feature exists. On removal, call
`willMove(toParent: nil)`, remove its view, then call `removeFromParent()`.

## Bridge Data with One Owner

For input that changes only occasionally, UIKit can create a new SwiftUI view value
and assign it to `rootView`. UIKit must repeat that assignment after every relevant
input change.

For shared changing state, pass one externally owned `@Observable` model into the
root view. Mark UI-bound models `@MainActor` unless the project uses main-actor
default isolation. SwiftUI observes the properties its body reads, while UIKit can
keep owning the model's lifetime. Closures or a small action interface carry user
intent back to the UIKit route owner.

Do not mirror the same state into a UIKit property, a SwiftUI `@State`, and a model.
Choose one source of truth and derive presentation values. Also avoid letting both
frameworks present the same route. If UIKit owns the flow, SwiftUI sends a route
intent; UIKit performs the push, presentation, or dismissal.

## Size for the Container

Normal full-screen and constrained child layouts let UIKit propose the hosting
view's size. When UIKit needs SwiftUI's ideal size, configure `sizingOptions`:

- `.preferredContentSize` fits popovers or custom containers that read the
  controller's preferred size;
- `.intrinsicContentSize` lets Auto Layout react to ideal-size changes.

The default is no sizing option. Enable only the value that the UIKit container
actually reads. If both systems repeatedly change size in response to each other,
the layout can become unstable.

For table and collection view cells, prefer `UIHostingConfiguration`. It implements
`UIContentConfiguration`, participates in reuse and cell state updates, and bridges
features such as list swipe actions. Actions must use the item's stable identifier,
not an index path that can change while the cell remains visible.

## Production Boundary

Test traits, safe areas, Dynamic Type, accessibility focus, appearance, and task
cancellation across the mixed hierarchy. Profile a representative screen; the
boundary adds layout and update work, but the correct decision depends on the actual
feature rather than framework count alone.

Hosting fits a SwiftUI screen or component inside an existing UIKit-owned flow. It
adds little value when UIKit must immediately reach through the host and control
individual SwiftUI views; that usually signals an unclear ownership boundary.

## References

- [`UIHostingController`](https://developer.apple.com/documentation/swiftui/uihostingcontroller)
- [`UIHostingControllerSizingOptions`](https://developer.apple.com/documentation/swiftui/uihostingcontrollersizingoptions)
- [`UIHostingConfiguration`](https://developer.apple.com/documentation/swiftui/uihostingconfiguration)
- [Use SwiftUI with UIKit](https://developer.apple.com/videos/play/wwdc2022/10072/)
- [Implementing a container view controller](https://developer.apple.com/library/archive/featuredarticles/ViewControllerPGforiPhoneOS/ImplementingaContainerViewController.html)
