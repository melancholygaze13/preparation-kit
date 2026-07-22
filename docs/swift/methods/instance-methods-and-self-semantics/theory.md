---
title: "Instance Methods and Self Semantics: Theory"
domain: "Swift"
topic: "Methods"
concept: "Instance Methods and Self Semantics"
page_type: theory
levels: [senior]
interview_priority: reference
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-07-22
---

# Instance Methods and Self Semantics: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

An instance method is a function declared inside a type and called on one instance.
That instance is the method's receiver. Inside the method, `self` means the current
receiver.

```swift
struct Greeting {
    let sender: String

    func message(for recipient: String) -> String {
        "Hello, \(recipient). From \(sender)."
    }
}

let greeting = Greeting(sender: "Mina")
print(greeting.message(for: "Kai"))
// Hello, Kai. From Mina.
```

`message(for:)` uses the receiver's `sender` property, so it naturally belongs to
`Greeting`. The call uses dot syntax: `greeting.message(for: "Kai")`.

## `self` and Property Names

Swift usually lets a method refer to an instance property without writing `self.`.
Write it when a parameter or local name would otherwise hide the property:

```swift
final class Counter {
    var count = 0

    func setCount(_ count: Int) {
        self.count = count
    }
}

let counter = Counter()
counter.setCount(3)
print(counter.count) // 3
```

Here, `self.count` is the instance property and plain `count` is the parameter.
Swift also requires explicit `self` in some escaping-closure situations so capture
of the receiver is visible.

## Mutation Depends on the Type

A regular structure or enumeration method cannot change its stored value. Such a
method needs the `mutating` keyword, covered in the next concept. A class method can
change a `var` property because class instances have reference semantics:

```swift
counter.setCount(4) // changes the same Counter instance
```

This access rule does not provide thread safety. Concurrent mutation still needs an
actor or another synchronization policy.

## API Design

Place a method on a type when the receiver owns the state, rule, or capability the
method uses. Keep unrelated helpers separate. Method names and effect markers should
also reveal important behavior: `loadProfile()` communicates work more clearly than
a method named `profile()` when loading can suspend or fail.

Use `self` when Swift requires it, to resolve a name conflict, or when receiver
identity needs emphasis. Adding `self.` mechanically everywhere usually adds noise.

## References

- [The Swift Programming Language: Methods](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/methods/)
