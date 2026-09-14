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
    _ snapshot: VirtualHandSnapshot
) {
    let hand = MachineHandState(
        active: snapshot.active,
        shellId: "shell_a",
        x: snapshot.x,
        y: snapshot.y,
        vx: snapshot.vx,
        vy: snapshot.vy,
        clicked: false,
        edgeGlow: snapshot.edgeGlow
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

let handController = VirtualHandController()

func emitPendingHandState() {
    if let snapshot = handController.takePendingSnapshot() {
        emitMachineHand(snapshot)
    }
}

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
        onMouseEvent: { point, _, enteredEdge, dx, dy in
            if !handController.isActive {
                if enteredEdge {
                    handController.activate(
                        entryScreenY: point.y,
                        displayBounds: CGDisplayBounds(
                            CGMainDisplayID()
                        )
                    )
                    emitPendingHandState()
                }
                return
            }

            let deactivated = handController.applyDelta(
                dx: dx,
                dy: dy
            )

            if deactivated {
                emitPendingHandState()
            }
        }
    )

    let updateTimer = Timer(
        timeInterval: 1.0 / 60.0,
        repeats: true
    ) { _ in
        emitPendingHandState()
    }

    RunLoop.main.add(
        updateTimer,
        forMode: .common
    )

    print(
        "[Portal] Move the cursor against the \(edge.rawValue) edge."
    )
    print(
        "[Portal] Move away and touch it again. Ctrl-C exits."
    )

    RunLoop.main.run()
}
