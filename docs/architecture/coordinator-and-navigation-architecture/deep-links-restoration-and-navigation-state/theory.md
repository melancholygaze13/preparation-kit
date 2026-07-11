---
title: "Deep Links, Restoration, and Navigation State: Theory"
domain: "Architecture"
topic: "Coordinator and Navigation Architecture"
concept: "Deep Links, Restoration, and Navigation State"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 8
status: reviewed
last_reviewed: 2026-07-11
tags:
  - deep-links
  - restoration
  - navigation-state
---

# Deep Links, Restoration, and Navigation State: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A deep link is a request to reach a product destination, not an instruction to push a
specific screen. Route handling is a pipeline:

```text
URL / Activity / Notification
        -> Parse typed route
        -> Validate and authorize
        -> Resolve prerequisites
        -> Delegate to owning flow
        -> Build navigation state
```

Restoration runs through the same route model but starts from previously persisted,
versioned state. Both inputs may be stale or invalid.

## Parse into Stable Product Routes

```swift
enum AppRoute: Codable, Equatable {
    case product(Product.ID)
    case order(Order.ID)
    case checkout(Cart.ID)
}
```

Keep URL syntax in the parser. Feature coordinators consume `AppRoute` or a narrower
feature route, not raw URL components. This separates public link compatibility from
internal screen structure.

Reject malformed identifiers, unexpected hosts, duplicate parameters, and oversized
payloads. Never trust a link to prove authorization. A valid order ID does not mean
the current account may view it.

## Resolve Prerequisites Explicitly

A requested destination may require:

- a signed-in account;
- a selected workspace or store;
- fresh data or a local record;
- completion of onboarding or consent;
- an available feature or supported app version.

Model the outcome: open now, defer until authentication, redirect to a safe fallback,
or reject. If login is required, retain the typed pending route and resume it after
successful authentication. Clear it on cancel, account change, expiry, or logout.

Avoid building a sequence of view controllers before async prerequisites finish. The
flow owner should transition through valid states and remain reversible.

## Represent Navigation State Minimally

For SwiftUI, a typed array can drive `NavigationStack`:

```swift
enum CatalogDestination: Hashable, Codable {
    case product(Product.ID)
    case reviews(Product.ID)
}

@Observable
@MainActor
final class CatalogRouter {
    var path: [CatalogDestination] = []
}
```

Typed paths are easier to inspect, migrate, and validate than a type-erased
`NavigationPath`. `NavigationPath` is useful for mixed `Hashable` values and offers a
codable representation only when its elements are codable.

Store route identifiers and restorable drafts, not loaded models or view instances.
On restoration, resolve current data and shorten the path if an item no longer exists.
The nearest valid destination is better than a broken hierarchy.

## Distinguish Restoration from Durable Product State

Navigation restoration preserves continuity. It is not the authority for unsaved
critical work. A checkout draft or offline operation that must survive termination
belongs in durable product storage; the route stores its identifier.

Do not restore temporary authentication prompts, stale alerts, loading spinners, or
operations that cannot safely repeat. Re-evaluate current authentication, feature
flags, permissions, and product availability before rebuilding the route.

UIKit scene-based apps can store restoration context in `NSUserActivity`; view-controller
restoration can recreate eligible hierarchies through restoration identifiers. A
coordinator still needs to reconcile restored UI with current application state.

## Support Multiple Scenes and Competing Routes

Each scene owns its navigation and restoration state. App-level routing decides which
scene should receive a route or whether a new scene is appropriate. Do not share one
global mutable path among windows.

Define behavior when a second route arrives during an active flow: replace, queue,
merge, focus an existing destination, ask the user, or reject. Payment and editing
flows may not be safe to discard automatically.

## Version and Observe the Route Contract

Public URLs and persisted paths outlive internal refactors. Keep parsing backward
compatible when product requirements demand it. Version restoration payloads and map
old routes to current destinations. Do not encode Swift type names as a permanent
public contract.

Track parse failures, authorization rejection, fallback use, time to destination, and
restoration truncation without logging sensitive link payloads.

## Engineering Decisions

Tests cover valid and malformed links, logged-out deferral, account changes, missing
entities, stale restored paths, route version migration, repeated links, and multiple
scenes. UI integration tests verify actual stack and modal presentation.

At Staff scope, assign ownership for the external route registry, compatibility,
analytics, security review, and feature handoff. Feature teams should own typed route
interpretation behind a small app-level router.

## References

- [NavigationPath — SwiftUI](https://developer.apple.com/documentation/swiftui/navigationpath)
- [Understanding the navigation stack](https://developer.apple.com/documentation/swiftui/understanding-the-navigation-stack)
- [Restoring your app's state](https://developer.apple.com/documentation/uikit/restoring-your-app-s-state)
- [Preserving your app's UI across launches](https://developer.apple.com/documentation/uikit/preserving-your-app-s-ui-across-launches)
