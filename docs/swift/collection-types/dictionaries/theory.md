---
title: "Dictionaries: Theory"
domain: "Swift"
topic: "Collection Types"
concept: "Dictionaries"
page_type: theory
levels:
  - senior
interview_priority: high
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-07-12
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

## Constraints and Guarantees

A dictionary key is a lookup identity, not merely a convenient field. It should
remain stable for as long as the entry is stored. If a mutable class instance is
used as a key and its equality-relevant state changes, later lookup or removal can
fail even though the object is still in storage.

The default-value subscript creates a value only when needed for mutation. It is
useful for counters and grouping, but the chosen default must be a true identity
value for the operation. A default that hides missing required configuration turns
an input error into plausible but incorrect data.

Copy-on-write preserves independent dictionary values, not deep copies of reference
values. Two dictionary copies may still contain references to the same mutable objects.

## Production Application

Treat merge behavior as part of the boundary contract. For cached data, “new wins”
may be valid. For configuration or financial records, duplicate keys may require a
hard error with source information. Preserve enough context to explain the conflict.

Sort keys before deterministic encoding, signing, or snapshot comparison. Test
missing keys, present optional values, duplicate inputs, and mutation after a
dictionary copy. Protect shared dictionary variables with an actor or appropriate
synchronization when several tasks can access them.

## References

- [The Swift Programming Language: Dictionaries](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/collectiontypes/#Dictionaries)
- [Swift `Dictionary`](https://developer.apple.com/documentation/swift/dictionary)
