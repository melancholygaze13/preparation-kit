---
title: "Feature and Layer Module Boundaries: Interview Questions"
domain: "Architecture"
topic: "Modularization and Feature Boundaries"
concept: "Feature and Layer Module Boundaries"
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
  - modularization
  - feature-modules
  - boundaries
---

# Feature and Layer Module Boundaries: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you choose module boundaries?](#q1-how-do-you-choose-module-boundaries) | Senior | Change and ownership |
| [Feature modules or layer modules?](#q2-feature-modules-or-layer-modules) | Senior | Boundary axis |
| [When should shared code become a module?](#q3-when-should-shared-code-become-a-module) | Senior | Reuse and coordination |

---

<a id="q1-how-do-you-choose-module-boundaries"></a>
## Q1: How do you choose module boundaries?

### Short Answer

I combine change history, dependency direction, runtime lifetime, and team ownership.
Code that changes and ships together stays together. I add a target or package when
compiler enforcement, reuse, security, build isolation, or independent ownership is
worth the API and graph cost.

### Expanded Answer

I start with source boundaries and pilot physical separation. A module needs a coherent
purpose, owner, small API, and supported consumers. Target count is not a quality metric.

<a id="q2-feature-modules-or-layer-modules"></a>
## Q2: Feature modules or layer modules?

### Short Answer

I usually start feature-first because product changes and teams are often vertical.
I extract layer or capability modules when networking, authentication, persistence,
or design systems have a stable shared contract and owner. Most large apps use a hybrid.

### Trade-offs

Feature modules localize delivery but can duplicate capabilities. Layer modules
centralize expertise but can make every feature cross several teams and APIs.

<a id="q3-when-should-shared-code-become-a-module"></a>
## Q3: When should shared code become a module?

### Short Answer

When consumers share the same meaning, change pattern, and contract—not merely similar
syntax. The module needs an owner and compatibility policy. I may keep small duplication
when sharing would couple features with independent product rules.

### Expanded Answer

I avoid generic `Common` and `Utils` hubs. A named capability such as `Authentication`
or `MoneyFormatting` makes allowed dependencies and responsibility clearer.
