---
title: "Test Boundaries and Confidence: Interview Questions"
domain: "Architecture"
topic: "Architecture Testing and Testability"
concept: "Test Boundaries and Confidence"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-07-11
tags:
  - test-strategy
  - test-boundaries
  - confidence
---

# Test Boundaries and Confidence: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you choose a test boundary?](#q1-how-do-you-choose-a-test-boundary) | Senior | Risk and feedback |
| [What does a healthy test strategy look like?](#q2-what-does-a-healthy-test-strategy-look-like) | Senior | Confidence portfolio |
| [How do you evaluate a slow or unreliable suite?](#q3-how-do-you-evaluate-a-slow-or-unreliable-suite) | Staff | Suite health |

---

<a id="q1-how-do-you-choose-a-test-boundary"></a>
## Q1: How do you choose a test boundary?

### Short Answer

I start from the failure I need to detect and choose the narrowest boundary that can
prove it. Pure rules get logic tests. Mapping, persistence, and configuration use real
integration tests. I reserve UI tests for important journeys and platform behavior.

### Expanded Answer

I define what is real, what is controlled, and which observable result matters. I do
not assume one type equals one unit. A coherent state transition or component can be
the unit when splitting it would only expose internals. I add a broader test when a
smaller one cannot detect wiring or framework failures.

<a id="q2-what-does-a-healthy-test-strategy-look-like"></a>
## Q2: What does a healthy test strategy look like?

### Short Answer

It has many deterministic logic tests, focused integration tests at risky boundaries,
and a small set of critical UI journeys. It optimizes useful defect detection, feedback
speed, and diagnosis—not test count or coverage percentage alone.

### Trade-offs

Narrow tests are fast and precise but miss production wiring. Broad tests exercise more
reality but add setup, runtime, and environmental failures. I use both where they catch
different defects rather than repeating every case at every layer.

<a id="q3-how-do-you-evaluate-a-slow-or-unreliable-suite"></a>
## Q3: How do you evaluate a slow or unreliable suite?

### Short Answer

I measure duration, queue time, inconsistent-result rate, retries, and failure clarity.
Then I group failures by uncontrolled dependency: shared state, time, network, device,
ordering, or oversized boundaries. I fix the source, change the boundary, or remove
duplicate tests instead of accepting permanent retries.

### Expanded Answer

At team scale, I create lanes by risk and cadence. Fast relevant tests block pull
requests; broader device and UI matrices can run later. Every lane needs owners and a
response policy so a failing test remains a trusted engineering signal.
