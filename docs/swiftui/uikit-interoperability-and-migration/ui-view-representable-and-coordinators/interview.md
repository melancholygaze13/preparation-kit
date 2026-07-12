---
title: "UIViewRepresentable and Coordinators: Interview Questions"
domain: "SwiftUI"
topic: "UIKit Interoperability and Migration"
concept: "UIViewRepresentable and Coordinators"
page_type: interview
levels: [senior, staff, principal]
interview_priority: situational
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-07-12
---

# UIViewRepresentable and Coordinators: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When would you use `UIViewRepresentable` instead of a native SwiftUI view?](#q1-when-use-uiviewrepresentable) | Senior | Boundary selection |
| [What belongs in `makeUIView`, `updateUIView`, and a coordinator?](#q2-lifecycle-and-coordinator) | Senior | Lifecycle and ownership |
| [How do you avoid feedback loops between UIKit callbacks and SwiftUI state?](#q3-avoid-feedback-loops) | Staff | State synchronization |
| [How would you manage representables during a UIKit-to-SwiftUI migration?](#q4-migration-boundaries) | Staff/Principal | Migration and ownership |

---

<a id="q1-when-use-uiviewrepresentable"></a>
## Q1: When would you use `UIViewRepresentable` instead of a native SwiftUI view?

### Short Answer

I use it when SwiftUI does not provide the needed behavior, when the app already
has a reliable UIKit component, or when an SDK exposes only a UIKit view. If
SwiftUI can express the behavior cleanly, I prefer native SwiftUI because state,
identity, layout, and testing stay simpler.

### Expanded Answer

`UIViewRepresentable` is a boundary adapter, not a default component pattern. It
is useful for specialized text editing, camera or map SDK views, mature internal
UIKit controls, and incremental migration. The cost is that I now have two UI
models in one feature: SwiftUI's value updates and UIKit's mutable view object.

I first check the current deployment target and framework API. For example, an app
targeting iOS 26 can use WebKit's native SwiftUI `WebView` and `WebPage` rather than
maintain a routine `WKWebView` representable.

So I define the wrapper contract narrowly. SwiftUI owns the source of truth and
passes configuration in. UIKit sends user events back through bindings, closures,
or actions. I avoid letting the wrapper become the owner of business state,
navigation, or long-running side effects.

---

<a id="q2-lifecycle-and-coordinator"></a>
## Q2: What belongs in `makeUIView`, `updateUIView`, and a coordinator?

### Short Answer

`makeUIView` creates the UIKit view and one-time structure. `updateUIView`
applies current SwiftUI inputs to that existing view. A coordinator handles
delegate, data source, target-action, or callback identity that a SwiftUI value
type should not hold.

### Expanded Answer

I keep `makeUIView` for construction: creating the view, assigning the delegate,
and installing stable UIKit collaborators. I keep `updateUIView` idempotent and
use it to synchronize values such as text, selection, configuration, enabled
state, or model identifiers.

The coordinator bridges imperative callbacks back into SwiftUI. It should
translate events, not become a separate feature owner. If the coordinator starts
holding domain state or deciding navigation, the wrapper is hiding architecture
inside UIKit.

### Example

For a wrapped `UITextView`, `makeUIView` creates the text view and assigns its
delegate. `updateUIView` sets `view.text` only when it differs from the binding.
The coordinator implements `textViewDidChange` and writes user edits back to the
binding.

---

<a id="q3-avoid-feedback-loops"></a>
## Q3: How do you avoid feedback loops between UIKit callbacks and SwiftUI state?

### Short Answer

I make updates idempotent, compare before setting UIKit properties, and separate
programmatic updates from user-originated callbacks when the UIKit control fires
events for both.

### Expanded Answer

The loop usually looks like this: SwiftUI state changes, `updateUIView` sets a
UIKit property, UIKit fires a delegate callback, and the callback writes back to
SwiftUI state. Sometimes that is harmless, but for text input, scrolling, maps,
and media controls it can reset selection, jump position, restart work, or cause
repeated renders.

The first defense is to avoid setting UIKit state when it already matches the
SwiftUI input. The second is to track whether a callback came from a direct user
action or from synchronization. The third is to keep the wrapper's event surface
small so the parent SwiftUI owner can decide how to handle changes.

### Trade-offs

Comparing every property can be noisy, but blind assignment is worse for views
with editing state, selection, scroll position, or expensive redraw behavior. I
compare values that affect user-visible continuity or callback behavior.

---

<a id="q4-migration-boundaries"></a>
## Q4: How would you manage representables during a UIKit-to-SwiftUI migration?

### Short Answer

I treat representables as explicit migration boundaries. They should isolate a
UIKit component behind a small SwiftUI contract while ownership of state, effects,
and navigation moves deliberately toward the target architecture.

### Expanded Answer

The risk in migration is a permanent split where UIKit owns some state, SwiftUI
owns related state, and neither side is clearly authoritative. I would define
which layer owns the source of truth, which callbacks cross the boundary, and
which UIKit assumptions are allowed to leak out.

For a team migration, I would add wrapper guidelines and tests around translation
behavior. I would also track where wrappers are temporary and where UIKit is the
right long-term implementation, such as a specialized SDK view. At Staff or
Principal scope, the important part is controlled adoption, not rewriting every
screen.

### Trade-offs

A wrapper can reduce migration risk by letting one feature move at a time. It can
also preserve old coupling if it exposes raw UIKit objects broadly. I prefer a
small SwiftUI-facing API even when the implementation remains UIKit.
