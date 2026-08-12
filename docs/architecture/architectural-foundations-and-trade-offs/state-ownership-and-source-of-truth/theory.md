---
title: "State Ownership and Source of Truth: Theory"
domain: "Architecture"
topic: "Architectural Foundations and Trade-offs"
concept: "State Ownership and Source of Truth"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 8
status: reviewed
last_reviewed: 2026-08-12
tags:
  - state-ownership
  - source-of-truth
  - data-flow
---

# State Ownership and Source of Truth: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A **source of truth** is the authoritative storage for one fact within a defined
scope. **Ownership** is the responsibility to keep that fact valid over its lifetime.
The owner decides which changes are allowed, coordinates side effects, and resolves
conflicts with other representations.

There is not one object that must own all app state. An app has many sources of truth
at different scopes. A view can own whether a disclosure is expanded. A feature can
own a checkout draft. A database can own durable downloaded records. A server can be
authoritative for account entitlement.

The design problem is to make the owner and scope explicit for each mutable fact.

## Classify State Before Choosing Storage

State should live as long as the user outcome needs it, not as long as the first view
that displays it.

| State kind | Example | Typical owner |
|---|---|---|
| Ephemeral view state | Focus, selection, disclosure, animation phase | The least common view ancestor that needs it |
| Feature state | Search query, results, request phase, navigation path | Feature model, store, or flow owner |
| Draft state | Unsaved form or edited document | Draft object with explicit save and discard policy |
| Session state | Signed-in identity or current workspace | App or session scope |
| Durable local state | Offline records and queued operations | Persistence or repository boundary |
| Remote authority | Subscription, inventory, server revision | Server, represented locally by a snapshot or cache |

This classification prevents two common errors. If durable work lives only in a
screen, navigation or process termination loses it. If every local toggle enters a
global store, unrelated views become coupled and simple interaction becomes hard to
reason about.

SwiftUI recommends storing UI state in the least common ancestor of the views that
need it. `State` gives SwiftUI ownership of that local storage; a `Binding` gives a
child access to storage owned elsewhere. Neither is intended to replace persistent
storage.

## Store Facts and Derive Views

Store the smallest set of independent facts. Compute values that follow from them:

```swift
struct Cart {
    var lines: [LineItem]
    var discount: Discount?

    var subtotal: Decimal {
        lines.reduce(0) { $0 + $1.price * Decimal($1.quantity) }
    }
}
```

Storing both `lines` and a mutable `subtotal` creates two values that can disagree.
Derived values may be cached for measured performance reasons, but then invalidation
becomes part of ownership. The cache is not a second authority; it is a disposable
representation with a refresh rule.

Duplication can also be correct at a boundary:

- a form draft differs from the last saved model;
- an offline replica differs from the last confirmed server version;
- a navigation route contains stable identifiers rather than live models;
- a rendered view receives a value snapshot of actor-isolated state.

In each case, name both versions and the operation that reconciles them. Without a
save, merge, refresh, or conflict rule, "temporary copy" usually becomes accidental
state divergence.

## Control Mutation Through Intents

Ownership is weaker if every consumer can write every property. Expose operations
that preserve required rules:

```swift
@Observable
@MainActor
final class CheckoutModel {
    private(set) var state: State = .editing(Cart())

    func add(_ product: Product) { /* validate and update */ }
    func submit() async { /* transition and coordinate the effect */ }
    func retry() async { /* allowed only from a retryable failure */ }
}
```

`private(set)` and intent methods make the mutation boundary visible. The owner can
reject an invalid transition, cancel earlier work, record an event, and update related
facts together.

A `Binding` is appropriate when a child edits a value within the parent's policy,
such as a text field changing a draft name. It becomes risky when the child can bypass
validation or change shared domain state at any time. In that case pass a value plus
an action closure, or expose a narrow method.

## Model State as Valid Transitions

Several optional booleans often allow impossible combinations:

```swift
var isLoading: Bool
var error: Error?
var order: Order?
```

Can `isLoading` and `error` both be set? Does an existing order remain visible during
refresh? A sum type can make relevant states explicit:

```swift
enum OrderState {
    case initial
    case loading
    case loaded(Order, isRefreshing: Bool)
    case failed(previous: Order?, message: String)
}
```

The exact cases follow user behavior. Do not create a large state machine for a
simple toggle. Use one when invalid combinations, effect ordering, retries, or
recovery are part of the feature's correctness.

The owner should update related state as one logical transition. Actors and
`@MainActor` prevent unsafe concurrent memory access, but isolation alone does not
prevent stale logical results. If a user starts search B after search A, the owner
still needs cancellation, operation identity, or a latest-result rule.

## Separate State, Events, and Effects

These terms answer different questions:

- **State:** what is true now and can be rendered or queried.
- **Event or intent:** what happened or what a caller requests.
- **Effect:** work outside the state transition, such as network, clock, disk, or
  analytics access.

Do not store a one-time event as a permanent boolean such as `shouldShowReceipt`.
After restoration, observation, or a second subscriber, it can fire again. Either
model presentation as real state with an identity and dismissal transition, or send
an event through an owner that defines delivery behavior.

Effects need owners too. The component that starts work should define cancellation,
result ordering, retry, and how outcomes re-enter state. A detached task that writes
shared state later creates a hidden second mutation path.

## Handle Several Authorities Explicitly

Offline and collaborative systems can have more than one valid representation, but
they still need an authority rule. Ask:

1. Which value may the user edit while offline?
2. Which version was last confirmed by the server?
3. How are local operations identified and retried?
4. How are conflicts detected: revision, timestamp, field versions, or server rule?
5. Can the UI show stale data, and how is staleness communicated?

"Single source of truth" does not mean pretending the cache and server are always
equal. A repository may own the local materialized view while the server owns final
business acceptance. The repository exposes one coherent policy to the feature and
tracks pending, confirmed, and conflicted state internally.

## Engineering Decisions

For each important state value, document:

- owner and scope;
- valid readers and mutation entry points;
- lifetime and persistence needs;
- isolation and effect owner;
- derived copies and their invalidation rule;
- remote authority and conflict policy;
- restoration, testing, and observability.

Tests should exercise transitions, not only final properties. Cover stale results,
cancellation, failure with previous data, duplicate events, and restoration when
those behaviors matter.

At Staff and Principal scope, align teams on ownership boundaries and identifiers,
not one universal state container. Shared session, navigation, persistence, and
remote-state contracts need explicit owners. Instrument illegal transitions,
conflict rates, retry age, and restoration failures so state problems are visible in
production.

## References

- [Managing user interface state](https://developer.apple.com/documentation/swiftui/managing-user-interface-state)
- [Managing model data in your app](https://developer.apple.com/documentation/swiftui/managing-model-data-in-your-app)
- [Data Flow Through SwiftUI — WWDC19](https://developer.apple.com/videos/play/wwdc2019/226/)
- [Discover Observation in SwiftUI — WWDC23](https://developer.apple.com/videos/play/wwdc2023/10149/)
