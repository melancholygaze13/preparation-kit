---
title: "Mutating Value Types and State Transitions: Interview Questions"
domain: "Swift"
topic: "Methods"
concept: "Mutating Value Types and State Transitions"
page_type: interview
levels: [senior]
interview_priority: reference
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-22
---

# Mutating Value Types and State Transitions: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

- [Why do value-type methods need `mutating`?](#q1-mutating)
- [Does `mutating` make an update atomic?](#q2-atomicity)

<a id="q1-mutating"></a>
## Q1: Why Do Value-Type Methods Need `mutating`?

### Short Answer

It makes write access to `self` explicit and requires a mutable binding at the
call site. A nonmutating method cannot change stored value state.

<a id="q2-atomicity"></a>
## Q2: Does `mutating` Make an Update Atomic?

### Short Answer

No. It is a language access rule, not synchronization. Shared mutable state still
needs actor isolation or another synchronization mechanism.
