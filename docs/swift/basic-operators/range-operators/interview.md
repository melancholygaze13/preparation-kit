---
title: "Range Operators: Interview Questions"
domain: "Swift"
topic: "Basic Operators"
concept: "Range Operators"
page_type: interview
levels:
  - senior
interview_priority: situational
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-06-22
---

# Range Operators: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When do you use closed and half-open ranges?](#q1-when-do-you-use-closed-and-half-open-ranges) | Senior | Boundary semantics |
| [Why is `0..<collection.count` unsafe in generic code?](#q2-why-is-zero-to-count-unsafe-in-generic-code) | Senior | Collection indices |
| [What should you know about collection slices?](#q3-what-should-you-know-about-collection-slices) | Senior | Indices and storage |

---

<a id="q1-when-do-you-use-closed-and-half-open-ranges"></a>
## Q1: When Do You Use Closed and Half-Open Ranges?

### Short Answer

Use `a...b` when both endpoints belong to the domain. Use `a..<b` when `b` is an
exclusive boundary, which is common for collection positions.

### Expanded Answer

Half-open ranges compose well because adjacent ranges can share a boundary
without sharing an element. For an external API, document whether the upper
bound is inclusive or exclusive. Validate bounds before using them as indices.

---

<a id="q2-why-is-zero-to-count-unsafe-in-generic-code"></a>
## Q2: Why Is `0..<collection.count` Unsafe in Generic Code?

### Short Answer

A generic collection may not use `Int` indices or start at zero. Iterate the
collection directly or use `collection.indices`.

### Expanded Answer

`count` is a distance, not the final valid index. Native index APIs also preserve
the complexity guarantees of the collection. This matters for strings and for
custom collections.

### Example

```swift
for index in collection.indices {
    process(collection[index])
}
```

---

<a id="q3-what-should-you-know-about-collection-slices"></a>
## Q3: What Should You Know About Collection Slices?

### Short Answer

A slice is a view that usually keeps the base collection's indices. Its first
index may not be zero, and it can keep the base storage alive.

### Expanded Answer

Slices are efficient for temporary work. Convert a slice to an `Array` when an
API requires zero-based indices, independent storage, or long-term ownership.
