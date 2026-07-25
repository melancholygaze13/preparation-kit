---
title: "Scene Storage, State Restoration, and Documents"
domain: "SwiftUI"
topic: "App, Scene, and System Integration"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: situational
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-07-25
tags:
  - state-restoration
  - scene-storage
  - documents
---

# Scene Storage, State Restoration, and Documents

> Scene storage holds small values for one scene. State restoration rebuilds context
> after recreation. A document is durable user data with a file identity and save
> lifecycle. Restoration data must never be the only copy of the user's work.

## Quick Recall

- `@SceneStorage` holds small restorable values scoped to a scene.
- `@AppStorage` represents app-wide preferences backed by user defaults.
- Durable models belong in files, a database, or another explicit persistence layer.
- Restore navigation from stable identifiers and validate them against current data.
- `DocumentGroup` integrates a `FileDocument` or `ReferenceFileDocument` with system
  document browsing and saving.

Restore from stable IDs, then load and validate current data. Document apps must also
handle format versions, malformed files, external changes, save failures, and conflicts
that the system document browser cannot decide for the product.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
