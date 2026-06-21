---
title: "Access Control"
domain: "Swift"
page_type: topic-index
status: reviewed
last_reviewed: 2026-06-21
---

# Access Control

## Scope

Declaration visibility across lexical scopes, files, modules, and packages; member,
extension, and conformance rules; `public` versus `open`; initializer and setter
access; testability, inlinable implementation exposure, and API-evolution policy.

## Prerequisites

- [Classes and Structures](../classes-and-structures/README.md)
- [Extensions](../extensions/README.md)
- [Protocols](../protocols/README.md)

## Learning Path

1. [Access Levels and Lexical Scope](access-levels-and-lexical-scope/README.md)
2. [Members, Extensions, and Conformances](members-extensions-and-conformances/README.md)
3. [Subclassing, Initialization, and Setter Access](subclassing-initialization-and-setter-access/README.md)
4. [Module, Package, Testing, and API Evolution](module-package-testing-and-api-evolution/README.md)

## Concepts

| Concept | Summary | Level |
|---|---|---|
| [Access Levels and Lexical Scope](access-levels-and-lexical-scope/README.md) | Choose the smallest scope that matches ownership across declarations, files, modules, and packages. | Senior |
| [Members, Extensions, and Conformances](members-extensions-and-conformances/README.md) | Apply access consistently to composite types, extensions, protocol witnesses, and exposed signatures. | Senior |
| [Subclassing, Initialization, and Setter Access](subclassing-initialization-and-setter-access/README.md) | Distinguish use from overridability and preserve construction/mutation invariants. | Senior |
| [Module, Package, Testing, and API Evolution](module-package-testing-and-api-evolution/README.md) | Govern package sharing, test visibility, inlinable implementation, and staged public API migration. | Staff |

## Source Section

- [The Swift Programming Language: Access Control](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/accesscontrol/)
