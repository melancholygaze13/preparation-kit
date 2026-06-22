---
title: "Extension Capabilities and Initialization"
domain: "Swift"
topic: "Extensions"
page_type: concept-index
interview_priority: situational
estimated_read_minutes: 1
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Extension Capabilities and Initialization

> Extensions add computed behavior and construction paths to an existing type, but cannot change stored layout, add class designated initialization, or override existing functionality.

## Quick Recall

- Extensions can add computed properties, methods, type methods, initializers, subscripts, nested types, and protocol conformances.
- They cannot add stored properties, property observers, deinitializers, or stored instance state.
- Extensions cannot override existing functionality or add class designated initializers.
- A class extension can add convenience initializers when normal delegation rules are satisfied.
- An initializer for a value type from another module must delegate to an initializer from that defining module before using `self`.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
