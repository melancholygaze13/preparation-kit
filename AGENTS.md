# Interview Preparation Authoring Guide

## Purpose

This repository is a time-efficient preparation system for Senior, Staff, and
Principal iOS interviews. It is not an exhaustive Swift or Apple-platform
reference.

Optimize every page for:

1. Recall under interview pressure.
2. Coverage of questions that are likely for the target role.
3. Correct engineering judgment and production trade-offs.
4. Progressive depth: learn the essential answer first, then expand only when
   the topic warrants it.

Prefer a smaller set of high-value concepts learned well over broad but shallow
coverage. Do not write beginner tutorials, generic API documentation, or
encyclopedic inventories. Mechanics belong only when they help a candidate
explain behavior, choose a design, or diagnose a realistic problem.

## Interview Priority

Assign each topic and concept one priority based on realistic iOS interview
value:

| Priority | Meaning | Typical examples | Treatment |
|---|---|---|---|
| `core` | Expected in most interview loops | concurrency, memory management, architecture, testing | Full coverage and applied questions |
| `high` | Common and role-relevant | Swift type system, networking, persistence, performance | Focused theory and questions |
| `situational` | Depends on role, company, or project history | advanced graphics, package infrastructure, specialized frameworks | Concise coverage; expand only for a target role |
| `reference` | Rarely worth dedicated preparation time | basic syntax details and narrow language features | Index summary or short reference; no forced bundle |

Priority is not a claim that a question is guaranteed. Base it on frequency,
role relevance, conceptual leverage, and the cost of not knowing it. When
editing, spend detail in this order: `core`, `high`, `situational`, `reference`.
Do not give a basic operator or isolated API more space than a major concurrency,
architecture, or ownership concept.

Topic indexes and concept pages must include `interview_priority`. Concept
overviews, theory pages, and interview pages must also include
`estimated_read_minutes`. Estimates cover a focused first read, not exercises.

## Preparation Paths

Domain and topic indexes must support selective study rather than imply that all
content is mandatory. Order material by priority and dependency, and identify:

- **Rapid review:** core concepts needed for an imminent interview.
- **Standard preparation:** core and high-priority concepts.
- **Role-specific depth:** situational material selected for a job description
  or known interview format.

Never require candidates to read reference material sequentially. Indexes should
make skipping low-priority material an explicit, safe choice.

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

- **Domain:** broad knowledge area.
- **Topic:** coherent group of related concepts.
- **Concept:** smallest independently reviewable interview unit.
- **Concept overview:** quick recall and navigation.
- **Theory:** minimum depth needed for accurate reasoning.
- **Interview:** rehearsal of likely questions for the same concept.

`core` and `high` concepts normally use the complete three-file bundle.
`situational` concepts may use a shorter bundle. `reference` concepts should
usually be summarized in the topic index or a single concept `README.md`.
Do not create three files merely to satisfy a pattern.

Keep interview material with its concept. Do not duplicate questions across
concepts or create a global question bank. High-level interview indexes may link
to concept pages.

## Content Budgets

Use these as limits, not targets:

| Priority | Total first-read time | Theory | Interview questions |
|---|---:|---:|---:|
| `core` | 12–20 min | 1,200–2,000 words | 2–5 |
| `high` | 7–12 min | 700–1,200 words | 2–5 |
| `situational` | 3–7 min | 300–700 words | 2–4 |
| `reference` | 1–3 min | Prefer no separate theory page | 2–3 short checks |

Exceed a budget only when removing material would make a common answer
incorrect or unsafe. If a page exceeds its budget:

1. Remove repetition, exhaustive enumeration, history, and low-value edge cases.
2. Merge overlapping concepts.
3. Move narrow facts to reference material only if they still have clear value.
4. Split only when each result is independently interviewable.

Do not compress by making prose denser. Use short paragraphs, meaningful
headings, tables for comparisons, and small examples for behavior that is hard
to explain precisely.

## File and Front Matter Rules

- Use lowercase `kebab-case` directory names.
- Every domain and topic directory has a `README.md` index.
- Every multi-page concept has a `README.md` linking its sibling pages.
- Use relative links, one H1 per page, and sequential heading levels.
- Preserve established naming when editing existing sections unless
  consolidation is part of the task.
- Remove empty sections instead of shipping placeholders.

All knowledge pages begin with YAML front matter. Use only these role levels:
`senior`, `staff`, and `principal`. Use only these statuses: `draft`, `reviewed`,
and `needs-update`. Dates use `YYYY-MM-DD`; tags use lowercase kebab-case.

Example concept metadata:

```yaml
---
title: "Structured Concurrency"
domain: "Swift"
topic: "Concurrency"
page_type: concept-index
levels:
  - senior
  - staff
interview_priority: core
estimated_read_minutes: 2
status: reviewed
last_reviewed: YYYY-MM-DD
---
```

Do not add empty metadata. Reassess the reading estimate after substantial
editing; use roughly 200 words per minute plus time for code and tables.

## Writing Standards

- Start with the answer or mental model.
- Put recall before detail and common cases before edge cases.
- Keep the concept overview reviewable in one minute.
- Use plain English that is clear to a non-native speaker.
- Prefer common words, active voice, and one idea per sentence.
- Keep most sentences below 25 words. Split long sentences instead of joining
  several qualifications with commas.
- Define a necessary technical term on first use. Do not replace a precise Swift
  term with an inaccurate simpler word.
- Avoid idioms, metaphors, clever headings, and abstract business language.
- Separate language or framework guarantees from implementation assumptions.
- State constraints and trade-offs only where they affect a decision or answer.
- Connect mechanics to production consequences.
- Prefer one representative example over several similar examples.
- Use decision criteria instead of unconditional recommendations.
- Avoid filler, trivia, repeated definitions, and generic Staff-level commentary.
- Do not repeat theory in interview answers; reshape it into a spoken response.

For Staff and Principal material, add broader scope only when the concept has a
real system or organizational dimension. Useful concerns include boundaries,
ownership, migration, rollout risk, observability, and cross-team standards.
More API detail is not Staff-level depth.

## Schemas and Diagrams

Use a schema or Mermaid diagram only when it materially simplifies the topic.
Good candidates include architecture boundaries, ownership, task hierarchies,
state transitions, data flow, and interactions between several components.

- Keep the mental model and key conclusion understandable without the diagram.
- Prefer a table for exact comparisons or mappings and a code block for a
  literal data or API schema. Use Mermaid when relationships or sequence are
  the important part.
- Choose the smallest suitable Mermaid form, such as `flowchart`,
  `sequenceDiagram`, `stateDiagram-v2`, or `classDiagram`.
- Use short, precise labels and explain Swift-specific constraints in nearby
  prose instead of crowding the diagram.
- Do not add decorative diagrams or repeat the same information in prose, a
  table, and a diagram.
- Keep diagrams focused enough to review under interview pressure. Split or
  remove a diagram when it needs substantial narration to be understood.
- Verify that Mermaid syntax renders and include diagram review time in
  `estimated_read_minutes`.

## Source Standards

- Prefer Swift Evolution, Swift documentation, Apple documentation, and WWDC.
- Use secondary sources only for analysis missing from primary sources.
- Cite claims that depend on precise or changing behavior, close to the claim.
- Never invent guarantees, performance characteristics, quotations, or sources.
- Update `last_reviewed` when verification materially changes content.

References support correctness; they are not a reading list. Include only sources
that substantively support the page.

## Index Requirements

A topic index should let a candidate decide what to study in under a minute.
Use a table like this:

```md
| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [Structured Concurrency](structured-concurrency/README.md) | Explains task hierarchy, cancellation, and lifetime. | Core | 15 min |
```

Its learning path should list core concepts first, respect prerequisites, and
label optional role-specific depth. Do not include empty prerequisite or related
sections.

## Concept Overview Template

```md
---
title: "<Concept>"
domain: "<Domain>"
topic: "<Topic>"
page_type: concept-index
levels:
  - senior
interview_priority: <core|high|situational|reference>
estimated_read_minutes: 1
status: draft
last_reviewed: YYYY-MM-DD
---

# <Concept>

> <!-- Interview-ready mental model in one or two sentences. -->

## Quick Recall

- <!-- Three to five facts or decisions worth retaining. -->

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
```

Add prerequisites or related concepts only when the links exist and materially
improve the study path. For a reference-only concept, omit sibling links that do
not exist.

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
interview_priority: <core|high|situational>
estimated_read_minutes: <number>
status: draft
last_reviewed: YYYY-MM-DD
---

# <Concept>: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

<!-- Shortest accurate explanation. -->

## How It Works

<!-- Only mechanics needed to reason correctly. -->

## Constraints and Guarantees

<!-- Distinguish documented behavior from assumptions. -->

## Engineering Decisions

<!-- Selection criteria, alternatives, and important trade-offs. -->

## Production Application

<!-- Relevant performance, concurrency, testing, debugging, or migration concerns. -->

## References

- [<Primary source>](<url>)
```

Sections are conditional. Remove those that do not contribute to a plausible
interview answer. Do not add standalone `Failure Modes` or `Common Mistakes`
sections. Incorporate a failure or misconception at the exact point where it
changes the mental model, decision, or production outcome.

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
interview_priority: <core|high|situational>
estimated_read_minutes: <number>
status: draft
last_reviewed: YYYY-MM-DD
---

# <Concept>: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [<Question>](#q1-question-slug) | Senior | <Knowledge or judgment tested> |

---

<a id="q1-question-slug"></a>
## Q1: <Question>

### Short Answer

<!-- A direct, speakable answer for 20–30 seconds. -->

### Expanded Answer

<!-- The reasoning, limits, and relevant mechanics. -->

### Trade-offs

<!-- Include only for a context-dependent design decision. -->

### Example

<!-- Optional compact production scenario or code example. -->
```

Keep questions distinct and likely. Include two or three short questions even for
easy topics; basic questions often appear as warm-ups or as part of a larger
problem. Do not create artificial Staff-level questions for simple syntax. The
short answer must stand alone. The expanded answer should model a strong
interview response without duplicating the theory page. Omit `Trade-offs` and
`Example` when they add no value.

Do not add `What It Evaluates`, `Follow-up Questions`, `Strong Answer Signals`,
`Weak Answer Signals`, or `Related Theory`. These sections increase reading cost
without improving the candidate's core rehearsal loop.

Use stable explicit anchors and sequential question numbers so links survive
wording changes.

## Creating or Revising Content

Before writing:

1. Identify target roles and interview formats.
2. Assign priority and a reading-time budget.
3. Check for overlap with existing concepts.
4. Decide whether the concept needs a full bundle, a single page, consolidation,
   or removal.

When adding a `core` or `high` concept, normally create the complete bundle and
update the parent topic index. When revising existing content, preserve useful
facts but do not preserve structure or length that conflicts with this guide.

## Quality Checklist

Before considering content complete, verify that:

- Priority reflects realistic interview value and controls depth.
- Reading time is within budget and front matter matches the content.
- The first minute gives the candidate the essential mental model.
- Every section contributes to recall, correct reasoning, or rehearsal.
- Guarantees and assumptions are distinguished.
- Interview short answers are direct and speakable.
- Broader Staff/Principal claims address genuine system or organizational scope.
- Parent and sibling links resolve; no placeholder content remains.
- Important claims are supported by current primary sources.
- Lower-priority detail has not displaced core preparation.
