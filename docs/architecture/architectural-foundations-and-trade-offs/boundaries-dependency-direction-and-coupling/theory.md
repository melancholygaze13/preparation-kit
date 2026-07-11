---
title: "Boundaries, Dependency Direction, and Coupling: Theory"
domain: "Architecture"
topic: "Architectural Foundations and Trade-offs"
concept: "Boundaries, Dependency Direction, and Coupling"
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
  - boundaries
  - dependency-direction
  - coupling
---

# Boundaries, Dependency Direction, and Coupling: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A boundary controls how change crosses between parts of a system. It gives one
part a contract while hiding decisions that the caller should not need to know.
The goal is not the maximum number of layers. The goal is to keep an important
change local.

**Coupling** is the degree to which one part depends on another. It includes more
than a direct type reference. Two components are coupled when they must agree on
data shape, call order, threading, lifetime, error meaning, release timing, or a
shared mutable value.

**Cohesion** describes how strongly the responsibilities inside one component
belong together. A good boundary tends to place code that changes together on the
same side. It separates code that changes for different product reasons or under
different ownership.

## Recognize Meaningful Coupling

Not all coupling is harmful. A checkout feature should depend on its order model.
Removing every dependency would remove useful structure. The concern is coupling
to details that are likely to change independently.

| Coupling | Example | Production consequence |
|---|---|---|
| Type | A feature imports a third-party networking response | Vendor or schema changes spread into presentation code |
| Behavioral | A caller must invoke `prepare` before `start` | Incorrect call order becomes a runtime failure |
| Temporal | Two operations must complete in a narrow sequence | Cancellation and retry can produce invalid state |
| Lifetime | A callback assumes its owner still exists | Work can outlive a screen or retain it unexpectedly |
| Data | Several components mutate the same model | Ownership and conflict resolution become unclear |
| Release | Many teams must update together | Small changes require broad coordination |

Count the knowledge that crosses the boundary, not only the number of imports.
A single global service locator can create more coupling than several explicit
initializer parameters because any code can reach any service and the real object
graph is hidden.

## Draw a Boundary Around a Reason to Change

A useful boundary normally protects one of these differences:

- **Policy versus mechanism:** checkout rules versus `URLSession` transport.
- **Product versus framework:** navigation intent versus a concrete UIKit push.
- **Stable versus volatile:** a small analytics contract versus changing vendors.
- **Ownership:** one team owns authentication while feature teams consume it.
- **Lifetime:** feature-scoped state versus app-scoped identity.
- **Trust:** sensitive data access versus general presentation code.

Start with a concrete change scenario. If replacing the API schema requires edits
in decoding, views, validation, and tests, the transport model has crossed too far.
If changing button copy requires updates through five layers, the boundaries are
too fine or responsibilities are on the wrong side.

Boundary placement is therefore a trade-off. A larger component has fewer contracts
but a wider change surface. A smaller component can isolate change, but it adds
interfaces, mapping, object construction, navigation, and debugging steps.

## Choose Dependency Direction

Dependency direction answers which side names the contract. Consider a feature that
needs to load an order:

```swift
protocol OrderLoading {
    func loadOrder(id: Order.ID) async throws -> Order
}

final class OrderAPIAdapter: OrderLoading {
    private let client: HTTPClient

    func loadOrder(id: Order.ID) async throws -> Order {
        let response = try await client.get(OrderResponse.self, path: "/orders/\(id)")
        return response.domainModel
    }
}
```

The feature owns `OrderLoading` because it describes what the feature needs in
product terms. The adapter depends on that contract and translates volatile HTTP
details. The feature does not import `HTTPClient` or `OrderResponse`.

This is **dependency inversion**: high-level policy does not depend directly on a
low-level mechanism. Both depend on a contract shaped by policy. It is useful when
the mechanism is volatile, has multiple implementations, crosses a team boundary,
or needs a controlled test replacement.

Do not add a protocol automatically. Directly depending on a stable concrete value
type is often clearer. A protocol that exposes every method and transport type from
one concrete client does not invert the dependency. It only renames it.

## Keep Contracts Small and Honest

A boundary contract should expose the minimum capability the consumer needs. Small
contracts reduce the number of reasons both sides must change together.

Prefer product meaning over implementation shape:

```swift
// Product-level outcome
func submit(_ order: PendingOrder) async throws -> SubmissionReceipt

// Leaks transport policy to the feature
func post(path: String, body: Data) async throws -> (Data, HTTPURLResponse)
```

The higher-level call can still be the wrong abstraction if every feature requires
different submission behavior. Build the contract from real callers and changes,
not from a desire to standardize all operations.

Avoid a shared `Common` module that becomes the default owner of unrelated types.
Shared code creates a shared release and ownership boundary. A small duplicate can
be cheaper than coupling independent features to a central type that changes often.

## Enforce the Boundary at the Right Strength

Swift gives several enforcement levels:

| Mechanism | What it enforces | Cost |
|---|---|---|
| Naming and source folders | Communicates intent | No compiler enforcement |
| `private`, `internal`, `package` | Limits which declarations callers can use | Requires deliberate API design |
| Separate targets or modules | Limits imports and exposes explicit APIs | Build graph, mapping, and test setup |
| Dependency checks | Rejects forbidden edges or cycles | Tooling and exception maintenance |
| Contract and integration tests | Verifies behavior across a boundary | Test data and environment cost |

Swift access control can hide implementation inside a file, module, or package.
Each Xcode target is a module, and Swift packages can contain several targets.
These tools can turn a design rule into a compiler rule, but more targets are not
free. Use the weakest mechanism that reliably protects the risk.

A single team can start with feature folders and `internal` types. Separate modules
are justified when accidental imports recur, independent ownership matters, or a
public contract needs deliberate evolution.

## Detect Boundaries That Are Failing

Watch changes rather than diagrams. Warning signs include:

- one feature edit changes unrelated modules;
- domain tests need networking or UI frameworks;
- transport or persistence models appear throughout the app;
- a shared type grows optional fields for unrelated consumers;
- dependency cycles require service lookup or delayed wiring;
- a small API change needs coordinated releases across many teams.

Respond to the specific pressure. Add mapping where external schemas leak. Move a
contract to the consumer when a provider dictates its internal types. Split a module
when ownership and change history show two stable groups. Do not rewrite the whole
architecture because one edge is wrong.

## Engineering Decisions

For each proposed boundary, ask:

1. Which change or failure should stay on one side?
2. What knowledge must cross, including data, errors, lifetime, and ordering?
3. Which side is more stable and should own the contract?
4. How will the rule be enforced and tested?
5. What mapping, performance, build, and coordination cost does it add?
6. What evidence would justify strengthening, moving, or removing it?

At Staff and Principal scope, review the real dependency graph and change history.
Define a few system rules, such as features cannot import concrete infrastructure,
and automate only rules that protect an important quality. Give each shared contract
an owner, compatibility policy, migration path, and exception process.

## References

- [Access Control — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/accesscontrol/)
- [Organizing your code with local packages](https://developer.apple.com/documentation/xcode/organizing-your-code-with-local-packages)
- [PackageDescription — Swift Package Manager](https://docs.swift.org/package-manager/PackageDescription/PackageDescription.html)
