---
title: "Quality Attributes and Product Constraints: Theory"
domain: "Architecture"
topic: "Architectural Foundations and Trade-offs"
concept: "Quality Attributes and Product Constraints"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 8
status: reviewed
last_reviewed: 2026-07-11
tags:
  - quality-attributes
  - product-constraints
  - architecture-decisions
---

# Quality Attributes and Product Constraints: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Architecture is not a choice between named patterns. It is the set of hard-to-change
decisions about boundaries, ownership, data flow, and dependencies. Those decisions
should follow the product's important qualities and constraints.

A functional requirement says what the system does: "A customer can place an
order." A **quality attribute** says how well the system must behave: the order must
survive a network interruption, submission must not happen twice, and the interface
must remain responsive. A **constraint** limits the available choices: the team must
reuse an existing API, ship in six weeks, support a minimum OS version, or meet a
privacy rule.

The useful question is not "What is the best architecture?" It is "Which risks must
this design control, and what is the cheapest design that controls them?"

## Turn Goals into Testable Scenarios

Words such as *fast*, *reliable*, *secure*, and *maintainable* are too vague to guide
a design. Make each important quality concrete:

| Part | Example |
|---|---|
| Trigger | The customer confirms an order, then loses connectivity. |
| Conditions | The app may be suspended or terminated before the next launch. |
| Expected behavior | The order remains queued and is not submitted twice. |
| Measure | It resumes automatically within one minute of usable connectivity. |

This scenario points toward durable operation identity, persisted intent,
idempotency, and retry policy. "Use Clean Architecture" does not answer the problem.

Choose measures that represent the user outcome. For performance, that might be the
90th-percentile time until the first usable screen rather than the duration of one
repository call. For reliability, it might be successful recovery after termination,
not merely a low crash rate. Measure real device conditions when possible. Xcode
Organizer and MetricKit can expose launch time, responsiveness, memory, and energy
behavior from shipping apps.

Not every quality needs a numeric target. Accessibility, privacy, and legal
requirements may be pass-or-fail constraints. They still need an explicit validation
method, such as an accessibility audit, permission-flow review, or data-retention
test.

## Mobile Qualities That Shape Architecture

### Responsiveness and Resource Use

The main thread must remain available for user interaction. CPU work, memory, disk
access, network use, and battery cost are linked: caching may improve latency but use
more storage and create invalidation work. Eager object graphs may simplify access
but increase launch time and memory.

Decide which work is required for the first useful screen and defer the rest. Avoid
assuming that a faster development machine represents the device population. Field
metrics and representative low-end devices should inform the boundary.

### Reliability, Offline Behavior, and Data Integrity

Mobile processes can be suspended or terminated, and connectivity changes often.
Decide which operations may be lost, which must resume, and which require server-side
idempotency. A repository and local store are justified when the product needs a
stable offline or synchronization policy. They are overhead for a read-only feature
that can simply retry.

Background execution is scheduled by the system and is not a general always-running
service. A design that requires an exact background time conflicts with the platform.
Persist enough intent to resume later and make interruption a normal state.

### Security and Privacy

Collect the least data needed, keep sensitive values out of logs, request access in
context, and define where data is stored and deleted. These choices affect model and
module boundaries. For example, a small capability that owns Health data access is
easier to audit than permission checks scattered across screens.

Security is not a layer added after feature development. Authentication, authorization,
transport protection, local data protection, and failure behavior must be part of the
flow. A more isolated boundary can reduce exposure, but it also adds mapping and API
maintenance. Use the boundary when the risk warrants the cost.

### Accessibility and Adaptability

Accessibility affects component APIs and test strategy. A design system that exposes
only fixed heights or image-only controls makes Dynamic Type and assistive technology
support expensive. Prefer boundaries that preserve meaning: a button is an action,
not only a tap target at a coordinate.

The same principle applies to localization, multiple window sizes, input methods,
and platform variants. Keep domain policy independent of one layout, but do not add a
generic presentation framework before a second presentation actually needs it.

### Changeability and Delivery

Maintainability is the ability to make expected changes safely. Testability,
modularity, and clear ownership help, but each adds cost. More protocols can isolate
volatile dependencies; protocols around stable value types often add indirection
without reducing change.

Team topology is a constraint. A single small team may move fastest with source
folders and clear feature types. Several teams releasing shared capabilities may
need package boundaries, owned APIs, compatibility policy, and dependency checks.
A runtime architecture cannot fix unclear organizational ownership.

## Find the Driving Attributes

Architecture cannot maximize every quality. Identify the few **driving attributes**
whose failure would threaten the product, then discuss conflicts explicitly.

| Choice | Benefit | Cost or risk | Fits when |
|---|---|---|---|
| Durable offline queue | Recovery and user trust | Conflict, retry, and migration logic | Operations must survive interruption |
| Feature module | Enforced ownership and dependency limits | Public API and build-graph cost | Teams or release boundaries need enforcement |
| Shared design system | Consistency and accessibility fixes at scale | Coordination and versioning | Many surfaces repeat stable components |
| Direct service call from a feature | Low initial complexity | Harder replacement if policy spreads | One owner and simple, low-risk behavior |

Some requirements reinforce each other. Clear dependency boundaries can improve
testability and changeability. Others conflict. Strong consistency may reduce offline
availability. Aggressive caching may improve responsiveness while increasing memory,
staleness, and privacy risk. A strong answer names the conflict and explains which
product outcome wins.

## Make a Proportional Decision

Use this sequence for a new feature or design review:

1. Define the user outcome and important failure cases.
2. List fixed constraints, including platform, regulation, schedule, and team ownership.
3. Rank the two or three qualities that drive the design.
4. Write observable scenarios and decide how to measure them.
5. Compare the smallest viable options, including doing nothing new.
6. Record the decision, its costs, and the evidence that would trigger a review.

For an early product, a direct dependency and a focused integration test may be the
right choice. Add a repository when offline policy, multiple sources, or replacement
risk becomes real. Add a module when ownership or dependency enforcement matters.
This is deliberate evolution, not deferred design.

Architecture can also be too small. If payment submission can duplicate charges,
"we can refactor later" does not control the present risk. Spend complexity where
failure is expensive or recovery is difficult.

## Engineering Decisions

Good decision records remain short. Capture the context, options, chosen approach,
benefits, costs, owner, and review trigger. A trigger might be a measured launch
regression, a second data source, a new team boundary, or a change in privacy rules.

At Staff and Principal scope, make qualities enforceable across teams. Define a
small set of system measures, assign owners, provide supported implementation paths,
and allow documented exceptions. Roll out a boundary or platform in stages and
compare results. A standard without adoption cost, migration support, and evidence
becomes ceremony.

## References

- [Analyzing the performance of your shipping app](https://developer.apple.com/documentation/xcode/analyzing-the-performance-of-your-shipping-app)
- [Reducing your app's launch time](https://developer.apple.com/documentation/xcode/reducing-your-app-s-launch-time)
- [Choosing background strategies for your app](https://developer.apple.com/documentation/backgroundtasks/choosing-background-strategies-for-your-app)
- [Protecting the user's privacy](https://developer.apple.com/documentation/uikit/protecting-the-user-s-privacy)
- [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility/)
