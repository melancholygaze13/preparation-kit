---
title: "Dictionaries: Interview Questions"
domain: "Swift"
topic: "Collection Types"
concept: "Dictionaries"
page_type: interview
levels:
  - senior
interview_priority: high
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-08-12
---

# Dictionaries: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Why must dictionary keys be `Hashable`?](#q1-why-must-dictionary-keys-be-hashable) | Senior | Key lookup |
| [What does dictionary subscript optionality mean?](#q2-what-does-dictionary-subscript-optionality-mean) | Senior | Absence |
| [How should duplicate keys be merged?](#q3-how-should-duplicate-keys-be-merged) | Senior | Conflict policy |
| [When is a dictionary better than an array?](#q4-when-is-a-dictionary-better-than-an-array) | Senior | Representation choice |
| [Does reading with a default insert the key?](#q5-does-reading-with-a-default-insert) | Senior | Default subscript behavior |

---

<a id="q1-why-must-dictionary-keys-be-hashable"></a>
## Q1: Why Must Dictionary Keys Be `Hashable`?

### Short Answer

Hashing finds candidate storage efficiently, and equality confirms the key.
Equal keys must have equal hashes during one execution.

### Expanded Answer

Keys need stable equality while stored. Hash collisions are valid, and `hashValue`
is not a persistent identifier. A mutable reference key should use immutable identity
or be removed before identity-relevant mutation.

---

<a id="q2-what-does-dictionary-subscript-optionality-mean"></a>
## Q2: What Does Dictionary Subscript Optionality Mean?

### Short Answer

Lookup returns an optional because the key may not exist. Assigning `nil` through
the basic subscript removes the key.

### Expanded Answer

When the value type is optional, distinguish a missing key from a present key
whose value is `nil`. Outer `nil` removes the key; `.some(nil)` stores a present
optional `nil`. Avoid this model unless both states matter.

---

<a id="q3-how-should-duplicate-keys-be-merged"></a>
## Q3: How Should Duplicate Keys Be Merged?

### Short Answer

Choose a domain rule: keep the old value, take the new value, combine them, or
reject the conflict. Make the policy explicit at the merge boundary.

### Expanded Answer

Swift's merging APIs ask for a closure when duplicate keys appear. That closure is
business policy, not collection plumbing. It should be deterministic and should
preserve conflict evidence when silently choosing one value would lose information.

### Example

Refreshing a cache may take the newest record. Importing two configuration files with
the same key should often reject the conflict so one source does not silently win.

---

<a id="q4-when-is-a-dictionary-better-than-an-array"></a>
## Q4: When Is a Dictionary Better Than an Array?

### Short Answer

Use a dictionary for repeated lookup by a stable unique key. Use an array when
order, duplicates, or positional traversal are part of the model.

### Expanded Answer

A dictionary makes key uniqueness and key-based access part of the type. It does not
promise presentation order. If both fast lookup and stable order matter, keep one
authoritative model and derive an ordered view instead of letting two collections drift.

### Trade-offs

- Dictionary lookup is expected constant time but gives no stable iteration order.
- Arrays preserve order and duplicates but key lookup is normally linear.
- For very small data, the simpler representation can beat a more complex model.

---

<a id="q5-does-reading-with-a-default-insert"></a>
## Q5: Does Reading With a Default Insert the Key?

### Short Answer

No. `dictionary[key, default: value]` can return the default without changing
the dictionary. Mutating through that subscript, such as with `+=`, inserts the
default and then applies the mutation.

### Expanded Answer

The read-only form computes a fallback value for that access. A mutating access needs
storage to update, so Swift inserts the default for a missing key before applying the
mutation. This difference matters when an empty dictionary is used to count values.
