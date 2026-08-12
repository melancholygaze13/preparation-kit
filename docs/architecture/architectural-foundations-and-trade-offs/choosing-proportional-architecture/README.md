---
title: "Choosing Proportional Architecture"
domain: "Architecture"
topic: "Architectural Foundations and Trade-offs"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-08-12
tags:
  - proportional-architecture
  - architecture-decisions
  - evolution
---

# Choosing Proportional Architecture

> Choose the smallest architecture that controls current expensive risks and leaves
> a safe evolution path. Simplicity means low total change cost, not merely fewer
> types today.

## Quick Recall

- Start from product risk, volatility, ownership, and quality attributes—not a named
  pattern or company-wide template.
- Compare the cost of a boundary with the cost of the changes and failures it contains.
- Distinguish reversible choices from decisions that create durable data, public APIs,
  team dependencies, or difficult migrations.
- Use a simple design with explicit review triggers when uncertainty is cheap to
  reverse. Spend more upfront when failure or migration is expensive.
- Measure outcomes after adoption and remove boundaries that no longer pay for
  themselves.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
