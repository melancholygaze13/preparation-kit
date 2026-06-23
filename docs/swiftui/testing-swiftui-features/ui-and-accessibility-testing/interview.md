---
title: "UI and Accessibility Testing: Interview Questions"
domain: "SwiftUI"
topic: "Testing SwiftUI Features"
concept: "UI and Accessibility Testing"
page_type: interview
levels:
  - senior
  - staff
interview_priority: high
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-06-23
---

# UI and Accessibility Testing: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What belongs in a SwiftUI UI test?](#q1-ui-test-scope) | Senior | Test-layer selection |
| [How do you reduce UI test flakiness?](#q2-reliability) | Senior | Determinism and synchronization |
| [Does an accessibility audit prove the app is accessible?](#q3-audit-limits) | Staff | Automated and manual coverage |

---

<a id="q1-ui-test-scope"></a>
## Q1: What belongs in a SwiftUI UI test?

### Short Answer

I use XCTest UI tests for a small set of critical journeys and SwiftUI integration
contracts: launch, navigation, presentation, semantics, and system interaction.
Business rules and state permutations stay in fast Swift Testing tests below the UI.

### Expanded Answer

A UI test proves that the assembled app works from a user's entry point to a visible
outcome. It should not repeat every validation or service failure case already proven
by deterministic model tests. I include representative deep links, destructive
actions, purchase or account boundaries, and important accessibility states.

<a id="q2-reliability"></a>
## Q2: How do you reduce UI test flakiness?

### Short Answer

I launch into isolated fixture data, replace live dependencies at the composition
root, query stable semantic elements, and wait for observable conditions. I remove
fixed sleeps, test-order dependencies, and coordinate taps.

### Expanded Answer

Launch arguments choose a deterministic scenario and disposable storage. Each test
owns its state. Queries use roles, labels, or dedicated identifiers where labels are
localized or ambiguous. Failures attach the current screen and diagnostics. If an
async boundary lacks a reliable visible condition, I add an app readiness contract
rather than increase an arbitrary timeout.

### Trade-offs

- More fixture control improves repeatability but can diverge from production wiring.
- A few tests should retain near-production adapters in a controlled environment.
- Longer timeouts reduce false failures but also hide performance regressions.

<a id="q3-audit-limits"></a>
## Q3: Does an accessibility audit prove the app is accessible?

### Short Answer

No. An automated audit detects supported technical issue categories in the states it
visits. I also test semantic flows and manually use VoiceOver, large Dynamic Type,
reduced motion, contrast settings, and relevant alternate input methods.

### Expanded Answer

Automation cannot decide whether a label communicates the right meaning or whether
focus and announcements make a workflow efficient. I audit representative loading,
error, empty, modal, and populated states. Exceptions are narrow, documented, owned,
and reviewed. Shared component failures are fixed at the component boundary so every
feature benefits.
