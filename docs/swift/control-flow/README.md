---
title: "Control Flow"
domain: "Swift"
page_type: topic-index
status: reviewed
last_reviewed: 2026-06-20
---

# Control Flow

## Scope

Swift's branching, iteration, pattern matching, control transfer, scope-exit
cleanup, and API availability checks. The focus is correctness under evolving
state, resource ownership, platform deployment, and production failure paths.

Function returns and thrown-error design are covered in their owning topics;
this topic discusses them only where they transfer control from a branch or
scope.

## Prerequisites

- [Language Basics](../language-basics/README.md)
- [Basic Operators](../basic-operators/README.md)
- [Collection Types](../collection-types/README.md)

## Learning Path

1. [Loops and Control Transfer](loops-and-control-transfer/README.md)
2. [Conditional Branching and Pattern Matching](conditional-branching-and-pattern-matching/README.md)
3. [Guard and Deferred Cleanup](guard-and-deferred-cleanup/README.md)
4. [Availability Checking](availability-checking/README.md)

## Concepts

| Concept | Summary | Level |
|---|---|---|
| [Loops and Control Transfer](loops-and-control-transfer/README.md) | Choose bounded or condition-driven iteration while making termination, sequence consumption, and nested exits explicit. | Senior |
| [Conditional Branching and Pattern Matching](conditional-branching-and-pattern-matching/README.md) | Model exhaustive state decisions with ordered patterns, bindings, conditions, and expression forms. | Senior |
| [Guard and Deferred Cleanup](guard-and-deferred-cleanup/README.md) | Establish preconditions early and pair acquired resources with scope-exit cleanup. | Senior |
| [Availability Checking](availability-checking/README.md) | Separate compile-time API availability from runtime branching and deployment fallback policy. | Senior |

## Related Topics

- [Collection Types](../collection-types/README.md)

## Source Section

- [Control Flow](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/controlflow/)
