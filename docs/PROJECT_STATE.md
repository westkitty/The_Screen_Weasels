# PROJECT STATE — The Screen Weasels

Last Updated: Scaffold Audit Repair Pass
Current Branch: main
Current Milestone: Milestone 0 (Hardware Proof) Diagnostic Scaffolding

---

## 1. Reality Matrix: Explicit Verification Boundaries

| Subsystem / Layer | Current Status | Category | Evidence / Notes |
| :--- | :--- | :--- | :--- |
| **Git Repository & Remote** | Verified | **VERIFIED BY AUTOMATED TEST** | Connected to authoritative remote `westkitty/The_Screen_Weasels`. Local and remote `main` branch synchronized. |
| **Protocol Schemas & Serialization** | Verified | **VERIFIED BY AUTOMATED TEST** | Zod schemas for Hand, SyncedFace, Audio, ShellHello, Touch, and discriminated envelope pass 5 unit tests. |
| **Host-Shell Mock Integration** | Verified | **VERIFIED BY AUTOMATED TEST** | Automated integration test (`tools/integration-test.ts`) verifies WebSocket handshake, `SHELL_HELLO`, `FACE_SYNC`, `TOUCH_EVENT`, and rejection of malformed packets. |
| **Desktop Simulator** | Functional | **SIMULATOR RUNTIME VERIFIED** | Dual 320x240 viewports running Vite engine with time-based kinematics, fast sweep startle ($v > 350\text{ px/s}$), startle pupil dilation, slow approach curiosity, dwell settling ($v < 25\text{ px/s}$ for $> 0.6\text{s}$), and scheduled idle gaze drift (1.5–3.5s). |
| **Swift Native Bridge** | Compiles Cleanly | **COMPILED ONLY** | `weasel-bridge` compiles and links against `CoreGraphics` and `Accelerate` on Apple Silicon. Runtime `CGEventTap` and `ScreenCaptureKit` permissions unverified. |
| **ESP32 Firmware** | Compiles Cleanly | **COMPILED ONLY** | PlatformIO headless compile builds `esp32dev` binary with LovyanGFX, ArduinoJson, and Arduino Core. Zero warnings, no `-D BOARD_HAS_PSRAM=0` macro. |
| **Physical CYD Display & Touch** | Pending Hardware Flash | **PHYSICAL HARDWARE UNVERIFIED** | Firmware has NOT yet been uploaded to physical boards. Display controller (ILI9341 vs ST7789) and XPT2046 touch calibration remain unverified. |
| **Physical Wi-Fi Radio on CYD** | Pending Hardware Flash | **PHYSICAL HARDWARE UNVERIFIED** | M0 Wi-Fi diagnostic code prepared in `firmware/src/main.cpp` with `wifi_secrets.example.h` template; unexecuted on silicon. |
| **CYD Board Pinout & Polarity** | Unproven on exact silicon | **PROVISIONAL HARDWARE ASSUMPTION** | Isolated in `firmware/include/board_config.h` pending Milestone 0 serial diagnostics. |
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

Once the software repair pass completes:
1. Connect ONE physical ESP32 CYD board via USB-C to MacBook Air M1.
2. Run `python3 tools/cyd-probe.py` to identify the serial port.
3. Flash Milestone 0 diagnostic firmware without modifying production code.
