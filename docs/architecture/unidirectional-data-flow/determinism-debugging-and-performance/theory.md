---
title: "Determinism, Debugging, and Performance: Theory"
domain: "Architecture"
topic: "Unidirectional Data Flow"
concept: "Determinism, Debugging, and Performance"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 7
status: reviewed
last_reviewed: 2026-07-11
tags:
  - unidirectional-data-flow
  - debugging
  - performance
---

# Determinism, Debugging, and Performance: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

UDF improves diagnosis because state changes have named actions and a controlled
transition function. This is deterministic only when reducers do not read hidden
time, randomness, global mutable state, or external systems. Those values must enter
through controlled dependencies or actions.

Deterministic transitions make failures reproducible at the reducer boundary. They do
not make the whole distributed system deterministic: network order, server state,
cancellation, persistence, and OS lifecycle remain external concerns.

## Build a Useful Action Trail

A diagnostic record can include:

- action name and correlation ID;
- feature and effect identity;
- selected state changes rather than the entire state;
- effect start, cancellation, completion, and duration;
- app version and relevant schema version.

Never log all payloads by default. Actions may contain credentials, health data,
messages, or large images. Define redaction at the domain boundary and test it. Use
summaries such as counts, IDs safe for support, and transition names.

Action logs help answer what the app believed and in which order. Pair them with
network, persistence, and crash telemetry using correlation IDs. A reducer trace alone
cannot prove what a server committed.

## Treat Replay Carefully

Replaying actions through a reducer can reproduce state transitions when:

- initial state and reducer version are known;
- dependency outputs appear as recorded actions;
- effects are disabled or replaced during replay;
- action and state schemas remain compatible.

Do not replay a command log against live payment, analytics, or mutation services.
That can duplicate external effects. Time travel is safest as a diagnostic of pure
transitions, not as a production recovery mechanism unless the system was deliberately
designed as event sourcing.

State restoration has separate needs. Persist minimal stable domain state and route
identifiers with migrations. A long historical action list is rarely the simplest way
to restore a mobile feature.

## Control State and Action Size

One root value does not require every view to observe every property. Scope each view
to the smallest state it renders. With Swift Observation, property access tracking can
limit updates, but architecture still controls whether a view reads a broad object.

Large copied state can make equality, logging, snapshots, and mutation expensive.
Options include:

- use stable identifiers and normalize shared entities;
- keep large immutable values behind focused capabilities;
- derive small view state at the feature boundary;
- avoid copying unchanged collections during manual transformations;
- keep high-frequency samples outside global feature state when full fidelity is not
  needed for behavior.

Normalization reduces duplication but adds lookup and relationship maintenance. Use
it for shared, frequently updated entities—not as a rule for every nested value.

## Keep Reducers and Rendering Fast

Reducers run for every action and should complete synchronously. Avoid sorting large
collections, decoding, image work, or complex formatting in a frequent transition.
Move heavy computation to an effect and return a result action, or cache it under a
clear invalidation rule.

Derived state is usually safer than stored duplication. If derivation becomes costly,
measure it before caching. A cache creates another consistency responsibility.

High action rates also matter. Scroll position, audio meters, pointer movement, or
download bytes can overwhelm logging, reducers, and SwiftUI updates. Coalesce,
throttle, sample, or keep the signal local according to product needs. Do not drop
events that represent required operations.

## Measure the Whole Loop

Useful measurements include:

| Measure | What it reveals |
|---|---|
| Actions per second by type | Noisy producers and loops |
| Reducer duration | Expensive transitions |
| Effect latency and cancellation | External work and abandoned operations |
| State or diff size | Copying and logging pressure |
| View update count and body duration | Observation scope and render cost |
| Memory by feature scope | Retained stores, histories, and child state |

Apple's SwiftUI Instruments can show update causes and long view-body work. Use those
traces to narrow observation or move expensive work. Do not optimize store internals
when the actual cost is image decoding or layout.

## Engineering Decisions

Reducer tests establish deterministic transitions. Add property-based checks for
important rules, such as totals never becoming negative, when the domain benefits.
Store tests verify serialization, effect ordering, and cancellation. Performance tests
use representative state sizes and action rates.

At Staff scope, define privacy-safe logging, sampling, correlation, retention, and
versioning. Provide dashboards for action loops and effect health. Set budgets only
after measuring representative features, and allow simpler state management when UDF
cost exceeds its diagnostic value.

## References

- [Redux Fundamentals: Concepts and Data Flow](https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow)
- [Understanding and improving SwiftUI performance](https://developer.apple.com/documentation/xcode/understanding-and-improving-swiftui-performance)
- [Managing model data in your app](https://developer.apple.com/documentation/swiftui/managing-model-data-in-your-app)
