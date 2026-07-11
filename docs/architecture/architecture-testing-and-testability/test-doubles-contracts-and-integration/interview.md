---
title: "Test Doubles, Contracts, and Integration: Interview Questions"
domain: "Architecture"
topic: "Architecture Testing and Testability"
concept: "Test Doubles, Contracts, and Integration"
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
  - test-doubles
  - contract-tests
  - integration-tests
---

# Test Doubles, Contracts, and Integration: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When do you use a test double?](#q1-when-do-you-use-a-test-double) | Senior | Control and realism |
| [How do you stop fakes from drifting?](#q2-how-do-you-stop-fakes-from-drifting) | Senior | Contract tests |
| [What should remain an integration test?](#q3-what-should-remain-an-integration-test) | Senior | Boundary risk |

---

<a id="q1-when-do-you-use-a-test-double"></a>
## Q1: When do you use a test double?

### Short Answer

I use a double when a policy test needs controlled results, failures, timing, or a
meaningful interaction. I depend on a narrow port owned by the consumer and choose a
stub, spy, or fake for that need. I do not mock framework details or verify calls that
are not part of the behavior.

### Expanded Answer

A double buys speed and control but gives up realism. If a protocol mirrors a large SDK
or every test knows call order, I introduce an adapter with a smaller domain contract.
For a simple dependency, a value or closure may be clearer than a protocol and mock.

<a id="q2-how-do-you-stop-fakes-from-drifting"></a>
## Q2: How do you stop fakes from drifting?

### Short Answer

I define the behavior of the owned port and run shared contract examples against both
the fake and real adapter where practical. I also keep integration tests for behavior
unique to the real implementation, such as database constraints or HTTP mapping.

### Trade-offs

A rich fake can make many tests fast, but it becomes another implementation to maintain.
I keep it smaller than production and model only behavior callers rely on. If accurate
simulation becomes complex, focused real integration tests may be cheaper and safer.

<a id="q3-what-should-remain-an-integration-test"></a>
## Q3: What should remain an integration test?

### Short Answer

Anything whose risk comes from the real boundary: serialization, database queries and
migrations, adapter mapping, dependency assembly, or framework lifecycle. Replacing
that component would remove the behavior the test is meant to prove.

### Example

I would stub a repository while testing checkout policy. I would use the real decoder
for payload compatibility and a temporary real store for a migration. Each test gets
isolated resources so parallel execution cannot change its result.
