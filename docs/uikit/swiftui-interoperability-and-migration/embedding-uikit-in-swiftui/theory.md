---
title: "Embedding UIKit in SwiftUI: Theory"
domain: "UIKit"
topic: "SwiftUI Interoperability and Migration"
concept: "Embedding UIKit in SwiftUI"
page_type: theory
levels:
  - senior
  - staff
interview_priority: situational
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-07-26
---

# Embedding UIKit in SwiftUI: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

`UIViewRepresentable` wraps one UIKit view. `UIViewControllerRepresentable` wraps
one UIKit view controller. The SwiftUI wrapper is a value description that may be
created many times, while SwiftUI can keep the same wrapped UIKit object alive.
Protocol callbacks connect those different lifetimes.

Use a view representable for a view-level capability. Use a controller representable
when presentation, child controllers, or controller lifecycle is part of the
component's behavior. Prefer a native SwiftUI API when it fully covers the need; a
wrapper adds two lifecycle models that must stay consistent.

## Create Once and Update from Current Inputs

`makeUIView` creates and performs one-time wiring. `updateUIView` applies all changing
inputs to the existing view. Do not assume `makeUIView` runs for every new wrapper
value, and do not perform side effects on every update without checking whether an
input actually changed.

```swift
struct SearchField: UIViewRepresentable {
    @Binding var text: String

    func makeCoordinator() -> Coordinator { Coordinator(parent: self) }

    func makeUIView(context: Context) -> UISearchTextField {
        let field = UISearchTextField()
        field.addTarget(
            context.coordinator,
            action: #selector(Coordinator.changed(_:)),
            for: .editingChanged
        )
        return field
    }

    func updateUIView(_ field: UISearchTextField, context: Context) {
        context.coordinator.parent = self
        if field.text != text { field.text = text }
    }

    static func dismantleUIView(
        _ field: UISearchTextField,
        coordinator: Coordinator
    ) {
        field.removeTarget(
            coordinator,
            action: #selector(Coordinator.changed(_:)),
            for: .editingChanged
        )
    }

    final class Coordinator: NSObject {
        var parent: SearchField
        init(parent: SearchField) { self.parent = parent }

        @objc func changed(_ sender: UISearchTextField) {
            let newValue = sender.text ?? ""
            if parent.text != newValue { parent.text = newValue }
        }
    }
}
```

The coordinator stores the latest wrapper value because SwiftUI can create a new
description while retaining the coordinator. It forwards UIKit events to the
binding; it does not own a second copy of the text.

## Avoid Update Loops and Layout Conflicts

A two-way bridge can loop: SwiftUI updates UIKit, UIKit emits a delegate callback,
the callback changes SwiftUI state, and another update begins. Compare desired and
current values, and distinguish user events from programmatic synchronization when
the UIKit API emits both.

SwiftUI controls the represented view's outer `frame`, `bounds`, `center`, and
transform. Do not assign those properties from the adapter. Use constraints only
for the UIKit component's internal subviews. When the component must report its
preferred size, implement `sizeThatFits(_:uiView:context:)` rather than changing its
frame.

`dismantleUIView` or its controller equivalent is for cleanup created by the
adapter: observers, targets, delegates, timers, tasks, or external sessions. Normal
UIKit subview memory is released through ownership and does not need manual teardown.

## Production Boundary

Test repeated insertion, removal, identity changes, environment changes, and rapid
two-way updates. Verify accessibility at the composed SwiftUI level. A UIKit view may
already expose elements, but the wrapper still needs correct labels, focus order,
and sizing in its new context.

The benefit is access to a UIKit capability without rewriting it. The cost is an
extra lifecycle and data-flow boundary. Prefer a native SwiftUI component when it
already provides the same behavior.

## References

- [`UIViewRepresentable`](https://developer.apple.com/documentation/swiftui/uiviewrepresentable)
- [`UIViewRepresentableContext`](https://developer.apple.com/documentation/swiftui/uiviewrepresentablecontext)
- [`UIViewControllerRepresentable`](https://developer.apple.com/documentation/swiftui/uiviewcontrollerrepresentable)
- [`dismantleUIView(_:coordinator:)`](https://developer.apple.com/documentation/swiftui/uiviewrepresentable/dismantleuiview(_:coordinator:)-94s0o)
- [UIKit integration in SwiftUI](https://developer.apple.com/documentation/swiftui/uikit-integration)
