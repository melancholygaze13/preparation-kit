---
title: "Hosting SwiftUI in UIKit: Interview Questions"
domain: "SwiftUI"
topic: "UIKit Interoperability and Migration"
concept: "Hosting SwiftUI in UIKit"
page_type: interview
levels: [senior, staff, principal]
interview_priority: situational
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-07-25
---

# Hosting SwiftUI in UIKit: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When would you host SwiftUI inside UIKit?](#q1-when-host-swiftui) | Senior | Boundary selection |
| [What does correct `UIHostingController` containment require?](#q2-hosting-controller-containment) | Senior | UIKit lifecycle |
| [How should navigation and actions cross the hosting boundary?](#q3-navigation-and-actions) | Staff | Ownership and flow |
| [What can go wrong when a UIKit app embeds many SwiftUI islands?](#q4-many-swiftui-islands) | Staff/Principal | Migration risk |

---

<a id="q1-when-host-swiftui"></a>
## Q1: When would you host SwiftUI inside UIKit?

### Short Answer

I host SwiftUI when a UIKit app wants to adopt SwiftUI for a screen, section, or
cell without rewriting the surrounding flow. UIKit keeps navigation and
containment; SwiftUI owns rendering inside the hosted boundary.

### Expanded Answer

Good examples are a new SwiftUI feature in an existing UIKit app, a reusable
SwiftUI component embedded in a UIKit screen, or cell content that fits
`UIHostingConfiguration`. I avoid hosting when the boundary would split ownership
of the same navigation state, form state, or side effects.

`UIHostingConfiguration` requires iOS 16 or tvOS 16. I choose it for supported reusable
cell content and use `UIHostingController` for screens or child-controller containment.

The contract should say what data enters the SwiftUI root and what intents come
back out. That keeps the hosted view from depending on UIKit details that make
the migration harder later.

---

<a id="q2-hosting-controller-containment"></a>
## Q2: What does correct `UIHostingController` containment require?

### Short Answer

Treat `UIHostingController` like any child view controller. Add it as a child,
add and constrain its view, then call `didMove(toParent:)`. On removal, call the
matching UIKit removal lifecycle methods.

### Expanded Answer

The hosted SwiftUI root is declarative, but the hosting controller is still a
UIKit controller. Incorrect containment can cause missing lifecycle events,
layout bugs, safe-area surprises, and ownership leaks.

For a pushed or presented screen, UIKit navigation owns the hosting controller.
For an embedded section, the parent view controller owns the hosting controller
and must manage its view constraints. I also avoid recreating the hosting
controller on every data update because that resets SwiftUI identity and local
state.

---

<a id="q3-navigation-and-actions"></a>
## Q3: How should navigation and actions cross the hosting boundary?

### Short Answer

If UIKit owns the surrounding flow, SwiftUI should emit user intents and UIKit
should perform navigation. Shared state should have one owner and cross the
boundary through values, bindings, actions, or an explicitly owned model.

### Expanded Answer

A common mistake is letting a hosted SwiftUI view push UIKit screens indirectly
while UIKit also tracks the flow. That creates two navigation models. I prefer a
small action surface, such as `onEdit`, `onSelect(id:)`, or `onDismiss`, and let
the UIKit owner decide how to route.

The same rule applies to side effects. A hosted view can start local UI work, but
domain effects, analytics policy, and long-lived async work should live at the
feature boundary or in injected dependencies with clear lifetime.

### Trade-offs

Letting SwiftUI own more can be reasonable for a fully hosted feature. It is
risky for a small embedded section in a UIKit-owned journey because it hides flow
decisions inside the island.

---

<a id="q4-many-swiftui-islands"></a>
## Q4: What can go wrong when a UIKit app embeds many SwiftUI islands?

### Short Answer

The app can end up with many small boundaries, duplicated state, inconsistent
navigation, and unclear ownership. Hosting should be part of a migration plan,
not only a way to add new UI quickly.

### Expanded Answer

Each hosted island needs a contract for state, actions, lifecycle, and testing.
If teams add islands independently, UIKit and SwiftUI can start modeling the same
screen state in different places. That makes bugs hard to diagnose because the
problem is at the boundary, not inside either framework alone.

At Staff or Principal level, I would define migration rules: where hosting is
allowed, who owns navigation, how shared models cross the boundary, how visual
and accessibility behavior is tested, and when temporary wrappers should be
removed.
