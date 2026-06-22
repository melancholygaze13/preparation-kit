---
title: "Access Levels and Lexical Scope: Interview Questions"
domain: "Swift"
topic: "Access Control"
concept: "Access Levels and Lexical Scope"
page_type: interview
interview_priority: situational
estimated_read_minutes: 3
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Access Levels and Lexical Scope: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do Swift's access levels differ?](#q1-access-levels) | Senior | Visibility domains |
| [Why can a public function not return an internal type?](#q2-signature-visibility) | Senior | Interface consistency |
| [When should you use `package` instead of `public`?](#q3-package-choice) | Staff | Ownership boundary |

---

<a id="q1-access-levels"></a>
## Q1: How Do Swift's Access Levels Differ?

### Short Answer

`private` covers a declaration and allowed same-file extensions. `fileprivate`
covers the file, `internal` the module, and `package` the package. `public` allows
external use. `open` also allows external subclassing or overriding.

### Expanded Answer

Internal is default. Members of a public type remain internal unless widened. Access is compile-time
encapsulation, not runtime authorization or synchronization.

### Trade-offs

- Narrow scope reduces coupling and evolution obligations.
- Broad scope enables consumers but creates compatibility surface.

### Example

Several targets in one package share a parser via `package`, while only a stable facade is public to
external clients.

---

<a id="q2-signature-visibility"></a>
## Q2: Why Can a Public Function Not Return an Internal Type?

### Short Answer

External callers must be able to name and use every type in the public signature. An internal result
would make the public declaration unusable and expose an implementation the module has not published.

### Expanded Answer

The same minimum-access rule applies to parameters, tuples, function types, and generic arguments.
Return a public facade, opaque type, existential, or make the whole declaration internal.

### Trade-offs

- Public concrete types maximize caller capability.
- Facades/opaque results preserve implementation freedom.

### Example

A public factory originally returns an internal transport. It changes to a public domain protocol
with an opaque result, keeping transport structure private.

---

<a id="q3-package-choice"></a>
## Q3: When Should You Use `package` Instead of `public`?

### Short Answer

Use package when multiple modules in one Swift package need a declaration but external package clients
must not depend on it. Use public only for a supported external contract with compatibility policy.

### Expanded Answer

Package reduces public leakage while allowing package decomposition. It still couples modules and can
become an internal platform surface, so ownership, layering, and migration remain necessary.

### Trade-offs

- Package supports modular implementation sharing.
- It can create package-wide dependency tangles if used indiscriminately.

### Example

A package exposes one public SDK target while implementation targets share package-level wire models.
External apps see only stable domain APIs.
