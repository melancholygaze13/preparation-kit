---
title: "Dictionaries: Theory"
domain: "Swift"
topic: "Collection Types"
concept: "Dictionaries"
page_type: theory
levels:
  - senior
interview_priority: high
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-08-12
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

Assigning outer `nil` through the basic subscript removes an entry. This needs
care when `Value` is itself optional:

```swift
var flags: [String: Bool?] = [:]
flags["beta"] = .some(nil) // Key is present with a nil Bool? value.
flags["beta"] = nil        // Key is removed.
```

Use `updateValue(_:forKey:)` when the previous value matters or when inserting an
optional value should be unambiguous. Use `removeValue(forKey:)` when removal
should be explicit.

The default-value subscript is useful for accumulation:

```swift
var counts: [String: Int] = [:]
let word = "swift"
counts[word, default: 0] += 1
print(counts[word] as Any) // Optional(1)
```

Reading `dictionary[key, default: value]` does not insert a missing key. Mutating
through that subscript, as in the counter example, inserts the default before
applying the mutation.

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

The default-value subscript inserts its default only when needed for mutation. It
is useful for counters and grouping, but the chosen default must be a true
correct neutral starting value for the operation, such as zero for addition. A default that hides missing required
configuration turns an input error into data that looks valid but is wrong.

Copy-on-write preserves independent dictionary values, not deep copies of reference
values. Two dictionary copies may still contain references to the same mutable objects.

## Production Application

Treat merge behavior as part of the API rules. For cached data, “new wins”
may be valid. For configuration or financial records, duplicate keys may require a
hard error with source information. Preserve enough context to explain the conflict.

Sort keys before deterministic encoding, signing, or snapshot comparison. Test
missing keys, present optional values, duplicate inputs, and mutation after a
dictionary copy. Protect shared dictionary variables with an actor or appropriate
synchronization when several tasks can access them.

## References

- [The Swift Programming Language: Dictionaries](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/collectiontypes/#Dictionaries)
- [Swift `Dictionary`](https://developer.apple.com/documentation/swift/dictionary)
