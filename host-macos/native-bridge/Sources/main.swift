import Foundation

print("=== SCREEN WEASELS NATIVE BRIDGE ===")

let environment = ProcessInfo.processInfo.environment

let edgeName =
    environment["WEASEL_EDGE"]?
        .lowercased() ?? "right"

let edge =
    PortalEdge(rawValue: edgeName) ?? .right

let portal = CursorPortalMonitor(
    edge: edge,
    threshold: 3.0
)

let hasPermissions =
    portal.checkAccessibilityPermissions()

print(
    "Accessibility Permission: " +
    (hasPermissions ? "GRANTED" : "NOT GRANTED / PENDING")
)

if hasPermissions {
    portal.startMonitoring { x, y in
        print(
            "[Portal] Crossing candidate " +
            "at x=\(Int(x)) y=\(Int(y))"
        )
    }

    print(
        "[Portal] Move the cursor against the \(edge.rawValue) edge."
    )
    print(
        "[Portal] Move away and touch it again. Ctrl-C exits."
    )

    RunLoop.main.run()
}
