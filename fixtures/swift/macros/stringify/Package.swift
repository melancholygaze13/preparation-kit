// swift-tools-version: 6.3

import CompilerPluginSupport
import PackageDescription

let package = Package(
    name: "StringifyMacroFixture",
    platforms: [.macOS(.v14)],
    products: [
        .library(name: "StringifyMacro", targets: ["StringifyMacro"]),
        .executable(name: "StringifyMacroClient", targets: ["StringifyMacroClient"]),
    ],
    dependencies: [
        .package(
            url: "https://github.com/swiftlang/swift-syntax.git",
            from: "603.0.0-latest"
        ),
    ],
    targets: [
        .macro(
            name: "StringifyMacroPlugin",
            dependencies: [
                .product(name: "SwiftCompilerPlugin", package: "swift-syntax"),
                .product(name: "SwiftSyntax", package: "swift-syntax"),
                .product(name: "SwiftSyntaxBuilder", package: "swift-syntax"),
                .product(name: "SwiftSyntaxMacros", package: "swift-syntax"),
            ]
        ),
        .target(
            name: "StringifyMacro",
            dependencies: ["StringifyMacroPlugin"]
        ),
        .executableTarget(
            name: "StringifyMacroClient",
            dependencies: ["StringifyMacro"]
        ),
        .testTarget(
            name: "StringifyMacroTests",
            dependencies: [
                "StringifyMacro",
                "StringifyMacroPlugin",
                .product(name: "SwiftSyntaxMacrosTestSupport", package: "swift-syntax"),
            ]
        ),
    ],
    swiftLanguageModes: [.v6]
)
