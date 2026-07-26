---
title: "Constraints, Anchors, and Priorities: Interview Questions"
domain: "UIKit"
topic: "Auto Layout and Adaptive Layout"
concept: "Constraints, Anchors, and Priorities"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-07-26
---

# Constraints, Anchors, and Priorities: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do constraints and frames relate in UIKit?](#q1-constraints-and-frames) | Senior | Mental model |
| [What is the difference between ambiguous and unsatisfiable layout?](#q2-ambiguous-vs-unsatisfiable) | Senior | Debugging |
| [How do you use priorities in a production layout?](#q3-priorities-production-layout) | Staff | Trade-off judgment |

---

<a id="q1-constraints-and-frames"></a>
## Q1: How do constraints and frames relate in UIKit?

### Short Answer

Constraints are the input and frames are the output. With Auto Layout, I describe
relationships between views, then UIKit computes frames during layout. I avoid
setting a constrained view's frame directly because the next layout pass can
replace it.

### Expanded Answer

Auto Layout works best when each view has one layout owner. If constraints own a
view's position and size, I update constraints or constraint constants. If a
custom view owns its subview frames manually, I do that in `layoutSubviews` after
the view has final bounds.

The mistake is mixing both approaches for the same attributes. That creates
jumps, overwritten frames, or constraint warnings that only appear on some
devices.

---

<a id="q2-ambiguous-vs-unsatisfiable"></a>
## Q2: What is the difference between ambiguous and unsatisfiable layout?

### Short Answer

Ambiguous layout means UIKit has too few rules and more than one valid frame.
Unsatisfiable layout means the rules conflict, so UIKit must break one or more
constraints.

### Expanded Answer

For ambiguity, I add the missing position or size relationship. For an
unsatisfiable layout, I remove a conflicting rule or lower a priority so the
layout has a planned fallback.

This distinction matters because adding more required constraints to an
unsatisfiable layout can make it worse. The right fix is to decide which rule is
allowed to yield when content, localization, or available width changes.

---

<a id="q3-priorities-production-layout"></a>
## Q3: How do you use priorities in a production layout?

### Short Answer

I use priorities to encode product intent. Required constraints protect rules
that must always hold. Optional constraints describe preferred layout rules that
UIKit may break first, such as a preferred width, a spacer size, or which label truncates first.

### Expanded Answer

For example, in a cell with a title and an action button, the button may need to
remain visible while the title truncates. I would give the title lower
horizontal compression resistance than the button. That makes the fallback
explicit.

I avoid random priority values. A team should have a small set of known priority
patterns, and complex reusable views should explain which constraint is expected
to break first.

### Trade-offs

Priorities make layouts adaptive, but they also hide decisions if the values are
not named or documented. Required constraints are easier to reason about until
content grows. Optional constraints are safer for real content, but only when
the intended fallback is clear.
