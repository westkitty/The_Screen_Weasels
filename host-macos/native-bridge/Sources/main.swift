import Foundation
import Darwin
import CoreGraphics

struct MachineHandState: Encodable {
    let active: Bool
    let shellId: String
    let x: Double
    let y: Double
    let vx: Double
    let vy: Double
    let clicked: Bool
    let edgeGlow: Double
}

func emitMachineHand(
    active: Bool,
    screenY: CGFloat,
    dx: Int64,
    dy: Int64
) {
    let bounds = CGDisplayBounds(CGMainDisplayID())

    let relativeY =
        (screenY - bounds.minY) /
        max(bounds.height, 1.0)

    let handY =
        max(
            0.0,
            min(
                240.0,
                Double(relativeY) * 240.0
            )
        )

    let hand = MachineHandState(
        active: active,
        shellId: "shell_a",
        x: 0.0,
        y: handY,
        vx: Double(dx),
        vy: Double(dy),
        clicked: false,
        edgeGlow: active ? 1.0 : 0.0
    )

    let encoder = JSONEncoder()

    if
        let data = try? encoder.encode(hand),
        let json = String(data: data, encoding: .utf8)
    {
        print("WEASEL_HAND \(json)")
    }
}

setbuf(stdout, nil)

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
    portal.startMonitoring(
        onCrossing: { x, y in
            print(
                "[Portal] Crossing candidate " +
                "at x=\(Int(x)) y=\(Int(y))"
            )
        },
        onEdgeState: { active, _, y, dx, dy in
            emitMachineHand(
                active: active,
                screenY: y,
                dx: dx,
                dy: dy
            )
        }
    )

    print(
        "[Portal] Move the cursor against the \(edge.rawValue) edge."
    )
    print(
        "[Portal] Move away and touch it again. Ctrl-C exits."
    )

    RunLoop.main.run()
}
