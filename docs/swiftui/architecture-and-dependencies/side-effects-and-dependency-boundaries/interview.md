---
title: "Side Effects and Dependency Boundaries: Interview Questions"
domain: "SwiftUI"
topic: "Architecture and Dependencies"
concept: "Side Effects and Dependency Boundaries"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 7
status: reviewed
last_reviewed: 2026-06-23
tags:
  - dependency-injection
  - side-effects
  - testing
---

# Side Effects and Dependency Boundaries: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you inject dependencies into a SwiftUI feature?](#q1-how-do-you-inject-dependencies-into-a-swiftui-feature) | Senior | Explicit construction |
| [When do you use the environment?](#q2-when-do-you-use-the-environment) | Senior | Hierarchy scope |
| [What makes a test dependency realistic enough?](#q3-what-makes-a-test-dependency-realistic-enough) | Senior | Behavioral contracts |
| [How would you govern shared dependencies across teams?](#q4-how-would-you-govern-shared-dependencies-across-teams) | Staff | Ownership and standards |

---

<a id="q1-how-do-you-inject-dependencies-into-a-swiftui-feature"></a>
## Q1: How do you inject dependencies into a SwiftUI feature?

### Short Answer

I pass required capabilities through initializers at the feature composition root.
The feature model receives small interfaces for the operations it needs, while the
app supplies production adapters and tests or previews supply deterministic versions.

### Expanded Answer

Initializer injection makes requirements visible and prevents partially configured
features. I avoid having models reach into singletons or a service locator. A small
protocol or closure client is enough; I do not create abstraction without a useful
behavioral boundary.

The dependency contract includes cancellation, isolation, errors, freshness, and
idempotency—not only the Swift method signature.

<a id="q2-when-do-you-use-the-environment"></a>
## Q2: When do you use the environment?

### Short Answer

For typed context or dependencies that a view hierarchy legitimately shares and
whose scope follows that hierarchy. I prefer direct initializer injection for a
feature's required service and use environment injection to avoid repetitive plumbing
through many intermediate views.

### Expanded Answer

Good examples include a feature model at its root, presentation actions, or app-wide
policy that every descendant consumes. A networking container with unrelated services
is hidden global access even if stored in the environment.

I provide deliberate preview and test values and consider scene and account scope.
Missing or stale environment setup should not silently use a dangerous production default.

<a id="q3-what-makes-a-test-dependency-realistic-enough"></a>
## Q3: What makes a test dependency realistic enough?

### Short Answer

It must reproduce the behavior the feature relies on: suspension, cancellation,
ordering, errors, idempotency, and stream completion. An instant success stub is
useful for some tests but cannot validate race or lifecycle behavior.

### Expanded Answer

I use controllable fakes for async operations and fake clocks for debounce, expiry,
and retry. Contract tests verify every production adapter maps external behavior to
the same application contract.

Tests assert state outcomes and meaningful interactions rather than every incidental
method call. Exact counts matter when duplicate effects would be harmful.

<a id="q4-how-would-you-govern-shared-dependencies-across-teams"></a>
## Q4: How would you govern shared dependencies across teams?

### Short Answer

I assign an owner to each shared capability and publish a small contract covering
API, isolation, cancellation, privacy, observability, versioning, and test support.
Feature teams depend on that contract, not vendor or transport details.

### Expanded Answer

The shared layer handles cross-cutting mechanics such as authentication, retry
budgets, logging, and mapping. It does not expose unrestricted endpoints that bypass
feature policy. Changes use compatibility windows and adapter contract tests.

I monitor latency, retry, cancellation, and error categories at the boundary. A
standard fake and composition pattern reduces local reinvention and makes migrations
incremental.

### Trade-offs

Centralization improves consistency but can bottleneck teams and grow into a service
locator. Federated adapters preserve autonomy but may duplicate security and
observability rules. Centralize invariants; keep feature policy with feature owners.
