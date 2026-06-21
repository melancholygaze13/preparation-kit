# Stringify Macro Fixture

This package verifies three macro boundaries against the installed Swift toolchain:

- the public macro declaration resolves its compiler plugin;
- exact source expansion remains stable;
- a separate consumer target compiles and executes the generated expression.

Run:

```sh
CLANG_MODULE_CACHE_PATH=/tmp/preparation-kit-clang-cache \
SWIFTPM_MODULECACHE_OVERRIDE=/tmp/preparation-kit-swiftpm-cache \
swift test

CLANG_MODULE_CACHE_PATH=/tmp/preparation-kit-clang-cache \
SWIFTPM_MODULECACHE_OVERRIDE=/tmp/preparation-kit-swiftpm-cache \
swift run StringifyMacroClient
```

The SwiftSyntax dependency line must move with the supported Swift toolchain. Treat that
change as a compatibility update, not an automatic dependency bump.
