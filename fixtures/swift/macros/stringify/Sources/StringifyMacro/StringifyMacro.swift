@freestanding(expression)
public macro stringify<T>(_ value: T) -> (value: T, source: String) =
    #externalMacro(module: "StringifyMacroPlugin", type: "StringifyMacro")
