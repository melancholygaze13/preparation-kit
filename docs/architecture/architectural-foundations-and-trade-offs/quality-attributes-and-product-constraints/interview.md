---
title: "Quality Attributes and Product Constraints: Interview Questions"
domain: "Architecture"
topic: "Architectural Foundations and Trade-offs"
concept: "Quality Attributes and Product Constraints"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-08-12
tags:
  - quality-attributes
  - product-constraints
  - architecture-decisions
---

# Quality Attributes and Product Constraints: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do product requirements influence architecture?](#q1-how-do-product-requirements-influence-architecture) | Senior | From requirements to decisions |
| [How would you design a checkout that must survive lost connectivity?](#q2-how-would-you-design-a-checkout-that-must-survive-lost-connectivity) | Senior | Reliability and trade-offs |
| [How do you decide whether to add a layer or module?](#q3-how-do-you-decide-whether-to-add-a-layer-or-module) | Senior | Proportional complexity |
| [How would you align architecture across several teams?](#q4-how-would-you-align-architecture-across-several-teams) | Staff | Standards, rollout, and measurement |

---

<a id="q1-how-do-product-requirements-influence-architecture"></a>
## Q1: How do product requirements influence architecture?

### Short Answer

I separate product behavior from the qualities and constraints that shape its
implementation. I turn the most important qualities into observable scenarios,
rank the risks, and choose the smallest boundaries that meet them. I also record the
cost and the evidence that would make us revisit the decision.

### Expanded Answer

"Users can place orders" is behavior. Surviving termination, preventing duplicate
charges, responding within a target time, and protecting payment data are qualities
or constraints. They lead to different choices: durable intent, idempotent operations,
measured performance, and a narrow security boundary.

I do not start by selecting MVVM, Clean Architecture, or a package layout. I first
ask which failure would harm the user or business, under which conditions it occurs,
and how we will verify the result. Named patterns are possible tools after that.

<a id="q2-how-would-you-design-a-checkout-that-must-survive-lost-connectivity"></a>
## Q2: How would you design a checkout that must survive lost connectivity?

### Short Answer

I would persist an operation with a stable identifier before reporting acceptance,
make server submission idempotent, and model queued, submitting, succeeded, and failed
states. A retry owner resumes work when conditions allow. The UI shows honest status
and never equates a local queue with server confirmation.

### Expanded Answer

I would clarify whether offline checkout is legally and commercially allowed, how
long an order may remain queued, and what happens when price or inventory changes.
The persisted record needs schema migration and enough data to recover after process
termination. Retries use backoff and distinguish transient failures from business
rejection.

The server must deduplicate by operation identifier because a client can lose the
response after the server commits. Tests cover interruption before persistence,
during submission, and after server success but before local acknowledgement. Field
metrics track queue age, retry counts, and final outcomes.

### Trade-offs

This design improves recovery but adds local storage, reconciliation, privacy, and
support cost. If the product forbids offline acceptance, a simpler design can retain
the form and ask the user to submit again when connected.

<a id="q3-how-do-you-decide-whether-to-add-a-layer-or-module"></a>
## Q3: How do you decide whether to add a layer or module?

### Short Answer

I add a boundary when it contains a real source of change, risk, or ownership. I want
evidence such as multiple implementations, repeated policy, a team boundary, or a
need to enforce dependencies. Otherwise, a direct dependency with focused tests is
often clearer and cheaper.

### Expanded Answer

I compare expected change isolation with the cost of APIs, mapping, build graph,
debugging, and migration. A repository can own meaningful cache and synchronization
policy. A protocol that only repeats every method of one stable concrete service may
not create a useful boundary.

A source-level feature boundary can precede a package. I introduce package enforcement
when accidental dependencies or independent ownership become measurable problems.
The decision includes a review trigger, such as a second data source or another team
taking ownership.

<a id="q4-how-would-you-align-architecture-across-several-teams"></a>
## Q4: How would you align architecture across several teams?

### Short Answer

I would align teams on outcomes and dependency rules, not identical internal class
shapes. I would publish a supported path, automate the few rules that protect system
qualities, migrate incrementally, and measure delivery and runtime results. Every
standard needs an owner and an exception process.

### Expanded Answer

I would first identify cross-team problems: unsafe dependency cycles, inconsistent
authentication, poor launch time, or unclear feature ownership. Then I would define
small contracts and measures tied to those problems. A pilot feature tests the design
and exposes adoption cost before a wider rollout.

Tooling can check module dependencies and provide templates, but local feature design
can remain proportional. I would track build time, change lead time, incidents, and
relevant product metrics. If a standard adds ceremony without improving its target,
we revise it rather than blaming adoption.

### Trade-offs

Consistency lowers coordination and support cost, while uniformity can force complex
solutions onto simple features. Exceptions preserve local judgment but need owners,
expiry or review dates, and visibility so they do not silently become the real system.
