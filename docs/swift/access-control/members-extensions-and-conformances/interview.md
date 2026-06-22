---
title: "Members, Extensions, and Conformances: Interview Questions"
domain: "Swift"
topic: "Access Control"
concept: "Members, Extensions, and Conformances"
page_type: interview
interview_priority: situational
estimated_read_minutes: 3
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Members, Extensions, and Conformances: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Do members of a public type become public?](#q1-public-members) | Senior | Explicit publication |
| [How is conformance accessibility determined?](#q2-conformance-access) | Senior | Witness usability |
| [What risks come with public extensions and conformances?](#q3-extension-risk) | Staff | Ecosystem evolution |

---

<a id="q1-public-members"></a>
## Q1: Do Members of a Public Type Become Public?

### Short Answer

No. Members default to internal and must be explicitly public/open where supported. A public struct
can therefore be externally nameable but impossible to construct or use meaningfully until its API
members and initializer are published.

### Expanded Answer

This lets a type expose a narrow stable surface while hiding representation. Inspect the generated
interface and compile an external client rather than inferring API from implementation source.

### Trade-offs

- Explicit members preserve encapsulation.
- More annotations are required for intended public APIs.

### Example

A public response model fails in a client because its synthesized memberwise initializer is not public.
The framework adds one validated public initializer instead of exposing all storage.

---

<a id="q2-conformance-access"></a>
## Q2: How Is Conformance Accessibility Determined?

### Short Answer

Its effective accessibility is bounded by the type and protocol. Every requirement witness must be
accessible wherever that conformance is usable. You do not assign a separate access level to the
conformance itself.

### Expanded Answer

An extension that adds conformance cannot use an extension access modifier for the conformance.
Conformance publication also exposes semantic behavior globally for that type/protocol pair.

### Trade-offs

- Public conformance integrates generic algorithms broadly.
- It creates witness and evolution commitments across clients.

### Example

A public model adopts a public serialization protocol. Its witness must be externally usable and its
wire semantics versioned; an internal helper can remain private behind that witness.

---

<a id="q3-extension-risk"></a>
## Q3: What Risks Come with Public Extensions and Conformances?

### Short Answer

They add globally visible lookup and behavior. New members can collide or alter overload resolution;
retroactive conformances can conflict with other modules or future owner conformances. Both require
ownership, downstream compilation, and migration policy.

### Expanded Answer

Prefer the type/protocol owner for conformances. Keep feature conveniences internal/package-scoped,
inspect generated interfaces, and publish only stable semantic contracts.

### Trade-offs

- Extensions improve discoverability and composition.
- Their global lookup impact reduces local control.

### Example

A package publishes a convenience method on an SDK type; a later SDK adds the same signature. The
package migrates to a namespace wrapper and deprecates the extension.
