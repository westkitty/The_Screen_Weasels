import Foundation

print("=== SCREEN WEASELS NATIVE BRIDGE ===")
let portal = CursorPortalMonitor()
let hasPerms = portal.checkAccessibilityPermissions()
print("Accessibility Permission: \(hasPerms ? "GRANTED" : "NOT GRANTED / PENDING")")
print("Native bridge ready for Milestone 1 cursor portal hook.")
