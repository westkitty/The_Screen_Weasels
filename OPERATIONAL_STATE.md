# OPERATIONAL STATE — The Screen Weasels

Project ID: screen-weasels
Revision: 2
Updated: 2026-09-17

## Scope
Two ESP32-2432S028R Screen Weasel shells coordinated by a macOS host with shared TypeScript protocol, browser simulator, native bridge, and firmware renderer.

## Current baseline
- Baseline branch: main @ 49d8f88dd1e935c6b5a0c7593d77867f7fce9620.
- Active Familiar Bus implementation branch: feature/familiar-bus-foundation.
- Existing cursor/Hand portal behavior, continuous gaze, procedural face rendering, typed protocol, simulator, and firmware paths are protected.
- Existing fixture identities remain provisional; no final cast names or personalities are introduced here.
- Current renderer semantics include idle, curious, startled, suspicious, singing, and struggling.

## Active invariants
- INV-01: Preserve continuous gazeX/gazeY. Familiar Bus may carry a look hint but may not override existing gaze kinematics.
- INV-02: Preserve the black-void visual law and procedural renderer.
- INV-03: Familiar Bus is not a personality engine and must not define canon/personality/dialogue.
- INV-04: Host/protocol/simulator/firmware remain separable; no React/browser runtime is introduced to ESP32 firmware.
- INV-05: Existing message types and old FACE_SYNC payloads remain backward-compatible.
- INV-06: No hardware flashing is implied by source changes; physical-CYD behavior remains unverified until compiled/flashed/tested.

## Implemented on feature/familiar-bus-foundation
- IMP-01: Added renderer-neutral Familiar attention/reaction/trigger signal schema and TypeScript types.
- IMP-02: Added deterministic TTL/priority/sequence arbitration helpers.
- IMP-03: Added FAMILIAR_SIGNAL protocol message and bumped protocol version to 1.1.0.
- IMP-04: Kept FACE_SYNC backward-compatible with optional state.familiar.
- IMP-05: Added Hand-to-semantic classification while leaving continuous gaze authoritative.
- IMP-06: Added rapid-touch escalation: blink -> pleased -> irritated -> dizzy.
- IMP-07: Made macOS host authoritative for semantic arbitration and signal publication.
- IMP-08: Wired simulator reactions through a semantic adapter without replacing its procedural renderer.
- IMP-09: Mirrored the signal in firmware C++ structures and WebSocket parsing.
- IMP-10: Added firmware touch-event emission to the host; TOUCH_EVENT is now connected rather than schema-only.
- IMP-11: Added firmware reaction TTL expiry and 64-bit epoch timestamp storage.
- IMP-12: Added protocol regression tests and adapter documentation.
- IMP-13: Added branch validation workflow for TypeScript and PlatformIO builds.

## Evidence state
- Source baseline: inspected.
- Branch diff against main: inspected; changes are bounded to Familiar Bus, tests, docs, firmware transport, and operational state.
- Protocol tests: verified in GitHub Actions.
- Host, simulator, and tools TypeScript builds: verified in GitHub Actions.
- PlatformIO firmware compile: in progress in GitHub Actions.
- GitHub Actions workflow: active; TypeScript job passed on current head.
- macOS native bridge/runtime: unverified in this change.
- Physical CYD behavior: unverified in this change.
- Attempted disposable Linux validation: blocked because the runner cannot resolve github.com.
- MacBook-Air.local remote execution node: offline during this work.

## Pending validation
1. Run pnpm --filter @screen-weasels/protocol test.
2. Run pnpm --filter @screen-weasels/host build.
3. Run pnpm --filter @screen-weasels/simulator build.
4. Run pnpm --filter @screen-weasels/tools build.
5. Run platformio run -d firmware.
6. Run the existing full pnpm validate on the Mac when available.
7. Exercise Hand speed classes and four-touch escalation in simulator.
8. Flash only after compilation passes; verify CYD1 before touching CYD2.

## Prohibited collateral changes
- Do not rename provisional fixture identities.
- Do not redesign the Hand portal.
- Do not remove existing protocol messages.
- Do not replace LovyanGFX or the existing firmware architecture.
- Do not claim physical hardware verification from source inspection alone.

## Revision history
- r1: Initialized continuity guard for Familiar Bus work.
- r2: Recorded source-complete Familiar Bus foundation and explicit unverified validation state.
