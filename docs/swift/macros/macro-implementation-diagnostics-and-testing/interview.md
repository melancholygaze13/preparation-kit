---
title: "Macro Implementation, Diagnostics, and Testing: Interview Questions"
domain: "Swift"
topic: "Macros"
concept: "Macro Implementation, Diagnostics, and Testing"
page_type: interview
interview_priority: situational
estimated_read_minutes: 2
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
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

### Short Answer

Validate syntax explicitly and emit a source-located diagnostic explaining the
requirement and repair. Add notes or fix-its when unambiguous. Never force-cast syntax,
crash the plugin, silently ignore the attribute, or generate code that fails later with
an unrelated compiler error.

### Expanded Answer

Macro input is effectively untrusted. Diagnostics should point to the narrow invalid
node and remain deterministic across formatting differences.

### Trade-offs

- Early diagnostics require validation code but shorten debugging.
- Fix-its accelerate repair but must never guess unsafe intent.
- Silent fallback preserves builds while hiding configuration mistakes.

### Example

A macro expects a struct but is attached to an enum. It diagnoses the enum declaration
and proposes removal rather than failing inside a syntax cast.

---

<a id="q2-expansion-testing"></a>
## Q2: What Should Macro Tests Verify?

### Short Answer

Test exact expansion and generated names, diagnostics and fix-its, malformed and edge
syntax, access and isolation, generics, attributes, collision behavior, macro composition,
and compile-level consumer integration. Run supported toolchain/SwiftSyntax combinations
and review snapshot changes semantically rather than updating them mechanically.

### Expanded Answer

Unit-test semantic analysis helpers separately from syntax emission. Expansion snapshots
make generated API diffs visible; integration catches behavior the syntax fixture cannot.

### Trade-offs

- Exact snapshots detect drift but can be formatting-sensitive.
- Structural assertions reduce churn but may miss API text changes.
- Consumer fixtures cost build time while protecting real compatibility.

### Example

A macro update preserves compilation but changes a generated member from internal to
public. Expansion and consumer API tests catch the unintended surface change.
