---
title: "Arrays: Theory"
domain: "Swift"
topic: "Collection Types"
concept: "Arrays"
page_type: theory
levels:
  - senior
interview_priority: high
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-06-22
---

# Arrays: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

An array stores ordered elements of one type and supports random access. It has
value semantics: after assignment, changing one array must not change the other.

## Value Semantics and Elements

Swift arrays normally use copy-on-write. Copies can share storage until one copy
mutates. This is an implementation optimization; callers must observe independent
array values.

Element semantics still matter. If an array stores class references, copying the
array copies those references. Both arrays can point to the same objects.

```swift
var first = [Account()]
var second = first
second[0].name = "Changed"

// first[0] observes the same Account instance.
```

## Indices, Slices, and Mutation

Use `indices` or direct iteration instead of assuming every collection starts at
zero. An array does use integer indices, but insertion and removal can invalidate
saved positions or change which element a position represents. Use a stable ID
when an element must retain identity across mutations.

`ArraySlice` is a view into array storage. It keeps the original index space, so
its `startIndex` may not be zero. Keeping a small slice alive may keep a large
buffer alive. Convert to `Array` when you need independent storage, zero-based
indices, or long-term ownership.

## Cost Model

- Indexed read and update are constant time.
- Append is amortized constant time, but occasional growth reallocates storage.
- Insertion or removal near the front or middle is linear because elements move.
- Linear search is linear; use a dictionary or set for frequent key lookup.

`reserveCapacity` can reduce reallocations when a useful size estimate exists.
Do not use it as a correctness requirement.

## Engineering Decisions

Choose an array when order and positional access are part of the model. Choose a
set for uniqueness and membership, or a dictionary for key-based lookup. Protect
shared mutation with isolation; value semantics do not make simultaneous access
to the same variable safe.

## References

- [The Swift Programming Language: Arrays](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/collectiontypes/#Arrays)
- [Swift `Array`](https://developer.apple.com/documentation/swift/array)
- [Swift `ArraySlice`](https://developer.apple.com/documentation/swift/arrayslice)
