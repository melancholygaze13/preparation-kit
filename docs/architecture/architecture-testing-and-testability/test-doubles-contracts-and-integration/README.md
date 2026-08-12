---
title: "Test Doubles, Contracts, and Integration"
domain: "Architecture"
topic: "Architecture Testing and Testability"
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
  - test-doubles
  - contract-tests
  - integration-tests
---

# Test Doubles, Contracts, and Integration

> Replace a dependency only when the test needs control or observation. Keep doubles
> small, model real behavior that affects the caller, and use contract or integration
> tests where a local substitute could drift from production.

## Quick Recall

- A stub supplies results; a spy records calls; a fake provides a working substitute.
- Mock only a boundary you own. Wrap third-party or framework APIs behind owned ports.
- Prefer state or output assertions unless an interaction is part of the contract.
- Run shared contract examples against both fakes and real adapters when practical.
- Use real decoders, stores, and serializers for risks created by their actual behavior.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
