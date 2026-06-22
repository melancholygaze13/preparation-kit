---
title: "Availability Checking: Theory"
domain: "Swift"
topic: "Control Flow"
concept: "Availability Checking"
page_type: theory
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

# Availability Checking: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

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

## References

- [The Swift Programming Language: Checking API Availability](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/controlflow/#Checking-API-Availability)
- [The Swift Programming Language: Attributes](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/attributes/)
- [SE-0290: Unavailability Condition](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0290-negative-availability.md)
