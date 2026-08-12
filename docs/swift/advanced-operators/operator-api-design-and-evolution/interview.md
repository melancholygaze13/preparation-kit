---
title: "Operator API Design and Evolution: Interview Questions"
domain: "Swift"
topic: "Advanced Operators"
concept: "Operator API Design and Evolution"
page_type: interview
interview_priority: reference
estimated_read_minutes: 2
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-08-12
---

# Operator API Design and Evolution: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What contract should a public operator document?](#q1-operator-contract) | Senior | Semantic laws |
| [How do imports make operator APIs risky?](#q2-import-collisions) | Staff | Global resolution |

---

<a id="q1-operator-contract"></a>
## Q1: What Contract Should a Public Operator Document?

### Short Answer

Document the operator's meaning, units, operand types, result type, mathematical
rules, normalization, overflow, failure, mutation, side effects, and cost. For a
custom infix operator, also document precedence and associativity. Provide a named
function when the symbol's meaning is not obvious.

### Expanded Answer

Only promise laws that hold. Floating-point or approximate domains may not be associative; currency
addition needs conversion policy; collection operators may allocate linearly.

---

<a id="q2-import-collisions"></a>
## Q2: How Do Imports Make Operator APIs Risky?

### Short Answer

Operators and overloads enter lookup through imported modules. Two packages can use one symbol or
precedence vocabulary differently; new overloads/conformances can create ambiguity or change the
selected candidate when clients recompile.

### Expanded Answer

Test realistic combined imports and downstream expressions, not isolated module builds. Namespace
wrappers and named methods localize meaning better than global punctuation.
