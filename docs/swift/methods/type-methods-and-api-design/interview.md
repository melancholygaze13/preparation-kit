---
title: "Type Methods and API Design: Interview Questions"
domain: "Swift"
topic: "Methods"
concept: "Type Methods and API Design"
page_type: interview
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-21
---

# Type Methods and API Design: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When should you use a type method?](#q1-type-method-fit) | Senior | Ownership and construction |
| [What is the difference between static and class methods?](#q2-static-versus-class) | Senior | Override contract |
| [How do you migrate a static service API?](#q3-static-service-migration) | Staff | Dependency ownership |
| [How should an organization govern static APIs?](#q4-static-api-policy) | Principal | Platform standards |

---

<a id="q1-type-method-fit"></a>
## Q1: When Should You Use a Type Method?

### What It Evaluates

Whether type-level syntax reflects genuine type ownership.

### Short Answer

Use a type method for behavior about the type as a whole, such as a named construction
policy, parser, preset, or canonical value. Use an initializer for direct construction,
an instance method for receiver state, and an injected service for effectful coordination.
A static call should not conceal global dependencies merely for convenience.

### Detailed Answer

Factory names should disclose failure, caching, and whether references are fresh or
shared. A free function fits symmetric operations with no natural owner.

### Engineering Trade-offs

- Type methods are discoverable and namespaced.
- Initializers provide conventional construction.
- Services make dependency and lifecycle boundaries explicit.

### Production Scenario

`Image.load()` reaches global network and cache singletons. An injected image repository
owns those effects; `Image.placeholder()` remains a legitimate type factory.

### Follow-up Questions

- When is a free function preferable?
- How should a cached factory be named?
- Can type methods access instance state?

### Strong Answer Signals

- Uses ownership and construction semantics.
- Discloses factory identity behavior.
- Separates orchestration into a service.

### Weak Answer Signals

- Uses static methods as dependency injection.
- Hides I/O in innocent factories.
- Treats namespacing as ownership.

### Related Theory

- [Initializer, Factory, or Free Function](theory.md#initializer-factory-or-free-function)

---

<a id="q2-static-versus-class"></a>
## Q2: What Is the Difference Between static and class Methods?

### What It Evaluates

Knowledge of type methods and deliberate subclass extension points.

### Short Answer

`static` declares a type method and prevents overriding. On classes, `class` declares
an overridable type method. Prefer `static` unless subclass-specific behavior is an
intentional supported contract; overridability expands invariants, testing, and
compatibility obligations.

### Detailed Answer

Structures and enums use `static`. Inside a type method, `self` is the dynamic or
declared type according to the applicable dispatch rules. Detailed inheritance
dispatch belongs to inheritance design, not routine utility methods.

### Engineering Trade-offs

- `static` keeps behavior closed and predictable.
- `class` enables subclass customization but weakens closed-world reasoning.
- Composition can provide customization without inheritance coupling.

### Production Scenario

A security token factory is accidentally overridable and a subclass skips validation.
Making it `static` closes the unsupported extension point.

### Follow-up Questions

- Which declaration kinds support `class`?
- When is overriding a factory legitimate?
- What alternatives provide customization?

### Strong Answer Signals

- Defines override behavior precisely.
- Treats overridability as API design.
- Considers composition.

### Weak Answer Signals

- Calls the keywords stylistic synonyms.
- Makes every class method overridable.
- Ignores invariant impact.

### Related Theory

- [Static and Class Methods](theory.md#static-and-class-methods)

---

<a id="q3-static-service-migration"></a>
## Q3: How Do You Migrate a Static Service API?

### What It Evaluates

Staff-level incremental dependency migration.

### Short Answer

Define an instance protocol and owner, implement an adapter over the old static API,
inject it at composition roots, migrate callers incrementally, and instrument remaining
static use. Move shared state and lifecycle into the instance owner before deprecating
the global entry point, with a rollback path during mixed operation.

### Detailed Answer

Preserve behavior while changing dependency shape. Tests should stop resetting globals
and instead receive isolated fakes. If state is concurrent, choose an actor or audited
synchronous owner and migrate isolation semantics explicitly.

### Engineering Trade-offs

- Adapters reduce rollout risk but prolong duplicate surfaces.
- Injection adds plumbing while enabling scoped lifecycle and tests.
- A flag-day rewrite is simpler only with a proven small dependency graph.

### Production Scenario

A static analytics client becomes an injected session-scoped client. The adapter keeps
events flowing while call sites migrate and telemetry confirms old usage reaches zero.

### Follow-up Questions

- Where should the instance be created?
- How do you preserve event ordering?
- What metrics prove migration completion?

### Strong Answer Signals

- Uses adapter, composition root, telemetry, and deprecation.
- Moves state ownership, not only syntax.
- Covers concurrency and rollback.

### Weak Answer Signals

- Replaces calls globally without inventory.
- Wraps the static singleton but retains all global state.
- Leaves tests dependent on reset order.

### Related Theory

- [Compatibility and Migration](theory.md#compatibility-and-migration)

---

<a id="q4-static-api-policy"></a>
## Q4: How Should an Organization Govern Static APIs?

### What It Evaluates

Principal-level platform policy balancing clarity and pragmatism.

### Short Answer

Allow static constants, pure type behavior, and explicit named factories by default.
Require review for mutable state, shared instances, I/O, overridable class methods,
and hidden service lookup. Approved shared owners need isolation, lifecycle, quotas,
telemetry, test strategy, and a responsible team. Provide migration tooling rather
than relying on style guidance alone.

### Detailed Answer

Exceptions are legitimate for platform integration and process-wide resources, but
their sharing semantics must be visible. Linting can flag patterns; architecture review
decides contextual exceptions and prevents a utility namespace from becoming a service locator.

### Engineering Trade-offs

- Standards reduce hidden coupling and incidents.
- Strict bans create needless dependency plumbing for pure utilities.
- Exceptions preserve practicality but require ownership and expiration.

### Production Scenario

Teams accumulate competing static caches. A platform-owned cache service supplies
scoped clients, quotas, metrics, and migration adapters while pure factories remain static.

### Follow-up Questions

- Which patterns can tooling detect?
- What qualifies as a process-wide resource?
- Who owns exception review?

### Strong Answer Signals

- Distinguishes pure type behavior from global services.
- Combines rules, ownership, tooling, and migration.
- Supports justified exceptions.

### Weak Answer Signals

- Bans all static methods indiscriminately.
- Publishes guidance without enforcement or owners.
- Permits global mutation without isolation.

### Related Theory

- [Staff and Principal Perspective](theory.md#staff-and-principal-perspective)
