---
title: "Parameter Packs and Variadic Generics: Interview Questions"
domain: "Swift"
topic: "Generics"
concept: "Parameter Packs and Variadic Generics"
page_type: interview
levels: [staff, principal]
status: reviewed
last_reviewed: 2026-06-21
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

### What It Evaluates

Whether the candidate understands heterogeneous static shape.

### Short Answer

Use a pack when arity varies across call sites but every position's distinct concrete type
must remain known to the compiler. Use a collection when elements share one abstraction
and length or membership is runtime data.

### Detailed Answer

A pack models types such as `(Int, String, URL)` without erasing them and can repeat one
operation positionally. `[Value]` models homogeneous values and supports runtime insertion,
removal, and iteration. Neither is a universally faster substitute for the other.

### Engineering Trade-offs

- Packs remove arity caps and casts but raise syntax, diagnostics, and toolchain requirements.
- Collections are operationally simple but cannot preserve unrelated positional types.

### Production Scenario

A typed dependency composer replaces overloads for two through ten dependency types with a
pack. A server response list remains an array because its count is runtime data.

### Follow-up Questions

- What happens with an empty pack?
- What shape requirement applies to two packs in one repetition?

### Strong Answer Signals

- Distinguishes compile-time shape from runtime length.
- Mentions heterogeneous positional relationships.

### Weak Answer Signals

- Calls packs dynamically sized arrays.
- Uses packs for ordinary homogeneous data.

### Related Theory

- [Mental Model](theory.md#mental-model)

---

<a id="q2-overload-migration"></a>
## Q2: How Would You Migrate a Fixed-Arity Overload Family to Packs?

### What It Evaluates

Framework migration and operational rigor.

### Short Answer

Establish the supported compiler floor, implement and test the pack form including zero
arity, compare inference and generated interfaces, retain compatibility overloads where
needed, and measure client build time, binary size, and runtime before staged deprecation.

### Detailed Answer

The new declaration may infer differently or require newer syntax in generated interfaces.
Keep old entry points as shims if deployment or toolchain policy requires them, avoid
ambiguous overlap, compile real clients, and remove the ladder only after adoption data
shows it is safe.

### Engineering Trade-offs

- Immediate replacement deletes maintenance quickly but can strand older toolchains.
- Staged shims preserve compatibility but temporarily retain API and test duplication.

### Production Scenario

A result-builder library has ten tuple overloads. The team ships a pack-based core, keeps
source-compatible forwarding overloads for one release, monitors compile metrics, then
deprecates only the redundant forms.

### Follow-up Questions

- Which compile-fail cases belong in fixtures?
- How would you detect a code-size regression?

### Strong Answer Signals

- Covers client toolchains, inference, diagnostics, and measurement.
- Treats migration as more than a mechanical rewrite.

### Weak Answer Signals

- Deletes overloads after one local build.
- Assumes fewer source lines guarantee lower build cost.

### Related Theory

- [Compatibility and Migration](theory.md#compatibility-and-migration)
