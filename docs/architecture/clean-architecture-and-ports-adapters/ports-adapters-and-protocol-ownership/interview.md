---
title: "Ports, Adapters, and Protocol Ownership: Interview Questions"
domain: "Architecture"
topic: "Clean Architecture and Ports and Adapters"
concept: "Ports, Adapters, and Protocol Ownership"
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
  - ports-and-adapters
  - protocols
  - dependency-inversion
---

# Ports, Adapters, and Protocol Ownership: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What are ports and adapters?](#q1-what-are-ports-and-adapters) | Senior | Boundary mechanics |
| [Where should a protocol be defined?](#q2-where-should-a-protocol-be-defined) | Senior | Contract ownership |
| [When would you avoid a protocol?](#q3-when-would-you-avoid-a-protocol) | Senior | Proportional abstraction |

---

<a id="q1-what-are-ports-and-adapters"></a>
## Q1: What are ports and adapters?

### Short Answer

A port is an application-facing contract. A driving adapter converts UI or external
input into application calls. A driven adapter implements an external capability such
as storage or networking. Adapters contain technology-specific translation so product
policy can run without those mechanisms.

### Expanded Answer

The same driving port may be called by SwiftUI, a widget, or a test. An output port may
have HTTP, local, and fake adapters. The implementations must share behavior, including
error, cancellation, and ordering rules.

<a id="q2-where-should-a-protocol-be-defined"></a>
## Q2: Where should a protocol be defined?

### Short Answer

Place it near the policy or consumer it protects and express the smallest capability
in that consumer's terms. An outer provider implements it. A protocol that mirrors a
large provider API leaves the consumer coupled to provider concepts.

### Expanded Answer

Several consumers can share one port when meaning and policy are stable. I split it
when broad access exposes methods a feature should not know. Module dependencies should
make the adapter import the port, not the reverse.

<a id="q3-when-would-you-avoid-a-protocol"></a>
## Q3: When would you avoid a protocol?

### Short Answer

I avoid one when a stable concrete value or pure function already expresses the need
and replacement has no architectural value. I can also use a closure-based capability
for one small operation. Testability does not require mocking every type.

### Trade-offs

Protocols reveal capabilities and support independent implementations. They also add
naming, conformance, existential or generic choices, and API evolution. The abstraction
should contain a real source of change or ownership.
