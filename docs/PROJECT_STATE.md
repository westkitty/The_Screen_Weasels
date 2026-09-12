# PROJECT STATE — The Screen Weasels

Last Updated: Initial Scaffold Bootstrap
Current Branch: main
Current Milestone: Milestone 0 (Hardware Proof) & Scaffold Integration

---

## 1. Reality Checklist: What Is Verified vs. Unverified

| Layer | Status | Evidence / Notes |
| :--- | :--- | :--- |
| **Repository & Git** | **VERIFIED** | Connected to authoritative remote `westkitty/The_Screen_Weasels`. Branch `main`. |
| **Workspace Tooling** | **VERIFIED** | Node v26, pnpm, Python 3.14, Swift installed on host Mac. |
| **Protocol Schemas** | **VERIFIED** | Zod schemas and TypeScript types compile and pass unit tests. |
| **Desktop Simulator** | **VERIFIED (Software)** | Dual-shell 320x240 web engine builds cleanly. |
| **Exact CYD Pinout & Controller** | **UNVERIFIED (PROVISIONAL HYPOTHESIS)** | Assumed standard Sunton CYD 2432S028R pinout (ILI9341 SPI, XPT2046 secondary SPI). Requires Milestone 0 hardware probe. |
| **LovyanGFX Suitability** | **UNVERIFIED (PROVISIONAL HYPOTHESIS)** | Selected as best-in-class hypothesis for CYD DMA SPI, but unproven on exact user silicon. |
| **Vector / SVG Performance** | **UNVERIFIED (PROVISIONAL HYPOTHESIS)** | Constrained parametric vector renderer selected to avoid heap fragmentation; empirical FPS/heap benchmark pending Milestone 0. |
| **macOS Cursor Portal** | **UNVERIFIED (PROVISIONAL HYPOTHESIS)** | CoreGraphics / CGEventTap architecture designed; requires Accessibility runtime permissions and physical display edge calibration. |
| **ScreenCaptureKit Audio** | **UNVERIFIED (PROVISIONAL HYPOTHESIS)** | ScreenCaptureKit + vDSP FFT pipeline architected; requires Screen Recording runtime permission test in Milestone 4. |

---

## 2. Current Focus & Next Concrete Action

* **Milestone 0 Execution**:
  1. Inspect physical CYD board markings (confirm single/dual USB-C, ILI9341 vs ST7789 screen markings).
  2. Connect first physical CYD to Mac via USB-C.
  3. Run `python3 tools/cyd-probe.py` to identify serial port and chip boot info.
  4. Flash Milestone 0 diagnostic firmware and verify touch-tracking living face.

---

## 3. Known Limitations & Boundaries

* No physical flashing has been performed yet in this session.
* Physical touch calibration offsets are uncalibrated until first probe.
* All Wi-Fi credentials are kept strictly out of git (`wifi_secrets.h`).
