---
title: "Interfaces, Implementations, and Dependency Inversion: Interview Questions"
domain: "Architecture"
topic: "Modularization and Feature Boundaries"
concept: "Interfaces, Implementations, and Dependency Inversion"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-08-12
tags:
  - modularization
  - dependency-inversion
  - interfaces
---

# Interfaces, Implementations, and Dependency Inversion: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Why separate interface and implementation modules?](#q1-why-separate-interface-and-implementation-modules) | Senior | Physical dependency inversion |
| [Who should own the interface?](#q2-who-should-own-the-interface) | Senior | Consumer-shaped contracts |
| [When is the split not worth it?](#q3-when-is-the-split-not-worth-it) | Senior | Packaging cost |

---

<a id="q1-why-separate-interface-and-implementation-modules"></a>
## Q1: Why separate interface and implementation modules?

### Short Answer

It lets a feature depend on a stable product contract without importing a volatile SDK
or infrastructure module. The live implementation depends on that interface, and the
composition root connects them. This enforces dependency direction at compile time.

### Expanded Answer

The interface must use product terms and remain small. Adapter tests cover the SDK;
feature tests inject the interface. The split can also isolate rebuilds or support
platform variants.

<a id="q2-who-should-own-the-interface"></a>
## Q2: Who should own the interface?

### Short Answer

The policy or consumers being protected should shape it. A shared capability team can
govern a stable business API, while features may own narrower ports for distinct needs.
A provider-shaped mega-interface preserves provider coupling.

### Expanded Answer

Ownership includes behavior, errors, concurrency, lifetime, compatibility, and
migration—not only the Swift declaration.

<a id="q3-when-is-the-split-not-worth-it"></a>
## Q3: When is the split not worth it?

### Short Answer

When one team owns a stable implementation, consumers change with it, and a small
public entry API already hides internals. Separate interface and live targets would
add API, build, test, and discovery cost without isolating real change.

### Expanded Answer

I split targets when consumers need a stable contract without importing the live
implementation or when build and ownership boundaries benefit. If all changes move
together, ordinary access control and a focused public API can preserve encapsulation.
The module graph should reflect a real independent reason to vary.

### Trade-offs

The split enforces clean imports and supports replacement. Applied mechanically, it
doubles module count and turns private refactoring into public API evolution.
