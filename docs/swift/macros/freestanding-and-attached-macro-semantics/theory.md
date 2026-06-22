---
title: "Freestanding and Attached Macro Semantics: Theory"
domain: "Swift"
topic: "Macros"
concept: "Freestanding and Attached Macro Semantics"
page_type: theory
interview_priority: situational
estimated_read_minutes: 2
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
tags: [macros, freestanding-macros, attached-macros, expansion]
---

# Freestanding and Attached Macro Semantics: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Treat a macro call as a compact declaration of source that the compiler will generate.
Correctness depends on both the visible invocation and the expanded code.

## How It Works

```swift
@attached(member, names: named(init))
macro MemberwiseInit() = #externalMacro(
    module: "ModelMacros",
    type: "MemberwiseInitMacro"
)
```

Freestanding expression macros behave as expressions; declaration macros introduce
declarations. Attached roles constrain where and what a macro can add. Generated names
must follow the declaration's name specification, helping tooling reason about expansion.

Macros operate at compile time and cannot serve as dynamic runtime policy. Expanded
code still obeys access control, type checking, isolation, availability, and overload rules.

### Core Invariants

- Invocation and expansion have one documented semantic meaning.
- Generated names are predictable and collision-safe.
- Expansion preserves access, isolation, and availability expectations.
- Callers do not need hidden ordering between unrelated macros.
- Handwritten alternatives remain understandable for debugging and migration.

### Constraints and Guarantees

- Macro roles and generated names are declared at the API boundary.
- Expansion can fail compilation with diagnostics; it does not create runtime fallback.
- Attached macro ordering/composition must not be used as an undocumented protocol.
- Macro syntax does not automatically reduce generated code size or compile time.

## Engineering Judgment

Use macros for repetitive compile-time structure that cannot be expressed cleanly with
language abstractions. Reject them when code generation is small, runtime behavior is
the real need, or expansion makes ownership less visible.

## References

- [The Swift Programming Language: Macros](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/macros/)
- [SE-0382: Expression Macros](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0382-expression-macros.md)
- [SE-0389: Attached Macros](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0389-attached-macros.md)
