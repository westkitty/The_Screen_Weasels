# PROJECT STATE — The Screen Weasels

Last Updated: 2026-09-12 — Milestone 0 Physical Hardware Proof
Current Branch: main
Current Milestone: Milestone 1 (Cursor Portal) — Ready to Begin

---

## 1. Reality Matrix: Explicit Verification Boundaries

| Subsystem / Layer | Current Status | Category | Evidence / Notes |
| :--- | :--- | :--- | :--- |
| **Git Repository & Remote** | Verified | **VERIFIED BY AUTOMATED TEST** | Connected to authoritative remote `westkitty/The_Screen_Weasels`. Local and remote `main` branch synchronized. |
| **Protocol Schemas & Serialization** | Verified | **VERIFIED BY AUTOMATED TEST** | Zod schemas for Hand, SyncedFace, Audio, ShellHello, Touch, and discriminated envelope pass 5 unit tests. |
| **Host-Shell Mock Integration** | Verified | **VERIFIED BY AUTOMATED TEST** | Automated integration test (`tools/integration-test.ts`) verifies WebSocket handshake, `SHELL_HELLO`, `FACE_SYNC`, `TOUCH_EVENT`, and rejection of malformed packets. |
| **Desktop Simulator** | Functional | **SIMULATOR RUNTIME VERIFIED** | Dual 320x240 viewports running Vite engine with time-based kinematics, fast sweep startle ($v > 350\text{ px/s}$), startle pupil dilation, slow approach curiosity, dwell settling ($v < 25\text{ px/s}$ for $> 0.6\text{s}$), and scheduled idle gaze drift (1.5–3.5s). |
| **Swift Native Bridge** | Compiles Cleanly | **COMPILED ONLY** | `weasel-bridge` compiles and links against `CoreGraphics` and `Accelerate` on Apple Silicon. Runtime `CGEventTap` and `ScreenCaptureKit` permissions unverified. |
| **ESP32 Firmware** | Running on CYD #1 | **PHYSICAL HARDWARE VERIFIED** | Firmware physically flashed, hash-verified, booted, and rendered successfully on ESP32-D0WD-V3 rev 3.1. |
| **Physical CYD Display & Touch** | Verified on CYD #1 | **PHYSICAL HARDWARE VERIFIED** | 240x320 native geometry, 320x240 landscape runtime, backlight, color order, XPT2046 touch, center, and all four corner regions physically verified. |
| **Physical Wi-Fi Radio on CYD** | Verified on CYD #1 | **PHYSICAL HARDWARE VERIFIED** | Successful association and DHCP; measured RSSI -60 dBm. Heap remained healthy after Wi-Fi initialization. |
| **CYD Board Pinout & Polarity** | Core M0 pins verified on exact unit | **PHYSICAL HARDWARE PARTIALLY VERIFIED** | Display, touch, and backlight mapping/polarity verified. Rear RGB LED, LDR, audio, and microSD remain physically untested. |
| **Nine Identities ("Target Cast")** | In Development | **PROVISIONAL TEST FIXTURES** | The 9 identities (`fixture_weasel_01` to `fixture_weasel_09`) are provisional simulator/test fixtures. Andrew has not yet canonically finalized the names, features, or personalities. Green face with orange nose/accents represents the established discovery anchor. |

---

## 2. Root Validation Command

All currently automatable tests and builds are unified under one single gate:
```bash
pnpm validate
```
This runs:
1. Protocol schema unit tests
2. Protocol TypeScript build
3. macOS host daemon build
4. Simulator production bundle
5. Diagnostic tools build
6. Swift native bridge compile
7. PlatformIO ESP32 firmware compile (COMPILE ONLY)
8. Host & mock shell integration test

---

## 3. Next Physical Action

Milestone 0 is complete on CYD #1.

Milestone 1 is the cursor portal:

1. Run the macOS host/bridge with required runtime permissions.
2. Establish the persistent LAN connection between the Mac host and CYD #1.
3. Detect the configured Mac display-edge crossing.
4. Represent the cursor as the Weasel-world Hand.
5. Verify perimeter glow, face attention, and gaze response on physical CYD #1.

The first M1 success condition is simple: the Mac cursor reaches the configured
screen edge and visibly enters the physical Weasel world.
