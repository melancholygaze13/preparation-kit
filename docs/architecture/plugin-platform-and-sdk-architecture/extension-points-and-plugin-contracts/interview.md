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
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-06-29
---

# Extension Points and Plugin Contracts: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When would you introduce a plugin architecture?](#q1-when-plugin-architecture) | Staff | Proportionality |
| [What makes a plugin contract safe?](#q2-safe-plugin-contract) | Staff | Boundary design |
| [How would you test plugin behavior without coupling to internals?](#q3-test-plugin-contracts) | Principal | Contract testing |

---

<a id="q1-when-plugin-architecture"></a>
## Q1: When would you introduce a plugin architecture?

### Short Answer

I would introduce it when independently owned behavior must integrate through a
stable host boundary. If variation is small or owned by one team, a normal module
or strategy interface is usually cheaper.

### Expanded Answer

The signal is not "we have many modules." The signal is that the host needs to
accept contributions without knowing each implementation. A checkout flow with
several payment providers or a platform screen with team-owned sections are good
examples.

I would still keep the contract narrow. The host owns lifecycle, ordering,
failure policy, and observability. Plugins own their implementation and declared
capabilities.

---

<a id="q2-safe-plugin-contract"></a>
## Q2: What makes a plugin contract safe?

### Short Answer

The contract exposes only the required context, returns a validated contribution,
and defines lifecycle, failure, ordering, cancellation, and versioning behavior.

### Expanded Answer

A risky contract gives plugins access to global app state or private host types.
That lets plugins depend on implementation details and makes host evolution hard.

A safe contract looks like a capability interface. It passes stable input models,
uses clear result types, and lets the host decide what to do with the result. It
also has diagnostics, because plugin failures need to be attributable in
production.

---

<a id="q3-test-plugin-contracts"></a>
## Q3: How would you test plugin behavior without coupling to internals?

### Short Answer

I would write contract tests around the extension point and run them against real
and fake plugins. The tests should verify inputs, outputs, cancellation, failure,
and compatibility behavior without depending on host internals.

### Expanded Answer

The host should have tests with fake plugins to prove ordering, aggregation, and
failure policy. Each plugin should run a shared test suite that proves it obeys
the published contract.

For a platform used by several teams, I would make this part of CI. Otherwise a
plugin can pass its own tests while breaking the host's assumptions.

