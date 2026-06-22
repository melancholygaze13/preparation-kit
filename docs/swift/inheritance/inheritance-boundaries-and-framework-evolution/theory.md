---
title: "Inheritance Boundaries and Framework Evolution: Theory"
domain: "Swift"
topic: "Inheritance"
concept: "Inheritance Boundaries and Framework Evolution"
page_type: theory
interview_priority: situational
estimated_read_minutes: 3
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
tags: [open-classes, composition, framework-design, evolution]
---

# Inheritance Boundaries and Framework Evolution: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Publishing an open class delegates part of your implementation to code you do not
control. Every release must remain correct with old subclasses and new base behavior.

## How It Works

### Inheritance Versus Composition

Inheritance fits a true is-a relationship with stable shared invariants and controlled
variation. Composition fits orthogonal strategies, decorators, dependencies, and
behaviors that should be replaceable without changing identity or lifecycle.

Deep hierarchies multiply state and override ordering. A final coordinator containing
small protocol-based strategies usually makes ownership and testing clearer.

### Designing Extension Points

Use template methods sparingly: a nonoverridable operation owns sequencing and calls
small protected/open hooks with documented inputs, outputs, call count, ordering,
thread/isolation context, and whether `super` is required. Do not expose stored
representation merely to make subclassing convenient.

### Resilient Evolution

New base calls into an existing override can introduce reentrancy or invoke code in a
lifecycle phase old subclasses never expected. New abstract requirements are especially
disruptive. Prefer additive hooks with safe defaults, capability checks, and deprecation
windows; validate source and runtime behavior against representative external subclasses.

### Ownership and Isolation

An actor-isolated or global-actor-isolated hierarchy must preserve that boundary across
extensions. Module defaults may differ, so public isolation should be explicit where it
is contractual. Do not retrofit unchecked sendability onto an open mutable hierarchy.

### Core Invariants

- Open hooks are few, documented, and safe under unknown implementations.
- The base owns sequencing and protects private representation.
- Composition is used for independent variation dimensions.
- New framework versions remain compatible with supported old subclasses.
- Isolation, lifecycle, and shutdown remain one coherent contract.

### Constraints and Guarantees

- Cross-module subclassing and overriding require `open` declarations.
- A framework cannot enumerate or fully test all future external subclasses.
- `final` can close individual hooks while leaving a class otherwise subclassable.
- ABI/source compatibility does not guarantee behavioral compatibility.
- Default actor isolation is configured per module and must not be assumed across packages.

## Engineering Judgment

| Requirement | Prefer |
|---|---|
| Closed finite alternatives | Enum |
| Shared identity, no extension | Final class |
| Open capability implementations | Protocol plus composition |
| Base-controlled algorithm with stable hooks | Shallow inheritance/template method |
| Independent runtime behaviors | Strategy/decorator composition |
| Framework-mandated subclass integration | Inheritance with adapter boundary |

## References

- [The Swift Programming Language: Inheritance](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/inheritance/)
- [The Swift Programming Language: Access Control](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/accesscontrol/)
- [Library Evolution in Swift](https://www.swift.org/blog/library-evolution/)
