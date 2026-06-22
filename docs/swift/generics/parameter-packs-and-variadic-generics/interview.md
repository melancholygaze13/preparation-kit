---
title: "Parameter Packs and Variadic Generics: Interview Questions"
domain: "Swift"
topic: "Generics"
concept: "Parameter Packs and Variadic Generics"
page_type: interview
interview_priority: situational
estimated_read_minutes: 3
levels: [staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Parameter Packs and Variadic Generics: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When is a parameter pack better than a collection?](#q1-pack-versus-collection) | Staff | Compile-time shape versus runtime data |
| [How would you migrate a fixed-arity overload family to packs?](#q2-overload-migration) | Principal | Toolchain, compatibility, and measurement |

---

<a id="q1-pack-versus-collection"></a>
## Q1: When Is a Parameter Pack Better Than a Collection?

### Short Answer

Use a pack when arity varies across call sites but every position's distinct concrete type
must remain known to the compiler. Use a collection when elements share one abstraction
and length or membership is runtime data.

### Expanded Answer

A pack models types such as `(Int, String, URL)` without erasing them and can repeat one
operation positionally. `[Value]` models homogeneous values and supports runtime insertion,
removal, and iteration. Neither is a universally faster substitute for the other.

### Trade-offs

- Packs remove arity caps and casts but raise syntax, diagnostics, and toolchain requirements.
- Collections are operationally simple but cannot preserve unrelated positional types.

### Example

A typed dependency composer replaces overloads for two through ten dependency types with a
pack. A server response list remains an array because its count is runtime data.

---

<a id="q2-overload-migration"></a>
## Q2: How Would You Migrate a Fixed-Arity Overload Family to Packs?

### Short Answer

Establish the supported compiler floor first. Implement and test the pack form,
including zero arity. Compare inference and generated interfaces, then measure
build time, binary size, and runtime before staged deprecation.

### Expanded Answer

The new declaration may infer differently or require newer syntax in generated interfaces.
Keep old entry points as shims if deployment or toolchain policy requires them, avoid
ambiguous overlap, compile real clients, and remove the ladder only after adoption data
shows it is safe.

### Trade-offs

- Immediate replacement deletes maintenance quickly but can strand older toolchains.
- Staged shims preserve compatibility but temporarily retain API and test duplication.

### Example

A result-builder library has ten tuple overloads. The team ships a pack-based core, keeps
source-compatible forwarding overloads for one release, monitors compile metrics, then
deprecates only the redundant forms.
