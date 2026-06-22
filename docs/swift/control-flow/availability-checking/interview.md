---
title: "Availability Checking: Interview Questions"
domain: "Swift"
topic: "Control Flow"
concept: "Availability Checking"
page_type: interview
interview_priority: high
estimated_read_minutes: 6
levels:
  - senior
  - staff
  - principal
status: reviewed
last_reviewed: 2026-06-22
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

### Short Answer

The SDK supplies declarations and availability metadata to the compiler. The
deployment target is the oldest OS the binary promises to support. The runtime OS
is the version currently executing it. A new SDK lets code know about a new API,
but if that API is newer than the deployment target, references need an available
context or runtime check before they are safe on older installations.

### Expanded Answer

The compiler compares each API's declared availability with the current context.
An `if #available` branch strengthens that context for one runtime path. An
`@available` function strengthens the declaration contract and pushes the
requirement to callers.

Raising the deployment target makes older runtime checks unnecessary only because
those runtimes are no longer supported. It does not follow automatically from
updating Xcode or the SDK.

### Trade-offs

- New SDK adoption enables APIs and diagnostics without necessarily dropping old
  OS support.
- A low deployment target retains users but expands fallback and test burden.
- Raising the target simplifies code while changing product reach.

### Example

A team builds with a new SDK and assumes all users have the corresponding OS.
An unguarded API call is rejected because the deployment target remains older.
The feature adds an adapter and fallback until product policy raises the target.

---

<a id="q2-availability-forms"></a>
## Q2: What Is the Difference Between @available, #available, and #unavailable?

### Short Answer

`@available` annotates a declaration with platform-version or lifecycle metadata.
`#available` is a runtime condition whose true branch permits APIs meeting the
specified version. `#unavailable` expresses the inverse older-runtime path; the
stronger availability applies to its else path. A guard availability check can
refine the rest of its scope after the fallback exits.

### Expanded Answer

Annotate a wrapper when its whole implementation requires the newer API. Use an
if check to choose between implementations and a guard when fallback exits early.
The wildcard covers platforms not explicitly listed at their minimum deployment
target; the list is not ordinary OR logic.

Availability checks are special conditions, not Boolean values. They cannot be
stored or freely negated. Use `#unavailable` instead of an empty positive branch
when only older systems need work.

### Trade-offs

- Declaration annotations centralize requirements but restrict every caller.
- Inline checks localize branching but can spread thresholds.
- Guard creates a clean modern path when fallback returns early.

### Example

A helper directly uses an iOS 17 API while every caller repeats the same check.
Marking the helper `@available(iOS 17, *)` makes its contract explicit; a factory
owns the single `#available` selection and legacy implementation.

---

<a id="q3-availability-versus-capability"></a>
## Q3: Why Is Availability Not the Same as Capability?

### Short Answer

Availability proves that a symbol may be referenced on the running platform
version. It does not prove the device has required hardware, the app has
permission or entitlement, an account is eligible, a feature flag is enabled, a
service is reachable, or the call will succeed. Check availability for symbol
safety, then use the relevant capability API and handle operation failure.

### Expanded Answer

An iOS version check can guard the compiler-visible API call. Product behavior
still needs direct evidence: authorization status, supported interface, device
capabilities, configuration, and returned errors. These facts can change without
an OS update.

Version proxies age poorly and can enable unsupported behavior on one device
while disabling supported behavior on another. A compatibility adapter can choose
the API, while the feature's domain layer owns eligibility and failure.

### Trade-offs

- Direct capability checks are accurate but may be asynchronous or stateful.
- Version checks are simple but answer only symbol presence.
- Server flags enable rollout but require offline and stale-configuration policy.

### Example

A camera feature enables solely on a new OS version but crashes on hardware
without the required camera mode. The fix retains the availability guard and adds
the framework's capability check plus a fallback UI.

---

<a id="q4-compatibility-ownership"></a>
## Q4: How Should an Organization Own and Retire Compatibility Paths?

### Short Answer

Select modern or legacy implementations at a small owned adapter boundary, define
one behavioral contract, and test the oldest supported OS, version boundary, and
current OS. Track path usage and failures. Assign an owner and retirement
criterion tied to an approved deployment-target increase; remove fallback only
after old runtimes are no longer supported and rollback builds no longer require
them.

### Expanded Answer

Scattered checks create many subtly different compatibility paths. One adapter
contains thresholds and lets most feature code remain version-agnostic. It must
normalize behavior that affects concurrency, cancellation, security,
accessibility, and analytics—not only return types.

Deployment-target changes require product, support, release, and sometimes
enterprise input. Use active-version data carefully, preserve emergency release
options, and document why the older path can be deleted. Tests and telemetry
should be removed with the code, not before it.

### Trade-offs

- Centralization reduces drift but can overgeneralize unrelated behavior.
- Maintaining fallback supports users while increasing binary and test cost.
- Target increases reduce complexity at the cost of device reach and rollback
  flexibility.

### Example

Five modules implement different checks for the same framework transition. A
platform-owned adapter unifies semantics, path telemetry shows negligible legacy
use, and product approves a target increase. The fallback is removed in a later
release after the rollback window closes.
