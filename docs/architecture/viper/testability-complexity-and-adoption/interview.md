---
title: "Testability, Complexity, and Adoption: Interview Questions"
domain: "Architecture"
topic: "VIPER"
concept: "Testability, Complexity, and Adoption"
page_type: interview
levels:
  - senior
  - staff
interview_priority: situational
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-08-12
tags:
  - viper
  - testability
  - architecture-trade-offs
---

# Testability, Complexity, and Adoption: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How would you test a VIPER feature?](#q1-how-would-you-test-a-viper-feature) | Senior | Behavioral boundaries |
| [What are VIPER's main costs?](#q2-what-are-vipers-main-costs) | Senior | Trade-offs |
| [How would you adopt VIPER in an existing app?](#q3-how-would-you-adopt-viper-in-an-existing-app) | Staff | Incremental adoption |

---

<a id="q1-how-would-you-test-a-viper-feature"></a>
## Q1: How would you test a VIPER feature?

### Short Answer

I test each role's observable contract: presenter input to display state or route intent,
interactor use-case input to domain outcome, router intent to destination handoff, and
assembly wiring. A small integration test covers the real UIKit transition.

### Expanded Answer

I avoid asserting every internal call. Small fakes at service boundaries are often more
stable than generated mocks for every protocol. Tests should allow internal role changes
without losing behavior coverage.

<a id="q2-what-are-vipers-main-costs"></a>
## Q2: What are VIPER's main costs?

### Short Answer

Object count, protocols, assembly, retention rules, callback tracing, and changes that
touch several files. If presenter and interactor only forward calls, the split adds
ceremony without independent policy or test value.

### Expanded Answer

The boundaries make sense only when roles change and test independently. Otherwise they
increase navigation cost for engineers and create more places for lifecycle mistakes.
Tooling can reduce assembly repetition, but it does not create missing responsibility or
justify a five-part module.

### Trade-offs

The separation can help large teams and complex UIKit features. For a small feature, a
state owner plus coordinator may provide the useful boundaries with less indirection.

<a id="q3-how-would-you-adopt-viper-in-an-existing-app"></a>
## Q3: How would you adopt VIPER in an existing app?

### Short Answer

I would not rewrite the app. I would pilot a new or heavily changing representative
feature behind a stable entry point, measure change and test outcomes, refine conventions,
and expand only where the separation pays for itself.

### Expanded Answer

The pilot defines assembly, async ownership, route results, teardown, and protocol naming
as one coherent convention. Existing modules remain behind adapters while the team compares
delivery and defects. Adoption stops where a simpler feature boundary produces the same
confidence at lower cost.

### Example

The pilot should include async loading, a child route, data handoff, failure, and teardown.
If it only proves a static screen, it does not test the architecture's expensive parts.
