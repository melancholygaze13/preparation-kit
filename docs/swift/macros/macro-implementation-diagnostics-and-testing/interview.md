---
title: "Macro Implementation, Diagnostics, and Testing: Interview Questions"
domain: "Swift"
topic: "Macros"
concept: "Macro Implementation, Diagnostics, and Testing"
page_type: interview
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
---

# Macro Implementation, Diagnostics, and Testing: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How should invalid macro input be handled?](#q1-invalid-input) | Senior | Diagnostics and robustness |
| [What should macro tests verify?](#q2-expansion-testing) | Staff | Expansion, diagnostics, and integration |

---

<a id="q1-invalid-input"></a>
## Q1: How Should Invalid Macro Input Be Handled?

### What It Evaluates

Compiler-extension robustness and developer experience.

### Short Answer

Validate syntax explicitly and emit a source-located diagnostic explaining the
requirement and repair. Add notes or fix-its when unambiguous. Never force-cast syntax,
crash the plugin, silently ignore the attribute, or generate code that fails later with
an unrelated compiler error.

### Detailed Answer

Macro input is effectively untrusted. Diagnostics should point to the narrow invalid
node and remain deterministic across formatting differences.

### Engineering Trade-offs

- Early diagnostics require validation code but shorten debugging.
- Fix-its accelerate repair but must never guess unsafe intent.
- Silent fallback preserves builds while hiding configuration mistakes.

### Production Scenario

A macro expects a struct but is attached to an enum. It diagnoses the enum declaration
and proposes removal rather than failing inside a syntax cast.

### Follow-up Questions

- Where should the diagnostic point?
- When is a fix-it inappropriate?
- How do you test diagnostic stability?

### Strong Answer Signals

- Treats plugin crashes as unacceptable.
- Provides actionable source diagnostics.
- Separates validation from emission.

### Weak Answer Signals

- Force-casts the declaration.
- Returns empty expansion silently.
- Relies on downstream type errors.

### Related Theory

- [Mental Model](theory.md#mental-model)

---

<a id="q2-expansion-testing"></a>
## Q2: What Should Macro Tests Verify?

### What It Evaluates

Testing strategy beyond happy-path compilation.

### Short Answer

Test exact expansion and generated names, diagnostics and fix-its, malformed and edge
syntax, access and isolation, generics, attributes, collision behavior, macro composition,
and compile-level consumer integration. Run supported toolchain/SwiftSyntax combinations
and review snapshot changes semantically rather than updating them mechanically.

### Detailed Answer

Unit-test semantic analysis helpers separately from syntax emission. Expansion snapshots
make generated API diffs visible; integration catches behavior the syntax fixture cannot.

### Engineering Trade-offs

- Exact snapshots detect drift but can be formatting-sensitive.
- Structural assertions reduce churn but may miss API text changes.
- Consumer fixtures cost build time while protecting real compatibility.

### Production Scenario

A macro update preserves compilation but changes a generated member from internal to
public. Expansion and consumer API tests catch the unintended surface change.

### Follow-up Questions

- How do you test collisions?
- Which toolchain matrix is justified?
- What makes a snapshot update legitimate?

### Strong Answer Signals

- Covers expansion, diagnostics, and integration.
- Treats generated API as reviewed output.
- Includes compatibility versions.

### Weak Answer Signals

- Tests only one valid invocation.
- Auto-accepts all snapshot changes.
- Omits diagnostic and collision tests.

### Related Theory

- [Production Considerations](theory.md#production-considerations)
