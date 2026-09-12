# ARCHITECTURE DECISION LOG — The Screen Weasels

This log records foundational architecture decisions, explicitly classifying them as verified facts, provisional engineering hypotheses, or design choices.

---

## 1. Embedded Graphics Stack
* **Selected Technology**: LovyanGFX (`lovyan03/LovyanGFX`) on PlatformIO / Arduino Core.
* **Status**: **PROVISIONAL IMPLEMENTATION HYPOTHESIS** (Pending Milestone 0 hardware verification).
* **Rationale**:
  * TFT_eSPI requires brittle global header editing (`User_Setup.h`) or cluttered `-D` flags in `platformio.ini`.
  * LVGL 9 has significant heap overhead (40–80 KB) and heavy vector memory requirements (ThorVG) unsuitable for 520 KB internal SRAM without PSRAM.
  * LovyanGFX isolates board pinouts cleanly in C++ code, provides direct DMA SPI acceleration, and includes integrated support for the CYD board profile.
* **Fallback / Pivot Path**: If LovyanGFX encounters compatibility issues on user's exact screen controller, pivot to modular TFT_eSPI or raw ESP-IDF SPI driver.

---

## 2. Vector Graphics Strategy (SVG vs. Parametric)
* **Selected Technology**: Constrained Procedural Vector Representation (on-device) + SVG (authoring/simulator).
* **Status**: **PROVISIONAL IMPLEMENTATION HYPOTHESIS** (Pending Milestone 0 framerate/heap benchmark).
* **Rationale**:
  * Parsing arbitrary SVG XML at runtime on an ESP32 with ~160 KB free heap under active Wi-Fi causes allocation thrashing and drops framerates to <10 FPS.
  * The Screen Weasel faces are composed of geometric primitives: eye contours, pupil circles, brow lines, mouth arcs, teeth polygons, and cheek accents.
  * Storing and animating parametric parameters (`pupilX`, `gazeY`, `mouthOpen`, `squashStretch`) allows 40–60 FPS rendering with zero dynamic heap allocations.
* **Fallback / Pivot Path**: If complex curves require pre-rasterized elements, use a hybrid approach of packed 1-bit or 4-bit alpha masks with dynamic color tinting.

---

## 3. World State Authority & Dual Shell Coordination
* **Selected Technology**: Mac Host-Authoritative State Engine.
* **Status**: **PROJECT DECISION**.
* **Rationale**:
  * The MacBook is present during operation.
  * Avoids complex distributed consensus or P2P mesh logic between two resource-constrained ESP32 chips.
  * The Mac manages the 9 persistent identities, migration between shells, external music indexing, and system audio capture.
  * CYD devices act as low-latency, responsive tactile display surfaces with local gaze/touch interpolation.

---

## 4. Network Transport
* **Selected Technology**: Local WebSocket (Mac as Server, CYDs as Clients).
* **Status**: **PROJECT DECISION**.
* **Rationale**:
  * Standard TCP WebSocket provides low latency (<5 ms on local Wi-Fi), framing, ping/pong keepalive, and predictable client reconnection.
  * Eliminates UDP packet ordering issues and NAT traversal complications.
  * Bandwidth is minimal (~3 KB/s per shell for 60 Hz Hand updates).

---

## 5. macOS Pointer Portal Mechanism
* **Selected Technology**: `CoreGraphics` `CGEventTap` + `CGWarpMouseCursorPosition` + `CGDisplayHideCursor`.
* **Status**: **PROVISIONAL IMPLEMENTATION HYPOTHESIS** (Pending Milestone 1 runtime permissions & edge testing).
* **Rationale**:
  * Native macOS event taps allow detecting when pointer coordinates approach screen bounds.
  * Hiding the system cursor and warping/pinning it prevents macOS mouse wander while virtual Hand coordinates are streamed to the CYD.
  * Requires Accessibility permission (`AXIsProcessTrustedWithOptions`).

---

## 6. System Audio Capture
* **Selected Technology**: Apple `ScreenCaptureKit` (`SCStream`) audio-only capture + `Accelerate.framework` (vDSP).
* **Status**: **PROVISIONAL IMPLEMENTATION HYPOTHESIS** (Pending Milestone 4 implementation).
* **Rationale**:
  * Modern Apple-supported API on macOS Sequoia that captures system audio (YouTube, Spotify, video) without third-party virtual audio cables (BlackHole, Soundflower).
  * vDSP provides zero-overhead hardware-accelerated FFT and RMS energy calculation on Apple Silicon.
