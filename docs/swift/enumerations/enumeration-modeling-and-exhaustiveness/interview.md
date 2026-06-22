---
title: "Enumeration Modeling and Exhaustiveness: Interview Questions"
domain: "Swift"
topic: "Enumerations"
concept: "Enumeration Modeling and Exhaustiveness"
page_type: interview
interview_priority: high
estimated_read_minutes: 6
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-22
tags:
  - enumerations
  - state-modeling
  - exhaustiveness
  - case-iterable
---

# Enumeration Modeling and Exhaustiveness: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Why use an enum instead of Booleans and optionals for state?](#q1-invalid-states) | Senior | Making invalid combinations unrepresentable |
| [When should an enum switch avoid default?](#q2-exhaustive-switches) | Senior | Evolution and compiler assistance |
| [What does CaseIterable provide and what should not depend on it?](#q3-case-iterable) | Senior | Inventory versus stable policy |
| [When is an enum the wrong abstraction for alternatives?](#q4-closed-versus-open) | Senior | Closed sets and independent dimensions |
| [How should a shared enum evolve across a system?](#q5-system-evolution) | Staff | Ownership and distributed rollout |

---

<a id="q1-invalid-states"></a>
## Q1: Why Use an Enum Instead of Booleans and Optionals for State?

### Short Answer

Use an enum when states are mutually exclusive. One enum value can hold exactly
one case, and each case can carry only its valid payload. Several flags and
optionals allow contradictory combinations such as loading with both data and an
error. The enum moves those constraints into construction and exhaustive handling.

### Expanded Answer

An enum such as idle, loading, loaded(Data), and failed(Error) represents the
actual alternatives directly. Consumers cannot forget to check whether fields
agree before using them.

Independent dimensions should not be forced into one enum. Authentication and
reachability may combine freely; a product state containing every cross-product
case grows artificially. Model only genuine mutual exclusion together.

### Trade-offs

- Enums eliminate invalid combinations and enable exhaustive decisions.
- Adding a state touches all exhaustive consumers.
- Separate dimensions are more composable but require coordination where they
  interact.

### Example

A screen has `isLoading`, cached data, and error flags. Retry races produce all
three simultaneously. An actor-owned enum state and validated reducer make each
transition atomic and representable.

---

<a id="q2-exhaustive-switches"></a>
## Q2: When Should an Enum Switch Avoid default?

### Short Answer

Avoid default for a closed enum you own when each case deserves explicit policy;
adding a case then creates useful compile failures. Use default when all residual
values truly share behavior. For a nonfrozen external enum that may add cases,
handle known cases and use `@unknown default` with a safe forward-compatible
fallback.

### Expanded Answer

A default in a state reducer can silently route a new security or payment state
through old behavior. Exhaustiveness turns case addition into an intentional
migration.

External framework enums require runtime tolerance because a newer framework can
produce a case unknown when the client was built. `@unknown default` preserves a
fallback while keeping compiler warnings for omitted currently known cases.

### Trade-offs

- Exhaustiveness increases change work and review quality.
- Default reduces churn but can hide semantic gaps.
- Unknown fallback improves resilience but needs telemetry and product policy.

### Example

A new `.suspended` account case falls into a default that enables access. Naming
all owned cases forces the authorization decision before release.

---

<a id="q3-case-iterable"></a>
## Q3: What Does CaseIterable Provide and What Should Not Depend on It?

### Short Answer

For eligible enums, `CaseIterable` provides `allCases`, a collection of case
values useful for iteration, tests, pickers, and tooling. It does not prove every
case is user-selectable, authorized, available, or supported remotely. Do not
persist an `allCases` offset or treat declaration order as stable identity; use
explicit IDs, ranks, and filtering policy.

### Expanded Answer

Adding a case can automatically place it in every generic picker or test loop.
That is useful for inventory coverage but dangerous if visibility requires a
feature flag, entitlement, or server capability.

Associated-value cases describe potentially unbounded values, so synthesized
`allCases` cannot enumerate the domain. A manual list should be named as examples,
supported presets, or another precise policy—not “all” unless it truly is.

### Trade-offs

- Synthesized inventory reduces duplicated lists.
- Automatic inclusion can expose cases prematurely.
- Explicit catalogs add maintenance while encoding product policy.

### Example

A new internal theme case automatically appears in a settings picker driven by
`allCases`. An explicit `userSelectableThemes` policy prevents internal and
feature-gated cases from leaking.

---

<a id="q4-closed-versus-open"></a>
## Q4: When Is an Enum the Wrong Abstraction for Alternatives?

### Short Answer

An enum is wrong when alternatives must be added by independent modules, when
several dimensions combine independently, or when each alternative owns an open
set of behavior and state better represented by conforming types. Use protocols,
classes, registries, or separate properties for open or orthogonal models. Use an
enum when one owner can define and evolve the complete meaningful set.

### Expanded Answer

A plugin architecture cannot require every third party to edit one central enum.
A protocol or type-erased value supports an open family. Conversely, a closed
network state benefits from compiler exhaustiveness.

One enum combining platform, authentication, connectivity, and feature rollout
creates a cross product of states. Separate typed dimensions and coordinate them
in the owning policy layer.

### Trade-offs

- Enums provide exhaustive coverage and centralized ownership.
- Open abstractions support extension but require dynamic capability handling.
- Separate dimensions reduce case explosion while permitting more combinations.

### Example

A rendering engine models every renderer implementation as a central enum. New
modules require core releases. Moving to a renderer protocol lets modules register
implementations while a smaller enum retains only closed built-in modes.

---

<a id="q5-system-evolution"></a>
## Q5: How Should a Shared Enum Evolve Across a System?

### Short Answer

Assign one owner, classify the enum as source-only or externally represented,
inventory exhaustive consumers and transition logic, define unknown-case behavior,
and coordinate storage, wire, analytics, UI, and older clients. Deploy tolerant
readers before new producers, instrument fallback use, and avoid reusing or
reinterpreting existing codes.

### Expanded Answer

Within one source build, compile failures find many exhaustive consumers. They do
not find older binaries, persisted values, dashboards, or services. External
formats need explicit stable identifiers and unknown preservation or rejection
policy.

Rollout sequencing depends on risk: readers learn the case, storage and analytics
accept it, then producers emit it. Rollback must not leave new persisted state that
old code misinterprets.

### Trade-offs

- Strict rejection protects invariants but can break forward compatibility.
- Unknown preservation supports mixed versions but expands domain states.
- Compatibility windows add code and telemetry while enabling safe rollout.

### Example

A server emits a new order status before old clients understand it. Clients treat
unknown as completed. The corrected rollout adds an explicit unknown state,
deploys tolerant readers, updates analytics, and enables server emission later.
