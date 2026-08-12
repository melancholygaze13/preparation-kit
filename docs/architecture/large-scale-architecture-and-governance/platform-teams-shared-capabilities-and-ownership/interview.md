---
title: "Platform Teams, Shared Capabilities, and Ownership: Interview Questions"
domain: "Architecture"
topic: "Large-Scale Architecture and Governance"
concept: "Platform Teams, Shared Capabilities, and Ownership"
page_type: interview
levels:
  - staff
  - principal
interview_priority: situational
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-08-12
tags:
  - platform-teams
  - ownership
  - shared-capabilities
---

# Platform Teams, Shared Capabilities, and Ownership: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When should a capability move to a platform team?](#q1-when-should-a-capability-move-to-a-platform-team) | Staff | Centralization criteria |
| [What does a platform team own?](#q2-what-does-a-platform-team-own) | Principal | Product and operations |
| [How do you know an internal platform is successful?](#q3-how-do-you-know-an-internal-platform-is-successful) | Staff | Outcome measurement |

---

<a id="q1-when-should-a-capability-move-to-a-platform-team"></a>
## Q1: When should a capability move to a platform team?

### Short Answer

When many teams need it, variation creates meaningful risk or duplicated work, and scarce
expertise can provide a better supported path. The reduction in cognitive and operational
cost must exceed the coordination and blast-radius cost of centralization.

### Expanded Answer

I first confirm repeated consumer pain and a stable common capability. The platform team
then owns a service contract, migration support, reliability, and contribution model.
Product-specific decisions remain with feature teams so the platform does not become a
central approval queue.

### Trade-offs

Authentication, observability, and delivery tooling often benefit. Product policy usually
does not. I start with a thin capability based on observed consumer pain instead of a
large central roadmap.

<a id="q2-what-does-a-platform-team-own"></a>
## Q2: What does a platform team own?

### Short Answer

The supported interface and developer experience: APIs, safe defaults, documentation,
diagnostics, reliability, security, versioning, migration, support, and feedback. It may
integrate an underlying service owned elsewhere, but it still owns the consumer contract.

### Expanded Answer

Consumers own correct integration and feature behavior. The contract names incident and
fallback responsibilities precisely. Contribution paths let product teams improve the
platform without turning it into several incompatible forks.

<a id="q3-how-do-you-know-an-internal-platform-is-successful"></a>
## Q3: How do you know an internal platform is successful?

### Short Answer

Teams integrate faster with fewer defects and less duplicated infrastructure. I combine
lead time, reliability, support causes, exception reasons, local alternatives, and product
delivery outcomes. Adoption alone can be high only because the platform is mandatory.

### Expanded Answer

I measure the consumer journey from discovery through production operation. Shorter setup,
clearer diagnostics, fewer repeated incidents, and fewer unsupported forks are stronger
signals than registration counts. Qualitative interviews explain whether the platform
removed work or merely moved it to another queue.

### Example

If adoption rises while support tickets and integration time also rise, the platform is
moving work rather than removing it. Repeated tickets should produce better diagnostics,
contracts, or tooling.
