---
title: "Subscript Access and Domain Indexing: Theory"
domain: "Swift"
topic: "Subscripts"
concept: "Subscript Access and Domain Indexing"
page_type: theory
levels: [senior]
interview_priority: reference
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-22
---

# Subscript Access and Domain Indexing: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A subscript provides bracket-based access using one or more index values. Use it
when lookup feels like direct element access. Use a named method when the operation
has important effects, policy, I/O, or expensive work.

The API must define valid indices, complexity, mutation behavior, and failure.
Trapping is suitable for a programmer-contract violation. Return an optional or
use a throwing method when missing data is expected or input is untrusted.

An index belongs to the collection state that created it. Mutation can invalidate
saved indices even when their numeric representation still looks valid.

## References

- [The Swift Programming Language: Subscripts](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/subscripts/)
