---
title: "Arrays: Interview Questions"
domain: "Swift"
topic: "Collection Types"
concept: "Arrays"
page_type: interview
levels:
  - senior
interview_priority: high
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-06-22
---

# Arrays: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do value semantics and copy-on-write work together?](#q1-how-do-value-semantics-and-copy-on-write-work-together) | Senior | Copy behavior |
| [Does copying an array copy its objects?](#q2-does-copying-an-array-copy-its-objects) | Senior | Element semantics |
| [What should you know about `ArraySlice`?](#q3-what-should-you-know-about-array-slice) | Senior | Indices and storage |
| [When is an array the wrong collection?](#q4-when-is-an-array-the-wrong-collection) | Senior | Representation choice |

---

<a id="q1-how-do-value-semantics-and-copy-on-write-work-together"></a>
## Q1: How Do Value Semantics and Copy-on-Write Work Together?

### Short Answer

Array copies are independent logical values. Swift may share storage until one
copy mutates, then create separate storage before exposing the change.

### Expanded Answer

Copy-on-write avoids unnecessary physical copies. It is not a thread-safety
mechanism and code should not depend on storage identity.

---

<a id="q2-does-copying-an-array-copy-its-objects"></a>
## Q2: Does Copying an Array Copy Its Objects?

### Short Answer

No. When elements are class references, the new array contains copies of those
references. Both arrays can still refer to the same instances.

---

<a id="q3-what-should-you-know-about-array-slice"></a>
## Q3: What Should You Know About `ArraySlice`?

### Short Answer

It is a view that keeps the original indices and may retain the original storage.
Convert it to `Array` for zero-based indices or independent long-term storage.

---

<a id="q4-when-is-an-array-the-wrong-collection"></a>
## Q4: When Is an Array the Wrong Collection?

### Short Answer

Use a set when uniqueness and membership dominate. Use a dictionary for frequent
key-based lookup. Use a different data structure when frequent front insertion
or stable positional identity is required.
