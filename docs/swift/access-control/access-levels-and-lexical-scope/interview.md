---
title: "Access Levels and Lexical Scope: Interview Questions"
domain: "Swift"
topic: "Access Control"
concept: "Access Levels and Lexical Scope"
page_type: interview
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
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

### What It Evaluates

Command of source visibility boundaries.

### Short Answer

Private is lexical declaration/same-file extension scope; fileprivate is the file; internal is the
module; package is the package's modules; public is external use; open additionally allows external
subclassing and overriding for classes/members.

### Detailed Answer

Internal is default. Members of a public type remain internal unless widened. Access is compile-time
encapsulation, not runtime authorization or synchronization.

### Engineering Trade-offs

- Narrow scope reduces coupling and evolution obligations.
- Broad scope enables consumers but creates compatibility surface.

### Production Scenario

Several targets in one package share a parser via `package`, while only a stable facade is public to
external clients.

### Follow-up Questions

- How does private work in same-file extensions?
- Which declarations can be open?

### Strong Answer Signals

- Names all six levels and scopes.

### Weak Answer Signals

- Treats fileprivate and private as identical.

### Related Theory

- [Quick Recall](theory.md#quick-recall)

---

<a id="q2-signature-visibility"></a>
## Q2: Why Can a Public Function Not Return an Internal Type?

### What It Evaluates

Understanding interface consistency.

### Short Answer

External callers must be able to name and use every type in the public signature. An internal result
would make the public declaration unusable and expose an implementation the module has not published.

### Detailed Answer

The same minimum-access rule applies to parameters, tuples, function types, and generic arguments.
Return a public facade, opaque type, existential, or make the whole declaration internal.

### Engineering Trade-offs

- Public concrete types maximize caller capability.
- Facades/opaque results preserve implementation freedom.

### Production Scenario

A public factory originally returns an internal transport. It changes to a public domain protocol
with an opaque result, keeping transport structure private.

### Follow-up Questions

- How is a tuple's access determined?
- When is an opaque result appropriate?

### Strong Answer Signals

- Applies the least-accessible-component rule.

### Weak Answer Signals

- Suggests compiler-generated runtime hiding.

### Related Theory

- [Constraints and Guarantees](theory.md#constraints-and-guarantees)

---

<a id="q3-package-choice"></a>
## Q3: When Should You Use `package` Instead of `public`?

### What It Evaluates

Package architecture and API ownership.

### Short Answer

Use package when multiple modules in one Swift package need a declaration but external package clients
must not depend on it. Use public only for a supported external contract with compatibility policy.

### Detailed Answer

Package reduces public leakage while allowing package decomposition. It still couples modules and can
become an internal platform surface, so ownership, layering, and migration remain necessary.

### Engineering Trade-offs

- Package supports modular implementation sharing.
- It can create package-wide dependency tangles if used indiscriminately.

### Production Scenario

A package exposes one public SDK target while implementation targets share package-level wire models.
External apps see only stable domain APIs.

### Follow-up Questions

- How is package identity supplied to the compiler?
- What happens when code moves between packages?

### Strong Answer Signals

- Distinguishes package clients from external clients.
- Includes ownership and migration.

### Weak Answer Signals

- Calls package equivalent to public.

### Related Theory

- [Compatibility and Migration](theory.md#compatibility-and-migration)
