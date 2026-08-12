---
title: "Deprecation, Standards, and Team Coordination: Interview Questions"
domain: "Architecture"
topic: "Architecture Evolution and Migration"
concept: "Deprecation, Standards, and Team Coordination"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-08-12
tags:
  - deprecation
  - standards
  - team-coordination
---

# Deprecation, Standards, and Team Coordination: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What makes a deprecation plan complete?](#q1-what-makes-a-deprecation-plan-complete) | Staff | Managed transition |
| [How do you enforce a standard without blocking teams?](#q2-how-do-you-enforce-a-standard-without-blocking-teams) | Staff | Governance |
| [When can you remove a deprecated API?](#q3-when-can-you-remove-a-deprecated-api) | Senior | Compatibility window |

---

<a id="q1-what-makes-a-deprecation-plan-complete"></a>
## Q1: What makes a deprecation plan complete?

### Short Answer

It includes a ready replacement, actionable diagnostics, migration examples, support,
consumer inventory, usage measurement, owner, deadline, exception process, and removal
condition. A compiler warning alone does not move consumers or retire the old path.

### Expanded Answer

The provider owns replacement quality and final removal. Consumer teams own validation
and migration. I stop new adoption early, then increase enforcement as supported callers
approach zero.

<a id="q2-how-do-you-enforce-a-standard-without-blocking-teams"></a>
## Q2: How do you enforce a standard without blocking teams?

### Short Answer

I make the preferred path easy, automate checks at the relevant boundary, and provide an
exception process with a reason, owner, risk control, and expiry. Repeated exceptions are
feedback that the standard may need a supported extension.

### Expanded Answer

I begin with documentation, examples, and migration tooling, then block new violations
before forcing existing consumers to move. Enforcement belongs near the boundary it
protects, such as a module graph or API check. The exception record keeps urgent work
visible without turning one exception into a permanent second standard.

### Trade-offs

Immediate hard enforcement can stop urgent product work before the replacement is ready.
Permanent voluntary guidance creates fragmentation. Enforcement should grow with
replacement maturity and migration support.

<a id="q3-when-can-you-remove-a-deprecated-api"></a>
## Q3: When can you remove a deprecated API?

### Short Answer

When all supported consumers have migrated, runtime traffic is zero for the agreed
window, compatibility and version promises allow the break, and rollback no longer
depends on it. Then I remove the API, adapter, flag, tests, metrics, and outdated docs.

### Expanded Answer

Source search alone is not enough when released clients or dynamically selected paths
can still call the API. I combine build-time inventory, production usage, support windows,
and rollback dependencies. Removal is complete only when the old path and its temporary
operational support are deleted.

### Example

Internal source callers may reach zero quickly. A server field used by older supported
app versions must remain until that client window closes, even when the current branch
has no references.
