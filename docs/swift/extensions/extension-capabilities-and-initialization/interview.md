---
title: "Extension Capabilities and Initialization: Interview Questions"
domain: "Swift"
topic: "Extensions"
concept: "Extension Capabilities and Initialization"
page_type: interview
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
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

### What It Evaluates

Accurate extension mechanics without confusing them with subclassing.

### Short Answer

Extensions can add computed properties, methods, type methods, initializers, subscripts,
nested types, and protocol conformances. They cannot add stored properties, property
observers, deinitializers, or override existing functionality.

### Detailed Answer

An extension contributes declarations to the same type; it does not create a subtype or
change stored layout. Added members obey normal access, availability, isolation, and
overload rules. Hidden global maps do not turn computed syntax into safe instance storage.

### Engineering Trade-offs

- Extensions give discoverable dot syntax without wrappers.
- Broad foreign-type extensions risk collisions and unclear semantic ownership.
- Splitting files improves organization until invariant behavior becomes fragmented.

### Production Scenario

A team wants cached parsed state on `URL`. A global dictionary keyed by URL would add
lifetime and synchronization bugs, so the cache belongs in an explicit loader/owner.

### Follow-up Questions

- Can an extension add a nested type?
- Why can it not override a class method?

### Strong Answer Signals

- Separates computed behavior from storage.
- Includes access, collision, and isolation consequences.

### Weak Answer Signals

- Treats extensions as partial classes with stored state.
- Uses associated-object storage without discussing lifetime and concurrency.

### Related Theory

- [Constraints and Guarantees](theory.md#constraints-and-guarantees)

---

<a id="q2-extension-initialization"></a>
## Q2: What Initialization Rules Apply to Extensions?

### What It Evaluates

Value- and reference-type initialization boundaries.

### Short Answer

Extensions can add initializers. A class extension can add convenience but not designated
initializers or deinitializers. An initializer for a value type from another module must
delegate to a defining-module initializer before accessing `self`.

### Detailed Answer

For a local value type whose synthesized default/memberwise initializers remain available,
an extension initializer can delegate to them. This is useful for preserving synthesis.
External modules own stored representation, so client extensions must initialize through
the API they expose rather than assigning foreign stored properties piecemeal.

### Engineering Trade-offs

- Extension initializers preserve synthesized APIs but can enlarge construction surface.
- Factory methods can express validation/failure policy more clearly than overloaded init.

### Production Scenario

A module adds a convenience initializer to an SDK class and delegates to its designated
initializer. It does not attempt to add a new designated lifecycle path in an extension.

### Follow-up Questions

- How can placing a struct initializer in an extension preserve memberwise initialization?
- When should initialization be a throwing factory?

### Strong Answer Signals

- Distinguishes class convenience and designated initialization.
- Recognizes cross-module `self` restrictions.

### Weak Answer Signals

- Claims all initializer kinds are allowed.
- Bypasses the defining type's validation contract.

### Related Theory

- [How It Works](theory.md#how-it-works)

---

<a id="q3-extension-versus-wrapper"></a>
## Q3: When Should Extension Behavior Become a Wrapper?

### What It Evaluates

Architecture and semantic ownership.

### Short Answer

Use a wrapper when behavior needs stored state, validation, lifecycle, application-specific
identity, or independent evolution. Use an extension when behavior is naturally derived
from the existing type and the added name and semantics are broadly valid.

### Detailed Answer

A wrapper creates an explicit boundary and can own persistence, sendability, dependencies,
and migration. Extensions are attractive for convenience but can pollute foundational
types with feature-specific vocabulary and create future member collisions.

### Engineering Trade-offs

- Wrappers require conversions and forwarding.
- Extensions minimize ceremony but create tighter source coupling.

### Production Scenario

Rather than add payment-specific validation to `String`, a `PaymentReference` wrapper
owns normalization, validation, Codable format, and redaction.

### Follow-up Questions

- When is a free function clearer?
- How do public extensions affect SDK evolution?

### Strong Answer Signals

- Decides from state and semantic ownership.
- Includes migration and module boundaries.

### Weak Answer Signals

- Chooses extensions only for shorter call sites.
- Adds domain policy to primitive types globally.

### Related Theory

- [Engineering Judgment](theory.md#engineering-judgment)
