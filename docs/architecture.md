# ARCHITECTURE OVERVIEW — The Screen Weasels

The system coordinates two physical ESP32-2432S028R displays ("Screen Weasel A" and "Screen Weasel B") sitting adjacent to a host MacBook.

```
+-------------------------------------------------------------+
|                     macOS HOST DAEMON                       |
|                                                             |
|  - World State Coordinator (9 Persistent Face Identities)   |
|  - WebSocket Server (Port 8765)                             |
|  - Native Bridge Helper (Cursor Portal + ScreenCaptureKit)   |
+------------------------------+------------------------------+
                               |
               Local Wi-Fi WebSocket Broadcast
                               |
         +---------------------+---------------------+
         |                                           |
         v                                           v
+-----------------------------+     +-----------------------------+
|    SCREEN WEASEL SHELL A    |     |    SCREEN WEASEL SHELL B    |
|       (ESP32-2432S028R)     |     |       (ESP32-2432S028R)     |
|                             |     |                             |
| - LovyanGFX Driver Profile  |     | - LovyanGFX Driver Profile  |
| - Parametric Vector Engine  |     | - Parametric Vector Engine  |
| - XPT2046 Touch Reader      |     | - XPT2046 Touch Reader      |
| - Local Gaze Interpolator   |     | - Local Gaze Interpolator   |
+-----------------------------+     +-----------------------------+
```

---

## Subsystem Roles

1. **Protocol (`protocol/`)**:
   * Single source of truth for message schemas using Zod.
   * Shared by Host and Simulator; mirrored in C++ headers for Firmware.
2. **Desktop Simulator (`simulator/`)**:
   * Dual 320x240 viewports executing the exact same procedural rendering and behavioral equations as the firmware.
   * Enables rapid behavioral and aesthetic iteration without flashing.
3. **Firmware (`firmware/`)**:
   * Zero-dynamic-allocation render loop.
   * Dirty-rect clearing on the black void (`#000000`).
   * Handles local touch interaction, Wi-Fi keepalive, and WebSocket framing.
4. **macOS Host (`host-macos/`)**:
   * Runs the authoritative simulation and device coordinator.
   * Interfaces with Swift native bridge for global pointer monitoring and system audio capture.
