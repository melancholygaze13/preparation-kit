---
title: "Factories, Builders, and SDK Configuration: Interview Questions"
domain: "Architecture"
topic: "Plugin, Platform, and SDK Architecture"
concept: "Factories, Builders, and SDK Configuration"
page_type: interview
levels:
  - staff
  - principal
interview_priority: situational
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-06-29
---

# Factories, Builders, and SDK Configuration: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When would you use a builder instead of an initializer for SDK setup?](#q1-builder-vs-initializer) | Staff | API ergonomics |
| [What should be configuration versus runtime input?](#q2-configuration-vs-runtime-input) | Staff | Lifecycle boundaries |
| [How do factories help SDK architecture?](#q3-factories-sdk-architecture) | Staff/Principal | Implementation hiding |
| [How would you make SDK setup failures diagnosable?](#q4-diagnosable-setup-failures) | Principal | Supportability |

---

<a id="q1-builder-vs-initializer"></a>
## Q1: When would you use a builder instead of an initializer for SDK setup?

### Short Answer

I use a builder when setup has many optional choices, staged configuration, or
validation rules that would make an initializer hard to read. If construction has
only a few required values, a normal initializer is clearer.

### Expanded Answer

A builder should improve correctness, not just add ceremony. It is useful when
the SDK has environment, credentials, providers, feature flags, diagnostics, and
defaults that need to be assembled before creating the instance.

I would still keep the final `build()` step strict. It should validate required
values and incompatible options before the SDK starts runtime work.

---

<a id="q2-configuration-vs-runtime-input"></a>
## Q2: What should be configuration versus runtime input?

### Short Answer

Configuration should contain stable setup facts for the SDK instance. Runtime
input should contain per-operation or per-user data that can change during normal
use.

### Expanded Answer

Examples of configuration are environment, API key, app group identifier,
diagnostic mode, and optional providers. Examples of runtime input are request
payloads, selected user IDs, screen context, or a one-time authorization code.

Mixing these creates lifecycle bugs. If account data lives in global SDK
configuration, logout and account switching become difficult. If environment
changes during requests, cancellation and consistency need explicit policy.

---

<a id="q3-factories-sdk-architecture"></a>
## Q3: How do factories help SDK architecture?

### Short Answer

Factories hide implementation selection and dependency assembly behind a stable
public API. They let the SDK choose concrete implementations without exposing
internal modules to clients.

### Expanded Answer

A factory is useful when construction depends on environment, platform
capability, test mode, feature flags, or optional providers. The client asks for a
capability; the SDK decides which internal implementation satisfies it.

The factory should not become a global service locator. It should create a
well-defined SDK instance or capability, not expose arbitrary internal services.

---

<a id="q4-diagnosable-setup-failures"></a>
## Q4: How would you make SDK setup failures diagnosable?

### Short Answer

Use typed setup errors with actionable messages, validate early, and include
safe diagnostics such as SDK version, environment, enabled capabilities, and
missing configuration keys.

### Expanded Answer

Setup failures are often client integration mistakes. The SDK should distinguish
missing required values, unsupported environments, invalid option combinations,
missing entitlements, and unavailable capabilities.

At Principal scope, I would make these diagnostics consistent across the SDK and
document them in integration guides. I would also ensure logs never expose API
keys, tokens, or user data.

