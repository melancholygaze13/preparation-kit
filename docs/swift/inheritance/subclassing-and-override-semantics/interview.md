---
title: "Subclassing and Override Semantics: Interview Questions"
domain: "Swift"
topic: "Inheritance"
concept: "Subclassing and Override Semantics"
page_type: interview
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
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

### What It Evaluates

Separation of compiler-checked shape from behavioral correctness.

### Short Answer

`override` tells the compiler that a declaration must replace a visible superclass
method, property, or subscript with a compatible signature. It catches accidental
name collisions and missing base members. It does not prove substitutability, invariant
preservation, correct `super` ordering, performance, or concurrency behavior.

### Detailed Answer

Dynamic calls through a base reference use the supported override. The subclass must
still preserve accepted inputs, promised results, effects, failure, and isolation.

### Engineering Trade-offs

- Explicit override syntax prevents accidental replacement.
- Dynamic variation supports frameworks but expands behavior matrices.
- Final members simplify reasoning where variation is unnecessary.

### Production Scenario

An override compiles but adds blocking network I/O to a fast base method. Contract and
latency tests reveal a semantic break the type checker cannot.

### Follow-up Questions

- What can properties override?
- Can structures inherit?
- What does `final` change?

### Strong Answer Signals

- Names both compiler guarantees and omissions.
- Includes operational behavior in the contract.
- Connects override to dynamic calls.

### Weak Answer Signals

- Says matching signatures guarantee correctness.
- Treats override as optional documentation.
- Ignores effects and isolation.

### Related Theory

- [Declaring and Overriding](theory.md#declaring-and-overriding)

---

<a id="q2-super-contract"></a>
## Q2: When Should an Override Call super?

### What It Evaluates

Understanding that superclass composition is contract-specific.

### Short Answer

Call `super` when the base extension contract requires augmentation or when the
override deliberately reuses base behavior. Do not follow a universal “always” rule:
some hooks replace behavior. The base must document whether the call is required,
allowed, or forbidden, plus call count and ordering relative to subclass work.

### Detailed Answer

Required bookkeeping skipped by an override corrupts base state; duplicate calls can
repeat side effects. Template methods reduce ambiguity by keeping sequencing final and
calling narrow hooks.

### Engineering Trade-offs

- Augmentation preserves shared behavior but couples ordering.
- Replacement gives control but can bypass invariants.
- Closed sequencing with small hooks reduces subclass responsibility.

### Production Scenario

A lifecycle override calls `super` after notifying observers, exposing stale base state.
The contract requires base update first and a test asserts notification ordering.

### Follow-up Questions

- How should the requirement be tested?
- What if base behavior changes later?
- How does a template method help?

### Strong Answer Signals

- Rejects universal rules.
- Specifies count and ordering.
- Protects base invariants.

### Weak Answer Signals

- Always or never calls `super` by style.
- Calls it twice defensively.
- Leaves ordering undocumented.

### Related Theory

- [Declaring and Overriding](theory.md#declaring-and-overriding)

---

<a id="q3-final-boundary"></a>
## Q3: When Should a Class or Member Be final?

### What It Evaluates

Judgment about intentional extension surfaces.

### Short Answer

Use `final` when subclassing or overriding is not a supported customization mechanism,
when invariants require closed behavior, or when identity is needed without polymorphic
extension. Defaulting internal implementation classes to final reduces accidental
contracts. Leave members overridable only with documented semantics and tests.

### Detailed Answer

Performance may benefit, but correctness and evolution are stronger reasons. A class
can remain subclassable while selected invariant-critical members are final.

### Engineering Trade-offs

- Final closes behavior and eases evolution.
- Open hooks support legitimate framework customization.
- Protocol composition can offer extension without lifecycle coupling.

### Production Scenario

A token validator is subclassed to bypass checks because the class was nonfinal by
default. Closing it and injecting a narrow policy strategy preserves supported customization.

### Follow-up Questions

- How do `public` and `open` differ?
- Can individual members be final?
- When is subclassing framework-mandated?

### Strong Answer Signals

- Treats openness as a supported contract.
- Separates identity from subclassability.
- Offers composition where appropriate.

### Weak Answer Signals

- Leaves everything open for hypothetical flexibility.
- Uses final solely as a micro-optimization.
- Closes required framework hooks.

### Related Theory

- [Preventing Overrides](theory.md#preventing-overrides)
