---
title: "Constraints, Anchors, and Priorities"
domain: "UIKit"
topic: "Auto Layout and Adaptive Layout"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-26
---

# Constraints, Anchors, and Priorities

> Auto Layout calculates frames from relationships between views. A constraint
> states one relationship. Its priority tells Auto Layout whether that rule may
> be broken when all constraints cannot be satisfied together.

## Quick Recall

- Constraints relate attributes such as leading, width, center, and baseline.
- Anchors give type-safe APIs for creating those relationships in code.
- Required priority is `1000`; optional priorities let layouts adapt.
- Ambiguous layout means too few constraints. Unsatisfiable layout means rules
  conflict.
- Do not mix manual frame ownership and constraint ownership for the same
  attributes.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
