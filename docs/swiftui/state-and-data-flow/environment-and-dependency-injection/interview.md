---
title: "Environment and Dependency Injection: Interview Questions"
domain: "SwiftUI"
topic: "State and Data Flow"
concept: "Environment and Dependency Injection"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-06-23
tags:
  - environment
  - dependency-injection
  - composition-root
---

# Environment and Dependency Injection: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When should you use the environment instead of initializer injection?](#q1-when-should-you-use-the-environment-instead-of-initializer-injection) | Senior | Dependency visibility and scope |
| [How do custom environment values work?](#q2-how-do-custom-environment-values-work) | Senior | Entry, defaults, and overrides |
| [Who owns an observable model placed in the environment?](#q3-who-owns-an-observable-model-placed-in-the-environment) | Senior | Lifetime and typed injection |
| [How would you prevent the environment becoming a service locator?](#q4-how-would-you-prevent-the-environment-becoming-a-service-locator) | Staff | Governance and composition roots |

---

<a id="q1-when-should-you-use-the-environment-instead-of-initializer-injection"></a>
## Q1: When should you use the environment instead of initializer injection?

### Short Answer

I use initializer injection for required, feature-specific dependencies because it
makes them visible and compiler-enforced. I use the environment for genuinely
ambient context shared through a deep subtree, especially when local overrides are
useful and passing the value through every intermediate view adds no meaning.

### Expanded Answer

Locale, accessibility configuration, presentation actions, design tokens, and a
session or feature capability used by many descendants are good environment
candidates. A repository needed by one screen should usually be an initializer
parameter.

The choice affects failure behavior. Initializer injection fails at compile time
when a caller omits a dependency. A custom environment entry supplies a default,
which can hide missing configuration. Typed observable environment lookup requires
an injected instance and otherwise fails at runtime.

### Trade-offs

Environment injection reduces plumbing and enables subtree overrides, but hides
dependencies from the initializer. Explicit injection improves discoverability and
supports multiple nearby instances, but can create pass-through parameters in deep
hierarchies.

<a id="q2-how-do-custom-environment-values-work"></a>
## Q2: How do custom environment values work?

### Short Answer

Define a property on `EnvironmentValues` with `@Entry` and a default. An ancestor
sets it with `.environment` and a key path. Descendants read it with `@Environment`.
Values are inherited, and the nearest override wins for that subtree.

### Expanded Answer

```swift
extension EnvironmentValues {
    @Entry var analytics = AnalyticsClient.noop
}

FeatureRoot()
    .environment(\.analytics, liveAnalytics)
```

A view that reads `@Environment(\.analytics)` becomes dependent on the value.
For a library, I often provide a semantic view modifier around the key assignment.

The default must be deliberate. A no-op can make optional analytics or previews
safe. It is inappropriate when missing authorization, persistence, or payment
configuration must fail visibly.

<a id="q3-who-owns-an-observable-model-placed-in-the-environment"></a>
## Q3: Who owns an observable model placed in the environment?

### Short Answer

The composition root that creates and stores the model owns it. The environment
only distributes the reference. A root commonly stores a view-owned observable
instance in private `@State`, injects it with `.environment(model)`, and descendants
read it with typed `@Environment`.

### Expanded Answer

Observation tracks properties descendants read from that instance, but neither
`@Environment` nor `@Bindable` creates a new owner. Replacing the injected instance
is an owner decision and may represent a new session.

Every entry point that renders the descendant must supply the required type,
including previews and test hosts. If two instances of the same type need to appear
in one hierarchy, explicit injection or distinct wrapper types are clearer than
depending on which ancestor happens to be nearest.

### Example

A signed-in scene can own one `AccountModel` and inject it below the authenticated
root. Signing out removes that root and ends the feature ownership boundary instead
of mutating a process-global model into an unrelated session.

<a id="q4-how-would-you-prevent-the-environment-becoming-a-service-locator"></a>
## Q4: How would you prevent the environment becoming a service locator?

### Short Answer

I restrict environment entries to focused, widely shared capabilities and create
them at explicit app, scene, or feature composition roots. Each entry documents its
lifetime, default, actor isolation, failure policy, and test replacement. Leaf views
do not receive one container containing every service.

### Expanded Answer

I review whether a dependency is truly ambient or merely inconvenient to pass. For
feature-specific dependencies, initializer injection remains the default. For
cross-cutting behavior, I expose narrow action or client types rather than mutable
repositories with broad authority.

Previews and tests override dependencies at the nearest root with deterministic
fakes. I avoid mutable global registries because parallel tests and multiple scenes
can interfere. Metrics and logs identify which composition root installed a live
implementation without exposing credentials.

### Trade-offs

A central dependency catalog can speed initial wiring but creates hidden coupling
and organization-wide migration risk. Focused entries require more design work but
let teams evolve capabilities, test failure modes, and migrate ownership
incrementally.
