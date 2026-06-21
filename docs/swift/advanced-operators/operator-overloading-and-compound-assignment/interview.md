---
title: "Operator Overloading and Compound Assignment: Interview Questions"
domain: "Swift"
topic: "Advanced Operators"
concept: "Operator Overloading and Compound Assignment"
page_type: interview
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
---

# Operator Overloading and Compound Assignment: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When is operator overloading appropriate?](#q1-overload-choice) | Senior | Semantic fit |
| [How should `+=` relate to `+`?](#q2-compound-assignment) | Senior | Mutation consistency |
| [What makes an operator overload dangerous to evolve?](#q3-overload-evolution) | Staff | Resolution stability |

---

<a id="q1-overload-choice"></a>
## Q1: When Is Operator Overloading Appropriate?

### What It Evaluates

API judgment and law-based design.

### Short Answer

When a familiar symbol has conventional, unsurprising meaning for a value-like domain and its laws,
cost, mutation, and failure match caller expectations. Prefer named methods for side effects, policy,
lossy work, async operations, or meaning that needs labels.

### Detailed Answer

Operators are terse and globally discoverable by symbol, so ambiguity costs are high. Mathematical
vectors, measures, and option sets often fit; network calls and business transitions usually do not.

### Engineering Trade-offs

- Operators make algebraic code readable/composable.
- Named APIs communicate effects and roles better.

### Production Scenario

A Money type offers explicit converted(to:) instead of `+` across currencies, while same-currency
addition uses `+` after validated scale/overflow policy.

### Follow-up Questions

- Which laws would you test?
- Should operators throw?

### Strong Answer Signals

- Uses semantics/laws rather than syntax novelty.

### Weak Answer Signals

- Overloads symbols only to shorten calls.

### Related Theory

- [Engineering Judgment](theory.md#engineering-judgment)

---

<a id="q2-compound-assignment"></a>
## Q2: How Should `+=` Relate to `+`?

### What It Evaluates

Consistency of value and mutation APIs.

### Short Answer

When both exist, `lhs += rhs` should normally produce the same semantic value as `lhs = lhs + rhs`,
while mutating lhs through `inout` and returning `Void`. Normalization, overflow, and failure policy
must agree.

### Detailed Answer

Implementation may optimize in place, but callers should not observe a different algebra. Test
equivalence and copy-on-write behavior without requiring address identity.

### Engineering Trade-offs

- Compound assignment can reduce copies and express mutation.
- A second implementation can drift from binary semantics.

### Production Scenario

A vector library implements `+=` through `+` initially, then optimizes storage after benchmarks while
retaining property tests for equivalence.

### Follow-up Questions

- Why is lhs `inout`?
- Does compound assignment provide thread safety?

### Strong Answer Signals

- Covers mutation, return, and semantic equivalence.

### Weak Answer Signals

- Gives `+=` separate domain behavior.

### Related Theory

- [How It Works](theory.md#how-it-works)

---

<a id="q3-overload-evolution"></a>
## Q3: What Makes an Operator Overload Dangerous to Evolve?

### What It Evaluates

Static resolution and source compatibility.

### Short Answer

New overloads/conformances can make existing expressions ambiguous or choose a different candidate
when clients recompile. Operators lack labels, literals are flexible, and generic constraints can
overlap, so downstream source fixtures are essential.

### Detailed Answer

Adding an overload is not behaviorally additive if resolution changes. Test supported literal,
optional, generic, and conversion contexts and prefer distinct names when semantics differ.

### Engineering Trade-offs

- More overloads improve convenience.
- They enlarge a global inference and compatibility surface.

### Production Scenario

A generic scalar-vector overload captures integer-literal expressions that previously selected a
domain-specific overload. The library narrows constraints and adds explicit client fixtures.

### Follow-up Questions

- How can return context affect resolution?
- When should an operator be deprecated?

### Strong Answer Signals

- Covers recompilation and contextual inference.

### Weak Answer Signals

- Assumes successful library build proves compatibility.

### Related Theory

- [Compatibility and Migration](theory.md#compatibility-and-migration)
