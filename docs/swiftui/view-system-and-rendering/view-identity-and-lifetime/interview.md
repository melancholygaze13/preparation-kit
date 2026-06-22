---
title: "View Identity and Lifetime: Interview Questions"
domain: "SwiftUI"
topic: "View System and Rendering"
concept: "View Identity and Lifetime"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-06-23
tags:
  - view-identity
  - state-lifetime
  - identifiable
---

# View Identity and Lifetime: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What is view identity in SwiftUI?](#q1-what-is-view-identity-in-swiftui) | Senior | Structural and explicit identity |
| [How does identity control state lifetime?](#q2-how-does-identity-control-state-lifetime) | Senior | State persistence and reset |
| [How do you choose an ID for `ForEach`?](#q3-how-do-you-choose-an-id-for-foreach) | Senior | Collection correctness |
| [When is changing `.id` appropriate?](#q4-when-is-changing-id-appropriate) | Staff | Intentional lifecycle boundaries |

---

<a id="q1-what-is-view-identity-in-swiftui"></a>
## Q1: What is view identity in SwiftUI?

### Short Answer

Identity is how SwiftUI decides whether two view values from different updates
represent the same conceptual UI element. Structural identity comes from concrete
type and hierarchy position. Explicit identity comes from stable data IDs or the
`.id` modifier. Identity gives an element continuity over time.

### Expanded Answer

A SwiftUI view struct is an ephemeral description, so its memory address is not the
view's identity. If a new description has the same identity, SwiftUI treats it as
an update and can preserve state and animation continuity. If identity changes, it
treats the change as removal and insertion.

Conditional branches have distinct structural positions. Two calls to the same
view type in opposite branches therefore have different identities. That is useful
for genuinely different elements, but it can reset state unnecessarily when the
code only intends to change styling or configuration.

### Example

```swift
EditorView(mode: isEditing ? .editing : .readOnly)
```

This preserves one structural identity. An `if/else` containing a separate
`EditorView` in each branch describes two identities.

<a id="q2-how-does-identity-control-state-lifetime"></a>
## Q2: How does identity control state lifetime?

### Short Answer

SwiftUI associates local state storage with a view identity. Re-evaluating `body`
with the same identity reuses that storage. Removing the view or changing its
identity destroys the storage, so a later view starts from its initial state.

### Expanded Answer

This is why an ordinary parent update does not reset a child's `@State`, but moving
the child to another structural branch or changing `.id` can. It also means a
state initial value derived from an initializer argument is only initialization
for a new identity, not ongoing synchronization with that argument.

If the parent owns the source of truth, I pass a binding. If the child owns a local
draft, I define when to preserve, commit, discard, or reset it. Durable domain data
does not belong in identity-scoped UI state.

### Example

An editor showing a different document may need a fresh draft. If it should, the
document ID can define the editor session identity. If it should preserve unsaved
work while metadata changes, random or overly broad IDs would be destructive.

<a id="q3-how-do-you-choose-an-id-for-foreach"></a>
## Q3: How do you choose an ID for `ForEach`?

### Short Answer

I use a stable, unique identifier for the domain entity, such as an immutable
database or server ID. It must not change while the element represents the same
entity. I avoid indices for mutable collections and computed random UUIDs because
they break the relationship between data, row state, and animations.

### Expanded Answer

An ID answers “is this the same entity after insertion, deletion, movement, or
sorting?” Position answers a different question. If an item is inserted at the
front of an index-identified array, every later position now refers to different
data, so local row state can move to the wrong row.

`\.self` is acceptable only when the entire value is unique and stable identity,
such as a set of immutable unique values. Duplicate IDs are invalid within the
relevant sibling scope. An ID that changes with editable content is also unstable.

### Trade-offs

Persisted IDs require domain ownership and migration discipline. Locally generated
IDs are appropriate for genuinely new local entities, but they should be generated
once and stored, not recomputed during rendering.

<a id="q4-when-is-changing-id-appropriate"></a>
## Q4: When is changing `.id` appropriate?

### Short Answer

Changing `.id` is appropriate when the application intentionally starts a new UI
identity, such as opening a different editing session whose local state must reset.
It is not a general refresh mechanism. The reset also affects focus, animation,
tasks, and other identity-scoped behavior.

### Expanded Answer

I first define the lifecycle boundary in product terms. For an editor, that may be
the document ID plus a deliberate revision or session token. Then I confirm which
state should be discarded and whether unsaved work needs a prompt or migration.

Using `.id(UUID())` to fix stale UI masks an observation problem and forces
replacement on every update. It can restart loading, cancel work, lose input, and
create poor animations. The correct fix is usually narrower dependencies, proper
observation, or explicit model ownership.

### Trade-offs

Identity reset is simple and comprehensive, which is useful when all local state is
invalid. It is too blunt when only one field or cache needs reset. At Staff scope,
shared components should expose an intentional session or model identity rather
than requiring callers to discover destructive `.id` behavior by trial and error.
