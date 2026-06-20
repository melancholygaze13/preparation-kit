---
title: "Availability Checking: Theory"
domain: "Swift"
topic: "Control Flow"
concept: "Availability Checking"
page_type: theory
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

# Availability Checking: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> `@available` declares where a symbol can be used; `#available` and
> `#unavailable` refine what the compiler permits inside runtime control-flow
> regions.

- The deployment target is the baseline OS promise; the SDK determines which API
  declarations the compiler knows.
- `if #available` protects a new-API branch; `guard #available` refines the rest
  of the scope after its fallback exits.
- The `*` covers unspecified platforms at their minimum deployment target; the
  platform list is not an ordinary Boolean OR expression.
- Availability proves symbol presence for a platform version, not permission,
  entitlement, device capability, server rollout, data validity, or success.
- Fallback code is production code: test it on actual supported OS versions and
  retire it only with an intentional deployment-target migration.

## Mental Model

Availability is a contract spanning three layers:

```text
SDK declaration metadata -> compiler proof -> runtime OS branch
```

The compiler rejects an unguarded reference whose required OS exceeds the
deployment target. An availability condition creates a region where the compiler
knows a stronger runtime version fact.

## How It Works

### Deployment Target, SDK, and Runtime OS

These versions answer different questions:

- **Deployment target:** the oldest OS version the built product promises to run.
- **SDK:** the API surface and availability annotations used to compile.
- **Runtime OS:** the version executing this particular installation.

Building with a new SDK does not raise the deployment target automatically, and
knowing an API at compile time does not make it present on an older runtime.
Availability annotations and checks bridge that gap.

### Declaration Availability with @available

Annotate a declaration when its implementation or contract requires a platform
version:

```swift
@available(iOS 17, *)
func makeModernRenderer() -> Renderer {
    Renderer(using: NewRenderingAPI())
}
```

Callers must already be in an equally available context or prove availability at
runtime. This moves the requirement into the API contract instead of relying on
every caller to know implementation details.

Availability attributes can also express deprecation, obsoletion, unavailability,
renaming, and messages. Deprecation warns about supported-but-discouraged use; it
is not the same as runtime absence.

### Runtime Refinement with #available

```swift
if #available(iOS 17, *) {
    let renderer = makeModernRenderer()
    renderer.render()
} else {
    legacyRenderer.render()
}
```

Inside the first branch the compiler permits iOS 17 APIs. The fallback must use
only APIs available at its lower baseline.

A guard refines the remainder of the enclosing scope:

```swift
guard #available(iOS 17, *) else {
    legacyRenderer.render()
    return
}

makeModernRenderer().render()
```

Use this when the fallback exits and the rest of the function is entirely the new
path. Prefer a small adapter boundary when checks would otherwise be scattered
through feature code.

### Negative Checks with #unavailable

`#unavailable` expresses an older-only path directly:

```swift
if #unavailable(iOS 17) {
    installLegacyWorkaround()
}
```

It is the semantic inverse of the corresponding availability check. In an
`if #unavailable`, stronger symbol availability applies to the `else` path, not
the unavailable branch.

Availability conditions are special syntax, not general Boolean values. Do not
try to store them, negate them with `!`, or treat their platform list as ordinary
OR logic.

### Wildcard and Multiple Platforms

```swift
if #available(iOS 17, macOS 14, *) {
    // iOS 17+ when compiling for iOS; macOS 14+ when compiling for macOS.
}
```

The compiler selects the entry for the current target platform. The wildcard
means unspecified platforms use their minimum deployment target, supporting
future platform compilation. It does not mean “all platforms make this true” in
an OR expression.

Keep platform entries aligned with the declaration actually used. Large lists
copied across files become stale; a wrapper annotated with its own requirement is
often a better ownership boundary.

### Runtime Availability versus Conditional Compilation

Availability and `#if` solve different problems:

```swift
#if canImport(UIKit)
import UIKit
#endif
```

- `#if os(...)`, `canImport(...)`, compiler checks, and build flags choose code at
  compile time for a target or configuration.
- `#available` chooses at runtime within one built binary and refines symbol use.

Conditional compilation cannot distinguish two runtime iOS versions of the same
binary. Availability cannot make a module importable on a target where it was not
compiled.

### Availability Is Not Capability

An API can exist while the operation remains unusable because of:

- missing permission or entitlement;
- unsupported hardware or device configuration;
- unavailable account, data, or network service;
- feature flag or staged server rollout;
- policy restrictions or runtime failure.

Check version only for versioned symbol safety. Check actual capability and
operation results for product behavior. Avoid “OS version as feature flag” when a
more direct capability API exists.

### Fallback Architecture

Keep version branches shallow:

```swift
protocol Rendering {
    func render(_ model: Model)
}

func makeRenderer() -> any Rendering {
    if #available(iOS 17, *) {
        ModernRenderer()
    } else {
        LegacyRenderer()
    }
}
```

The rest of the feature depends on one behavior contract rather than repeated OS
checks. Verify that both implementations provide equivalent required semantics;
a fallback that merely compiles may still lose accessibility, privacy, data, or
transaction guarantees.

### Core Invariants

- Every API reference occurs in a context meeting its declared availability.
- The fallback uses only APIs valid at its deployment baseline.
- Runtime version checks and compile-time platform checks are not conflated.
- Capability, permission, and operational errors remain separately handled.
- Availability branching is owned at a small compatibility boundary.

### Constraints and Guarantees

- Availability checking prevents known unsafe symbol use according to SDK
  metadata; it does not guarantee an API call succeeds.
- `guard #available` refines only after its else transfers control.
- `#unavailable` reverses branch meaning but is not an ordinary negatable Boolean.
- The wildcard represents unspecified target platforms, not a universal true
  operand.
- Testing only on the newest OS does not validate fallback behavior.

## Failure Modes

- **Confusing SDK with deployment target:** Builds successfully but references a
  newer API without a valid runtime guard.
- **Using OS version as capability:** Enables behavior on devices or accounts that
  cannot support it.
- **Scattering checks:** New and legacy behavior drift across call sites.
- **Empty or unsafe fallback:** Older supported users crash or lose core behavior.
- **Using #if for runtime versions:** Removes one path from the binary instead of
  selecting by executing OS.
- **Treating `*` as Boolean OR:** Misunderstands behavior on other platforms.
- **Testing fallback with mocks only:** Misses older-runtime framework behavior.
- **Removing fallback before raising deployment target:** Breaks supported OS
  versions.

## Engineering Judgment

### Decision Criteria

| Question | Mechanism |
|---|---|
| Does the target compile this module or platform code? | `#if`, `canImport` |
| Does the executing OS contain this versioned API? | `#available` |
| Should an older-only workaround run? | `#unavailable` |
| Does this declaration require a newer OS? | `@available` |
| Can the device or account perform the feature? | Capability or permission API |
| Is the feature enabled operationally? | Configuration or feature flag |

### Trade-offs

Inline checks are local but duplicate policy. Adapter boundaries add types while
centralizing compatibility. Raising the deployment target removes fallback cost
and test burden but drops users and may constrain business or enterprise support.

## Production Considerations

### Performance

Version check cost is negligible. The architectural cost comes from duplicated
implementations, binary size, maintenance, and divergent behavior. Resolve the
implementation once at a boundary instead of repeatedly branching in a hot path.

### Concurrency

New and fallback APIs can have different isolation, callback, cancellation, or
threading contracts. An adapter must normalize these behaviors or expose the
difference honestly. Availability alone does not make a legacy callback API safe
to call from an actor or guarantee equivalent cancellation.

### Testing and Observability

Run tests on the oldest supported OS, boundary versions, and current OS. Test both
implementations for shared contract behavior and platform-specific differences.
Track fallback usage, failures by OS, unsupported-capability outcomes, and legacy
path health without using version alone as a proxy for causation.

### Compatibility and Migration

To adopt a newer API:

1. Define the behavior contract and minimum version.
2. Add a small guarded adapter with a functional fallback.
3. Test supported OS boundaries and mixed feature configurations.
4. Roll out with path and failure telemetry.
5. Raise the deployment target only through a product-supported migration.
6. Remove fallback and obsolete tests after the old target is no longer built.

Raising the deployment target is a product and support decision, not merely code
cleanup. Consider active users, enterprise fleets, release cadence, and emergency
rollback builds.

## Staff and Principal Perspective

### System Impact

Compatibility branches multiply across modules if no one owns them. Divergent
paths affect analytics, accessibility, security, concurrency, and support, not
only UI appearance. A common adapter surface limits the number of behavior
variants the system must reason about.

### Decision Framework

Record the deployment and SDK baselines, declaration availability, fallback
contract, capability checks, path owner, oldest-OS test plan, telemetry, adoption
threshold, and retirement criteria.

### Organizational Impact

Maintain a deployment-target policy with product and support stakeholders.
Centralize compatibility utilities only where semantics are genuinely shared;
avoid a generic “availability helper” that hides compiler refinement. Assign
owners and deletion criteria to fallbacks so compatibility code does not become
permanent by neglect.

## Common Mistakes

### Treating Availability as Feature Detection

**Why it is wrong:** An existing symbol says nothing about permission, hardware,
configuration, server rollout, or operation success.

**Better approach:** Guard symbol use by availability and separately query the
actual capability or handle the operation result.

### Repeating Checks Throughout a Feature

**Why it is wrong:** Branch behavior and version thresholds drift.

**Better approach:** Select an implementation at a compatibility boundary and
expose one semantic interface.

## References

- [The Swift Programming Language: Checking API Availability](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/controlflow/#Checking-API-Availability)
- [The Swift Programming Language: Attributes](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/attributes/)
- [SE-0290: Unavailability Condition](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0290-negative-availability.md)
