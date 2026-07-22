---
title: "Subscript Access and Domain Indexing: Theory"
domain: "Swift"
topic: "Subscripts"
concept: "Subscript Access and Domain Indexing"
page_type: theory
levels: [senior]
interview_priority: reference
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-07-22
---

# Subscript Access and Domain Indexing: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A subscript provides bracket-based access using one or more index values. Use it
when lookup feels like direct element access. Use a named method when the operation
has important effects, policy, I/O, or expensive work.

## Read and Write Syntax

Declare a subscript with `subscript`, its input parameters, and its result type:

```swift
struct Scoreboard {
    private var scores: [String: Int] = [:]

    subscript(player: String) -> Int {
        get { scores[player, default: 0] }
        set { scores[player] = newValue }
    }
}

var board = Scoreboard()
print(board["Ari"]) // 0
board["Ari"] = 12
print(board["Ari"]) // 12
```

The getter returns the value for an index. The setter receives the assigned value
through the implicit name `newValue`. A read-only subscript can omit `get` and
contain only its return expression. Unlike a method, a subscript has no name at the
call site; its parameters and surrounding type must make its meaning clear.

Subscripts may accept several parameters, such as `grid[row, column]`. Parameter
labels are omitted at the call site by default, but a declaration can add labels
when they prevent confusion.

## Failure and Index Rules

The API must define valid indices, complexity, mutation behavior, and failure.
Trapping is suitable for a programmer-contract violation. Return an optional or
use a throwing method when missing data is expected or input is untrusted.

An index belongs to the collection state that created it. Mutation can invalidate
saved indices even when their numeric representation still looks valid.

Bracket syntax does not promise constant-time access. Document complexity when it
is not obvious, and avoid using a subscript for work whose cost or side effects need
an explicit method name.

## References

- [The Swift Programming Language: Subscripts](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/subscripts/)
