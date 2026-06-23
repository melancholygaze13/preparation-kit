---
title: "Scene Storage, State Restoration, and Documents: Interview Questions"
domain: "SwiftUI"
topic: "App, Scene, and System Integration"
concept: "Scene Storage, State Restoration, and Documents"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: situational
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-06-23
tags:
  - state-restoration
  - scene-storage
  - documents
---

# Scene Storage, State Restoration, and Documents: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When would you use SceneStorage?](#q1-when-would-you-use-scenestorage) | Senior | Storage scope |
| [How would you restore navigation safely?](#q2-how-would-you-restore-navigation-safely) | Senior | Best-effort reconstruction |
| [How do FileDocument and ReferenceFileDocument differ?](#q3-how-do-filedocument-and-referencefiledocument-differ) | Staff | Document ownership and saving |

---

<a id="q1-when-would-you-use-scenestorage"></a>
## Q1: When would you use SceneStorage?

### Short Answer

I use `@SceneStorage` for small values that reconstruct one scene's context, such as a
selected record ID. I use `@AppStorage` for small app-wide preferences and explicit
persistence for authoritative user data.

### Expanded Answer

Scene restoration is best effort, so the stored value cannot be the only copy of user
work. I store stable identifiers rather than models and validate them during restore.
This also lets two windows restore different selections over one shared data store.

<a id="q2-how-would-you-restore-navigation-safely"></a>
## Q2: How would you restore navigation safely?

### Short Answer

I decode a small navigation token, load current data, verify that the destination still
exists and is allowed, then rebuild the path. If any step fails, I return to a safe root
instead of forcing stale state into the hierarchy.

### Expanded Answer

Persisting codable path values is only transport. Records can be deleted, schemas can
change, and sign-in state can expire. I version restoration data when needed, keep it
separate from durable edits, and test migration and invalid-token paths.

<a id="q3-how-do-filedocument-and-referencefiledocument-differ"></a>
## Q3: How do FileDocument and ReferenceFileDocument differ?

### Short Answer

`FileDocument` suits value-semantic models and gives the editor a binding. A
`ReferenceFileDocument` is a reference-semantic observable document and produces a
snapshot for writing. Both declare content types and serialize through `FileWrapper`.

### Expanded Answer

I choose based on model ownership, not file size alone. The format boundary validates
input, reports failures, and maintains compatibility. Snapshot creation must represent
one consistent document version.

### Trade-offs

Value semantics simplify reasoning but copying can be costly for some models. Reference
semantics support shared mutable identity but require stricter synchronization and
snapshot discipline. Neither protocol defines the product's external-conflict policy.
