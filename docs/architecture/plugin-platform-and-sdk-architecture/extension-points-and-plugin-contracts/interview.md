---
title: "Extension Points and Plugin Contracts: Interview Questions"
domain: "Architecture"
topic: "Plugin, Platform, and SDK Architecture"
concept: "Extension Points and Plugin Contracts"
page_type: interview
levels:
  - staff
  - principal
interview_priority: situational
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-07-12
tags:
  - plugin-architecture
  - extension-points
  - contracts
---

# Extension Points and Plugin Contracts: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When would you introduce a plugin architecture?](#q1-when-would-you-introduce-a-plugin-architecture) | Staff | Proportionality |
| [What belongs in a safe plugin contract?](#q2-what-belongs-in-a-safe-plugin-contract) | Staff | Boundary design |
| [How would you test and evolve a cross-team plugin contract?](#q3-how-would-you-test-and-evolve-a-cross-team-plugin-contract) | Principal | Compatibility and rollout |

---

<a id="q1-when-would-you-introduce-a-plugin-architecture"></a>
## Q1: When would you introduce a plugin architecture?

### Short Answer

I use it when independently owned contributors must add behavior through a stable host
boundary and may evolve on different schedules. If one team owns a small set of variants,
a normal dependency or strategy is cheaper.

### Trade-offs

The benefit is independent contribution with consistent host policy. The cost is a
long-lived contract, registration, compatibility testing, diagnostics, and support. I
would also name whether this is an in-process module, build plugin, or separate-process
app extension because their isolation and lifecycle differ.

---

<a id="q2-what-belongs-in-a-safe-plugin-contract"></a>
## Q2: What belongs in a safe plugin contract?

### Short Answer

It exposes the minimum capability and stable context, returns a contribution the host can
validate, and defines identity, discovery, lifecycle, isolation, ordering, cancellation,
failure, compatibility, and diagnostics.

### Expanded Answer

A large service container or mutable app state makes every plugin a privileged host peer.
I prefer value models and narrow protocols. The host keeps security, privacy, conflict,
and failure policy because contributors must not grant themselves access or redefine
system-wide behavior.

---

<a id="q3-how-would-you-test-and-evolve-a-cross-team-plugin-contract"></a>
## Q3: How would you test and evolve a cross-team plugin contract?

### Short Answer

I publish a conformance suite for every plugin and use fakes to test host policy. For an
incompatible change, I add a versioned contract or adapter, support both paths during
migration, measure adoption, and remove the old path only after its policy allows it.

### Expanded Answer

The shared suite covers valid context, result validation, cancellation, concurrency, and
errors. Host tests cover discovery, ordering, timeouts, aggregation, and partial failure.
Compatibility tests run in CI for supported host and contract versions, while safe
diagnostics identify the plugin and contract version in production.
