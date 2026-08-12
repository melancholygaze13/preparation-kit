---
title: "Dependency Rule and Use-Case Boundaries"
domain: "Architecture"
topic: "Clean Architecture and Ports and Adapters"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-08-12
tags:
  - clean-architecture
  - dependency-rule
  - use-cases
---

# Dependency Rule and Use-Case Boundaries

> Product policy should not depend on UI, storage, transport, or vendor details.
> Dependencies point toward the policy being protected, while outer code adapts to it.

## Quick Recall

- The dependency rule is about source-code knowledge, not runtime call direction.
- Use cases represent meaningful application operations and coordinate product rules.
- Inner types should not expose UIKit, SwiftUI, database, HTTP, or SDK-specific models.
- Dependency inversion lets outer implementations satisfy contracts owned near the
  consuming policy.
- Add a use-case boundary when it isolates real policy, reuse, risk, or change—not for
  every one-line call.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
