---
title: "Extension Points and Plugin Contracts"
domain: "Architecture"
topic: "Plugin, Platform, and SDK Architecture"
page_type: concept-index
levels:
  - staff
  - principal
interview_priority: situational
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-29
---

# Extension Points and Plugin Contracts

> A plugin architecture is a contract-first design. The host owns lifecycle,
> policy, and safety; plugins contribute behavior through explicit extension
> points without depending on host internals.

## Quick Recall

- Define the host/plugin boundary before designing registration mechanics.
- Prefer narrow capability protocols over giving plugins access to global app
  state.
- The host should own lifecycle, ordering, isolation, error handling, and
  observability.
- Plugins should declare capabilities, dependencies, and supported contexts.
- Contract tests are more valuable than tests that know the host implementation.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

