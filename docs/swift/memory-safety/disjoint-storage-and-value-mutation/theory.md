---
title: "Disjoint Storage and Value Mutation: Theory"
domain: "Swift"
topic: "Memory Safety"
concept: "Disjoint Storage and Value Mutation"
page_type: theory
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
---

# Disjoint Storage and Value Mutation: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> Member syntax does not prove disjoint memory; Swift permits overlapping property access only under specific stored, local, uncaptured conditions.

- Mutating a value type commonly requires write access to the whole value.
- Distinct stored properties of a local structure or tuple can be proven disjoint when capture does not escape.
- Globals, computed properties, class properties, and captured values can hide aliasing or execute code.
- A mutating method holds access to all of `self`, so passing part/all of the same value `inout` can conflict.
- Compute then commit when callbacks or reentrancy would overlap whole-value mutation.

## Mental Model

Value storage has a hierarchy: whole value and projections. The compiler may split access into separate
stored projections only when it can prove they cannot alias and no accessor/capture obscures storage.
Otherwise it conservatively protects the whole value.

## How It Works

```swift
func balance(_ first: inout Int, _ second: inout Int) {
    let total = first + second
    first = total / 2
    second = total - first
}

func rebalanceLocal() {
    var scores = (primary: 42, secondary: 30)
    balance(&scores.primary, &scores.secondary)
}
```

This is valid because both arguments are distinct stored fields of a local uncaptured tuple. The
same surface syntax on global, computed, class-backed, or closure-captured storage may be rejected or
dynamically checked because accessors and aliases can overlap.

### Core Invariants

- Disjointness is proven from storage, not property names.
- Computed accessors are treated as behavior, not independent stored fields.
- Whole-value mutation does not call arbitrary code that reenters the same value.
- APIs avoid exposing multiple independently mutable projections when one invariant spans them.
- Refactoring storage representation preserves client access behavior or includes migration.

### Constraints and Guarantees

- Swift's special disjoint-property allowance requires stored instance properties of a local variable that is not captured, or is captured only by nonescaping closures.
- Mutating methods access `self`, not only the fields visibly changed in the body.
- Class properties can alias through multiple references and do not gain value-projection guarantees.
- Computed properties may call arbitrary getter/setter code and cannot be assumed disjoint.
- Copying to locals changes the access graph and must match intended snapshot/commit semantics.

## Failure Modes

- A valid local tuple pattern is moved to global storage and begins trapping/rejecting.
- A stored property becomes computed and invalidates disjoint-access assumptions.
- `self` is passed as another `inout` argument during a mutating method.
- A closure captures a local aggregate and removes the proof of isolated storage.
- Two separate property mutations violate an aggregate invariant between commits.

## Engineering Judgment

Use separate `inout` projections for small local algorithms with proven stored disjointness. Use one
aggregate method/result when representation can evolve, invariants span fields, or callbacks occur.

## Production Considerations

### Performance

Projection can avoid aggregate copies, but computed storage and copy-on-write may dominate. Measure
and keep public APIs semantic so storage can change without breaking callers.

### Concurrency and Thread Safety

Disjoint stored fields are not automatically safe for concurrent mutation when the aggregate has
shared invariants. Assign one actor/lock owner to the complete transition.

### Testing

Compile local positive cases and global/computed/captured negative cases. Test reentrant callbacks,
representation changes, and aggregate invariant preservation.

### Observability and Debugging

When diagnostics mention overlapping access, expand property declarations: stored/computed, local/global,
value/reference, captured/uncaptured. This usually reveals why splitting was not proven.

### Compatibility and Migration

Stored-to-computed changes and moving state into a class/global owner can change exclusivity behavior.
Keep mutation behind methods and compile downstream `inout` call sites before rollout.

## Staff and Principal Perspective

Storage projection is an implementation detail that easily leaks through `inout` APIs. Platform surfaces
should expose domain transitions, allowing storage, observation, and synchronization to evolve together.

## Common Mistakes

### Assuming Different Property Names Mean Different Memory

**Why it is wrong:** Accessors, aliasing, capture, and whole-value mutation can make separate syntax touch overlapping storage.

**Better approach:** Rely on the narrow proven local stored-property rule or redesign as one aggregate transition.

## References

- [The Swift Programming Language: Memory Safety](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/memorysafety/)
