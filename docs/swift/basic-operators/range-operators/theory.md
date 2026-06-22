---
title: "Range Operators: Theory"
domain: "Swift"
topic: "Basic Operators"
concept: "Range Operators"
page_type: theory
levels:
  - senior
interview_priority: situational
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-06-22
---

# Range Operators: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A range defines a lower and upper boundary. The consumer decides how to use
those boundaries. A numerically valid range can still be invalid for a specific
collection.

## Range Forms

Use a closed range when both ends belong to the domain:

```swift
for rating in 1...5 { /* includes 5 */ }
```

Use a half-open range when the upper bound is a boundary, not an element. This
matches many collection operations:

```swift
for index in 0..<items.count { /* excludes count */ }
```

One-sided ranges omit one boundary. The consuming operation supplies it:

```swift
let tail = items[startIndex...]
let prefix = items[..<endIndex]
```

An invalid closed range, where the lower bound is greater than the upper bound,
can trap when constructed. A half-open `Range` can represent an empty range when
both bounds are equal.

## Collections and Indices

Do not use `0..<collection.count` in generic collection code. A collection's
index type may not be `Int`, and its first index may not be zero. Prefer direct
iteration, `collection.indices`, or collection index APIs.

```swift
for index in collection.indices {
    use(collection[index])
}
```

To move by a distance, use `index(_:offsetBy:limitedBy:)` when the offset might
cross a boundary. Validate external offsets and lengths before converting them
to collection indices.

## Slices

A slice is a view into part of a collection. It usually preserves the base
collection's index space:

```swift
let values = [10, 20, 30, 40]
let slice = values[1..<3]

slice.startIndex // 1, not 0
```

Pass a slice when a short-lived view is useful. Create an `Array(slice)` when an
API needs independent storage, zero-based indices, or long-term ownership. Some
slices can keep the original storage alive, so retaining a small slice may also
retain a much larger buffer.

## Engineering Decisions

- State whether an external upper bound is inclusive or exclusive.
- Reject negative offsets and lengths before index conversion.
- Avoid converting an inclusive upper bound with `upper + 1` unless overflow is
  impossible and documented.
- Test empty input, one element, exact end boundaries, and invalid external data.

## References

- [The Swift Programming Language: Range Operators](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/basicoperators/#Range-Operators)
- [Swift `Collection`](https://developer.apple.com/documentation/swift/collection)
- [Swift `Slice`](https://developer.apple.com/documentation/swift/slice)
