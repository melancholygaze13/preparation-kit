---
title: "Custom Operators and Precedence Groups: Interview Questions"
domain: "Swift"
topic: "Advanced Operators"
concept: "Custom Operators and Precedence Groups"
page_type: interview
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
---

# Custom Operators and Precedence Groups: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What does a precedence group control?](#q1-precedence) | Senior | Parsing |
| [How do you test a custom operator grammar?](#q2-grammar-tests) | Staff | Mixed expressions |
| [When should you reject a custom operator proposal?](#q3-reject-operator) | Staff | API judgment |

---

<a id="q1-precedence"></a>
## Q1: What Does a Precedence Group Control?

### What It Evaluates

Parsing versus runtime semantics.

### Short Answer

It controls how an infix operator groups relative to other groups, same-level associativity, and
assignment-like parsing behavior. It determines the expression tree—not short-circuiting, runtime
synchronization, or performance.

### Detailed Answer

Higher/lower relations establish implicit parentheses. Left/right associativity determines chains;
none rejects ambiguous same-level chains. Operator implementations then execute as ordinary calls.

### Engineering Trade-offs

- Well-chosen precedence makes domain expressions readable.
- Implicit grouping can hide meaning and become compatibility-sensitive.

### Production Scenario

A pipeline operator is deliberately lower than arithmetic and documented with equivalent parentheses;
mixed expressions are compiled in downstream fixtures.

### Follow-up Questions

- What does associativity none mean?
- Do prefix operators have precedence groups?

### Strong Answer Signals

- Separates parsing from execution.

### Weak Answer Signals

- Claims higher precedence executes first in all senses.

### Related Theory

- [Mental Model](theory.md#mental-model)

---

<a id="q2-grammar-tests"></a>
## Q2: How Do You Test a Custom Operator Grammar?

### What It Evaluates

Source-level compatibility rigor.

### Short Answer

Compile prefix/postfix/infix whitespace, same-precedence chains, mixed standard/custom groups, explicit
parenthesized equivalents, generic/literal overloads, and real dependency imports. Assert results and
compile failures where ambiguity should remain.

### Detailed Answer

Tests must validate the parse, not only the function body. Keep representative external client files
because imported operators and precedence groups affect lookup and resolution.

### Engineering Trade-offs

- Parse fixtures catch silent source changes.
- They add maintenance but are necessary for custom syntax.

### Production Scenario

A math package tests `a + b ** c`, `a ** b ** c`, and parenthesized equivalents across releases and
supported Swift toolchains.

### Follow-up Questions

- How can you inspect inferred parsing?
- Which negative cases matter?

### Strong Answer Signals

- Covers imports, whitespace, precedence, associativity, and overloads.

### Weak Answer Signals

- Unit-tests only the operator function directly.

### Related Theory

- [Testing](theory.md#testing)

---

<a id="q3-reject-operator"></a>
## Q3: When Should You Reject a Custom Operator Proposal?

### What It Evaluates

Clarity and ecosystem judgment.

### Short Answer

Reject it when meaning needs labels, has side effects/failure/variable cost, lacks stable algebraic
laws, is hard to type/search, collides with dependencies, or serves too few repeated expressions to
justify teaching a new grammar token.

### Detailed Answer

A named method is easier to discover, document, deprecate, instrument, and evolve. Custom syntax is
justified only when it creates a durable, coherent domain language.

### Engineering Trade-offs

- Operators can make algebra concise.
- Every symbol consumes organization-wide cognitive and compatibility budget.

### Production Scenario

A team proposes `user <~ payload` for an async upload. It becomes `upload(_:for:)` because labels,
failure, cancellation, and observability are essential.

### Follow-up Questions

- Who should own shared operator vocabulary?
- When is Unicode acceptable?

### Strong Answer Signals

- Evaluates semantics, discoverability, collisions, and evolution.

### Weak Answer Signals

- Approves based on fewer characters.

### Related Theory

- [Engineering Judgment](theory.md#engineering-judgment)
