---
title: "Heterogeneous Values and Boundary Design: Theory"
domain: "Swift"
topic: "Type Casting"
concept: "Heterogeneous Values and Boundary Design"
page_type: theory
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-21
tags: [any, anyobject, heterogeneous-data, boundary-design]
---

# Heterogeneous Values and Boundary Design: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> `Any` can hold a value of any type; `AnyObject` can represent an instance of any class type.

- Use heterogeneous containers only when the boundary is genuinely open or interoperable.
- Cast and validate into domain types immediately; do not propagate `[String: Any]` through business logic.
- An optional can be stored in `Any`, but implicit optional-to-`Any` conversion warns because nil intent is ambiguous.
- Objective-C bridging can make values appear through `AnyObject`; do not infer native reference semantics from that boundary alone.
- Prefer Codable schemas, enums, protocols, generics, or type erasure with a defined contract.

## Mental Model

`Any` erases static knowledge. Every consumer then pays validation and casting cost.
Keep the erased region small and establish typed invariants once.

## How It Works

```swift
func decodeMetadata(_ raw: [String: Any]) throws -> Metadata {
    guard let id = raw["id"] as? String,
          let retries = raw["retries"] as? Int else {
        throw MetadataError.invalidShape
    }
    return Metadata(id: id, retries: retries)
}
```

Boundary code must distinguish missing key, explicit null, wrong type, and invalid
value when those cases affect recovery. Casting proves runtime representation only;
domain validation still follows.

### Type Erasure Versus Any

A purpose-built erased wrapper preserves one protocol's capabilities while hiding the
concrete type. `Any` preserves none. Use `Any` for truly unconstrained payloads and a
typed eraser for heterogeneous implementations of one semantic contract.

### Core Invariants

- Erasure is confined to an owned boundary.
- Validation establishes a typed domain value exactly once.
- Missing, null, wrong type, and invalid value remain distinguishable as needed.
- Unknown payloads have an explicit reject, preserve, or ignore policy.
- Erased mutable references do not cross concurrency domains unchecked.

### Constraints and Guarantees

- `Any` includes value, reference, function, and optional values.
- `AnyObject` is class-constrained, with interoperability bridging governed by platform rules.
- Successful casting does not validate range, encoding, identity, or authorization.
- Heterogeneous storage provides no stable serialization schema by itself.

## Failure Modes

- Stringly typed dictionary spreads across the application.
- Numeric bridge assumptions change across input sources.
- `nil as Any` is confused with missing value.
- Unknown plugin payload is force-cast.
- `AnyObject` container hides shared mutable state and sendability violations.

## Engineering Judgment

Use `Any` for narrow Objective-C, reflection, logging, or intentionally open metadata
boundaries. Prefer Codable or explicit parsers for wire data, protocols/type erasure for
capabilities, and enums for closed heterogeneous states.

## Production Considerations

Fuzz malformed payloads and test null/missing/wrong-type/overflow cases. Log stable
failure categories without raw secrets. Migrate `[String: Any]` by adding typed adapters,
measuring legacy reads, and narrowing the erased boundary incrementally.

## Staff and Principal Perspective

Unowned erasure becomes organization-wide schema debt. Define boundary owners, versioned
schemas, unknown-field policy, redaction, compatibility, and tooling. Prohibit raw erased
payloads from crossing service and concurrency boundaries without validation.

## Common Mistakes

### A Successful Cast Produces a Valid Domain Value

**Why it is wrong:** Runtime representation can match while range, format, or authorization fails.

**Better approach:** Cast at the boundary, then validate through a domain initializer.

## References

- [The Swift Programming Language: Type Casting](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/typecasting/)
- [SE-0116: id as Any](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0116-id-as-any.md)
