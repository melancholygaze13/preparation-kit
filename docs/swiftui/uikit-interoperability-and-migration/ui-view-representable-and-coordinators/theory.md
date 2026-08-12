---
title: "UIViewRepresentable and Coordinators: Theory"
domain: "SwiftUI"
topic: "UIKit Interoperability and Migration"
concept: "UIViewRepresentable and Coordinators"
page_type: theory
levels: [senior, staff, principal]
interview_priority: situational
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-08-12
---

# UIViewRepresentable and Coordinators: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

`UIViewRepresentable` is a protocol that adapts a `UIView` for SwiftUI's view hierarchy.
A **coordinator** is an optional stable reference object created by the representable
to receive UIKit delegate, data-source, target-action, or callback events.

The representable is an adapter between SwiftUI's value-driven rendering and
UIKit's reference-driven view model. The representable struct is cheap and can be
created many times. The UIKit view returned from `makeUIView(context:)` is the
long-lived object that SwiftUI manages for the current identity.

The most important interview answer is ownership. SwiftUI should own the source
of truth. UIKit should own only the imperative view object and the mechanics that
must live with it, such as delegate callbacks or target-action wiring.

## Lifecycle

<figure class="schematic-figure">
  <iframe class="schematic-frame" src="../diagram.html" style="--schematic-aspect: 960 / 592" title="UIViewRepresentable and Coordinators — Lifecycle" loading="lazy"></iframe>
  <figcaption><a href="../diagram.html">Open the UIViewRepresentable and Coordinators — Lifecycle diagram</a></figcaption>
</figure>

`makeUIView` creates and configures stable UIKit structure. Set delegate objects,
install target-action handlers, and create expensive UIKit collaborators there.
Do not assume it runs every time an input changes.

`updateUIView` synchronizes SwiftUI inputs into the existing UIKit view. It should
be idempotent: calling it with the same inputs should not add duplicate
observers, append duplicate subviews, restart unrelated work, or send callbacks
that look like user actions.

`dismantleUIView` is available when a wrapper must stop external work, unregister
observers, or release resources that UIKit will not clean up by ordinary
deallocation. Many wrappers do not need it.

SwiftUI decides when construction, update, and dismantling occur for a representable's
identity. Do not depend on an exact update count. Make creation one-time in meaning,
updates repeatable, and cleanup safe when called.

## Coordinator Responsibilities

A coordinator is a reference object created by the representable. Use it when
UIKit expects identity, mutation, or callback storage that a SwiftUI value type
should not provide.

Good coordinator responsibilities include:

| Responsibility | Example |
|---|---|
| Delegate or data source | `UIScrollViewDelegate`, `UITextViewDelegate`, map view callbacks |
| Target-action bridge | A UIKit control sends a value change event |
| Callback normalization | Convert several UIKit callbacks into one SwiftUI binding update |
| In-flight UIKit state | Track whether an update came from SwiftUI or from direct user input |

The coordinator should not become a hidden view model. If it starts owning domain
state, networking, persistence, or navigation policy, the boundary has moved too
far into UIKit.

## State Flow

Representables are safest when data flow is narrow and explicit. Inputs flow from
SwiftUI into UIKit during `updateUIView`. User events flow back through bindings,
closures, or actions.

```swift
struct LegacyTextView: UIViewRepresentable {
    @Binding var text: String

    func makeCoordinator() -> Coordinator {
        Coordinator(text: $text)
    }

    func makeUIView(context: Context) -> UITextView {
        let view = UITextView()
        view.delegate = context.coordinator
        return view
    }

    func updateUIView(_ view: UITextView, context: Context) {
        if view.text != text {
            view.text = text
        }
    }

    final class Coordinator: NSObject, UITextViewDelegate {
        var text: Binding<String>

        init(text: Binding<String>) {
            self.text = text
        }

        func textViewDidChange(_ textView: UITextView) {
            text.wrappedValue = textView.text
        }
    }
}
```

The comparison in `updateUIView` matters. Without it, a SwiftUI update can reset
selection, marked text, scroll position, or editing state. For controls that
emit callbacks when properties are set programmatically, it can also create a
state feedback loop.

## Engineering Decisions

Prefer native SwiftUI controls when they express the product behavior well. Reach
for `UIViewRepresentable` when the app needs a UIKit-only capability, a mature
custom UIKit component, an SDK view, or a staged migration path.

Recheck that boundary when the deployment target changes. Frameworks can add native
SwiftUI views that remove an older wrapper's synchronization and lifecycle burden. For
example, WebKit provides SwiftUI `WebView` and observable `WebPage` APIs on iOS 26 and
later. Prefer those for supported web-content needs instead of starting with a wrapped
`WKWebView`. Keep a representable only when a required behavior is not available or the
app must support older systems.

Before wrapping a UIKit view, decide these boundaries:

| Decision | What to define |
|---|---|
| Identity | What makes this UIKit view the same logical instance? |
| Inputs | Which SwiftUI values configure the view? |
| Events | Which UIKit callbacks become SwiftUI actions or binding writes? |
| Ownership | Who owns validation, navigation, side effects, and domain state? |
| Teardown | What observers, tasks, delegates, or external resources need cleanup? |

For Staff and Principal discussions, the main concern is not the syntax. It is
whether the wrapper prevents a permanent split model. A migration wrapper should
make ownership visible, have tests around state translation, and avoid leaking
UIKit assumptions into unrelated SwiftUI features.

## Production Application

Representables often fail at update boundaries. Common symptoms include duplicate
delegates, stale coordinator references, scroll jumps, lost text selection,
callbacks fired during programmatic updates, and memory leaks from long-lived
UIKit objects.

Keep wrappers small and test the translation logic separately when possible. For
complex views, introduce a small adapter model that describes the SwiftUI inputs
and expected events, then keep the UIKit-specific code as mechanical as possible.

For concurrency, treat UIKit callbacks as main-thread UI events. If a callback
starts async work, move that work to the SwiftUI owner or injected dependency so
cancellation and lifetime remain visible.

## References

- [UIViewRepresentable](https://developer.apple.com/documentation/swiftui/uiviewrepresentable)
- [makeUIView(context:)](https://developer.apple.com/documentation/swiftui/uiviewrepresentable/makeuiview%28context%3A%29)
- [updateUIView(_:context:)](https://developer.apple.com/documentation/swiftui/uiviewrepresentable/updateuiview%28_%3Acontext%3A%29)
- [WebKit for SwiftUI](https://developer.apple.com/documentation/webkit/webkit-for-swiftui)
