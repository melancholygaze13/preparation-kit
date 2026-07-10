---
title: "UI, Accessibility, and Interaction Testing: Interview Questions"
domain: "UIKit"
topic: "Testing UIKit Features"
concept: "UI, Accessibility, and Interaction Testing"
page_type: interview
levels:
  - senior
  - staff
interview_priority: high
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-07-10
---

# UI, Accessibility, and Interaction Testing: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Why do UI tests become flaky, and how do you prevent it?](#q1-ui-test-reliability) | Senior | Deterministic automation |
| [When do you query by label or accessibility identifier?](#q2-element-queries) | Senior | Stable semantic queries |
| [Is an automated accessibility audit enough?](#q3-accessibility-audit) | Senior | Audit limits |
| [How would you govern UI tests across a large app?](#q4-ui-test-governance) | Staff | Suite scope and ownership |

---

<a id="q1-ui-test-reliability"></a>
## Q1: Why do UI tests become flaky, and how do you prevent it?

### Short Answer

Flakes usually come from uncontrolled launch state, live dependencies, shared data,
timing guesses, unstable queries, or system interruptions. I control those inputs and
wait for observable state instead of sleeping.

### Expanded Answer

Each test launches with its own fixture, disposable storage, and stubbed service
configuration. It queries by accessible meaning and waits for existence,
disappearance, hittability, or a value. I keep system permission handling explicit
and collect screenshots, element hierarchies, and logs on failure.

Retries can confirm instability during diagnosis, but they should not become the
normal solution. A retry can hide a product race or missing readiness contract.

---

<a id="q2-element-queries"></a>
## Q2: When do you query by label or accessibility identifier?

### Short Answer

I use a role and label when the label is meaningful and stable for the test. I add an
identifier when the element is ambiguous, dynamic, or localized.

### Expanded Answer

An identifier is a stable automation hook, not user-facing accessibility content. It
must not replace a correct label, value, trait, or action. I name identifiers by
product meaning, such as `checkout.place-order`, rather than view hierarchy or index.

I avoid coordinates and positional queries unless position itself is the behavior.
Those queries break during harmless layout or ordering changes.

---

<a id="q3-accessibility-audit"></a>
## Q3: Is an automated accessibility audit enough?

### Short Answer

No. An audit catches supported categories of common problems. It cannot judge product
meaning, workflow quality, announcement timing, or real assistive-technology use.

### Expanded Answer

I run audits on representative loaded, error, modal, and large-text states. I also
assert important labels, values, traits, and actions in critical flows. Manual checks
with VoiceOver, Voice Control, keyboard access, and relevant display settings cover
experience that automation cannot evaluate.

Any filtered audit result should be narrow, documented, and owned. Broad exclusions
turn the audit into a weak signal.

---

<a id="q4-ui-test-governance"></a>
## Q4: How would you govern UI tests across a large app?

### Short Answer

I would keep a small critical smoke set, assign owners to fixtures and flakes, and run
larger device, locale, and accessibility matrices according to risk.

### Expanded Answer

Teams need stable identifier conventions, launch-fixture contracts, failure artifacts,
and clear test-layer guidance. Fast tests should cover rule matrices. UI tests should
cover important app wiring and journeys.

I track runtime, flake rate, and quarantine age. A quarantined test needs an owner and
removal condition. For broader matrices, I select combinations that expose distinct
risk instead of multiplying default-device runs.

### Trade-offs

More UI coverage can find integration failures, but it increases runtime and
maintenance. A smaller trusted suite often protects releases better than a large
suite whose failures are routinely ignored.
