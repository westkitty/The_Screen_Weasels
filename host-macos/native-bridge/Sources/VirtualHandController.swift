import CoreGraphics
import Foundation

public struct VirtualHandSnapshot: Equatable {
    public let active: Bool
    public let x: Double
    public let y: Double
    public let vx: Double
    public let vy: Double
    public let edgeGlow: Double
}

public enum PortalGeometry {
    public static func isAtEdge(
        point: CGPoint,
        bounds: CGRect,
        edge: PortalEdge,
        threshold: CGFloat
    ) -> Bool {
        let withinHorizontalSpan =
            point.x >= bounds.minX && point.x < bounds.maxX

        let withinVerticalSpan =
            point.y >= bounds.minY && point.y < bounds.maxY

        switch edge {
        case .left:
            return withinVerticalSpan &&
                point.x >= bounds.minX &&
                point.x <= bounds.minX + threshold
        case .right:
            return withinVerticalSpan &&
                point.x >= bounds.maxX - threshold &&
                point.x < bounds.maxX
        case .top:
            return withinHorizontalSpan &&
                point.y >= bounds.minY &&
                point.y <= bounds.minY + threshold
        case .bottom:
            return withinHorizontalSpan &&
                point.y >= bounds.maxY - threshold &&
                point.y < bounds.maxY
        }
    }
}

public final class VirtualHandController {
    private let horizontalSensitivity = 0.35
    private let verticalSensitivity = 0.50

    public private(set) var isActive = false

    private var x = 0.0
    private var y = 0.0
    private var accumulatedDX = 0.0
    private var accumulatedDY = 0.0
    private var hasPendingState = false

    public init() {}

    @discardableResult
    public func activate(
        entryScreenY: CGFloat,
        displayBounds: CGRect
    ) -> VirtualHandSnapshot {
        let relativeY =
            (entryScreenY - displayBounds.minY) /
            max(displayBounds.height, 1.0)

        isActive = true
        x = 0.0
        y = clamp(Double(relativeY) * 240.0, 0.0, 240.0)
        accumulatedDX = 0.0
        accumulatedDY = 0.0
        hasPendingState = true

        return currentSnapshot()
    }

    @discardableResult
    public func applyDelta(
        dx: Int64,
        dy: Int64
    ) -> Bool {
        guard isActive else {
            return false
        }

        let deltaX = Double(dx) * horizontalSensitivity
        let deltaY = Double(dy) * verticalSensitivity
        let nextX = x + deltaX

        accumulatedDX += deltaX
        accumulatedDY += deltaY
        y = clamp(y + deltaY, 0.0, 240.0)

        if deltaX < 0.0 && nextX <= 0.0 {
            x = 0.0
            isActive = false
        } else {
            x = clamp(nextX, 0.0, 320.0)
        }

        hasPendingState = true
        return !isActive
    }

    public func takePendingSnapshot() -> VirtualHandSnapshot? {
        guard hasPendingState else {
            return nil
        }

        let snapshot = currentSnapshot()
        accumulatedDX = 0.0
        accumulatedDY = 0.0
        hasPendingState = false
        return snapshot
    }

    public func currentSnapshot() -> VirtualHandSnapshot {
        VirtualHandSnapshot(
            active: isActive,
            x: x,
            y: y,
            vx: accumulatedDX,
            vy: accumulatedDY,
            edgeGlow: isActive ? 1.0 : 0.0
        )
    }

    private func clamp(
        _ value: Double,
        _ lower: Double,
        _ upper: Double
    ) -> Double {
        min(max(value, lower), upper)
    }
}
