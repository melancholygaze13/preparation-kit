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
last_reviewed: 2026-07-12
tags:
  - sdk-configuration
  - factories
  - builders
---

# Factories, Builders, and SDK Configuration

> SDK construction is part of the public contract. Use the simplest entry point that
> makes valid setup obvious, validates required rules once, and gives resources a clear
> owner and lifetime.

## Quick Recall

- Prefer an initializer for a few required values. Add a configuration type or builder
  only when it encodes real choices or required validation.
- A factory hides implementation selection and dependency assembly; it should not become
  a service locator.
- Keep stable instance configuration separate from per-user and per-operation input.
- Define who owns long-lived tasks, caches, sessions, observers, and shutdown.
- Fail before runtime work when setup is invalid. Return typed, actionable, redacted
  diagnostics.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
