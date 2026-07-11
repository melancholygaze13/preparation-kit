---
title: "Test Overrides and Service-Locator Trade-offs: Interview Questions"
domain: "Architecture"
topic: "Dependency Injection and Composition"
concept: "Test Overrides and Service-Locator Trade-offs"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-07-11
tags:
  - dependency-injection
  - test-doubles
  - service-locator
---

# Test Overrides and Service-Locator Trade-offs: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you override dependencies safely in tests?](#q1-how-do-you-override-dependencies-safely-in-tests) | Senior | Isolation and determinism |
| [Why is service locator controversial?](#q2-why-is-service-locator-controversial) | Senior | Hidden dependencies |
| [Is SwiftUI environment dependency injection?](#q3-is-swiftui-environment-dependency-injection) | Senior | Hierarchical context |

---

<a id="q1-how-do-you-override-dependencies-safely-in-tests"></a>
## Q1: How do you override dependencies safely in tests?

### Short Answer

I construct a graph per test or use an automatically restored task-scoped override.
Fakes control values, failures, time, IDs, cancellation, and completion order. I avoid
mutable global overrides because parallel tests can affect one another.

### Expanded Answer

I assert state and outcomes rather than every internal call. Contract tests keep fakes
aligned with production semantics where ordering or transactions matter. Production
root smoke tests catch missing real wiring.

<a id="q2-why-is-service-locator-controversial"></a>
## Q2: Why is service locator controversial?

### Short Answer

It hides required dependencies behind runtime lookup. Consumers depend on the locator,
missing registrations fail at runtime, and scope, cycles, concurrency, and test isolation
become harder to inspect. Constructor injection keeps requirements visible.

### Expanded Answer

A locator can still be useful at legacy or framework entry points and for genuinely
dynamic plugins. I confine lookup to that boundary, then inject narrow typed services
into the rest of the graph.

<a id="q3-is-swiftui-environment-dependency-injection"></a>
## Q3: Is SwiftUI environment dependency injection?

### Short Answer

It is a hierarchical form of dependency distribution and is useful for values meant
to flow through a view tree. It can also become a scoped service locator if arbitrary
required services are hidden there. I keep essential feature dependencies explicit
when practical.

### Trade-offs

Environment reduces repetitive plumbing and matches presentation context. It makes
requirements less visible, can fail at runtime for missing objects, and can couple
views to a broad ambient scope.
