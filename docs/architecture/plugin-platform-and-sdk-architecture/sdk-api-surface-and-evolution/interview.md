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
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-07-12
tags:
  - sdk-design
  - api-evolution
  - compatibility
---

# SDK API Surface and Evolution: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How would you design the public API for an iOS SDK?](#q1-how-would-you-design-the-public-api-for-an-ios-sdk) | Staff | API boundaries |
| [How do source, binary, and behavior compatibility differ?](#q2-how-do-source-binary-and-behavior-compatibility-differ) | Staff | Compatibility promises |
| [How would you evolve and support an SDK across many clients?](#q3-how-would-you-evolve-and-support-an-sdk-across-many-clients) | Principal | Migration and operations |

---

<a id="q1-how-would-you-design-the-public-api-for-an-ios-sdk"></a>
## Q1: How would you design the public API for an iOS SDK?

### Short Answer

I start from client workflows and expose a small facade with configuration, capabilities,
stable models, typed errors, concurrency rules, and diagnostics. Internal services,
storage, networking, and vendor types stay hidden unless clients need direct control.

### Expanded Answer

I test usage at the call site because clarity matters more than a neat declaration. I
also document actor isolation, cancellation, callback ordering, privacy, and supported
platforms. Those behavior promises can break clients even if method signatures do not.

---

<a id="q2-how-do-source-binary-and-behavior-compatibility-differ"></a>
## Q2: How do source, binary, and behavior compatibility differ?

### Short Answer

Source compatibility means old client source still compiles. Binary compatibility means
an already-built client works with a separately built library. Behavior compatibility
means documented outcomes and timing rules remain valid. I state and test each promise
instead of treating semantic versioning as the guarantee.

### Expanded Answer

Source packages normally rebuild with the client. A separately distributed binary Swift
framework may need module stability and library evolution. Even an additive API change can
have language-specific effects, so I use compatibility checks and documented supported
versions rather than relying on the word "additive."

---

<a id="q3-how-would-you-evolve-and-support-an-sdk-across-many-clients"></a>
## Q3: How would you evolve and support an SDK across many clients?

### Short Answer

I prefer additive change, provide a replacement before deprecation, publish migration
guides and examples, test old and new client paths, and measure supported-version use. I
remove an old API only after the stated window and when clients have a practical path.

### Expanded Answer

The support contract includes version and capability reporting, typed error categories,
request identifiers, redacted logs, release notes, ownership, and incident escalation. I
track migration progress, integration failures, crash and latency regressions, and support
causes. That shows whether compatibility work is helping clients rather than only keeping
old code alive.
