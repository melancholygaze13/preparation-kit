---
title: "Generic Context and API Evolution: Interview Questions"
domain: "Swift"
topic: "Nested Types"
concept: "Generic Context and API Evolution"
page_type: interview
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-21
---

# Generic Context and API Evolution: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How does generic context affect a nested type?](#q1-generic-context) | Senior | Specialization and dependencies |
| [How would you move a public nested type?](#q2-public-type-migration) | Staff | Compatibility and rollout |
| [How should type placement be governed across modules?](#q3-type-placement-governance) | Principal | Domain ownership |

---

<a id="q1-generic-context"></a>
## Q1: How Does Generic Context Affect a Nested Type?

### What It Evaluates

Understanding of enclosing generic parameters and qualified names.

### Short Answer

A nested type can use generic parameters from its enclosing type, so its meaning and
qualified spelling can depend on the outer specialization, such as
`Buffer<String>.Entry`. Use that coupling when the inner concept is genuinely defined
by the outer generic context; otherwise lift it into an independently generic type.

### Detailed Answer

Generic nesting can express ownership precisely but create verbose signatures and
unnecessary feature-level dependencies when the inner record is broadly reusable.

### Engineering Trade-offs

- Nested context avoids repeating generic relationships.
- Top-level generic types improve reuse and neutral ownership.
- Qualification disambiguates but can reduce readability.

### Production Scenario

A buffer entry initially depends on `Element`; later several containers use it. A
top-level `IndexedValue<Element>` becomes the stable shared model.

### Follow-up Questions

- Are specializations interchangeable types?
- When should the inner type declare its own generic parameter?
- How does qualification help inference?

### Strong Answer Signals

- Identifies real generic dependency.
- Lifts independently meaningful types.
- Considers call-site readability.

### Weak Answer Signals

- Assumes nesting never affects type identity.
- Couples shared models to feature containers.
- Uses deep qualification without semantic value.

### Related Theory

- [How It Works](theory.md#how-it-works)

---

<a id="q2-public-type-migration"></a>
## Q2: How Would You Move a Public Nested Type?

### What It Evaluates

Staff-level source and schema migration planning.

### Short Answer

Introduce the new type at its stable owner, provide a deprecated typealias or adapter
where compatibility permits, migrate internal producers and representative clients,
and verify generated interfaces, binary expectations, reflection, and serialization.
Measure old-name use before removal and never use the qualified type name as persisted identity.

### Detailed Answer

A typealias can preserve source spelling but not every ABI, tooling, reflection, or
schema behavior. Mixed-version modules need a declared compatibility window and rollback.

### Engineering Trade-offs

- Aliases reduce source churn but prolong duplicate vocabulary.
- Clean renames simplify the endpoint but require coordinated migration.
- Adapters can preserve representation while isolating old ownership.

### Production Scenario

`Feature.Event` becomes a platform event. A temporary alias and codemod migrate modules,
while explicit wire codes keep stored events unchanged.

### Follow-up Questions

- What does a typealias not preserve?
- How would you automate call-site changes?
- When can the alias be removed?

### Strong Answer Signals

- Covers source, binary, reflection, and schema dimensions.
- Uses telemetry and automation.
- Separates type name from wire identity.

### Weak Answer Signals

- Assumes aliasing makes the move free.
- Renames persisted discriminators accidentally.
- Has no mixed-version plan.

### Related Theory

- [Public API Evolution](theory.md#public-api-evolution)

---

<a id="q3-type-placement-governance"></a>
## Q3: How Should Type Placement Be Governed Across Modules?

### What It Evaluates

Principal-level domain vocabulary and dependency ownership.

### Short Answer

Place a type in the lowest stable domain that owns its invariants. Nest feature-private
vocabulary, promote shared concepts to neutral modules, prohibit reflected names as
schemas, and require ownership plus compatibility review for public moves. Support
large migrations with aliases, codemods, consumer CI, and removal schedules.

### Detailed Answer

Placement controls dependency direction and extraction cost. Centralizing every type
is not the answer; shared modules need cohesive scope and owners rather than becoming dumps.

### Engineering Trade-offs

- Local nesting improves autonomy.
- Shared modules reduce duplication but increase coordination.
- Governance protects architecture while allowing reviewed exceptions.

### Production Scenario

Multiple features define incompatible nested `UserID` values. A platform-owned domain
identifier replaces them, with adapters at feature boundaries during rollout.

### Follow-up Questions

- What qualifies as shared vocabulary?
- Who owns compatibility aliases?
- How do you prevent a common module from becoming a dump?

### Strong Answer Signals

- Aligns placement with invariant ownership.
- Includes migration tooling and lifecycle.
- Avoids both duplication and indiscriminate centralization.

### Weak Answer Signals

- Places types beside first use permanently.
- Creates a universal Common module.
- Has no owner for shared vocabulary.

### Related Theory

- [Dependency Direction](theory.md#dependency-direction)
