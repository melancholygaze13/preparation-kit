---
title: "Protocol API Evolution and Isolation: Theory"
domain: "Swift"
topic: "Protocols"
concept: "Protocol API Evolution and Isolation"
page_type: theory
interview_priority: high
estimated_read_minutes: 2
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Protocol API Evolution and Isolation: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Protocols invert ownership: the protocol owner publishes a contract, conformer owners
implement it, and client owners depend on it generically. Evolution requires all three
groups and all module build settings to remain compatible.

## How It Works

Adding a defaulted requirement can avoid immediate source errors, but existing conformers
receive the default until rebuilt/changed and behavior may differ from an intended custom
implementation. Use a new refinement protocol when the capability is optional or adoption
must be staged independently.

Actor isolation is part of the function contract. A main-actor type cannot truthfully
satisfy a nonisolated synchronous requirement using isolated state. Options include making
the protocol actor-aware, providing a truthful nonisolated witness, redesigning the API,
or using a global-actor-isolated conformance where supported and appropriate.

### Core Invariants

- Protocol changes preserve documented laws or ship as a new capability/version.
- Witness isolation matches requirement isolation.
- Sendability promises reflect the entire stored/captured graph.
- Retroactive and unchecked conformances have named owners and migration plans.
- Mixed Swift modes and default-isolation settings are tested at module boundaries.

### Constraints and Guarantees

- Defaults do not make every requirement addition behavior-compatible.
- `@preconcurrency` reduces checking at a legacy boundary; it does not prove safety.
- Isolated conformances restrict where the conformance can be used.
- Protocol resilience depends on distribution model and library-evolution constraints.

## Engineering Judgment

Prefer small capability protocols and refinements. Add requirements only with conformer
inventory, defaults that are universally correct, client fixtures, and rollout policy.
Use isolation annotations to express ownership, not to appease diagnostics.

## Production Application

Compile representative conformers and generic clients across supported toolchains and
module settings. Track adoption, legacy annotations, unchecked conformances, dynamic
isolation failures, and beta-SDK conformance collisions.

## Staff and Principal Perspective

Assign protocol owners, semantic versioning, conformance certification, diagnostics policy,
and retirement plans. Split organizational interfaces before they become release trains.

## References

- [The Swift Programming Language: Protocols](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/protocols/)
- [SE-0302: Sendable and @Sendable closures](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0302-concurrent-value-and-concurrent-closures.md)
- [SE-0364: Retroactive conformance warnings](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0364-retroactive-conformance-warning.md)
- [SE-0470: Global-actor isolated conformances](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0470-isolated-conformances.md)
