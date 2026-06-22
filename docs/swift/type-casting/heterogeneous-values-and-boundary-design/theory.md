---
title: "Heterogeneous Values and Boundary Design: Theory"
domain: "Swift"
topic: "Type Casting"
concept: "Heterogeneous Values and Boundary Design"
page_type: theory
interview_priority: situational
estimated_read_minutes: 2
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
tags: [any, anyobject, heterogeneous-data, boundary-design]
---

# Heterogeneous Values and Boundary Design: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

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

## Engineering Judgment

Use `Any` for narrow Objective-C, reflection, logging, or intentionally open metadata
boundaries. Prefer Codable or explicit parsers for wire data, protocols/type erasure for
capabilities, and enums for closed heterogeneous states.

## References

- [The Swift Programming Language: Type Casting](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/typecasting/)
- [SE-0116: id as Any](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0116-id-as-any.md)
