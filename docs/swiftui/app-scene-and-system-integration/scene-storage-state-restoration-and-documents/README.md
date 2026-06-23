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
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-23
tags:
  - state-restoration
  - scene-storage
  - documents
---

# Scene Storage, State Restoration, and Documents

> Restoration reconstructs user context from small stable identifiers; it is not the
> durable data store. Document apps add a system-owned open, edit, and save lifecycle
> whose model must serialize correctly and tolerate external file changes or conflicts.

## Quick Recall

- `@SceneStorage` holds small restorable values scoped to a scene.
- `@AppStorage` represents app-wide preferences backed by user defaults.
- Durable models belong in files, a database, or another explicit persistence layer.
- Restore navigation from stable identifiers and validate them against current data.
- `DocumentGroup` integrates a `FileDocument` or `ReferenceFileDocument` with system
  document browsing and saving.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
