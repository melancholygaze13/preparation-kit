---
title: "Protocol Extensions and Dispatch: Interview Questions"
domain: "Swift"
topic: "Protocols"
concept: "Protocol Extensions and Dispatch"
page_type: interview
interview_priority: high
estimated_read_minutes: 3
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-07-12
---

# Protocol Extensions and Dispatch: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Why can the same method name behave differently through a protocol value?](#q1-extension-dispatch) | Senior | Witness versus static dispatch |
| [When should a requirement have a default implementation?](#q2-default-implementation) | Staff | Policy and evolution |
| [How should protocol dispatch be tested?](#q3-dispatch-testing) | Senior | Static views and witnesses |

---

<a id="q1-extension-dispatch"></a>
## Q1: Why Can the Same Method Name Behave Differently Through a Protocol Value?

### Short Answer

If the method is a protocol requirement, a conformer's witness is used through the
protocol view. If it exists only in a protocol extension, selection uses the expression's
static type, so the extension implementation can run instead of a same-named concrete member.

### Expanded Answer

Defaults satisfy declared requirements and remain customization points. Extension-only
helpers are statically selected conveniences. Declare polymorphic behavior in the protocol
instead of relying on matching names.

### Trade-offs

- Extension-only helpers keep contracts small.
- Requirements enable polymorphism but burden every conformer and API evolution.

### Example

Concrete tests call a custom formatter, while production stores it as `any Formattable`
and calls an extension-only fallback. Making formatting a requirement fixes the contract.

---

<a id="q2-default-implementation"></a>
## Q2: When Should a Requirement Have a Default Implementation?

### Short Answer

Provide a default when one universally correct implementation can be derived from other
requirements with acceptable complexity. Require explicit witnesses when behavior is
policy-sensitive, safety-critical, effectful, or materially different by conformer.

### Expanded Answer

Defaults reduce adoption cost but can hide missing behavior. Adding a defaulted requirement
may preserve compilation while changing behavior and method selection for existing conformers.

### Trade-offs

- Defaults centralize shared rules and remove duplication.
- Explicit requirements keep policy visible and reviewable.

### Example

A retry protocol does not provide a default retry count. Each service has different
rules for safe repetition and
budgets differ; a pure derived diagnostic label safely has a default.

---

<a id="q3-dispatch-testing"></a>
## Q3: How Should Protocol Dispatch Be Tested?

### Short Answer

Call the behavior through concrete, generic, and existential views that match production.
Verify that requirements use the intended witness and extension-only helpers remain
deliberately static. Concrete-only tests can miss the exact dispatch bug under review.

### Example

A formatter test passes on `ConcreteFormatter` but production stores `any Formatter`.
The existential-view test reveals that the same-named method was not a requirement.
