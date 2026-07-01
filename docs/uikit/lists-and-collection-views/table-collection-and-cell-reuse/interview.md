---
title: "Table, Collection, and Cell Reuse: Interview Questions"
domain: "UIKit"
topic: "Lists and Collection Views"
concept: "Table, Collection, and Cell Reuse"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-07-01
---

# Table, Collection, and Cell Reuse: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Why do table and collection views reuse cells?](#q1-why-cell-reuse) | Senior | Reuse model |
| [What belongs in `prepareForReuse()`?](#q2-prepare-for-reuse) | Senior | Cell lifecycle |
| [How do you prevent wrong images in reused cells?](#q3-wrong-image-reuse) | Staff | Async correctness |

---

<a id="q1-why-cell-reuse"></a>
## Q1: Why do table and collection views reuse cells?

### Short Answer

They reuse cells so large lists can display with a limited number of view
objects. A cell instance may show different items over time, so configuration
must fully describe the current item.

### Expanded Answer

Reuse improves memory and scrolling performance. The trade-off is correctness:
the cell cannot assume its old state still applies. Labels, images, hidden flags,
selection state, and async work all need to match the current item.

---

<a id="q2-prepare-for-reuse"></a>
## Q2: What belongs in `prepareForReuse()`?

### Short Answer

Transient view state belongs in `prepareForReuse()`: clearing old images,
stopping animations, cancelling tasks, and resetting temporary visual state.
Normal content state should still be set in the configure method.

### Expanded Answer

The configure method should be idempotent. If an item is unread, it shows the
badge. If it is not unread, it hides the badge. Relying only on
`prepareForReuse()` often leaves stale UI when paths differ or configuration is
partial.

---

<a id="q3-wrong-image-reuse"></a>
## Q3: How do you prevent wrong images in reused cells?

### Short Answer

I cancel image loading on reuse when possible, and I validate identity before
applying a completed image. The result should only update the cell if it still
represents the same item.

### Expanded Answer

Cell reuse means an image request may finish after the cell has moved to a new
item. I usually keep a task token or represented item ID. In the completion, I
compare it with the current ID before setting the image.

### Example

```swift
cell.representedID = item.id
imageLoader.load(item.imageURL) { [weak cell] image in
    guard cell?.representedID == item.id else { return }
    cell?.imageView.image = image
}
```
