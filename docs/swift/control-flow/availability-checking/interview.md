---
title: "Availability Checking: Interview Questions"
domain: "Swift"
topic: "Control Flow"
concept: "Availability Checking"
page_type: interview
levels:
  - senior
  - staff
  - principal
status: reviewed
last_reviewed: 2026-06-20
tags:
  - availability
  - deployment-target
  - compatibility
---

# Availability Checking: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do SDK, deployment target, and runtime OS differ?](#q1-version-layers) | Senior | Build and execution contracts |
| [What is the difference between @available, #available, and #unavailable?](#q2-availability-forms) | Senior | Declaration and control-flow refinement |
| [Why is availability not the same as capability?](#q3-availability-versus-capability) | Senior | Product and runtime correctness |
| [How should an organization own and retire compatibility paths?](#q4-compatibility-ownership) | Staff | Boundaries, testing, and migration |

---

<a id="q1-version-layers"></a>
## Q1: How Do SDK, Deployment Target, and Runtime OS Differ?

### What It Evaluates

Whether the candidate separates compile-time API knowledge from runtime support.

### Short Answer

The SDK supplies declarations and availability metadata to the compiler. The
deployment target is the oldest OS the binary promises to support. The runtime OS
is the version currently executing it. A new SDK lets code know about a new API,
but if that API is newer than the deployment target, references need an available
context or runtime check before they are safe on older installations.

### Detailed Answer

The compiler compares each API's declared availability with the current context.
An `if #available` branch strengthens that context for one runtime path. An
`@available` function strengthens the declaration contract and pushes the
requirement to callers.

Raising the deployment target makes older runtime checks unnecessary only because
those runtimes are no longer supported. It does not follow automatically from
updating Xcode or the SDK.

### Engineering Trade-offs

- New SDK adoption enables APIs and diagnostics without necessarily dropping old
  OS support.
- A low deployment target retains users but expands fallback and test burden.
- Raising the target simplifies code while changing product reach.

### Production Scenario

A team builds with a new SDK and assumes all users have the corresponding OS.
An unguarded API call is rejected because the deployment target remains older.
The feature adds an adapter and fallback until product policy raises the target.

### Follow-up Questions

- Does changing SDK automatically change deployment target?
- What fact does #available refine?
- When can fallback code be removed?

### Strong Answer Signals

- Defines all three layers independently.
- Connects compiler metadata to runtime branching.
- Treats target changes as support decisions.

### Weak Answer Signals

- Uses SDK and runtime OS interchangeably.
- Assumes a successful build proves old-runtime safety.
- Raises the target only to silence diagnostics.

### Related Theory

- [Deployment Target, SDK, and Runtime OS](theory.md#deployment-target-sdk-and-runtime-os)

---

<a id="q2-availability-forms"></a>
## Q2: What Is the Difference Between @available, #available, and #unavailable?

### What It Evaluates

Precise understanding of declaration contracts and runtime control-flow
refinement.

### Short Answer

`@available` annotates a declaration with platform-version or lifecycle metadata.
`#available` is a runtime condition whose true branch permits APIs meeting the
specified version. `#unavailable` expresses the inverse older-runtime path; the
stronger availability applies to its else path. A guard availability check can
refine the rest of its scope after the fallback exits.

### Detailed Answer

Annotate a wrapper when its whole implementation requires the newer API. Use an
if check to choose between implementations and a guard when fallback exits early.
The wildcard covers platforms not explicitly listed at their minimum deployment
target; the list is not ordinary OR logic.

Availability checks are special conditions, not Boolean values. They cannot be
stored or freely negated. Use `#unavailable` instead of an empty positive branch
when only older systems need work.

### Engineering Trade-offs

- Declaration annotations centralize requirements but restrict every caller.
- Inline checks localize branching but can spread thresholds.
- Guard creates a clean modern path when fallback returns early.

### Production Scenario

A helper directly uses an iOS 17 API while every caller repeats the same check.
Marking the helper `@available(iOS 17, *)` makes its contract explicit; a factory
owns the single `#available` selection and legacy implementation.

### Follow-up Questions

- What does `*` mean?
- Which branch of #unavailable gains stronger availability?
- Can you write `!#available(...)`?

### Strong Answer Signals

- Separates attribute from runtime conditions.
- Explains guard refinement and wildcard behavior.
- Places checks at an ownership boundary.

### Weak Answer Signals

- Calls @available a runtime if statement.
- Treats platform entries as Boolean OR operands.
- Scatters identical checks across callers.

### Related Theory

- [Declaration Availability with @available](theory.md#declaration-availability-with-available)
- [Runtime Refinement with #available](theory.md#runtime-refinement-with-available)
- [Negative Checks with #unavailable](theory.md#negative-checks-with-unavailable)

---

<a id="q3-availability-versus-capability"></a>
## Q3: Why Is Availability Not the Same as Capability?

### What It Evaluates

Ability to avoid using OS version as a proxy for runtime product state.

### Short Answer

Availability proves that a symbol may be referenced on the running platform
version. It does not prove the device has required hardware, the app has
permission or entitlement, an account is eligible, a feature flag is enabled, a
service is reachable, or the call will succeed. Check availability for symbol
safety, then use the relevant capability API and handle operation failure.

### Detailed Answer

An iOS version check can guard the compiler-visible API call. Product behavior
still needs direct evidence: authorization status, supported interface, device
capabilities, configuration, and returned errors. These facts can change without
an OS update.

Version proxies age poorly and can enable unsupported behavior on one device
while disabling supported behavior on another. A compatibility adapter can choose
the API, while the feature's domain layer owns eligibility and failure.

### Engineering Trade-offs

- Direct capability checks are accurate but may be asynchronous or stateful.
- Version checks are simple but answer only symbol presence.
- Server flags enable rollout but require offline and stale-configuration policy.

### Production Scenario

A camera feature enables solely on a new OS version but crashes on hardware
without the required camera mode. The fix retains the availability guard and adds
the framework's capability check plus a fallback UI.

### Follow-up Questions

- Can an available API still fail?
- Where should permissions be checked?
- How do feature flags relate to availability?

### Strong Answer Signals

- Lists multiple nonversion capability dimensions.
- Keeps compiler safety separate from product eligibility.
- Handles operation errors after both checks.

### Weak Answer Signals

- Uses OS version as the only feature gate.
- Assumes newer devices imply authorization.
- Ignores server and account configuration.

### Related Theory

- [Availability Is Not Capability](theory.md#availability-is-not-capability)

---

<a id="q4-compatibility-ownership"></a>
## Q4: How Should an Organization Own and Retire Compatibility Paths?

### What It Evaluates

Staff-level reasoning about adapter boundaries, deployment policy, testing, and
fallback deletion.

### Short Answer

Select modern or legacy implementations at a small owned adapter boundary, define
one behavioral contract, and test the oldest supported OS, version boundary, and
current OS. Track path usage and failures. Assign an owner and retirement
criterion tied to an approved deployment-target increase; remove fallback only
after old runtimes are no longer supported and rollback builds no longer require
them.

### Detailed Answer

Scattered checks create many subtly different compatibility paths. One adapter
contains thresholds and lets most feature code remain version-agnostic. It must
normalize behavior that affects concurrency, cancellation, security,
accessibility, and analytics—not only return types.

Deployment-target changes require product, support, release, and sometimes
enterprise input. Use active-version data carefully, preserve emergency release
options, and document why the older path can be deleted. Tests and telemetry
should be removed with the code, not before it.

### Engineering Trade-offs

- Centralization reduces drift but can overgeneralize unrelated behavior.
- Maintaining fallback supports users while increasing binary and test cost.
- Target increases reduce complexity at the cost of device reach and rollback
  flexibility.

### Production Scenario

Five modules implement different checks for the same framework transition. A
platform-owned adapter unifies semantics, path telemetry shows negligible legacy
use, and product approves a target increase. The fallback is removed in a later
release after the rollback window closes.

### Follow-up Questions

- Which OS versions must CI exercise?
- What metrics justify fallback retirement?
- How do you avoid a compatibility helper becoming a dumping ground?

### Strong Answer Signals

- Names ownership, contract normalization, testing, telemetry, and deletion.
- Treats deployment target as cross-functional policy.
- Preserves rollback considerations.

### Weak Answer Signals

- Deletes fallback based only on developer device usage.
- Leaves version checks distributed across features.
- Tests only the newest simulator.

### Related Theory

- [Fallback Architecture](theory.md#fallback-architecture)
- [Compatibility and Migration](theory.md#compatibility-and-migration)
- [Organizational Impact](theory.md#organizational-impact)
