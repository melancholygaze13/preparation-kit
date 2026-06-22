---
title: "Extension Capabilities and Initialization: Interview Questions"
domain: "Swift"
topic: "Extensions"
concept: "Extension Capabilities and Initialization"
page_type: interview
interview_priority: situational
estimated_read_minutes: 3
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Extension Capabilities and Initialization: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What can and cannot be added in an extension?](#q1-extension-capabilities) | Senior | Language boundaries |
| [What initialization rules apply to extensions?](#q2-extension-initialization) | Senior | Delegation and invariants |
| [When should extension behavior become a wrapper?](#q3-extension-versus-wrapper) | Staff | Ownership and evolution |

---

<a id="q1-extension-capabilities"></a>
## Q1: What Can and Cannot Be Added in an Extension?

### Short Answer

Extensions can add computed properties, methods, type methods, initializers, subscripts,
nested types, and protocol conformances. They cannot add stored properties, property
observers, deinitializers, or override existing functionality.

### Expanded Answer

An extension contributes declarations to the same type; it does not create a subtype or
change stored layout. Added members obey normal access, availability, isolation, and
overload rules. Hidden global maps do not turn computed syntax into safe instance storage.

### Trade-offs

- Extensions give discoverable dot syntax without wrappers.
- Broad foreign-type extensions risk collisions and unclear semantic ownership.
- Splitting files improves organization until invariant behavior becomes fragmented.

### Example

A team wants cached parsed state on `URL`. A global dictionary keyed by URL would add
lifetime and synchronization bugs, so the cache belongs in an explicit loader/owner.

---

<a id="q2-extension-initialization"></a>
## Q2: What Initialization Rules Apply to Extensions?

### Short Answer

Extensions can add initializers. A class extension can add convenience but not designated
initializers or deinitializers. An initializer for a value type from another module must
delegate to a defining-module initializer before accessing `self`.

### Expanded Answer

For a local value type whose synthesized default/memberwise initializers remain available,
an extension initializer can delegate to them. This is useful for preserving synthesis.
External modules own stored representation, so client extensions must initialize through
the API they expose rather than assigning foreign stored properties piecemeal.

### Trade-offs

- Extension initializers preserve synthesized APIs but can enlarge construction surface.
- Factory methods can express validation/failure policy more clearly than overloaded init.

### Example

A module adds a convenience initializer to an SDK class and delegates to its designated
initializer. It does not attempt to add a new designated lifecycle path in an extension.

---

<a id="q3-extension-versus-wrapper"></a>
## Q3: When Should Extension Behavior Become a Wrapper?

### Short Answer

Use a wrapper when behavior needs stored state, validation, lifecycle, application-specific
identity, or independent evolution. Use an extension when behavior is naturally derived
from the existing type and the added name and semantics are broadly valid.

### Expanded Answer

A wrapper creates an explicit boundary and can own persistence, sendability, dependencies,
and migration. Extensions are attractive for convenience but can pollute foundational
types with feature-specific vocabulary and create future member collisions.

### Trade-offs

- Wrappers require conversions and forwarding.
- Extensions minimize ceremony but create tighter source coupling.

### Example

Rather than add payment-specific validation to `String`, a `PaymentReference` wrapper
owns normalization, validation, Codable format, and redaction.
