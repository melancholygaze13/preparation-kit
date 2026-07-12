---
title: "SDK API Surface and Evolution"
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
  - sdk-design
  - api-evolution
  - compatibility
---

# SDK API Surface and Evolution

> An SDK's public API is a long-lived client contract. Keep the supported surface small
> and workflow-based, and state source, binary, behavior, concurrency, and support
> promises separately.

## Quick Recall

- Design around client workflows, not the SDK's internal layers or services.
- Every public declaration adds source-compatibility cost. Binary distribution adds
  module and library-evolution decisions; semantic versioning does not provide them.
- Prefer additive changes. Deprecate only with a supported replacement, migration path,
  observation window, and stated removal policy.
- Treat documented behavior, isolation, cancellation, errors, privacy, and diagnostics
  as contract details, not implementation details.
- Test the package as a client would, including the previous supported release and a
  sample integration.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
