import CoreGraphics
import XCTest
@testable import WeaselNativeBridge

final class VirtualHandControllerTests: XCTestCase {
    private let displayBounds = CGRect(
        x: -1440,
        y: 100,
        width: 1360,
        height: 768
    )

    func testRightEdgeRequiresSelectedDisplayVerticalSpan() {
        XCTAssertTrue(
            PortalGeometry.isAtEdge(
                point: CGPoint(x: -81, y: 484),
                bounds: displayBounds,
                edge: .right,
                threshold: 3
            )
        )

        XCTAssertFalse(
            PortalGeometry.isAtEdge(
                point: CGPoint(x: 500, y: 484),
                bounds: displayBounds,
                edge: .right,
                threshold: 3
            )
        )

        XCTAssertFalse(
            PortalGeometry.isAtEdge(
                point: CGPoint(x: -81, y: 900),
                bounds: displayBounds,
                edge: .right,
                threshold: 3
            )
        )
    }

    func testActivationMapsEntryYAndStartsAtZero() {
        let controller = VirtualHandController()
        let state = controller.activate(
            entryScreenY: 484,
            displayBounds: displayBounds
        )

        XCTAssertTrue(state.active)
        XCTAssertEqual(state.x, 0)
        XCTAssertEqual(state.y, 120, accuracy: 0.001)
        XCTAssertEqual(state.vx, 0)
        XCTAssertEqual(state.vy, 0)
    }

    func testDeltasMoveClampAndPreserveSignedVelocity() {
        let controller = VirtualHandController()
        controller.activate(
            entryScreenY: 484,
            displayBounds: displayBounds
        )
        _ = controller.takePendingSnapshot()

        controller.applyDelta(dx: 400, dy: 200)
        var state = controller.currentSnapshot()
        XCTAssertEqual(state.x, 140)
        XCTAssertEqual(state.y, 220)
        XCTAssertEqual(state.vx, 140)
        XCTAssertEqual(state.vy, 100)

        controller.applyDelta(dx: 600, dy: 100)
        state = controller.currentSnapshot()
        XCTAssertEqual(state.x, 320)
        XCTAssertEqual(state.y, 240)

        _ = controller.takePendingSnapshot()
        controller.applyDelta(dx: -20, dy: -500)
        state = controller.currentSnapshot()
        XCTAssertTrue(state.active)
        XCTAssertEqual(state.x, 313)
        XCTAssertEqual(state.y, 0)
        XCTAssertEqual(state.vx, -7)
        XCTAssertEqual(state.vy, -250)
    }

    func testReturnThroughZeroDeactivatesAndReentryResets() {
        let controller = VirtualHandController()
        controller.activate(
            entryScreenY: 484,
            displayBounds: displayBounds
        )
        controller.applyDelta(dx: 80, dy: 10)
        controller.applyDelta(dx: -90, dy: 5)

        var state = controller.currentSnapshot()
        XCTAssertFalse(state.active)
        XCTAssertEqual(state.x, 0)
        XCTAssertEqual(state.edgeGlow, 0)

        state = controller.activate(
            entryScreenY: 868,
            displayBounds: displayBounds
        )
        XCTAssertTrue(state.active)
        XCTAssertEqual(state.x, 0)
        XCTAssertEqual(state.y, 240)
        XCTAssertEqual(state.vx, 0)
        XCTAssertEqual(state.vy, 0)
    }

    func testPhysicalEdgeExitDoesNotDeactivateVirtualHand() {
        let controller = VirtualHandController()
        controller.activate(
            entryScreenY: 484,
            displayBounds: displayBounds
        )
        controller.applyDelta(dx: 100, dy: 0)
        controller.applyDelta(dx: -25, dy: 0)

        XCTAssertTrue(controller.currentSnapshot().active)
        XCTAssertEqual(
            controller.currentSnapshot().x,
            26.25,
            accuracy: 0.001
        )
    }
}
