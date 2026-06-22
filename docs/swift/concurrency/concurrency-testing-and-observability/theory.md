---
title: "Concurrency Testing and Observability: Theory"
domain: "Swift"
topic: "Concurrency"
concept: "Concurrency Testing and Observability"
page_type: theory
interview_priority: high
estimated_read_minutes: 5
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Concurrency Testing and Observability: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A reliable concurrency test controls a happens-before relationship. A reliable production
system observes ownership and capacity at the same boundaries: task start/finish,
suspension, actor queue, cancellation, stream buffer, and dependency call.

## How It Works

Write native async Swift Testing tests and inject dependencies that can pause at a known
point. The test starts the operation, waits until the dependency confirms arrival,
performs the competing action, releases the operation, and awaits its result.

```swift
import Testing

@Test
func cancellationStopsOwnedWork() async {
    let gate = Gate()
    let task = Task {
        await gate.arriveAndWait()
        try Task.checkCancellation()
    }

    await gate.waitUntilArrived()
    task.cancel()
    await gate.release()

    await #expect(throws: CancellationError.self) {
        try await task.value
    }
}
```

The gate must itself be concurrency-safe and resume its waiters exactly once. Prefer a
domain fake over sleeps or repeated yielding. Inject a `Clock`-generic dependency or
test scheduler for deadlines so virtual time advances deterministically.

Use `confirmation(expectedCount:)` for observable events when the tested operation is
fully awaited inside the closure. It is not an XCTest-style expectation that waits after
the closure returns. Avoid globally serializing tests to hide shared mutable fixtures;
give each test isolated state. Annotate a test or suite with `@MainActor` only when the
production contract requires it.

Thread Sanitizer finds exercised runtime races in unsafe/legacy code. Instruments and
signposts reveal executor and task behavior. Neither replaces static isolation review or
deterministic assertions.

### Core Invariants

- Tests await every operation they start or explicitly cancel and drain it.
- Synchronization establishes order without wall-clock guesses.
- Test fixtures are isolated under parallel execution.
- Production metrics have bounded cardinality and preserve trace correlation.
- Instrumentation does not change correctness or become a synchronization mechanism.

### Constraints and Guarantees

- Passing tests cover only exercised schedules; repeated runs do not prove race freedom.
- TSan detects runtime memory races, not logical stale-result or cancellation-policy bugs.
- `confirmation()` counts calls during its dynamic scope; it does not wait for discarded tasks.

## Engineering Judgment

### When to Use It

Deterministically test cancellation, reentrancy, limits, buffering, termination, and
owner teardown. Add production signals where concurrency policy can overload or leak work.

### When Not to Use It

Do not assert exact scheduler order without a contract, use thread IDs as actor proof,
or serialize the suite to compensate for unsafe fixtures.

### Trade-offs

| Choice | Benefits | Costs | Best fit |
|---|---|---|---|
| Gate/fake dependency | Exact interleaving | Test support code | Reentrancy/cancellation |
| Injected clock | Fast deterministic deadlines | API generic/injection design | Timeout policy |
| TSan | Finds exercised memory races | Slow, incomplete coverage | CI/stress lane |
| Metrics and traces | Production visibility | Cost/cardinality | Capacity and lifecycle |

### Alternatives

Use model/state-machine tests for complex owners, integration tests for boundary adapters,
and load tests for capacity policy. Each answers a different risk.

## Production Application

### Performance

Instrument active and queued work, executor/actor wait, hop count, buffer high-water,
drops, timeout rate, cancellation latency, and work completed after cancellation.

### Concurrency and Thread Safety

Mocks, clocks, and recorders must themselves be isolated. Reading actor state from tests
requires await through an explicit snapshot method.

### Testing

Use parameterized tests for policy matrices, `#require` for prerequisites, and
`#expect(throws:)` for typed failures. Keep UI tests in XCTest; Swift Testing does not
support UI automation.

### Observability and Debugging

Propagate correlation through task-local values where appropriate, but explicitly bridge
detached/legacy boundaries. Use task names as diagnostic metadata, never correctness.

### Compatibility and Migration

Move XCTest async unit tests incrementally while retaining XCTest for UI tests. Verify
Swift Testing API availability against the installed toolchain and deployment policy.

## Staff and Principal Perspective

### System Impact

Concurrency telemetry exposes saturation and ownership leaks before they become latency
or battery incidents. Tests should enforce the same capacity and lifecycle policies.

### Decision Framework

For each risk, identify the required interleaving, controllable boundary, invariant,
runtime signal, and failure budget. Avoid tests that merely repeat work probabilistically.

### Organizational Impact

Provide shared concurrency-safe fakes, clocks, and metric conventions. Run strict compile,
TSan, deterministic unit, and capacity tests in distinct CI lanes with clear ownership.

## References

- [Swift Testing](https://developer.apple.com/documentation/testing)
- [WWDC24: Go further with Swift Testing](https://developer.apple.com/videos/play/wwdc2024/10195/)
- [Thread Sanitizer](https://developer.apple.com/documentation/xcode/diagnosing-memory-thread-and-crash-issues-early)
- [WWDC22: Visualize and optimize Swift concurrency](https://developer.apple.com/videos/play/wwdc2022/110350/)
