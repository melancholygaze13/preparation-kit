---
title: "Architecture Decisions, Standards, and Exceptions: Interview Questions"
domain: "Architecture"
topic: "Large-Scale Architecture and Governance"
concept: "Architecture Decisions, Standards, and Exceptions"
page_type: interview
levels:
  - staff
  - principal
interview_priority: situational
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-07-12
tags:
  - architecture-decisions
  - standards
  - governance
---

# Architecture Decisions, Standards, and Exceptions: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Which architecture decisions need broader review?](#q1-which-architecture-decisions-need-broader-review) | Staff | Decision scope |
| [When should a decision become a standard?](#q2-when-should-a-decision-become-a-standard) | Principal | Proportionate governance |
| [How do you handle exceptions?](#q3-how-do-you-handle-exceptions) | Staff | Controlled variation |

---

<a id="q1-which-architecture-decisions-need-broader-review"></a>
## Q1: Which architecture decisions need broader review?

### Short Answer

Decisions with cross-team blast radius, difficult reversal, public API or data
compatibility, security and privacy impact, or shared operational ownership. Local and
reversible implementation choices should stay with the team closest to the work.

### Expanded Answer

For significant choices I record context, constraints, options, decision, consequences,
owner, and review trigger. Affected operators and consumers participate because they will
carry the costs. The record preserves reasoning rather than replacing implementation
design.

<a id="q2-when-should-a-decision-become-a-standard"></a>
## Q2: When should a decision become a standard?

### Short Answer

When teams repeatedly face the same choice and variation creates measurable security,
compatibility, reliability, or delivery cost. The standard defines the required outcome,
safe default, support, migration, enforcement, and exception path without prescribing
irrelevant internals.

### Trade-offs

Standardization reduces repeated decisions and risk but can create a central bottleneck.
I automate rules that tools can check reliably and leave context-dependent judgment to
review.

<a id="q3-how-do-you-handle-exceptions"></a>
## Q3: How do you handle exceptions?

### Short Answer

I require a concrete reason, owner, limited scope, risk control, expiry, and convergence
or review plan. Repeated similar exceptions are feedback that the standard or paved path
may be missing a valid capability.

### Example

A legacy regulated module may retain a separate storage path for one release window. The
exception names its encryption controls, owner, migration dependency, and removal date.
