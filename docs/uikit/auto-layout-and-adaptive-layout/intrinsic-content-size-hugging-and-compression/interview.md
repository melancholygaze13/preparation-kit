---
title: "Intrinsic Content Size, Hugging, and Compression: Interview Questions"
domain: "UIKit"
topic: "Auto Layout and Adaptive Layout"
concept: "Intrinsic Content Size, Hugging, and Compression"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-07-01
---

# Intrinsic Content Size, Hugging, and Compression: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What is intrinsic content size?](#q1-intrinsic-content-size) | Senior | Layout sizing |
| [How do hugging and compression resistance differ?](#q2-hugging-vs-compression) | Senior | Priority behavior |
| [How would you fix a row where a label overlaps a button?](#q3-label-overlaps-button) | Staff | Production judgment |

---

<a id="q1-intrinsic-content-size"></a>
## Q1: What is intrinsic content size?

### Short Answer

Intrinsic content size is a view's natural size based on its content. A label can
derive size from text, and a button can derive size from its title and image.
Auto Layout can use that size, but it still needs constraints to position the
view.

### Expanded Answer

Intrinsic size often reduces the number of explicit size constraints. For
example, a label may not need a fixed height. But the layout still needs clear
horizontal and vertical relationships.

Multi-line text is the common edge case. The label usually needs a known width
before UIKit can calculate the height needed for wrapping.

---

<a id="q2-hugging-vs-compression"></a>
## Q2: How do hugging and compression resistance differ?

### Short Answer

Hugging controls how strongly a view resists growing beyond its natural size.
Compression resistance controls how strongly it resists shrinking below its
natural size.

### Expanded Answer

If there is extra horizontal space, the view with lower hugging is more likely
to grow. If space is tight, the view with lower compression resistance is more
likely to shrink or truncate.

These priorities are not just layout details. They describe which content is
more important when the interface cannot show everything at its ideal size.

---

<a id="q3-label-overlaps-button"></a>
## Q3: How would you fix a row where a label overlaps a button?

### Short Answer

I would first make the horizontal relationship explicit, usually with the
label's trailing anchor less-than-or-equal to the button's leading anchor. Then
I would set compression priorities so the label truncates before the button
loses its usable size.

### Expanded Answer

Overlap often means the layout is missing a constraint between competing views.
After adding the relationship, I decide the fallback. If the button is a primary
action, it should usually have higher compression resistance. If the title is
critical, the design may need wrapping, vertical stacking, or a different action
placement.

### Example

```swift
titleLabel.trailingAnchor.constraint(
    lessThanOrEqualTo: button.leadingAnchor,
    constant: -12
).isActive = true

titleLabel.setContentCompressionResistancePriority(.defaultLow, for: .horizontal)
button.setContentCompressionResistancePriority(.required, for: .horizontal)
```
