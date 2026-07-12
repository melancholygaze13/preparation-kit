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
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-07-12
tags:
  - sdk-configuration
  - factories
  - builders
---

# Factories, Builders, and SDK Configuration: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When would you use a builder instead of an initializer?](#q1-when-would-you-use-a-builder-instead-of-an-initializer) | Staff | Proportional API design |
| [What should be configuration versus runtime input?](#q2-what-should-be-configuration-versus-runtime-input) | Staff | Lifecycle boundaries |
| [How do you keep an SDK factory from becoming a service locator?](#q3-how-do-you-keep-an-sdk-factory-from-becoming-a-service-locator) | Staff | Dependency visibility |
| [How would you make SDK setup and reconfiguration safe?](#q4-how-would-you-make-sdk-setup-and-reconfiguration-safe) | Principal | Validation and lifecycle |

---

<a id="q1-when-would-you-use-a-builder-instead-of-an-initializer"></a>
## Q1: When would you use a builder instead of an initializer?

### Short Answer

I start with an initializer. I use a builder when setup has many optional choices,
staged input, or cross-field validation that an initializer cannot express clearly. The
builder must make valid construction easier, not only add ceremony.

### Expanded Answer

Required values should remain obvious. `build()` validates deterministic setup rules
before creating resources. If only two values are required, the initializer is more
readable and has fewer states to test.

---

<a id="q2-what-should-be-configuration-versus-runtime-input"></a>
## Q2: What should be configuration versus runtime input?

### Short Answer

Configuration holds stable facts for one SDK instance. Runtime input holds account or
operation data that changes during use. The placement must match ownership and lifetime.

### Expanded Answer

Environment, app identity, diagnostics policy, and client providers are often setup.
Request payloads and screen context are runtime input. If an instance is user-scoped,
user identity may be construction input. That choice must define cache separation,
cancellation, and account switching.

---

<a id="q3-how-do-you-keep-an-sdk-factory-from-becoming-a-service-locator"></a>
## Q3: How do you keep an SDK factory from becoming a service locator?

### Short Answer

A factory creates one documented capability or facade with explicit inputs. It may hide
implementation selection and assembly, but clients cannot request arbitrary internal
services by name or type.

### Expanded Answer

Required dependencies stay visible at the composition boundary. A global resolver hides
them, moves errors to runtime, and couples clients to internal registrations. I keep the
resolver internal if the SDK uses one at all.

---

<a id="q4-how-would-you-make-sdk-setup-and-reconfiguration-safe"></a>
## Q4: How would you make SDK setup and reconfiguration safe?

### Short Answer

I validate local rules before starting work, use immutable configuration, return typed and
actionable errors, and give the instance explicit resource ownership. Reconfiguration is
one operation with defined isolation, cancellation, cache, and rollback behavior.

### Expanded Answer

I distinguish deterministic setup errors from runtime failures such as remote
authentication. Tests cover invalid combinations, defaults, repeated construction,
shutdown, and account transitions. Diagnostics include safe version and capability data,
never credentials, tokens, or user information.
