---
title: "Choosing Proportional Architecture: Interview Questions"
domain: "Architecture"
topic: "Architectural Foundations and Trade-offs"
concept: "Choosing Proportional Architecture"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-07-11
tags:
  - proportional-architecture
  - architecture-decisions
  - evolution
---

# Choosing Proportional Architecture: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you choose an architecture for a new feature?](#q1-how-do-you-choose-an-architecture-for-a-new-feature) | Senior | Decision process |
| [How do you recognize over-engineering?](#q2-how-do-you-recognize-over-engineering) | Senior | Costs and evidence |
| [When should you design for future change?](#q3-when-should-you-design-for-future-change) | Senior | Reversibility and seams |
| [How would you introduce an architecture standard across teams?](#q4-how-would-you-introduce-an-architecture-standard-across-teams) | Staff | Adoption and measurement |

---

<a id="q1-how-do-you-choose-an-architecture-for-a-new-feature"></a>
## Q1: How do you choose an architecture for a new feature?

### Short Answer

I start with product risks, state lifetime, expected change, platform constraints,
and team ownership. I compare the simplest viable designs and choose the smallest
set of boundaries that controls expensive failures. I record costs and a trigger for
evolution instead of choosing a named pattern first.

### Expanded Answer

For a small read-only screen, an injected client and feature model may be enough. I
add a repository for real cache or synchronization policy, a coordinator for a flow,
and modules when dependency or ownership enforcement matters.

I state assumptions because data volume, offline requirements, security, and team
count can change the result. I also define validation: unit and integration tests,
field metrics, and a review trigger such as a second data source or repeated policy.

<a id="q2-how-do-you-recognize-over-engineering"></a>
## Q2: How do you recognize over-engineering?

### Short Answer

A boundary is over-engineered when its ongoing API, mapping, build, debugging, and
coordination cost exceeds the change or failure cost it contains. Warning signs are
forwarding layers, speculative protocols, repeated model mapping, and modules that
always change and release together.

### Expanded Answer

I inspect change history rather than judging type count alone. If a layer has no
independent rules, tests, owner, or rate of change, I consider merging it. If one
concrete dependency is stable and local, a protocol may not add useful flexibility.

The reverse also matters. A compact feature with hidden task lifetime, duplicated
business rules, or unsafe persistence may be under-architected. Simplicity is low
total cost and clear ownership, not the fewest files.

<a id="q3-when-should-you-design-for-future-change"></a>
## Q3: When should you design for future change?

### Short Answer

I invest early when a decision is hard to reverse or failure is expensive, such as
persistent schemas, operation identity, public SDK APIs, security boundaries, and
cross-team contracts. For reversible uncertainty, I keep the design simple and
preserve a small seam plus a concrete review trigger.

### Expanded Answer

Designing for change does not mean implementing every predicted variant. Constructor
injection can preserve replacement. Domain identifiers can keep navigation independent
of view instances. A versioned decoder can preserve data migration. These seams keep
options open at low cost.

"Refactor later" is weak when current callers expose vendor types everywhere or
stored data has no migration path. It is reasonable when the choice is feature-local,
tests protect behavior, and a known signal will trigger extraction.

### Trade-offs

Early abstraction can be based on guesses and make the actual change harder. Waiting
can make a public contract or durable data format prohibitively expensive to replace.
Reversibility determines where to spend design effort.

<a id="q4-how-would-you-introduce-an-architecture-standard-across-teams"></a>
## Q4: How would you introduce an architecture standard across teams?

### Short Answer

I would tie the standard to a measured cross-team problem, pilot the smallest rule
set, and provide a supported migration path. I would automate only critical dependency
rules, allow reviewed exceptions, and measure delivery and runtime outcomes rather
than adoption alone.

### Expanded Answer

I would begin with evidence such as dependency cycles, duplicated authentication,
unsafe navigation, slow builds, or frequent coordinated releases. A reference feature
tests the API and reveals migration cost. Templates, adapters, documentation, and
office hours reduce adoption friction.

The standard needs an owner, compatibility policy, deprecation process, and exception
path. I would track the metric it is meant to improve, such as build time, change lead
time, incident rate, or recovery. If complex features benefit but small ones gain only
ceremony, I would define proportional tiers instead of forcing uniform internals.

### Trade-offs

Consistency reduces coordination and support cost. Uniformity can centralize control,
slow simple teams, and lock in an early design. Pilots and reversible migration make
that trade-off visible before wide enforcement.
