---
title: "Stored-Property Initialization and Delegation"
domain: "Swift"
topic: "Initialization"
page_type: concept-index
interview_priority: high
estimated_read_minutes: 1
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-07-22
---

# Stored-Property Initialization and Delegation

> Initialization must assign every stored property a valid value before the instance
> is used. Delegation should lead to a small set of initializers that enforce the
> type's required rules.

## Quick Recall

- Every stored property needs a value before initialization completes.
- Struct delegation uses `self.init`; class delegation follows separate rules.
- Keep validation in a small number of designated construction paths.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Class Initialization and Two-Phase Safety](../class-initialization-and-two-phase-safety/README.md)
- [Failable, Required, and Evolving Initializers](../failable-required-and-evolving-initializers/README.md)
