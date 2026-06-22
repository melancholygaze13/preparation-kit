---
title: "Dictionaries: Theory"
domain: "Swift"
topic: "Collection Types"
concept: "Dictionaries"
page_type: theory
levels:
  - senior
interview_priority: high
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-06-22
---

# Dictionaries: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A dictionary provides key-based lookup. Keys define identity through stable
equality and hashing. Values do not affect where an entry is stored.

## Lookup and Absence

`dictionary[key]` returns `Value?` because the key may be absent. If `Value` is
itself optional, lookup can need two optional levels to distinguish a missing key
from a present key with a `nil` value. Prefer avoiding optional dictionary values
unless those states are meaningful.

Assigning `nil` through the basic subscript removes an entry. Use
`updateValue(_:forKey:)` when the previous value matters, and
`removeValue(forKey:)` when removal should be explicit.

The default-value subscript is useful for accumulation:

```swift
counts[word, default: 0] += 1
```

## Keys, Merging, and Order

Keys follow the same equality and hashing contract as set elements. Do not change
hash-relevant state while a reference-type key is stored.

Merging dictionaries requires a duplicate-key rule. The correct rule is a domain
decision: keep the old value, take the new value, combine both, or reject the
conflict. Do not choose based only on convenience.

Iteration order is not a stable API contract. Sort keys or entries when output,
tests, signatures, or persistence need deterministic order.

## Cost and Selection

Lookup, insertion, and removal have expected constant-time behavior with useful
hashing. Choose a dictionary for repeated key lookup. An array can be simpler for
small ordered data or when duplicates and position matter.

Dictionaries have value semantics and usually use copy-on-write. This does not
make simultaneous mutation of one shared variable safe.

## References

- [The Swift Programming Language: Dictionaries](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/collectiontypes/#Dictionaries)
- [Swift `Dictionary`](https://developer.apple.com/documentation/swift/dictionary)
