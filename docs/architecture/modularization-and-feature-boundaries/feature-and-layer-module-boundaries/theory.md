---
title: "Feature and Layer Module Boundaries: Theory"
domain: "Architecture"
topic: "Modularization and Feature Boundaries"
concept: "Feature and Layer Module Boundaries"
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
  - modularization
  - feature-modules
  - boundaries
---

# Feature and Layer Module Boundaries: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Modularization turns selected architecture rules into compiler and build-system rules.
A Swift target is a module: it creates a namespace, controls visibility, and declares
dependencies. A package groups one or more targets and their products.

A good module contains a coherent reason to change and exposes a small contract. The
goal is not the largest number of targets. It is local change, clear ownership, and a
dependency graph that reflects product boundaries.

## Compare Feature and Layer Axes

| Axis | Example | Strength | Risk |
|---|---|---|---|
| Feature | Catalog, Checkout, Profile | Keeps end-to-end product change local | Shared capability can be duplicated |
| Layer | Networking, Persistence, UI | Centralizes specialized implementation | One feature change crosses many modules |
| Capability | Authentication, Payments, Design System | Clear shared service ownership | Platform team can become a bottleneck |
| Platform | iOS app, widget, watch app | Separates delivery constraints | Shared logic may leak platform assumptions |

Feature-first organization often matches product teams and change history. A checkout
module can contain its presentation, application policy, and feature-specific adapters
behind one API. It may depend on stable capabilities such as authentication or payments.

Pure horizontal layers can make every feature edit touch UI, domain, and data modules.
Use layer modules when their content truly changes together under a specialist owner,
not because an architecture diagram has horizontal bands.

## Identify a Useful Boundary

Signals for a module include:

- another team needs independent ownership;
- accidental imports repeatedly violate a dependency rule;
- code is reused by multiple products or targets;
- a public API needs deliberate review;
- a large stable area should avoid rebuilding after local change;
- security, privacy, or platform capabilities need containment.

Signals to keep code together include frequent coordinated edits, one owner, a tiny
private API, and no need for compiler enforcement. A directory can provide structure
without adding module cost.

## Keep Shared Code Honest

Move code to a shared module only after its meaning is shared. Two similar address
forms may have different validation and release needs. Early deduplication can couple
features that should evolve independently.

Shared modules need:

- a named capability rather than `Common` or `Utils`;
- an owner and supported consumers;
- a narrow API and dependency policy;
- compatibility and deprecation expectations;
- tests at the contract boundary.

Duplication is sometimes cheaper than coordination. Reassess when the repeated code
represents the same rule and changes together.

## Choose Physical Enforcement

| Mechanism | Enforces | Cost |
|---|---|---|
| Folders and naming | Communication only | Low |
| Swift access control | Declaration visibility | API design inside current module/package |
| Separate target | Imports and compilation unit | Target, resource, test, and build configuration |
| Local Swift package | Target graph and package boundary | Manifest and package tooling |
| Remote package | Versioned distribution | Release, compatibility, and dependency resolution |

Do not move same-repository modules to separate repositories merely to appear modular.
Remote versioning adds coordination and makes atomic changes harder. Use it when
independent distribution or access control is genuinely required.

## Pros and Cons

| Benefits | Costs and risks |
|---|---|
| Compiler-enforced visibility and dependencies | Public API and mapping overhead |
| Clear ownership and review boundaries | More targets, manifests, tests, and resources |
| Feature changes can remain local | Poor axes create cross-module editing |
| Independent reuse becomes possible | Shared modules can centralize decisions |
| Build work may become more parallel or cacheable | More modules do not guarantee faster builds |

## Engineering Decisions

Use version-control history to see which files change together, dependency graphs to
see structural coupling, and team ownership to see coordination. Pilot a boundary and
measure build and delivery effects before broad migration.

At Staff scope, define module naming, allowed dependency directions, ownership, and an
exception process. Keep internal feature structure flexible. A central architecture
team should enable boundaries and tooling rather than approve every local edit.

## References

- [Introducing Packages — Swift Package Manager](https://docs.swift.org/swiftpm/documentation/packagemanagerdocs/introducingpackages/)
- [Target — PackageDescription](https://docs.swift.org/swiftpm/documentation/packagedescription/target/)
- [Organizing your code with local packages](https://developer.apple.com/documentation/xcode/organizing-your-code-with-local-packages)
