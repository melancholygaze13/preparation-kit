---
title: "Mutating Value Types and State Transitions: Theory"
domain: "Swift"
topic: "Methods"
concept: "Mutating Value Types and State Transitions"
page_type: theory
levels: [senior]
interview_priority: reference
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-07-22
---

# Mutating Value Types and State Transitions: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A struct or enum method needs `mutating` when it changes stored state or replaces
`self`. The call requires a mutable binding, so it cannot run through `let`.

```swift
struct Counter {
    private(set) var value = 0

    mutating func increment() {
        value += 1
    }
}

var counter = Counter()
counter.increment()
print(counter.value) // 1

let fixedCounter = Counter()
// fixedCounter.increment() // Compile-time error: fixedCounter is a let constant.
```

`Counter` is a structure, so changing `value` changes the value represented by
`self`. The `mutating` keyword declares that write access. The caller must therefore
store the counter in `var`, not `let`.

## Replacing the Whole Value

A mutating method can assign a new value to `self`. This is especially clear for an
enumeration state transition:

```swift
enum SwitchState {
    case off
    case on

    mutating func toggle() {
        self = self == .off ? .on : .off
    }
}

var state = SwitchState.off
state.toggle()
print(state) // on
```

## Safe State Transitions

Validate a transition before changing several properties. If the transition can
fail, report that failure and commit only after validation. Replacing all of `self`
with one validated value can make that boundary easier to see.

`mutating` is only a Swift access rule. It does not make a shared variable atomic or
thread-safe. Value semantics mean independent copies change independently, but code
that shares one variable across concurrent tasks still needs isolation.

## References

- [The Swift Programming Language: Modifying Value Types](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/methods/#Modifying-Value-Types-from-Within-Instance-Methods)
