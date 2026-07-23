---
title: "Arrays: Theory"
domain: "Swift"
topic: "Collection Types"
concept: "Arrays"
page_type: theory
levels:
  - senior
interview_priority: high
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-07-22
---

# Arrays: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

An array stores ordered elements of one type and supports random access. It has
value semantics: after assignment, changing one array must not change the other.

## Value Semantics and Element Behavior

Swift arrays normally use copy-on-write. Copies can share storage until one copy
mutates. This is an implementation optimization; callers must observe independent
array values.

Element behavior still matters. If an array stores class references, copying the
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

## Constraints and Guarantees

Value semantics is the public rule. Copy-on-write, capacity growth, and buffer
sharing are implementation details. A performance-sensitive design may measure
them, but an API must remain correct if Swift copies earlier or stores differently.

An array index identifies a position in one collection state. After insertion,
removal, or replacement, an old index may be invalid or may refer to a different
element. A model that needs stable identity should store an explicit identifier.
The integer offset is not that identity.

Array access is not automatically safe across tasks. Two independent array values
can be mutated independently. Two tasks reading and writing the same variable still
need actor isolation or synchronization.

## Engineering Decisions

Choose an array when order and positional access are part of the model. Choose a
set for uniqueness and membership, or a dictionary for key-based lookup. Protect
shared mutation with isolation; value semantics do not make simultaneous access
to the same variable safe.

When an operation repeatedly inserts or removes near the front, remember that
each operation may move many elements. First check whether the data is
small enough that simplicity wins. If measurements show a problem, choose a queue,
deque, or another structure whose operations match the workload.

## Production Application

Profile the complete mutation path, not only the subscript operation. A logically
small change may trigger buffer growth or a copy because another array still shares
the storage. Large elements and bridged Foundation collections can make that cost
more visible.

Tests should cover ordering, duplicate policy, slice ownership, and mutation after
copy. For UI lists, test identity separately from position so insertions do not
apply updates to the wrong item.

## References

- [The Swift Programming Language: Arrays](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/collectiontypes/#Arrays)
- [Swift `Array`](https://developer.apple.com/documentation/swift/array)
- [Swift `ArraySlice`](https://developer.apple.com/documentation/swift/arrayslice)
