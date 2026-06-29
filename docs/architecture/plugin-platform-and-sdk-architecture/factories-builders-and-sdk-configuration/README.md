---
title: "Factories, Builders, and SDK Configuration"
domain: "Architecture"
topic: "Plugin, Platform, and SDK Architecture"
page_type: concept-index
levels:
  - staff
  - principal
interview_priority: situational
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-29
---

# Factories, Builders, and SDK Configuration

> SDK construction patterns exist to make valid setup easy and invalid setup hard.
> Factories, builders, and configuration objects should encode lifecycle,
> dependency, environment, and validation rules instead of exposing a bag of
> mutable options.

## Quick Recall

- Use a configuration object for stable client-supplied setup values.
- Use a builder when setup has many optional choices or staged validation.
- Use a factory when construction must hide implementation selection or enforce
  environment-specific dependencies.
- Keep runtime capabilities separate from one-time configuration.
- Fail early for invalid setup, with errors that identify what the client must
  change.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

