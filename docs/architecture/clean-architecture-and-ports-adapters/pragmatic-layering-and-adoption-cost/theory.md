---
title: "Pragmatic Layering and Adoption Cost: Theory"
domain: "Architecture"
topic: "Clean Architecture and Ports and Adapters"
concept: "Pragmatic Layering and Adoption Cost"
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
  - clean-architecture
  - adoption
  - trade-offs
---

# Pragmatic Layering and Adoption Cost: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Clean Architecture is a dependency strategy, not a required folder template. Its
value is the change and risk it contains. Its price includes contracts, mapping,
composition, debugging distance, module APIs, build time, migration, and teaching.

The right design uses the fewest boundaries that protect current expensive concerns
and preserves a credible evolution path.

## Find the Pressure Before the Layer

Add a boundary when there is evidence such as:

- product policy is duplicated across presentations;
- external schemas or SDK types spread through features;
- offline, retry, transaction, or security policy needs one owner;
- tests require real UI, network, or persistence for inner behavior;
- teams need independent ownership and compatibility;
- repeated changes touch unrelated areas.

A one-screen read-only feature may need only an observable model and injected client.
A checkout with idempotency, durable submission, validation, and several delivery
surfaces deserves stronger use-case and adapter boundaries.

## Select a Proportional Structure

| Pressure | Smallest useful response |
|---|---|
| One volatile SDK | Wrap it in a focused adapter |
| Reused product operation | Extract a use case |
| Remote and local policy | Add a repository port and adapter |
| Transport DTOs in UI | Map at the network boundary |
| Accidental imports | Add access control or a module |
| Independent team ownership | Define an owned package API and compatibility policy |

Do not automatically add entities, interactors, presenters, gateways, and separate
request models to every feature. Each type should own a distinct decision. A function
or concrete value can implement a clean boundary when the contract is small.

## Adopt Incrementally

Avoid a full rewrite. Choose a high-cost seam and place a compatibility adapter around
current behavior:

1. Characterize existing behavior with tests and production metrics.
2. Define a narrow application contract in product terms.
3. Make the existing implementation satisfy that contract.
4. Move one caller or operation behind it.
5. Add domain mapping and policy only where needed.
6. Enforce dependency direction after migration is practical.
7. Remove the old path and compatibility code.

This approach permits rollback and exposes whether the proposed abstraction matches
real behavior. Temporary duplication is often safer than a flag-day conversion.

For data changes, use versioned schemas, parallel reads or writes when necessary, and
reconciliation metrics. For API changes, preserve a compatibility facade until callers
migrate.

## Decide When to Modularize

Source folders and `internal` access may be enough for one team. A Swift module enforces
imports and hides implementation, but public APIs need deliberate evolution. More
targets can add build scheduling opportunities or overhead depending on graph shape;
measure the real build.

Create a module when ownership, reuse, release, or dependency enforcement is worth
that cost. Avoid packages named `Core`, `Common`, or `Shared` becoming unrestricted
dependency hubs. Feature-oriented modules often keep reasons to change together.

## Pros and Cons

| Benefits | Costs and risks |
|---|---|
| Policy is isolated from frameworks | More indirection and mapping |
| Adapters contain vendor and schema change | Debugging crosses more boundaries |
| Focused tests run without infrastructure | Integration gaps still need real tests |
| Modules can enforce ownership | API and build graph maintenance |
| Incremental replacement becomes easier | Premature ports can encode the wrong abstraction |

Clean Architecture does not guarantee good domain modeling, performance, security, or
team ownership. It provides boundaries where those decisions can live. Poorly chosen
boundaries can make all of them harder.

## Measure Whether It Works

Define the outcome before adoption. Possible measures include change lead time, files
or teams touched per feature, build duration, escaped defects, test duration, adapter
incidents, and migration progress. Pair quantitative signals with developer feedback
and incident reviews.

At Staff and Principal scope, provide paved paths, migration support, contract tests,
and an exception process. Pilot with one representative feature. Standardize a small
dependency rule set, not identical internal class structures. Revisit the standard
when evidence shows ceremony without risk reduction.

## References

- [Hexagonal Architecture — original article](https://alistair.cockburn.us/hexagonal-architecture)
- [Organizing your code with local packages](https://developer.apple.com/documentation/xcode/organizing-your-code-with-local-packages)
- [Introducing Packages — Swift Package Manager](https://docs.swift.org/swiftpm/documentation/packagemanagerdocs/introducingpackages/)
