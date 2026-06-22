---
title: "Access Duration and Exclusivity Enforcement: Theory"
domain: "Swift"
topic: "Memory Safety"
concept: "Access Duration and Exclusivity Enforcement"
page_type: theory
interview_priority: core
estimated_read_minutes: 3
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Access Duration and Exclusivity Enforcement: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

For every access, identify location, read/write kind, and duration. Then ask whether another path
can touch that location before the first access ends. Syntax can look different while storage aliases,
and separate-looking properties can hide arbitrary code or whole-value access.

## How It Works

```swift
func balance(_ first: inout Int, _ second: inout Int) {
    let total = first + second
    first = total / 2
    second = total - first
}

var primary = 42
var secondary = 30
balance(&primary, &secondary)

// balance(&primary, &primary) // Conflicting long-term writes.
```

Each `inout` access lasts for the call. Passing one variable twice means two writes overlap on the
same storage. Other conflicts arise when the callee reads a global/property that aliases its `inout`
argument or invokes reentrant code while holding mutating access.

### Core Invariants

- Mutation is not observed through another alias while incomplete.
- Long-term access ends before storage is reused through another path.
- Runtime exclusivity traps are fixed as design defects, not suppressed as expected errors.
- Synchronization is applied separately for truly concurrent shared state.
- Unsafe code preserves equivalent aliasing invariants manually.

### Constraints and Guarantees

- Multiple overlapping reads are allowed by the exclusivity rule.
- One overlapping write conflicts with another read or write to the same location.
- Static and dynamic enforcement implement the same language rule at different proof points.
- A mutating value-type method holds write access to `self` for the method call.
- Safe exclusivity does not guarantee multi-operation transaction atomicity.

## Engineering Judgment

Prefer result-returning transforms or one aggregate mutation when aliasing is plausible. Shorten
access duration before calling arbitrary code. Use actors/locks for concurrency; do not infer them
from exclusivity checks.

## Production Application

### Performance

Dynamic exclusivity checking has cost, but removing enforcement is not an API-level optimization.
Redesign hot mutation boundaries and measure optimized builds rather than relying on unsafe aliases.

### Concurrency and Thread Safety

Exclusivity can fail on one thread. Data races can occur across threads even when each local access
looks exclusive. Use Swift concurrency guarantees or synchronization at the shared owner.

### Testing

Compile negative alias cases, test reentrancy, and run realistic callbacks/concurrency paths. Preserve
symbolicated exclusivity diagnostics because they identify access starts and conflicts.

### Observability and Debugging

Record the operation and storage owner around mutation boundaries. Reduce runtime traps to location,
kind, duration, and alias path rather than debugging from the final line alone.

### Compatibility and Migration

Changing a property to computed storage, adding callbacks, or widening mutation duration can turn
previously valid-looking calls into conflicts. Compile downstream mutation patterns during rollout.

## Staff and Principal Perspective

Exclusivity failures often expose APIs that distribute mutation authority. Centralize state transitions,
avoid reentrant mutation hooks, and make synchronization and ownership boundaries reviewable.

## References

- [The Swift Programming Language: Memory Safety](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/memorysafety/)
