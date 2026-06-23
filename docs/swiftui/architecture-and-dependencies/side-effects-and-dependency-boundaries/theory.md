---
title: "Side Effects and Dependency Boundaries: Theory"
domain: "SwiftUI"
topic: "Architecture and Dependencies"
concept: "Side Effects and Dependency Boundaries"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 8
status: reviewed
last_reviewed: 2026-06-23
tags:
  - dependency-injection
  - side-effects
  - testing
---

# Side Effects and Dependency Boundaries: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A dependency is a capability whose behavior the feature does not own: network,
storage, clock, identifiers, analytics, location, permissions, or another feature.
Make that capability explicit at the feature boundary.

The feature owns policy—when to load, retry, present, or commit. An adapter owns the
mechanics of talking to an external system.

## How It Works

### Inject Required Capabilities

Initializer injection makes construction fail early and keeps required dependencies
visible:

```swift
struct ProductClient: Sendable {
    var product: @Sendable (Product.ID) async throws -> Product
}

@MainActor
@Observable
final class ProductModel {
    private let client: ProductClient
    private let clock: any Clock<Duration>

    init(client: ProductClient, clock: any Clock<Duration>) {
        self.client = client
        self.clock = clock
    }
}
```

A protocol is useful when several implementations share a meaningful behavioral
contract or when reference identity matters. A small capability struct with closures
can be simpler for a narrow operation. Do not create a protocol for every concrete
type solely to claim testability.

Inject the smallest needed surface. A feature that only loads a product should not
receive an `APIClient` capable of deleting accounts, changing global headers, and
accessing unrelated endpoints.

Place the contract where the policy owner can define it. A feature-owned capability
describes what the feature needs, while infrastructure supplies the adapter. If the
networking module owns every protocol, feature code often inherits transport-shaped
APIs and loses control of error and caching semantics.

Do not abstract stable value types merely to reverse every import. The dependency
rule matters at volatile behavior and ownership boundaries. Shared domain values can
be concrete when both sides agree on their meaning and evolution policy.

### Composition Root

Concrete adapters are created near the app, scene, or feature entry point. That
composition root supplies production networking, storage, analytics, and feature
models. Previews and tests construct the same feature with deterministic substitutes.

Avoid process-wide service locator access from feature code. It hides requirements,
allows runtime failure, couples tests to shared mutable configuration, and makes
multiwindow or account scoping difficult.

The SwiftUI environment is dependency injection through the view hierarchy. It is
appropriate for values many descendants legitimately need, such as a feature model,
locale-like policy, or presentation action. It should not become an untyped global
container for every service.

### Side-Effect Boundaries

Keep external effects out of `body`. View evaluation can happen frequently and must
remain a description of UI. Start work from event handlers, `.task`, `refreshable`,
or model operations whose lifetime is explicit.

Separate domain decision from adapter mechanics:

```text
user event -> feature validates -> dependency performs effect
           <- typed result or error <- adapter translates external response
```

Adapters translate transport models, status codes, callbacks, and persistence
details into stable feature or domain values. A view should not decide retry policy
from an HTTP status code.

### Contract Includes Behavior

A method signature is not the whole contract. Document:

- actor isolation and `Sendable` requirements;
- cancellation propagation;
- whether repeated calls are idempotent or deduplicated;
- cache and freshness semantics;
- error categories and retry safety;
- callback or stream completion behavior;
- privacy and observability requirements.

Tests that substitute a dependency must preserve the behavior the feature relies on.
An instant fake that ignores cancellation can miss stale-result defects. A fake
clock, controlled suspension, and configurable errors make important ordering testable.

### Time, Randomness, and Identity

`Date.now`, random values, and UUID creation are dependencies when they affect
policy or expected output. Inject a clock or identifier generator so tests control
expiry, debounce, ordering, and idempotency.

Do not inject every pure standard-library function. Use a boundary where
nondeterminism or external state affects a decision. Over-injection makes APIs noisy
without increasing confidence.

### Error Translation

Infrastructure errors should be translated before presentation. A feature may need
categories such as offline, unauthorized, unavailable, conflict, or retryable server
failure. The UI then chooses an accessible message and action without importing a
networking library.

Preserve underlying diagnostic context for secure logging, but do not expose raw
server messages or secrets to users. Cancellation remains control flow and normally
does not become a visible error.

### Analytics and Logging

Analytics is a side effect. Feature code can emit a typed event at a meaningful
transition; the adapter handles vendor schema, batching, consent, and transport.
Avoid scattering vendor calls throughout views.

Define which layer records an event so it fires once. Logging both the button and
model operation can double-count. Never include sensitive domain values by default.

### Testing Layers

Unit tests use deterministic dependencies to verify policy, transitions, and effect
requests. Contract tests run each adapter against a controlled service or store to
verify mapping and behavioral guarantees. A smaller set of integration tests checks
that the composition root wires real implementations correctly.

Mocks that assert every incidental call create brittle tests. Prefer outcome and
contract assertions. Verify exact interaction only when order, count, or absence is
part of correctness, such as idempotent payment submission.

Fault-injection tests should cover slow responses, cancellation, malformed data,
partial writes, and repeated delivery. These cases verify the dependency contract
under the conditions that cause production incidents, not only a successful stub.

### Lifecycle and Scoping

Dependencies have lifetimes. An authenticated client may be account-scoped; a model
cache may be scene-scoped; a stateless formatter may be a value. A singleton can
accidentally leak one account's state into another or couple independent scenes.

Construction should make scope clear. When session changes, dispose or reconfigure
the account graph deliberately rather than mutating hidden globals under active
features.

### Security and Configuration

Configuration is also a dependency. Base URLs, feature flags, credentials, and
entitlements should enter through controlled configuration or secure storage, not
hard-coded view branches. Never put API secrets in the app repository or package
public defaults.

Distinguish a product feature flag from dependency selection. A flag decides user
behavior; the composition root can use that decision to select an implementation.
Reading flags directly throughout views spreads rollout policy and makes removal hard.

Adapters enforce authentication and data-classification rules. Feature models should
receive authorized results, yet still handle revoked access because authorization can
change between request and commit.

## Constraints and Guarantees

- SwiftUI environment values propagate down a view hierarchy, not across unrelated
  scenes or arbitrary service code.
- Dependency injection improves replaceability but does not guarantee substitutes
  obey the production contract.
- Protocols express interface requirements, not lifecycle, cancellation, or quality
  unless those behaviors are documented and tested.
- External effects can succeed after a caller stops awaiting; idempotency and
  reconciliation remain domain responsibilities.

## Engineering Decisions

| Need | Boundary |
|---|---|
| Required feature service | Initializer injection |
| Hierarchy-wide SwiftUI context | Typed environment value |
| Narrow async capability | Small protocol or closure-based client |
| Nondeterministic policy input | Clock, ID generator, or random source |
| Vendor analytics | Typed application events plus adapter |
| Complex external mapping | Repository or adapter with contract tests |

## Production Application

Inventory hidden dependency access and prioritize high-risk effects: money,
authentication, destructive writes, and long-lived streams. Add seams at ownership
boundaries rather than wrapping every API in advance.

At Staff scope, publish dependency contracts, standard fakes, privacy rules, and
adapter ownership. Monitor latency, cancellation, retry, and error mapping at the
boundary. A shared client should reduce duplicated infrastructure without becoming
an unrestricted cross-feature service locator.

## References

- [Model data](https://developer.apple.com/documentation/swiftui/model-data)
- [Environment values](https://developer.apple.com/documentation/swiftui/environmentvalues)
- [Discover Observation in SwiftUI](https://developer.apple.com/videos/play/wwdc2023/10149/)
- [Explore structured concurrency in Swift](https://developer.apple.com/videos/play/wwdc2021/10134/)
