# PROJECT STATE — The Screen Weasels

Last Updated: 2026-09-13 — Milestone 1 Portal Visual Physically Approved
Current Branch: main
Current Milestone: Milestone 1 (Cursor Portal) — Portal Visual Approved; Virtual Continuation Pending

---

## 1. Reality Matrix: Explicit Verification Boundaries

| Subsystem / Layer | Current Status | Category | Evidence / Notes |
| :--- | :--- | :--- | :--- |
| **Git Repository & Remote** | Verified | **VERIFIED BY AUTOMATED TEST** | Connected to authoritative remote `westkitty/The_Screen_Weasels`. Local and remote `main` branch synchronized. |
| **Protocol Schemas & Serialization** | Verified | **VERIFIED BY AUTOMATED TEST** | Zod schemas for Hand, SyncedFace, Audio, ShellHello, Touch, and discriminated envelope pass 5 unit tests. |
| **Host-Shell Mock Integration** | Verified | **VERIFIED BY AUTOMATED TEST** | Automated integration test (`tools/integration-test.ts`) verifies WebSocket handshake, `SHELL_HELLO`, `FACE_SYNC`, `TOUCH_EVENT`, and rejection of malformed packets. |
| **Desktop Simulator** | Functional | **SIMULATOR RUNTIME VERIFIED** | Dual 320x240 viewports running Vite engine with time-based kinematics, fast sweep startle ($v > 350\text{ px/s}$), startle pupil dilation, slow approach curiosity, dwell settling ($v < 25\text{ px/s}$ for $> 0.6\text{s}$), and scheduled idle gaze drift (1.5–3.5s). |
| **Swift Native Bridge** | Cursor Runtime Verified | **PHYSICAL HOST VERIFIED** | Accessibility permission and `CGEventTap` cursor-edge capture physically verified. Background capture requires a pseudo-TTY; the Node host launches the bridge through `/usr/bin/script`. ScreenCaptureKit/audio remains unverified. |
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

### M1 Checkpoint — Physical Host/Shell Heartbeat

Verified on physical CYD #1:

- CYD #1 connected to the macOS host over the local LAN using WebSockets.
- `shell_a` sent a valid `SHELL_HELLO`.
- The host registered the physical shell.
- The host returned authoritative `FACE_SYNC`.
- CYD #1 parsed the response and identified `fixture_weasel_01`.
- The macOS host supports a runtime `WEASEL_PORT` override because port 8765
  is occupied locally by the Tailscale network extension.
- The verified development port on this Mac is 18765.

This proves bidirectional application-layer communication between the physical
shell and the Mac. Cursor-edge crossing and physical Hand rendering remain
pending.

### M1 Checkpoint — macOS Cursor Edge Detection

Verified on the MacBook Air:

- Accessibility permission is granted for the native bridge.
- A real CoreGraphics event tap receives mouse movement.
- The portal edge is runtime-configurable.
- The provisional right-edge threshold was physically exercised.
- Repeated `EDGE_ENTER` and `EDGE_EXIT` transitions were observed.
- Cursor coordinates and movement deltas were captured at the boundary.

This proves the host can detect the boundary where the macOS cursor transitions
into the Weasel-world Hand. Continued motion inside the Weasel world and
physical CYD Hand rendering remain pending.


### M1 Checkpoint — Physical Hand Transport

Verified end-to-end with physical CYD #1:

- The trusted macOS native bridge captures the configured right-edge event.
- Background CoreGraphics capture requires a pseudo-TTY on this Mac.
- The Node host launches the native bridge through `/usr/bin/script`.
- The bridge emits machine-readable `HandState` data.
- The host validates the Hand state against the shared protocol schema.
- The host broadcasts `HAND_UPDATE` over the existing WebSocket connection.
- Physical CYD #1 repeatedly receives `HAND_UPDATE`.
- Automated proof assertions passed for the macOS edge event, Node broadcast,
  and physical CYD receipt.

This proves the complete event-transport path from physical mouse movement,
through macOS CoreGraphics and the authoritative host, across Wi-Fi, to the
physical ESP32 shell.

This does not yet prove visible cursor continuation inside Weasel space.
Virtual Hand movement beyond the Mac edge, perimeter glow, face attention,
and physical gaze response remain pending.


### M1 Checkpoint — Physical Hand Rendering Proof

Verified on physical CYD #1:

- Physical `HAND_UPDATE` packets are decoded into firmware Hand state.
- The firmware main loop consumes Hand state and invokes the physical renderer.
- Serial instrumentation confirms active/inactive Hand transitions and mapped
  gaze values on the actual CYD.
- A deliberately high-visibility cyan diagnostic was physically rendered on
  CYD #1 in direct response to Mac cursor edge crossings.
- This verifies the complete path from physical Mac mouse movement through
  CoreGraphics, the native bridge, Node host, WebSocket/Wi-Fi transport,
  ESP32 parsing, Hand-state consumption, renderer invocation, and physical
  display writes.
- The native CoreGraphics bridge now reports the first received mouse event
  and can re-enable its event tap if macOS disables it.
- A less-obtrusive blue/cyan portal-halo implementation has been compiled and
  flashed to CYD #1 and receives correctly mapped vertical Hand positions.
- The localized blue/cyan portal seam and halo were physically reviewed on
  CYD #1 at multiple entry heights and approved on 2026-09-13. The effect is
  visible without overwhelming the black void, follows the cursor entry Y,
  reads as a localized opening rather than a HUD border, attracts the Weasel's
  eyes, and clears without observed stale pixels or corruption.
- Hand X remains at the entry boundary; continued virtual cursor movement
  inside Weasel space has not yet been implemented.
- CYD #2 has not been started and is explicitly deferred at this checkpoint.

Resume from CYD #1 by implementing continued virtual Hand movement beyond the
Mac edge using the physically approved portal effect unchanged.
Do not treat CYD #2 as the next automatic task.


Milestone 1 is the cursor portal:

1. Run the macOS host/bridge with required runtime permissions.
2. Establish the persistent LAN connection between the Mac host and CYD #1.
3. Detect the configured Mac display-edge crossing.
4. Represent the cursor as the Weasel-world Hand.
5. Verify perimeter glow, face attention, and gaze response on physical CYD #1.

The first M1 success condition is simple: the Mac cursor reaches the configured
screen edge and visibly enters the physical Weasel world.
