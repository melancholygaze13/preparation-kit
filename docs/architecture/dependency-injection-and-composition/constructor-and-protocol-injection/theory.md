---
title: "Constructor and Protocol Injection: Theory"
domain: "Architecture"
topic: "Dependency Injection and Composition"
concept: "Constructor and Protocol Injection"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 7
status: reviewed
last_reviewed: 2026-08-12
tags:
  - dependency-injection
  - constructor-injection
  - protocols
---

# Constructor and Protocol Injection: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Dependency injection means an object receives the collaborators it needs instead of
constructing or locating them internally. Constructor injection is the default because
it makes requirements visible and lets Swift initialization guarantee a usable value.

```swift
@MainActor
final class OrderViewModel {
    private let loadOrder: OrderLoading
    private let submitOrder: OrderSubmitting

    init(loadOrder: OrderLoading, submitOrder: OrderSubmitting) {
        self.loadOrder = loadOrder
        self.submitOrder = submitOrder
    }
}
```

Any caller can see what must exist. Tests provide controlled implementations; production
composition provides real ones.

## Separate Injection from Inversion

Injection answers **how an implementation arrives**. Dependency inversion answers
**which side defines the contract**. Injecting `URLSession` is still injection, but the
consumer remains coupled to networking. Injecting a consumer-owned `OrderLoading`
port can also invert the dependency toward product policy.

Not every injected dependency needs a protocol. A stable value, actor, formatter, or
configuration struct can be injected concretely. Add a protocol when it narrows a
capability, separates ownership, supports real implementations, or contains volatility.

## Choose the Injection Form

| Form | Fits | Risk |
|---|---|---|
| Constructor | Required collaborators and configuration | Long initializer can reveal an oversized type |
| Property | Framework-created object or genuinely optional late setup | Partially initialized or mutable graph |
| Method parameter | Dependency needed for one operation | Repetition and caller burden |
| Closure capability | One or a few focused operations | Weak naming if many closures accumulate |
| Environment | Deliberately shared view-hierarchy context | Hidden requirement and runtime failure if missing |

Prefer constructor injection for requirements. If UIKit or SwiftUI creates the outer
object, inject immediately at its composition boundary. Avoid implicitly unwrapped
properties that crash when wiring is forgotten.

Method injection is useful for context that varies per call, such as a transaction or
authorization token. It should not make every call supply the same stable service.

## Shape Narrow Capabilities

A broad `APIClientProtocol` with every endpoint lets every feature call everything.
A feature-shaped capability documents allowed behavior:

```swift
struct SearchClient: Sendable {
    var results: @Sendable (String) async throws -> [SearchResult]
}
```

Closure-based clients are convenient for small Swift capabilities and test overrides.
Protocols fit public module contracts and related operations. Both require semantic
rules for cancellation, errors, ordering, and thread or actor use.

Do not use mocks as the only reason for abstraction. Pure value types and deterministic
functions can be tested directly. Integration boundaries need real adapter tests even
when inner tests use fakes.

## Preserve Concurrency Contracts

An injected reference that crosses concurrency domains must be safe to share. Use
`Sendable` values, actors, global-actor-isolated types, or explicit synchronization.
Marking a protocol `Sendable` states a semantic requirement that implementations must
honor.

A `@MainActor` view model can call an async dependency without requiring that all of
the dependency's work run on the main actor. Avoid injecting mutable, non-sendable
singletons into concurrent features and then suppressing compiler checks.

## Read Large Initializers as Feedback

Ten dependencies may indicate a feature that coordinates ten legitimate capabilities.
It may also show that the type owns unrelated responsibilities. Do not hide the signal
inside a container or one `Dependencies` bag without reviewing cohesion.

A typed dependency group is useful when the values share one scope and evolve together.
Avoid a universal bag that exposes every application service to every feature.

## Pros and Cons

| Benefits | Costs and risks |
|---|---|
| Requirements are visible at creation | More wiring at composition boundaries |
| Values can be valid after initialization | Initializers grow with poor cohesion |
| Tests control external behavior | Fakes can diverge from production adapters |
| Concrete implementations remain replaceable | Protocol proliferation adds indirection |
| Concurrency requirements can be explicit | Injection does not choose correct scope automatically |

## Engineering Decisions

Review whether each dependency is required, which side owns its contract, what lifetime
it needs, and whether it can cross actors safely. Test the consumer with focused fakes
and the adapter with contract or integration tests.

At Staff scope, publish small capability conventions, concurrency annotations, and
module ownership. Avoid mandating protocols for all types or hiding oversized graphs
behind code generation.

## References

- [Initialization — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/initialization/)
- [Protocols — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/protocols/)
- [Inversion of Control Containers and Dependency Injection](https://martinfowler.com/articles/injection.html)
