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
last_reviewed: 2026-07-12
tags:
  - plugin-architecture
  - extension-points
  - contracts
---

# Extension Points and Plugin Contracts

> A plugin architecture lets independently owned contributors add behavior through a
> host-defined contract. The host keeps control of lifecycle and policy; each plugin sees
> only the capability and context it needs.

## Quick Recall

- First decide whether the variation needs a plugin at all. A normal dependency or
  strategy is cheaper when one team owns all implementations.
- In-process Swift modules, SwiftPM build plugins, and OS app extensions are different
  models. Do not use one model's guarantees for another.
- Prefer narrow capability protocols and stable value models over host services or
  mutable global state.
- Define discovery, lifecycle, ordering, concurrency, cancellation, failure, and version
  policy as part of the contract.
- Test the published contract from both sides: host tests use fakes, and contributors run
  a shared conformance suite.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
