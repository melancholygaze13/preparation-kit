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
last_reviewed: 2026-06-29
---

# SDK API Surface and Evolution

> An SDK architecture is a promise to external or semi-external clients. The
> public surface must be small, stable, observable, and evolvable while internal
> implementation remains replaceable.

## Quick Recall

- Design the SDK around client workflows, not internal subsystem names.
- Keep public models and protocols stable; hide implementation modules.
- Prefer additive evolution and explicit deprecation over breaking changes.
- Separate configuration, capability use, callbacks, errors, and diagnostics.
- Treat documentation, examples, and migration notes as part of the API.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

