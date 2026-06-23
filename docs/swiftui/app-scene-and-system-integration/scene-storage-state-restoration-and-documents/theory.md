---
title: "Scene Storage, State Restoration, and Documents: Theory"
domain: "SwiftUI"
topic: "App, Scene, and System Integration"
concept: "Scene Storage, State Restoration, and Documents"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: situational
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-06-23
tags:
  - state-restoration
  - scene-storage
  - documents
---

# Scene Storage, State Restoration, and Documents: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Durable data and restoration state solve different problems. Durable storage preserves
the user's work. Restoration state records enough context to reconstruct a scene, such
as the selected record ID, navigation destination, or draft identifier.

Restoration is best effort. The system or user can discard a scene, stored identifiers
can become invalid, and the underlying data may change before reconstruction.

## Choosing Storage Scope

| Mechanism | Suitable data | Avoid |
|---|---|---|
| `@State` | Temporary state owned by a view or scene root | Cross-launch durability |
| `@SceneStorage` | Small per-scene restoration values | User documents or authoritative models |
| `@AppStorage` | Small app-wide preferences | Structured records and transactional data |
| Explicit persistence | Durable domain data | Incidental view state |

`@SceneStorage` distinguishes windows that need different selections or navigation
context. Keys should be stable and values small. Store an identifier rather than an
encoded model so restoration reloads current data and handles deletion explicitly.

`@AppStorage` uses user defaults and is appropriate for settings such as sort order or
an onboarding flag. It is not a database and does not provide domain transactions.
Keep persistence ownership out of an `@Observable` view model when the property wrapper
would not produce the expected observation behavior; inject a settings abstraction or
bind storage at the view boundary.

## Reconstructing a Scene

A restoration pipeline usually follows these steps:

1. Restore a small scene token.
2. Load current durable data for that token.
3. Validate authorization and availability.
4. Rebuild navigation and presentation state.
5. Fall back to a safe root if reconstruction fails.

Persist user edits independently of this pipeline. A navigation path can contain
codable values, but successful encoding does not guarantee the destinations still
exist or remain permitted when decoded later.

## Document-Based Apps

`DocumentGroup` delegates document discovery and window integration to the platform.
A value-semantic document conforms to `FileDocument`; the editor receives a binding to
the document. A reference-semantic document conforms to `ReferenceFileDocument`, which
uses snapshots for writing. Both declare supported content types and convert between
the model and `FileWrapper` values.

Serialization is a boundary. Validate malformed input, preserve format compatibility,
and surface errors instead of silently replacing content. Keep write snapshots
internally consistent so a save cannot combine fields from different logical versions.

System document UI does not solve domain conflicts. Files can move or change through
cloud synchronization, another window, or another process. Define whether to merge,
reload, fork, or ask the user. Use atomic formats or coordinated storage appropriate to
the document type, and test large files and interrupted writes.

For occasional import or export, `fileImporter` and `fileExporter` may be a smaller
integration than a full document-based app. Choose `DocumentGroup` when document
identity and system-managed open/save behavior are central to the product.

## Production Decisions

Test restoration after force termination, schema migration, sign-out, deleted data,
and multiple windows restoring the same record. Test documents with corrupt input,
unknown versions, read-only locations, external changes, and save failures.

At Staff or Principal scope, assign ownership for format evolution, migrations,
conflict policy, recovery, and observability. Restoration metrics should distinguish a
valid fallback from data loss; they must not log sensitive document content.

## References

- [`SceneStorage`](https://developer.apple.com/documentation/swiftui/scenestorage)
- [`AppStorage`](https://developer.apple.com/documentation/swiftui/appstorage)
- [`DocumentGroup`](https://developer.apple.com/documentation/swiftui/documentgroup)
- [`FileDocument`](https://developer.apple.com/documentation/swiftui/filedocument)
- [`ReferenceFileDocument`](https://developer.apple.com/documentation/swiftui/referencefiledocument)
- [Building a document-based app with SwiftUI](https://developer.apple.com/documentation/swiftui/building-a-document-based-app-with-swiftui)
