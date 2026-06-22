---
title: "Protocol API Evolution and Isolation"
domain: "Swift"
topic: "Protocols"
page_type: concept-index
interview_priority: high
estimated_read_minutes: 1
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Protocol API Evolution and Isolation

> Public protocol requirements, conformances, and isolation annotations are ecosystem contracts whose changes can break every conformer and generic client.

## Quick Recall

- Adding a public requirement can break existing conformers.
- A default implementation can help source compatibility but may change behavior.
- Actor isolation is part of a protocol's callable contract.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
