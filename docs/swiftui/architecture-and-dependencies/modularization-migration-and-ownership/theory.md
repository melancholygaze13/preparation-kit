---
title: "Modularization, Migration, and Ownership: Theory"
domain: "SwiftUI"
topic: "Architecture and Dependencies"
concept: "Modularization, Migration, and Ownership"
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
  - modularization
  - migration
  - ownership
---

# Modularization, Migration, and Ownership: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A module is useful when it enforces a meaningful dependency and ownership boundary.
It should expose a small entry API and hide implementation. More targets do not
automatically create better architecture; they add graph, public API, build, release,
and coordination costs.

Modularize in response to change patterns and constraints, then migrate through
small compatibility seams that can be measured and reversed.

## How It Works

### Choose Boundaries from Change and Ownership

Good feature candidates have a cohesive user capability, an accountable owner, and
limited reasons to change with other features. Look at version-control history:
which files change together, which teams review them, and where incidents originate.

Common module types include:

- feature entry and implementation;
- domain contracts and value types;
- platform capabilities such as networking or analytics;
- design-system components;
- test support used across module boundaries.

Avoid a horizontal module for every technical noun. `Models`, `Utilities`, and
`Managers` often become dependency hubs used by everything. A shared module requires
stricter inclusion criteria and ownership than a feature-local folder.

### Dependency Direction

Feature implementation can depend on stable domain and capability contracts. The app
composition target depends on feature entry modules and concrete adapters. A feature
should not import another feature's implementation to navigate or read its state.

```text
App composition -> Feature entry -> Feature implementation
       |                  |                 |
       +----------> capability contracts <-+
                          ^
                          |
                 infrastructure adapters
```

The exact packaging can vary, but dependencies should point toward stable abstractions
owned at the boundary. Detect and reject cycles in CI. A cycle usually indicates
misplaced shared policy or two boundaries that should be one.

### Entry APIs

A SwiftUI feature can expose an entry view or factory, input configuration, and typed
output actions:

```swift
public struct CheckoutFeature: View {
    public init(
        cartID: Cart.ID,
        client: CheckoutClient,
        onCompleted: @escaping (Order.ID) -> Void
    )
}
```

Keep internal views and model types internal. Public APIs create compatibility and
documentation obligations. Do not expose storage wrappers, concrete navigation
containers, or internal state solely so another feature can reach through the boundary.

Cross-feature navigation should target a feature entry intent. The composition layer
decides whether that feature appears in a stack, split view, sheet, or another scene.

### Module Granularity

Every target can improve incremental compilation only if dependency structure and
change distribution support it. Too many tiny targets add planning overhead, product
linking work, resource management, test startup, and public API maintenance.

Measure clean build, incremental build after representative edits, test duration,
cache effectiveness, and dependency fan-out. A frequently changing low-level module
can invalidate most of the graph. Splitting leaf features may isolate work better
than splitting a central utility library.

Start with source folders and access control when compile-time enforcement is not yet
worth target cost. A folder boundary with ownership and tests can later become a
module after its API stabilizes.

### Swift Package Manager Boundaries

Each Swift package target is a module with its own namespace and access control.
Packages can group several targets and expose selected library products. Local
packages are useful for modular application code; remote packages add versioning and
distribution concerns.

Pin and update external dependencies through a deliberate policy. A third-party
package adds supply-chain, platform, migration, binary size, and maintenance risk.
Wrap it only where substitution or domain translation is valuable; a wrapper that
copies the entire vendor API creates cost without insulation.

### Incremental Migration

Do not combine UI rewrite, state redesign, data migration, and module extraction into
one release unless unavoidable. Establish a seam first:

1. Define current behavior and success metrics.
2. Introduce a stable contract around the old implementation.
3. Add tests and observability at the boundary.
4. Build the new implementation behind the same contract.
5. Route a controlled cohort or feature slice to it.
6. Compare correctness and operational metrics.
7. Expand, retain rollback, then remove the old path.

Compatibility adapters are temporary architecture with an owner and removal condition.
Without that plan, they become permanent duplicate systems.

### State and Navigation during Migration

Old and new implementations must not become competing sources of truth. Choose one
owner and translate at the boundary. For a UIKit-to-SwiftUI migration, the existing
flow may initially own navigation while a SwiftUI feature emits route intents. Later,
ownership can move in a separate step.

When both systems need data, share a repository or stable domain model rather than
synchronizing two UI models. Define how tasks cancel and how state transfers when
switching implementations.

### Rollout and Observability

Feature flags enable controlled rollout only when the old and new paths can coexist
safely. Record which implementation handled an event, its outcome, latency, crash or
hang signals, and user-visible error category. Avoid high-cardinality or sensitive logs.

Rollback must include schema compatibility. A new implementation that writes data
the old path cannot read is not safely reversible. Use expand-and-contract data
changes: teach readers the new form before writers depend on it, then remove old
support after the rollback window.

### Ownership and Governance

Every module needs ownership for API review, CI health, release compatibility,
documentation, operational alerts, and dependency upgrades. “Shared” cannot mean
“owned by everyone.”

Architecture rules need enforcement and an exception process. Automated import or
graph checks prevent accidental cycles. Time-bounded exceptions let delivery continue
while preserving accountability for repayment.

At Principal scope, optimize for organizational flow as well as code shape. A boundary
that requires three teams to approve every feature change is not autonomous even if
its dependency graph is technically clean.

## Constraints and Guarantees

- A Swift target defines a module and access-control boundary.
- SwiftPM products expose selected targets; packages and modules are not identical concepts.
- Module extraction cannot repair unclear state ownership by itself.
- Public APIs increase compatibility cost and should remain smaller than implementation.
- Rollout flags do not provide rollback if persisted data or server contracts are incompatible.

## Engineering Decisions

| Signal | Response |
|---|---|
| Files and ownership change together | Consider one feature boundary |
| Frequent cross-feature imports | Define entry contracts or reconsider split |
| Central module invalidates most builds | Reduce fan-out or move volatile code outward |
| Boundary still changing rapidly | Keep source-level boundary until API stabilizes |
| Large risky rewrite | Contract, adapter, staged rollout, rollback |
| Shared package has no owner | Assign ownership before increasing adoption |

## Production Application

Maintain a dependency graph and a small set of architecture fitness checks. Track
incremental build time, module fan-in and fan-out, cycle violations, cross-team review
latency, and migration cohort outcomes. Metrics should guide restructuring rather
than justify a predetermined target count.

At Staff and Principal scope, publish a target architecture and a sequenced migration
portfolio. Fund compatibility work, operational dashboards, and old-path removal.
Success is faster safe change with clear accountability, not the number of packages.

## References

- [Introducing packages](https://docs.swift.org/swiftpm/documentation/packagemanagerdocs/introducingpackages/)
- [Swift Package Manager](https://docs.swift.org/swiftpm/documentation/packagemanagerdocs/)
- [Adding dependencies to a Swift package](https://docs.swift.org/swiftpm/documentation/packagemanagerdocs/addingdependencies/)
- [Migrating your app to SwiftUI](https://developer.apple.com/documentation/swiftui/migrating-your-app-to-swiftui)
