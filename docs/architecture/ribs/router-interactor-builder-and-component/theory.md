---
title: "Router, Interactor, Builder, and Component: Theory"
domain: "Architecture"
topic: "RIBs"
concept: "Router, Interactor, Builder, and Component"
page_type: theory
levels:
  - senior
  - staff
interview_priority: situational
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-08-12
tags:
  - ribs
  - dependency-injection
  - business-logic
---

# Router, Interactor, Builder, and Component: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A RIB is a business-logic scope with explicit construction, dependencies, behavior, and
child routing. It may have a view, but the active business tree does not depend on the
view hierarchy.

<figure class="schematic-figure">
  <iframe class="schematic-frame" src="../diagram.html" style="--schematic-aspect: 960 / 600" title="Router, Interactor, Builder, and Component" loading="lazy"></iframe>
  <figcaption><a href="../diagram.html">Open the Router, Interactor, Builder, and Component diagram</a></figcaption>
</figure>

The builder is the only construction entry point. The component turns parent-provided
dependencies into the values owned or exposed by this scope.

## Core Roles

| Role | Responsibility | Boundary to protect |
|---|---|---|
| Interactor | Business behavior and state for the active scope | Avoid UIKit transition and child construction details |
| Router | Attach and detach child RIBs; coordinate view routing when present | Avoid owning product rules that belong to the interactor |
| Builder | Construct and connect one RIB from declared parent dependencies | Avoid runtime business decisions |
| Component | Provide scoped dependencies and satisfy child dependency contracts | Avoid becoming a global service locator |
| View/Presenter | Optional rendering and view logic | Keep business scope usable without forcing a view |

The official framework name highlights Router, Interactor, and Builder. Component is the
dependency-injection part commonly used in iOS implementations. A RIB without a view can
represent authentication state, an active trip, or another business scope that continues
while visible screens change.

## Dependency Direction

A child builder declares what it requires from its parent. The parent component conforms
to that dependency contract. This makes scope and availability visible at construction.

Dependencies should reflect lifetime. An account client may come from the signed-in root.
A checkout draft may be created in the checkout component. A child should not reach into
a global container to find whichever instance happens to exist.

Do not expose the entire parent component to every child. Small child dependency
interfaces reduce coupling and make tests state what the RIB actually needs.

## Behavior and Routing

The interactor reacts to inputs and business state. When the active state requires a
child scope, it tells its router through an explicit routing interface. The router builds
and attaches that child. When the state ends, the router detaches it.

Keep the decision and mechanism separate:

- interactor: “the user is authenticated; enter the logged-in scope”;
- router: build and attach `LoggedIn`, then remove the logged-out child and its view.

A router should prevent duplicate attachment and define what happens when an expected
child is absent. Idempotent routing makes repeated state emissions safer.

## State and Communication

RIBs traditionally uses reactive streams and dependency interfaces to communicate state.
The current iOS framework depends on RxSwift. The architectural rule matters more than
the library: state must have an owner, subscriptions must follow the RIB lifecycle, and
siblings should communicate through their parent or a shared owned capability.

Avoid a global event bus. It hides which scope can send an event, which scope must be
active to receive it, and how the relationship is tested.

## Benefits and Costs

| Benefits | Costs and risks |
|---|---|
| Business state is independent of view structure | Many framework-specific roles and interfaces |
| Scoped dependency graph makes lifetime explicit | Builders and components add wiring |
| Child routing limits knowledge of distant features | Tree navigation can be unfamiliar |
| Cross-platform role model supports shared review | iOS and Android still need platform-specific implementation |

Use RIBs when nested business scopes and large-team ownership justify a framework. A
small screen with one state owner rarely benefits from a separate RIB graph.

## References

- [Uber RIBs for iOS](https://github.com/uber/RIBs-iOS)
- [Uber RIBs documentation and tutorials](https://github.com/uber/RIBs/wiki)
