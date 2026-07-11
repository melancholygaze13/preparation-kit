---
title: "Composition Roots and Object Graphs: Theory"
domain: "Architecture"
topic: "Dependency Injection and Composition"
concept: "Composition Roots and Object Graphs"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 7
status: reviewed
last_reviewed: 2026-07-11
tags:
  - dependency-injection
  - composition-root
  - object-graph
---

# Composition Roots and Object Graphs: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

The composition root is where abstract needs meet concrete implementations. It chooses
production adapters, configuration, lifetimes, decorators, and feature entry points.
The rest of the app receives already constructed collaborators.

An iOS app can have a small root hierarchy:

```text
App Root
├── Process services: HTTP, database, telemetry
├── Session scope: account, repositories, permissions
└── Scene root
    ├── Navigation owner
    └── Feature roots
        └── View models, use cases, child flows
```

There may be one top-level root plus delegated feature composition roots. Delegation
keeps the app root from importing every internal feature type.

## Assemble from Longer to Shorter Lifetime

```swift
@MainActor
struct AppComposition {
    let api: APIClient
    let database: AppDatabase
    let orders: OrderRepository

    init(configuration: AppConfiguration) {
        api = APIClient(configuration: configuration.api)
        database = AppDatabase(configuration: configuration.database)
        orders = LiveOrderRepository(api: api, database: database)
    }

    func makeOrderFeature(id: Order.ID) -> OrderViewModel {
        OrderViewModel(
            loadOrder: LoadOrder(repository: orders),
            submitOrder: SubmitOrder(repository: orders)
        )
    }
}
```

The root owns stable infrastructure and creates feature-scoped presentation objects.
In a real app, database initialization may be async and failure-capable; model that
startup state rather than blocking or force-unwrapping.

Do not expose `AppComposition` to all feature code. That turns it into a service
locator. Pass the result of `makeOrderFeature` or a narrow factory to the caller that
owns feature creation.

## Use Feature Factories at Runtime Boundaries

Apps create screens and child flows after launch. A feature factory can capture the
allowed shared dependencies and expose one creation operation:

```swift
struct CheckoutFactory {
    let orders: OrderRepository
    let payments: PaymentAuthorizing

    @MainActor
    func make(cartID: Cart.ID) -> CheckoutCoordinator {
        CheckoutCoordinator(cartID: cartID, orders: orders, payments: payments)
    }
}
```

The factory belongs near the navigation or module boundary. The resulting feature owns
its short-lived graph. Avoid a factory with generic `resolve<T>()`; its requirements
are invisible and failures move to runtime.

## Detect Cycles as Design Feedback

Object cycles often reveal mixed responsibilities: analytics needs session, session
needs networking, networking wants analytics. Break the cycle by separating startup
events, using a narrow callback, introducing an orchestration owner, or moving one
responsibility.

Lazy properties and provider closures can defer creation when a dependency is truly
needed later. They should not hide a logical cycle. A provider also needs a lifetime
contract: does each call return the same instance, a new one, or the current scope?

## Configure Without Spreading Environment Checks

Read build configuration, feature flags, command-line arguments, and process environment
at the root. Convert them into typed configuration and inject relevant values. Feature
code should not repeatedly call `ProcessInfo`, inspect bundle flags, or decide whether
it is running under tests.

Use decorators at composition: wrap a client with metrics, caching, retry, or logging
only when the contract permits that behavior. Retry is unsafe for some mutations, so
a universal network decorator can violate product policy.

## Manual Wiring Versus a Container

| Approach | Benefits | Costs |
|---|---|---|
| Manual Swift composition | Compiler-visible, direct debugging, no framework | Boilerplate for large graphs |
| Generated graph | Compile-time validation and less repetition | Build tooling and generated-code debugging |
| Runtime container | Flexible registration and dynamic resolution | Runtime failures, hidden graph, startup/debug cost |

Start manually. Adopt tooling when graph size and repeated mechanical wiring create a
measured cost. Keep container APIs inside roots; application components should still
receive normal constructor parameters.

## Engineering Decisions

Test roots with smoke tests that create each major feature under production-like
configuration. Unit tests target consumers and adapters separately. Startup tests cover
missing configuration, database failure, logout, scene creation, and extension graphs.

At Staff scope, distribute composition ownership by feature while defining shared
infrastructure APIs and scopes. Visualize dependency graphs, reject cycles, and keep
extension targets from importing capabilities they cannot use.

## References

- [Initialization — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/initialization/)
- [Access Control — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/accesscontrol/)
- [Inversion of Control Containers and Dependency Injection](https://martinfowler.com/articles/injection.html)
