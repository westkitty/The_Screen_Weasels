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

## 2. Removal of `-D BOARD_HAS_PSRAM=0` Macro
* **Decision**: Completely removed `-D BOARD_HAS_PSRAM=0` from `platformio.ini`.
* **Status**: **VERIFIED FIX**.
* **Rationale**:
  * In the ESP32 Arduino core (`esp32-hal-psram.c` / `esp32-hal-psram.h`) and associated board headers, checks are written as `#if defined(BOARD_HAS_PSRAM)` or `#ifdef BOARD_HAS_PSRAM`.
  * In C/C++ preprocessors, defining a macro to `0` still defines the symbol. Thus, `#ifdef BOARD_HAS_PSRAM` evaluates to **true**, erroneously triggering SPIRAM initialization attempts during boot.
  * Standard 2.8" ESP32-2432S028R boards do NOT have physical PSRAM populated.
  * We rely on runtime `psramFound()` checks and verified board configuration instead.

---

## 3. Vector Graphics Strategy (Parametric vs. Full SVG)
* **Selected Technology**: Constrained Procedural Vector Representation (on-device) + SVG (authoring/simulator).
* **Status**: **PROVISIONAL IMPLEMENTATION HYPOTHESIS** (Pending Milestone 0 framerate/heap benchmark).
* **Rationale**:
  * Parsing arbitrary SVG XML at runtime on an ESP32 with ~160 KB free heap under active Wi-Fi causes allocation thrashing and drops framerates to <10 FPS.
  * The Screen Weasel faces are composed of geometric primitives: eye contours, pupil circles, brow lines, mouth arcs, teeth polygons, and cheek accents.
  * Storing and animating parametric parameters (`pupilX`, `gazeY`, `mouthOpen`, `squashStretch`) allows 40–60 FPS rendering with zero dynamic heap allocations.

---

## 4. World State Authority & Dual Shell Coordination
* **Selected Technology**: Mac Host-Authoritative State Engine.
* **Status**: **PROJECT DECISION**.
* **Rationale**:
  * The MacBook is present during operation.
  * Avoids complex distributed consensus or P2P mesh logic between two resource-constrained ESP32 chips.
  * The Mac manages identity persistence, shell migration, external music indexing, and system audio capture.
  * CYD devices act as low-latency, responsive tactile display surfaces with local gaze/touch interpolation.

---

## 5. Network Transport & Typed Messages
* **Selected Technology**: Local WebSocket (Mac as Server, CYDs as Clients) with Zod Discriminated Union Envelope.
* **Status**: **VERIFIED IN SCAFFOLD**.
* **Rationale**:
  * Standard TCP WebSocket provides low latency (<5 ms on local Wi-Fi), framing, ping/pong keepalive, and predictable client reconnection.
  * Discriminated union envelope enforces message-specific payloads (`HAND_UPDATE` -> `HandState`, `FACE_SYNC` -> `FaceSyncPayload`), rejecting malformed payloads without crashing.

---

## 6. Provisional Test Fixtures vs. Canonical Cast
* **Decision**: All 9 entities (`fixture_weasel_01` .. `fixture_weasel_09`) are designated strictly as provisional development/test fixtures.
* **Status**: **PROJECT DECISION**.
* **Rationale**:
  * Andrew has not yet canonically chosen or approved the final names, palettes, and personalities of the 9 Screen Weasels.
  * The green face with orange accents (`fixture_weasel_01`) serves as the established discovery anchor.
  * Stable IDs are used across protocol and code rather than decorative names.
