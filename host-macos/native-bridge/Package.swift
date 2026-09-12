// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "WeaselNativeBridge",
    platforms: [
        .macOS(.v13)
    ],
    products: [
        .executable(name: "weasel-bridge", targets: ["WeaselNativeBridge"])
    ],
    targets: [
        .executableTarget(
            name: "WeaselNativeBridge",
            path: "Sources"
        )
    ]
)
