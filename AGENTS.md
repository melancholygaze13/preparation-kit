# Repository Authoring Guide

## Purpose

This repository is a Markdown knowledge base for engineers preparing for Senior,
Staff, and Principal iOS engineering roles. It covers Swift, Apple frameworks,
architecture, system design, performance, testing, platform engineering, and
technical leadership.

Optimize every page for:

1. Fast revision.
2. Accurate understanding.
3. Production engineering judgment.
4. Senior-level interview discussion.

Do not write beginner tutorials or generic API documentation. Explain mechanics
only when they support correct decisions, debugging, system design, or interview
reasoning.

## Information Architecture

Use this hierarchy:

```text
docs/
└── <domain>/
    ├── README.md
    └── <topic>/
        ├── README.md
        └── <concept>/
            ├── README.md
            ├── theory.md
            └── interview.md
```

Definitions:

- **Domain:** A broad knowledge area, such as Swift, frameworks, architecture,
  performance, or engineering leadership.
- **Topic:** A coherent group of related concepts within a domain.
- **Concept:** The smallest independently reviewable unit of knowledge.
- **Theory page:** The authoritative explanation of a concept.
- **Interview page:** Questions and answers that evaluate the same concept.

Keep interview material inside its concept directory. Do not create a global
question bank and do not duplicate the same question across unrelated pages.
High-level interview indexes may link to concept interview pages.

## File and Directory Rules

- Use lowercase `kebab-case` for directory names.
- Every domain, topic, and concept directory must contain a `README.md` index.
- Every concept normally contains exactly `README.md`, `theory.md`, and
  `interview.md`.
- Split a page only when it has become difficult to scan or owns multiple
  independently reviewable concepts.
- Use relative Markdown links between repository pages.
- Keep heading levels sequential; do not skip from `##` to `####`.
- Use one H1 heading per page.
- Prefer descriptive headings over clever or conversational headings.
- Preserve existing naming and structure when editing established sections.

## Front Matter

All knowledge pages must begin with YAML front matter.

Allowed role levels are:

- `senior`
- `staff`
- `principal`

Allowed page statuses are:

- `draft`
- `reviewed`
- `needs-update`

Use ISO 8601 dates in `YYYY-MM-DD` format. Tags must be lowercase kebab-case.
Do not add empty metadata fields that have no immediate use.

## Writing Standards

- Start with the answer or mental model, then add detail.
- Keep quick-recall material short enough to review in under one minute.
- Separate documented behavior from implementation assumptions.
- State constraints, guarantees, failure modes, and trade-offs explicitly.
- Prefer decision criteria over unconditional recommendations.
- Connect implementation details to production consequences.
- At Staff and Principal level, cover system boundaries, migration, ownership,
  rollout risk, and organizational impact when relevant.
- Use concrete examples only when they clarify behavior or judgment.
- Avoid filler, trivia, unexplained jargon, and exhaustive API inventories.
- Do not claim that an answer is the only correct approach when it depends on
  context.

## Source Standards

- Prefer primary sources: Swift Evolution proposals, the Swift language and
  standard library documentation, Apple documentation, and WWDC sessions.
- Use secondary sources only when they add analysis not available from a primary
  source.
- Put references on the theory page, close to the claims they support when a
  claim needs precise attribution.
- Never invent API guarantees, performance characteristics, quotations, or
  citations.
- Record the review date whenever source verification materially changes a page.

## Creating a New Concept

When asked to add a concept, create the complete concept bundle unless the user
explicitly requests only one page:

```text
<concept>/
├── README.md
├── theory.md
└── interview.md
```

Update the parent topic index in the same change. Add links to prerequisites and
related concepts only when those pages exist. Do not leave broken placeholder
links in committed content.

## Domain Index Template

```md
---
title: "<Domain>"
page_type: domain-index
status: draft
last_reviewed: YYYY-MM-DD
---

# <Domain>

## Scope

<!-- Define the domain and its boundaries. -->

## Topics

| Topic | Summary |
|---|---|
| [<Topic>](<topic>/README.md) | <!-- One sentence. --> |

## Suggested Learning Path

1. [<Topic>](<topic>/README.md)

## Related Domains

- <!-- Link only to an existing domain. -->
```

## Topic Index Template

```md
---
title: "<Topic>"
domain: "<Domain>"
page_type: topic-index
status: draft
last_reviewed: YYYY-MM-DD
---

# <Topic>

## Scope

<!-- Define what belongs to this topic and its boundaries. -->

## Prerequisites

- <!-- Link only to an existing prerequisite. -->

## Learning Path

1. [<Concept>](<concept>/README.md)

## Concepts

| Concept | Summary | Level |
|---|---|---|
| [<Concept>](<concept>/README.md) | <!-- One sentence. --> | Senior |

## Related Topics

- <!-- Link only to an existing topic. -->
```

## Concept Index Template

```md
---
title: "<Concept>"
domain: "<Domain>"
topic: "<Topic>"
page_type: concept-index
levels:
  - senior
status: draft
last_reviewed: YYYY-MM-DD
---

# <Concept>

> <!-- One- or two-sentence concept summary. -->

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Prerequisites

- <!-- Link only to an existing concept. -->

## Related Concepts

- <!-- Link only to an existing concept. -->
```

Remove optional empty sections such as `Prerequisites`, `Related Concepts`, or
`Related Domains` rather than shipping placeholder bullets.

## Theory Page Template

```md
---
title: "<Concept>: Theory"
domain: "<Domain>"
topic: "<Topic>"
concept: "<Concept>"
page_type: theory
levels:
  - senior
status: draft
last_reviewed: YYYY-MM-DD
---

# <Concept>: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> <!-- A precise definition or mental model. -->

- <!-- No more than five essential points. -->

## Mental Model

<!-- Explain the concept in the shortest accurate form. -->

## How It Works

<!-- Cover mechanics, lifecycle, ownership, or data flow. -->

### Core Invariants

- <!-- What must remain true? -->

### Constraints and Guarantees

- <!-- Separate guarantees from assumptions. -->

## Failure Modes

- <!-- Failure, symptom, cause, and relevant mitigation. -->

## Engineering Judgment

### When to Use It

- <!-- Selection criteria. -->

### When Not to Use It

- <!-- Rejection criteria. -->

### Trade-offs

| Choice | Benefits | Costs | Best fit |
|---|---|---|---|
| <!-- --> | <!-- --> | <!-- --> | <!-- --> |

### Alternatives

- <!-- Alternative and comparison criteria. -->

## Production Considerations

### Performance

<!-- Include only relevant time, memory, energy, startup, or I/O effects. -->

### Concurrency and Thread Safety

<!-- Include isolation, ordering, cancellation, and synchronization concerns. -->

### Testing

<!-- Cover valuable test boundaries and failure paths. -->

### Observability and Debugging

<!-- Cover useful signals, profiling, logs, and diagnostic tools. -->

### Compatibility and Migration

<!-- Cover availability, rollout, backward compatibility, and migration. -->

## Staff and Principal Perspective

### System Impact

<!-- Discuss boundaries, dependencies, scalability, and maintainability. -->

### Decision Framework

<!-- Explain how to evaluate and communicate the decision. -->

### Organizational Impact

<!-- Discuss ownership, coordination, standards, and rollout when relevant. -->

## Common Mistakes

### <Mistake>

**Why it is wrong:** <!-- Explanation. -->

**Better approach:** <!-- Correction. -->

## References

- [<Primary source>](<url>)
```

Remove production or Staff/Principal subsections that genuinely do not apply.
Do not fill them with generic observations merely to satisfy the template.

## Interview Page Template

```md
---
title: "<Concept>: Interview Questions"
domain: "<Domain>"
topic: "<Topic>"
concept: "<Concept>"
page_type: interview
levels:
  - senior
status: draft
last_reviewed: YYYY-MM-DD
---

# <Concept>: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [<Question>](#q1-question-slug) | Senior | <!-- Knowledge or judgment tested. --> |

---

<a id="q1-question-slug"></a>
## Q1: <Question>

### What It Evaluates

<!-- State the signal the interviewer is looking for. -->

### Short Answer

<!-- A direct answer that can be delivered in 20–30 seconds. -->

### Detailed Answer

<!-- Expand the reasoning without turning it into a theory-page duplicate. -->

### Engineering Trade-offs

- <!-- Context-dependent choices and consequences. -->

### Production Scenario

<!-- Show how the reasoning applies in a realistic situation. -->

### Follow-up Questions

- <!-- Likely deeper question. -->

### Strong Answer Signals

- <!-- Evidence of correct senior-level reasoning. -->

### Weak Answer Signals

- <!-- Missing reasoning, unsafe claims, or common misconceptions. -->

### Related Theory

- [<Relevant section>](theory.md#section-anchor)
```

## Interview Answer Rules

- Keep every question scoped to the owning concept.
- Begin with a direct answer before qualifications and edge cases.
- Make the short answer independently useful; do not write “see theory.”
- Keep the detailed answer focused on interview reasoning and link to the theory
  page for full mechanics.
- Include trade-offs for design and decision questions.
- Use production scenarios to test applied judgment, not storytelling ability.
- Strong and weak signals must evaluate technical reasoning, not personality or
  communication style unrelated to the role.
- Add follow-up questions that deepen or challenge the original answer.
- Use stable, explicit question anchors so indexes and external links survive
  wording edits.
- Number questions sequentially within a concept. Question numbers do not need to
  be unique across the repository.

## Quality Checklist

Before considering a concept complete, verify that:

- The topic index links to the concept.
- The concept index links to both sibling pages.
- Theory and interview pages link to each other.
- Quick Recall can be reviewed in under one minute.
- The theory distinguishes guarantees, assumptions, and trade-offs.
- Interview answers have short and detailed layers.
- Staff/Principal claims address broader impact rather than adding more API trivia.
- All internal links resolve.
- Claims are supported by current primary sources where appropriate.
- Placeholder comments and empty sections have been removed.
