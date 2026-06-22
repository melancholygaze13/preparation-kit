---
title: "Heterogeneous Values and Boundary Design: Interview Questions"
domain: "Swift"
topic: "Type Casting"
concept: "Heterogeneous Values and Boundary Design"
page_type: interview
interview_priority: situational
estimated_read_minutes: 3
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Heterogeneous Values and Boundary Design: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What is the difference between Any and AnyObject?](#q1-any-and-anyobject) | Senior | Erasure and class constraint |
| [How should a String-to-Any payload be handled?](#q2-erased-payload) | Senior | Boundary validation |
| [How would you migrate away from pervasive Any?](#q3-erasure-migration) | Principal | Schema ownership and rollout |

---

<a id="q1-any-and-anyobject"></a>
## Q1: What Is the Difference Between Any and AnyObject?

### Short Answer

`Any` can hold a value of any type, including structs, enums, functions, class
instances, and optionals. `AnyObject` represents an instance of any class type, though
Objective-C bridging can affect what interoperable values appear as `AnyObject`. Neither
provides a domain schema or safe mutation contract.

### Expanded Answer

Implicit optional-to-Any conversion warns because a nil optional stored as an `Any`
value differs from the absence of a container element. Make the intent explicit.

### Trade-offs

- Any supports truly heterogeneous boundaries.
- AnyObject serves reference-constrained interoperability.
- Typed wrappers preserve capabilities and compiler checking.

### Example

An Objective-C API returns heterogeneous values as objects. An adapter validates and
bridges them into Swift domain values before concurrency or persistence use.

---

<a id="q2-erased-payload"></a>
## Q2: How Should a String-to-Any Payload Be Handled?

### Short Answer

Keep it at the boundary, distinguish missing, null, wrong-type, and invalid-value cases,
cast fields conditionally, validate domain constraints, and construct a typed value once.
Do not pass the raw dictionary through business logic. Preserve unknown fields only
when compatibility policy requires it.

### Expanded Answer

A successful `as? Int` proves representation, not range or semantic validity. Wire data
usually benefits from Codable or an explicit parser with versioned errors.

### Trade-offs

- Dynamic payloads tolerate open metadata.
- Typed schemas improve safety and tooling.
- Unknown preservation helps forward compatibility while retaining unvalidated data.

### Example

Analytics metadata accepts `[String: Any]`; a schema adapter validates approved keys,
redacts secrets, and preserves unknown server fields separately for forwarding.

---

<a id="q3-erasure-migration"></a>
## Q3: How Would You Migrate Away from Pervasive Any?

### Short Answer

Inventory producers and consumers, define versioned typed schemas and unknown-field
policy, add adapters at ingress, dual-read or shadow-validate legacy payloads, measure
failures, migrate consumers, then narrow the erased API. Preserve rollback and assign
one owner for schema, tooling, redaction, and compatibility.

### Expanded Answer

Do not replace every cast simultaneously. Start with high-risk fields and establish
typed domain values without requiring old producers to upgrade in lockstep.

### Trade-offs

- Dual handling reduces rollout risk but duplicates validation.
- Strict schemas improve correctness while constraining open metadata.
- Versioned adapters add maintenance but support mixed deployments.

### Example

A shared event bus carries arbitrary dictionaries. A versioned envelope and typed event
adapters shadow-validate traffic before producers and dashboards migrate incrementally.
