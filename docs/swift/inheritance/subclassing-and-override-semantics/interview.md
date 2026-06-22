---
title: "Subclassing and Override Semantics: Interview Questions"
domain: "Swift"
topic: "Inheritance"
concept: "Subclassing and Override Semantics"
page_type: interview
interview_priority: situational
estimated_read_minutes: 3
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Subclassing and Override Semantics: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What does override guarantee?](#q1-override-guarantee) | Senior | Compiler checks versus behavior |
| [When should an override call super?](#q2-super-contract) | Senior | Composition and ordering |
| [When should a class or member be final?](#q3-final-boundary) | Senior | Closing unsupported extension |

---

<a id="q1-override-guarantee"></a>
## Q1: What Does override Guarantee?

### Short Answer

`override` tells the compiler that a declaration must replace a visible superclass
method, property, or subscript with a compatible signature. It catches accidental
name collisions and missing base members. It does not prove substitutability, invariant
preservation, correct `super` ordering, performance, or concurrency behavior.

### Expanded Answer

Dynamic calls through a base reference use the supported override. The subclass must
still preserve accepted inputs, promised results, effects, failure, and isolation.

### Trade-offs

- Explicit override syntax prevents accidental replacement.
- Dynamic variation supports frameworks but expands behavior matrices.
- Final members simplify reasoning where variation is unnecessary.

### Example

An override compiles but adds blocking network I/O to a fast base method. Contract and
latency tests reveal a semantic break the type checker cannot.

---

<a id="q2-super-contract"></a>
## Q2: When Should an Override Call super?

### Short Answer

Call `super` when the base extension contract requires augmentation or when the
override deliberately reuses base behavior. Do not follow a universal “always” rule:
some hooks replace behavior. The base must document whether the call is required,
allowed, or forbidden, plus call count and ordering relative to subclass work.

### Expanded Answer

Required bookkeeping skipped by an override corrupts base state; duplicate calls can
repeat side effects. Template methods reduce ambiguity by keeping sequencing final and
calling narrow hooks.

### Trade-offs

- Augmentation preserves shared behavior but couples ordering.
- Replacement gives control but can bypass invariants.
- Closed sequencing with small hooks reduces subclass responsibility.

### Example

A lifecycle override calls `super` after notifying observers, exposing stale base state.
The contract requires base update first and a test asserts notification ordering.

---

<a id="q3-final-boundary"></a>
## Q3: When Should a Class or Member Be final?

### Short Answer

Use `final` when subclassing or overriding is not a supported customization mechanism,
when invariants require closed behavior, or when identity is needed without polymorphic
extension. Defaulting internal implementation classes to final reduces accidental
contracts. Leave members overridable only with documented semantics and tests.

### Expanded Answer

Performance may benefit, but correctness and evolution are stronger reasons. A class
can remain subclassable while selected invariant-critical members are final.

### Trade-offs

- Final closes behavior and eases evolution.
- Open hooks support legitimate framework customization.
- Protocol composition can offer extension without lifecycle coupling.

### Example

A token validator is subclassed to bypass checks because the class was nonfinal by
default. Closing it and injecting a narrow policy strategy preserves supported customization.
