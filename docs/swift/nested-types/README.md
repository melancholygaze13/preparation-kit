---
title: "Nested Types"
domain: "Swift"
page_type: topic-index
interview_priority: reference
status: reviewed
last_reviewed: 2026-06-22
---

# Nested Types

## Scope

Types declared inside other types as scoped domain vocabulary, including generic
context, access, dependency ownership, public naming, and source-compatible evolution.

General declarations, generics, and access control are covered only where they affect
the decision to nest or expose a type.

## Prerequisites

- [Enumerations](../enumerations/README.md)
- [Classes and Structures](../classes-and-structures/README.md)

## Optional Review

1. [Scoped Domain Modeling](scoped-domain-modeling/README.md)
2. [Generic Context and API Evolution](generic-context-and-api-evolution/README.md)

## Concepts

| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [Scoped Domain Modeling](scoped-domain-modeling/README.md) | Nest supporting types when their meaning and lifecycle belong exclusively to one enclosing domain. | Reference | 5 min |
| [Generic Context and API Evolution](generic-context-and-api-evolution/README.md) | Manage specialization, qualified names, access, dependency direction, and migration of nested public types. | Reference | 5 min |

## Source Section

- [Nested Types](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/nestedtypes/)
