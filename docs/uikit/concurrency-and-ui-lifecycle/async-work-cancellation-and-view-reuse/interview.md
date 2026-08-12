---
title: "Async Work, Cancellation, and View Reuse: Interview Questions"
domain: "UIKit"
topic: "Concurrency and UI Lifecycle"
concept: "Async Work, Cancellation, and View Reuse"
page_type: interview
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-08-12
---

# Async Work, Cancellation, and View Reuse: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Why is cancellation important in UIKit screens?](#q1-cancellation-purpose) | Senior | Lifecycle ownership |
| [How do you avoid wrong data in reused cells?](#q2-reused-cells) | Senior | Identity checks |
| [How should cancellation errors be handled?](#q3-cancellation-errors) | Senior | Error handling |
| [Where should async work be owned?](#q4-work-ownership) | Staff | Architecture judgment |

---

<a id="q1-cancellation-purpose"></a>
## Q1: Why is cancellation important in UIKit screens?

### Short Answer

UIKit screens and views can become irrelevant before async work finishes. If the
work is not cancelled or ignored, old results can update invisible screens,
reused cells, or stale state.

### Expanded Answer

I store task handles for screen-scoped work and cancel them when a newer request
starts, when the screen no longer needs the result, or when the owner is
deallocated. Cancellation is cooperative, so the task still needs cancellation
checks or cancellable async APIs.

---

<a id="q2-reused-cells"></a>
## Q2: How do you avoid wrong data in reused cells?

### Short Answer

Cancel cell-scoped work in `prepareForReuse()` and check the current model
identity before applying any async result.

### Expanded Answer

A cell instance is not the item. If an image request for user A finishes after
the cell has been configured for user B, applying the result directly will show
the wrong image. I keep a represented ID or configuration token and compare it
before updating the cell.

---

<a id="q3-cancellation-errors"></a>
## Q3: How should cancellation errors be handled?

### Short Answer

Treat `CancellationError` as normal lifecycle behavior. Do not show user-facing
errors or retry just because a task was cancelled.

### Expanded Answer

I usually catch cancellation before the general error case. If the task was
cancelled because the user navigated away or typed a new query, the correct
behavior is often to do nothing.

---

<a id="q4-work-ownership"></a>
## Q4: Where should async work be owned?

### Short Answer

The object that starts and stores a task should live as long as that work is useful.
Screen requests belong to the view controller or view model. Shared cache fills
belong to a service or actor.
Cells should avoid owning shared work.

### Expanded Answer

This matters in large UIKit apps because cells are reused and screens disappear.
Putting ownership in the wrong place creates duplicate requests, retained view
controllers, and stale UI. A central loader can deduplicate shared work while the
screen or cell owns only its interest in the result.
