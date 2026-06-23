---
title: "Sheets, Popovers, and Dialogs: Interview Questions"
domain: "SwiftUI"
topic: "Navigation and Presentation"
concept: "Sheets, Popovers, and Dialogs"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 6
status: reviewed
last_reviewed: 2026-06-23
tags:
  - sheets
  - popovers
  - dialogs
---

# Sheets, Popovers, and Dialogs: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When do you use sheet(item:) instead of a Boolean?](#q1-when-do-you-use-sheetitem-instead-of-a-boolean) | Senior | Valid presentation state |
| [Where should modal state live?](#q2-where-should-modal-state-live) | Senior | Ownership and boundaries |
| [How do alerts and confirmation dialogs differ?](#q3-how-do-alerts-and-confirmation-dialogs-differ) | Senior | Semantic presentation choice |
| [How would you make an async editing sheet reliable?](#q4-how-would-you-make-an-async-editing-sheet-reliable) | Staff | Dismissal and task lifetime |

---

<a id="q1-when-do-you-use-sheetitem-instead-of-a-boolean"></a>
## Q1: When do you use sheet(item:) instead of a Boolean?

### Short Answer

I use a Boolean when the presentation has no payload. I use `sheet(item:)` when an
optional identifiable value represents both whether to present and what to present.
That prevents a Boolean and separate selection from becoming inconsistent.

### Expanded Answer

The item should have stable identity and usually be a route or draft rather than a
mutable domain object. If several modal destinations are mutually exclusive, an
optional enum route models those legal states better than several Booleans.

I decide how selection changes behave while the sheet is visible. Replacing the
item, deferring the new request, and requiring dismissal are different product
semantics.

### Example

`@State private var editor: EditorRoute?` with `.sheet(item: $editor)` cannot be
presented without an editor payload.

<a id="q2-where-should-modal-state-live"></a>
## Q2: Where should modal state live?

### Short Answer

It should live with the lowest feature or flow that owns the trigger and result.
Attach the modifier near that branch. Raise state only when a parent must coordinate
the modal with other navigation or enforce mutual exclusion.

### Expanded Answer

Local ownership keeps dependencies and dismissal effects clear. A root view that
owns every sheet becomes a global router and couples independent features.

For an app-level interruption or a route that changes tabs and presentations, a
coordinator can own an optional presentation route. It should expose typed intents,
not let every descendant edit global modal flags.

### Trade-offs

Local state is easy to reason about but cannot coordinate conflicting app-level
presentations alone. Central state provides arbitration but increases coupling and
must remain scene-specific in multiwindow apps.

<a id="q3-how-do-alerts-and-confirmation-dialogs-differ"></a>
## Q3: How do alerts and confirmation dialogs differ?

### Short Answer

An alert communicates important information or asks for a small blocking decision.
A confirmation dialog offers a set of related actions, often including a destructive
choice. I use semantic button roles and keep the consequence explicit.

### Expanded Answer

I attach a confirmation dialog near the control that triggered it so the system has
the correct presentation source. I use `.destructive` only for a genuinely harmful
action and provide a cancel path where appropriate.

Neither component should contain a complex workflow. If the user must review data,
enter text, or make several decisions, I use a dedicated screen or sheet.

<a id="q4-how-would-you-make-an-async-editing-sheet-reliable"></a>
## Q4: How would you make an async editing sheet reliable?

### Short Answer

I keep draft state separate from the saved model, prevent duplicate submissions,
and define whether dismissal cancels work or whether a longer-lived model owns it.
I save explicitly before dismissal and handle interactive dismissal when edits are
unsaved.

### Expanded Answer

Validation work tied to the form can use a view-scoped task. Once the user commits a
durable upload or purchase, transferring it to a model may be safer than canceling
because the sheet disappears. The UI shows progress and a retryable error.

I do not use `onDisappear` as proof of save. On success, the model commits, the
presenter receives the result, and then presentation state clears. On cancellation,
the draft is discarded only according to the product's policy.

### Trade-offs

Disabling interactive dismissal prevents accidental loss but can trap users.
Allowing it freely is simple but unsafe for meaningful drafts. A confirmation on
dirty dismissal adds logic but makes the consequence explicit and testable.
