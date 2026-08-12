---
title: "Cross-Team Ownership and API Evolution: Interview Questions"
domain: "Architecture"
topic: "Modularization and Feature Boundaries"
concept: "Cross-Team Ownership and API Evolution"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-08-12
tags:
  - modularization
  - api-evolution
  - team-ownership
---

# Cross-Team Ownership and API Evolution: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Who owns a shared module?](#q1-who-owns-a-shared-module) | Staff | Accountability and support |
| [How do you make a breaking API change?](#q2-how-do-you-make-a-breaking-api-change) | Staff | Compatibility and migration |
| [How should a platform team work with feature teams?](#q3-how-should-a-platform-team-work-with-feature-teams) | Principal | Enablement and governance |

---

<a id="q1-who-owns-a-shared-module"></a>
## Q1: Who owns a shared module?

### Short Answer

One team is accountable for its contract, reliability, support, compatibility, and
evolution. Consumers own supported usage and migration. Ownership includes behavioral
semantics, observability, and deprecation—not only approving source changes.

### Expanded Answer

I identify supported consumers and service expectations. If one team owns unrelated
shared modules and becomes a delivery queue, I split ownership around durable
capabilities.

<a id="q2-how-do-you-make-a-breaking-api-change"></a>
## Q2: How do you make a breaking API change?

### Short Answer

I add the replacement alongside the old API, provide adapters and migration tooling,
measure adoption, deprecate with a deadline, and remove after supported consumers move.
Behavior changes may need opt-in rollout even when signatures stay compatible.

### Expanded Answer

Same-repository callers can often migrate atomically. Separately versioned packages
need release notes, compatibility policy, and support windows. Every temporary adapter
and exception has an owner and review date.

<a id="q3-how-should-a-platform-team-work-with-feature-teams"></a>
## Q3: How should a platform team work with feature teams?

### Short Answer

It should provide paved paths, stable APIs, tools, diagnostics, migration support, and
automated rules tied to system outcomes. Feature teams retain control of local design,
with a documented exception process. The platform should not be an approval gate for
ordinary delivery.

### Expanded Answer

I measure consumer lead time, incidents, support load, adoption, and deprecated usage.
High adoption alone does not prove success if teams are blocked or the platform's API
does not fit real feature needs.
