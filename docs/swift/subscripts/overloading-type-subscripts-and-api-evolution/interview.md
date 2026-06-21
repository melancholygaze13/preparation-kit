---
title: "Overloading, Type Subscripts, and API Evolution: Interview Questions"
domain: "Swift"
topic: "Subscripts"
concept: "Overloading, Type Subscripts, and API Evolution"
page_type: interview
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-21
---

# Overloading, Type Subscripts, and API Evolution: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When is subscript overloading appropriate?](#q1-overload-design) | Senior | Disambiguation and domain types |
| [When should you use a type subscript?](#q2-type-subscript) | Senior | Type ownership and shared state |
| [How can a new overload break clients?](#q3-overload-evolution) | Staff | Source compatibility and inference |
| [How should public indexed APIs be governed?](#q4-indexed-api-governance) | Principal | Cross-system contracts |

---

<a id="q1-overload-design"></a>
## Q1: When Is Subscript Overloading Appropriate?

### What It Evaluates

Whether overloads remain predictable at call sites.

### Short Answer

Overload when each signature represents a distinct natural lookup and labels or
nominal key types make selection obvious. Avoid overloads distinguished mainly by
expected return type or similar primitive keys. Use semantic labels, dedicated ID
types, or named methods when inference or behavior would be ambiguous.

### Detailed Answer

`catalog[id: ProductID]` and `catalog[code: ProductCode]` communicate domains. Two
unlabeled `String` forms cannot. Different failure, authorization, or I/O behavior
usually deserves different method names rather than shared brackets.

### Engineering Trade-offs

- Overloads unify genuinely parallel access.
- Nominal keys prevent domain mixing.
- Named operations scale better when policies diverge.

### Production Scenario

Several string-key overloads select through contextual return types. Introducing
`UserID` and `OrderID` makes call sites and compiler diagnostics deterministic.

### Follow-up Questions

- Why are return-only overloads fragile?
- When do labels help?
- What belongs in a named method?

### Strong Answer Signals

- Requires obvious compile-time selection.
- Uses nominal keys for domain separation.
- Separates effectful operations.

### Weak Answer Signals

- Adds overloads until type annotations are required everywhere.
- Reuses raw strings for unrelated keys.
- Hides different policies behind identical syntax.

### Related Theory

- [Overloads and Labels](theory.md#overloads-and-labels)

---

<a id="q2-type-subscript"></a>
## Q2: When Should You Use a Type Subscript?

### What It Evaluates

Judgment about type-owned lookup versus static service access.

### Short Answer

Use a type subscript for deterministic lookup genuinely owned by the type, such as a
static code table. Do not use it as a repository or service locator that hides I/O,
failure, lifecycle, or mutable global state. Use `static subscript` normally; expose
`class subscript` only when subclass overriding is an intentional contract.

### Detailed Answer

Mutable backing state still needs explicit isolation. Even actor-isolated access does
not make several reads and writes one transaction; expose an owner method for compound operations.

### Engineering Trade-offs

- Type lookup is concise for pure tables.
- Injected repositories expose effects and are replaceable.
- Overridable lookup enables customization but weakens invariants.

### Production Scenario

`User[42]` performs network I/O through a singleton. `repository.fetchUser(id:)` makes
asynchrony, errors, caching, authorization, and ownership visible.

### Follow-up Questions

- How do `static` and `class` differ?
- Does isolation make workflows atomic?
- How should cached type lookup be documented?

### Strong Answer Signals

- Limits type subscripts to type-owned lookup.
- Identifies hidden global-state risk.
- Treats overridability deliberately.

### Weak Answer Signals

- Uses bracket syntax for remote services.
- Assumes static state is synchronized.
- Makes all class subscripts overridable.

### Related Theory

- [Type Subscripts](theory.md#type-subscripts)

---

<a id="q3-overload-evolution"></a>
## Q3: How Can a New Overload Break Clients?

### What It Evaluates

Staff-level understanding of source compatibility beyond declaration validity.

### Short Answer

A new overload can become a better inferred match, make a formerly valid expression
ambiguous, or change generic inference when client source is rebuilt. Test representative
downstream expressions, prefer semantic labels and nominal keys, and introduce a named
API when the new behavior cannot coexist predictably.

### Detailed Answer

Binary compatibility does not guarantee source inference stability. Migration can add
explicit key types first, deprecate the primitive signature, and only later add the new lookup.

### Engineering Trade-offs

- Additive overloads preserve surface shape but can destabilize inference.
- New names are explicit but expand API vocabulary.
- Nominal key migration adds conversion while protecting future evolution.

### Production Scenario

Adding a generic string subscript makes existing literal calls ambiguous. A labeled
`metadata[key:]` API avoids changing old lookup selection.

### Follow-up Questions

- What client fixtures should compile in CI?
- Can expected result type affect selection?
- How would you stage nominal key adoption?

### Strong Answer Signals

- Tests downstream source, not only the library.
- Plans staged deprecation.
- Recognizes inference as compatibility.

### Weak Answer Signals

- Calls every additive declaration source-compatible.
- Fixes ambiguity with arbitrary caller annotations.
- Has no client compilation tests.

### Related Theory

- [Ambiguity and Evolution](theory.md#ambiguity-and-evolution)

---

<a id="q4-indexed-api-governance"></a>
## Q4: How Should Public Indexed APIs Be Governed?

### What It Evaluates

Principal-level ownership of indexed contracts across boundaries.

### Short Answer

Standardize nominal identifiers, bounds and absence policy, complexity, index
invalidation, authorization scope, isolation, and compatibility tests. Prohibit
in-memory indices from persistence or wire formats. Require explicit methods for
remote or effectful lookup and give shared schemas and repositories named owners.

### Detailed Answer

Compact syntax can conceal high coupling. Platform guidance should include overload
budgets, client-source fixtures, telemetry for misses and latency, and migrations from
primitive keys to versioned domain identifiers.

### Engineering Trade-offs

- Common key types improve interoperability but require shared ownership.
- Strict rules reduce ambiguity while allowing reviewed local collection APIs.
- Compatibility suites cost maintenance but catch inference regressions before release.

### Production Scenario

Teams persist array positions for server entities. A shared entity-ID contract and
repository boundary eliminate reorder corruption and make authorization auditable.

### Follow-up Questions

- Which rules can linting enforce?
- Who owns identifier evolution?
- How are old clients migrated?

### Strong Answer Signals

- Covers identity, effects, security, and compatibility.
- Assigns owners and enforcement.
- Allows contextual exceptions.

### Weak Answer Signals

- Treats subscripts as syntax-only style.
- Allows ephemeral indices across services.
- Omits client evolution.

### Related Theory

- [Staff and Principal Perspective](theory.md#staff-and-principal-perspective)
