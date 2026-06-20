---
title: "Conditional Branching and Pattern Matching: Interview Questions"
domain: "Swift"
topic: "Control Flow"
concept: "Conditional Branching and Pattern Matching"
page_type: interview
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-20
tags:
  - conditionals
  - switch
  - pattern-matching
---

# Conditional Branching and Pattern Matching: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What guarantees does Swift switch provide?](#q1-switch-guarantees) | Senior | Exhaustiveness and first-match behavior |
| [When should you use pattern conditions instead of switch?](#q2-pattern-conditions) | Senior | Selective matching and silent nonmatches |
| [How do if and switch expressions differ from statement forms?](#q3-branch-expressions) | Senior | Result typing and side effects |
| [How should enum switches handle API evolution?](#q4-enum-evolution) | Staff | Exhaustiveness, resilience, and rollout |

---

<a id="q1-switch-guarantees"></a>
## Q1: What Guarantees Does Swift switch Provide?

### What It Evaluates

Understanding of exhaustiveness, ordered matching, and fallthrough behavior.

### Short Answer

A Swift switch must be exhaustive. It evaluates cases in source order and runs
the first matching case. Cases do not fall through implicitly, so execution
normally leaves the switch after that case. Overlapping pattern order is therefore
semantic. An explicit `fallthrough` enters the next body without checking its
pattern.

### Detailed Answer

Exhaustiveness can come from naming every enum case, a catch-all binding, or
`default`. Naming cases gives the compiler leverage when a closed model evolves.
For integers, strings, and other open-ended values, a fallback is normally
required.

Patterns may overlap: an exact value can also match a range, and a tuple can match
both a specific and wildcard case. Put specific cases first. Combine patterns
with commas when they intentionally share one body rather than relying on
fallthrough.

### Engineering Trade-offs

- Explicit cases improve model-evolution safety but increase migration work.
- Default reduces churn but can hide unexpected states.
- Rich patterns are concise but require careful precedence review.

### Production Scenario

A 401-specific authentication branch appears below `400..<500`, so it never
runs and users see a generic error. Reordering exact before range and adding
boundary tests restores the intended recovery flow.

### Follow-up Questions

- Does Swift require break after each case?
- What happens when two patterns match?
- Does fallthrough evaluate the next pattern?

### Strong Answer Signals

- States exhaustive, first-match-wins, and no implicit fallthrough.
- Treats order as behavior.
- Distinguishes compound cases from fallthrough.

### Weak Answer Signals

- Describes C switch behavior.
- Assumes all matching cases run.
- Uses default without considering model evolution.

### Related Theory

- [Exhaustive switch](theory.md#exhaustive-switch)
- [First Match Wins](theory.md#first-match-wins)

---

<a id="q2-pattern-conditions"></a>
## Q2: When Should You Use Pattern Conditions Instead of switch?

### What It Evaluates

Selection among `if case`, `guard case`, `for case`, and exhaustive branching.

### Short Answer

Use `if case` when one matching shape triggers optional work, `guard case` when
that shape is required for the rest of the scope, and `for case` when a loop
intentionally processes only matching elements. Use switch when all states need
explicit handling, observability, or validation. Pattern-condition nonmatches are
silently skipped unless you add an else path.

### Detailed Answer

Pattern conditions combine structural matching and bindings without a one-case
switch. A `where` clause can refine the match. Their concision is valuable only
when nonmatching data is truly irrelevant.

In ingestion, sync, security, or accounting code, ignored states often need a
metric or failure. An exhaustive switch makes that policy visible. For simple UI
projection where only loaded data renders, `if case .loaded(let value)` can be the
clearest contract.

### Engineering Trade-offs

- Pattern conditions reduce ceremony but de-emphasize discarded states.
- Switch adds explicit coverage and branch-level testing.
- Early `guard case` flattens success paths but exits the whole enclosing scope.

### Production Scenario

A `for case .success` import loop silently drops decoding failures. Replacing it
with a switch records errors and enforces a failure budget while continuing valid
records.

### Follow-up Questions

- Can `for case` include `where`?
- What scope do pattern bindings have?
- When is silent filtering correct?

### Strong Answer Signals

- Connects each form to nonmatch policy.
- Mentions bindings and optional refinement.
- Chooses explicit handling where failures matter.

### Weak Answer Signals

- Uses `for case` to avoid error handling.
- Says if case is exhaustive.
- Leaks bindings outside their valid scope.

### Related Theory

- [if case, guard case, and for case](theory.md#if-case-guard-case-and-for-case)

---

<a id="q3-branch-expressions"></a>
## Q3: How Do if and switch Expressions Differ from Statement Forms?

### What It Evaluates

Modern Swift expression semantics and judgment about immutable result
construction.

### Short Answer

Expression forms produce a value for assignment or return. Every normal branch
must produce a compatible type; an `if` expression needs an `else`, while switch
is already exhaustive. A throwing or nonreturning branch need not produce the
value. Use expressions for small value mappings, and statement forms or extracted
functions when branches own multiple effects or complex control.

### Detailed Answer

```swift
let title: String? = if let name {
    name
} else {
    nil
}
```

The explicit type gives context to `nil`. Branches are type-checked independently,
so mixed numeric literals or unrelated concrete types may require annotations.

Expression syntax removes mutable temporaries and repeated assignments. It should
not be used to compress logging, state mutation, and I/O into a visually simple
initializer. Those effects deserve statement structure or named handlers.

### Engineering Trade-offs

- Expressions support immutable construction and local reasoning.
- Type rules may require annotations in ambiguous branches.
- Statement forms better expose multi-step effects and exits.

### Production Scenario

A view maps an exhaustive load-state enum to one presentation value using a
switch expression. Network retry and analytics remain in a separate transition
handler instead of being hidden in presentation branches.

### Follow-up Questions

- Why does an if expression require else?
- How do you resolve an ambiguous nil branch?
- Can a branch throw instead of returning a value?

### Strong Answer Signals

- Explains compatible result types and totality.
- Uses expressions for value mapping, not effect compression.
- Knows explicit type context resolves nil ambiguity.

### Weak Answer Signals

- Claims expression form accepts arbitrarily many statements as its value.
- Omits else from a value-producing if.
- Adds a default mutable value only to satisfy initialization.

### Related Theory

- [if Statements and Expressions](theory.md#if-statements-and-expressions)
- [Statement versus Expression Form](theory.md#statement-versus-expression-form)

---

<a id="q4-enum-evolution"></a>
## Q4: How Should Enum Switches Handle API Evolution?

### What It Evaluates

Staff-level understanding of closed models, resilient external enums, and
compatible rollout.

### Short Answer

For an owned closed enum, list every case so additions force consumers to decide.
For a nonfrozen external enum, handle all known cases and use `@unknown default`
with a safe forward-compatibility policy. A plain default may be appropriate for
truly equivalent residual values, but should not be added merely to silence the
compiler. Coordinate persisted and distributed enum changes with tolerant readers
before new writers.

### Detailed Answer

Exhaustive compilation pressure is useful when the organization controls the
state space. A new case is a semantic migration, and compile failures identify
consumers needing policy.

Framework or library enums may add cases without recompiling the client.
`@unknown default` provides runtime fallback and compiler warnings for omitted
currently known cases. The fallback might disable a capability, preserve unknown
data, or report unsupported state; it should avoid destructive guesses.

For wire and persistence formats, source exhaustiveness is insufficient. Older
deployed clients need a decoding and fallback strategy before producers emit new
cases.

### Engineering Trade-offs

- Exhaustive switches maximize review pressure but widen coordinated changes.
- Unknown fallback improves forward compatibility but can mask product gaps if
  unobserved.
- Versioned payloads add complexity but protect mixed client populations.

### Production Scenario

A server emits a new subscription state before older apps tolerate it, causing
decode failures. The rollout changes to preserve unknown values, deploy tolerant
readers, monitor fallback use, and only then enable the new writer state.

### Follow-up Questions

- What is the difference between default and `@unknown default`?
- Does compiler exhaustiveness solve wire compatibility?
- What should the unknown branch do?

### Strong Answer Signals

- Distinguishes owned frozen state from resilient external state.
- Includes runtime fallback, telemetry, and deployment ordering.
- Treats new enum cases as semantic changes.

### Weak Answer Signals

- Adds default to every switch by policy.
- Assumes recompiling fixes already deployed clients.
- Crashes on every unknown framework case without product justification.

### Related Theory

- [Enum Resilience and Unknown Cases](theory.md#enum-resilience-and-unknown-cases)
- [Compatibility and Migration](theory.md#compatibility-and-migration)
