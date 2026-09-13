import Foundation
import CoreGraphics
import ApplicationServices

public enum PortalEdge: String {
    case left
    case right
    case top
    case bottom
}

private func cursorPortalEventCallback(
    proxy: CGEventTapProxy,
    type: CGEventType,
    event: CGEvent,
    refcon: UnsafeMutableRawPointer?
) -> Unmanaged<CGEvent>? {
    guard let refcon else {
        return Unmanaged.passUnretained(event)
    }

    let monitor = Unmanaged<CursorPortalMonitor>
        .fromOpaque(refcon)
        .takeUnretainedValue()

    monitor.handle(
        type: type,
        event: event
    )

    return Unmanaged.passUnretained(event)
}

public final class CursorPortalMonitor {
    public private(set) var isEdgeGlowActive = false

    private var eventTap: CFMachPort?
    private var runLoopSource: CFRunLoopSource?
    private var crossingHandler: ((CGFloat, CGFloat) -> Void)?
    private var edgeStateHandler: ((Bool, CGFloat, CGFloat, Int64, Int64) -> Void)?
    private var sawFirstMouseEvent = false

    private let edge: PortalEdge
    private let threshold: CGFloat

    public init(
        edge: PortalEdge = .right,
        threshold: CGFloat = 3.0
    ) {
        self.edge = edge
        self.threshold = threshold
    }

    public func checkAccessibilityPermissions(
        prompt: Bool = true
    ) -> Bool {
        let key =
            kAXTrustedCheckOptionPrompt
                .takeUnretainedValue() as String

        let options = [
            key: prompt
        ] as CFDictionary

        return AXIsProcessTrustedWithOptions(options)
    }

    public func startMonitoring(
        onCrossing: @escaping (CGFloat, CGFloat) -> Void,
        onEdgeState: ((Bool, CGFloat, CGFloat, Int64, Int64) -> Void)? = nil
    ) {
        guard checkAccessibilityPermissions() else {
            print(
                "[Portal] Accessibility permission not granted."
            )
            return
        }

        crossingHandler = onCrossing
        edgeStateHandler = onEdgeState

        let eventMask =
            (CGEventMask(1) << CGEventType.mouseMoved.rawValue) |
            (CGEventMask(1) << CGEventType.leftMouseDragged.rawValue) |
            (CGEventMask(1) << CGEventType.rightMouseDragged.rawValue) |
            (CGEventMask(1) << CGEventType.otherMouseDragged.rawValue)

        guard let tap = CGEvent.tapCreate(
            tap: .cgSessionEventTap,
            place: .headInsertEventTap,
            options: .listenOnly,
            eventsOfInterest: eventMask,
            callback: cursorPortalEventCallback,
            userInfo: Unmanaged.passUnretained(self).toOpaque()
        ) else {
            print(
                "[Portal] ERROR: Could not create CGEventTap."
            )
            return
        }

        eventTap = tap

        guard let source = CFMachPortCreateRunLoopSource(
            kCFAllocatorDefault,
            tap,
            0
        ) else {
            print(
                "[Portal] ERROR: Could not create run-loop source."
            )
            eventTap = nil
            return
        }

        runLoopSource = source

        CFRunLoopAddSource(
            CFRunLoopGetMain(),
            source,
            .commonModes
        )

        CGEvent.tapEnable(
            tap: tap,
            enable: true
        )

        print(
            "[Portal] Cursor monitor ACTIVE."
        )
        print(
            "[Portal] Edge: \(edge.rawValue), threshold: \(threshold) px"
        )
    }

    fileprivate func handle(
        type: CGEventType,
        event: CGEvent
    ) {
        if (
            type == .tapDisabledByTimeout ||
            type == .tapDisabledByUserInput
        ) {
            let reason =
                type == .tapDisabledByTimeout
                ? "timeout"
                : "user-input"

            print(
                "[Portal] WARNING: Event tap disabled " +
                "reason=\(reason); re-enabling."
            )

            if let tap = eventTap {
                CGEvent.tapEnable(
                    tap: tap,
                    enable: true
                )
            }

            return
        }

        let point = event.location
        let bounds = CGDisplayBounds(CGMainDisplayID())

        if !sawFirstMouseEvent {
            sawFirstMouseEvent = true

            print(
                "[Portal] Mouse stream ACTIVE " +
                "first=(\(Int(point.x)),\(Int(point.y))) " +
                "display=(\(Int(bounds.minX)),\(Int(bounds.minY)))" +
                "-(\(Int(bounds.maxX)),\(Int(bounds.maxY)))"
            )
        }

        let dx = event.getIntegerValueField(
            .mouseEventDeltaX
        )

        let dy = event.getIntegerValueField(
            .mouseEventDeltaY
        )

        let atEdge: Bool

        switch edge {
        case .left:
            atEdge =
                point.x <= bounds.minX + threshold

        case .right:
            atEdge =
                point.x >= bounds.maxX - threshold

        case .top:
            atEdge =
                point.y <= bounds.minY + threshold

        case .bottom:
            atEdge =
                point.y >= bounds.maxY - threshold
        }

        if atEdge && !isEdgeGlowActive {
            isEdgeGlowActive = true

            print(
                "[Portal] EDGE_ENTER " +
                "edge=\(edge.rawValue) " +
                "x=\(Int(point.x)) " +
                "y=\(Int(point.y)) " +
                "dx=\(dx) dy=\(dy)"
            )

            crossingHandler?(
                point.x,
                point.y
            )

            edgeStateHandler?(
                true,
                point.x,
                point.y,
                dx,
                dy
            )
        }

        if !atEdge && isEdgeGlowActive {
            isEdgeGlowActive = false

            edgeStateHandler?(
                false,
                point.x,
                point.y,
                dx,
                dy
            )

            print(
                "[Portal] EDGE_EXIT " +
                "edge=\(edge.rawValue)"
            )
        }
    }

    public func stopMonitoring() {
        if let tap = eventTap {
            CGEvent.tapEnable(
                tap: tap,
                enable: false
            )
        }

        if let source = runLoopSource {
            CFRunLoopRemoveSource(
                CFRunLoopGetMain(),
                source,
                .commonModes
            )
        }

        runLoopSource = nil
        eventTap = nil

        print("[Portal] Cursor monitor stopped.")
    }
}
