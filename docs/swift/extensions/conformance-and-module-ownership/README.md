---
title: "Conformance and Module Ownership"
domain: "Swift"
topic: "Extensions"
page_type: concept-index
interview_priority: situational
estimated_read_minutes: 1
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Conformance and Module Ownership

> A conformance introduced in an extension is visible process-wide; when neither the type nor protocol is yours, that retroactive decision can conflict with future owners.

## Quick Recall

- Extensions can declare conformance and implement requirements for owned or imported types.
- Protocol conformances are globally unique at runtime, not scoped to the importing file or feature.
- Swift 6 warns when both the type and protocol come from other modules.
- `@retroactive` acknowledges the risk; it does not make future conflicts safe.
- Prefer an owned wrapper when semantics, persistence, identity, or compatibility are application-specific.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Prerequisites

- [Extension Capabilities and Initialization](../extension-capabilities-and-initialization/README.md)
