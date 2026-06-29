---
title: "SDK API Surface and Evolution: Interview Questions"
domain: "Architecture"
topic: "Plugin, Platform, and SDK Architecture"
concept: "SDK API Surface and Evolution"
page_type: interview
levels:
  - staff
  - principal
interview_priority: situational
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-06-29
---

# SDK API Surface and Evolution: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How would you design the public API for an iOS SDK?](#q1-design-public-api) | Staff | API boundaries |
| [How do you evolve an SDK without breaking clients?](#q2-evolve-sdk) | Staff | Compatibility |
| [What diagnostics should an SDK expose?](#q3-sdk-diagnostics) | Principal | Supportability |

---

<a id="q1-design-public-api"></a>
## Q1: How would you design the public API for an iOS SDK?

### Short Answer

I would design around client workflows, expose a small facade, use stable public
models, and keep implementation details internal. The API should make correct
integration easy and incorrect integration diagnosable.

### Expanded Answer

I would start with configuration, the main capabilities, result models, error
handling, concurrency expectations, and diagnostics. Then I would hide internal
networking, storage, queues, and vendor SDK details behind that surface.

The public API is a contract. Once clients depend on it, every exposed type has
compatibility cost. That is why I would expose fewer concepts and document them
well.

---

<a id="q2-evolve-sdk"></a>
## Q2: How do you evolve an SDK without breaking clients?

### Short Answer

Prefer additive changes, mark replacements clearly, keep deprecated APIs during a
migration window, and provide migration notes and test coverage for old and new
paths.

### Expanded Answer

Breaking changes should be deliberate and rare. I would add new capabilities
without changing old behavior where possible. If a model or workflow must change,
I would explain the reason, provide a replacement, and measure adoption before
removing the old API.

Compatibility is not only version numbers. It includes source compatibility,
runtime behavior, threading or actor expectations, error semantics, and the
client's rollout process.

---

<a id="q3-sdk-diagnostics"></a>
## Q3: What diagnostics should an SDK expose?

### Short Answer

An SDK should expose enough diagnostics to identify version, configuration,
capability availability, request flow, recoverable errors, and integration
mistakes without leaking private implementation details.

### Expanded Answer

Diagnostics are part of the product. Client teams need to know whether a failure
is caused by bad configuration, network conditions, missing entitlement, an
unsupported OS version, misuse of the API, or an SDK defect.

At Principal scope, I would standardize error categories, logging hooks,
redaction rules, request identifiers, and support bundles. Otherwise every
integration issue becomes a custom debugging session.

