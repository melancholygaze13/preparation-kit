---
title: "Overloading, Type Subscripts, and API Evolution: Theory"
domain: "Swift"
topic: "Subscripts"
concept: "Overloading, Type Subscripts, and API Evolution"
page_type: theory
levels: [senior]
interview_priority: reference
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-07-22
---

# Overloading, Type Subscripts, and API Evolution: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Overload a subscript only when each form represents a clear lookup domain. Prefer
different index types or labels over return-type-only overloads, which depend on
context and can become ambiguous.

```swift
struct Catalog {
    let names: [String]

    subscript(position: Int) -> String {
        names[position]
    }

    subscript(named name: String) -> Int? {
        names.firstIndex(of: name)
    }
}

let catalog = Catalog(names: ["Book", "Pen"])
print(catalog[0])          // Book
print(catalog[named: "Pen"]!) // 1
```

Swift selects the overload from the arguments: the first takes `Int`; the second
takes a labeled `String`. This is easier to understand than overloads that differ
only in result type and require outside type context.

## Type Subscripts

Type subscripts use `static`. Classes can use `class` when overriding is an
intentional contract. A type subscript should describe lookup owned by the type;
it should not hide mutable global state or remote I/O.

```swift
enum HTTPStatus {
    static subscript(code: Int) -> String {
        switch code {
        case 200: "OK"
        case 404: "Not Found"
        default: "Unknown"
        }
    }
}

print(HTTPStatus[404]) // Not Found
```

The call uses the type name because no instance is involved.

## API Evolution

Adding an overload can change inference for existing source. Treat public
overloads as compatibility decisions and test representative client calls.
Prefer distinct index types or labels, and avoid changing an established subscript's
failure or complexity behavior silently.

## References

- [The Swift Programming Language: Subscript Options](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/subscripts/#Subscript-Options)
