# OPERATIONAL STATE — The Screen Weasels

Project ID: screen-weasels
Revision: 1
Updated: 2026-09-17

## Scope
Two ESP32-2432S028R Screen Weasel shells coordinated by a macOS host with shared TypeScript protocol, browser simulator, native bridge, and firmware renderer.

## Current baseline
- Baseline branch: main @ 49d8f88dd1e935c6b5a0c7593d77867f7fce9620.
- Existing cursor/Hand portal behavior, continuous gaze, procedural face rendering, typed protocol, simulator, and firmware paths are protected.
- Existing fixture identities remain provisional; no final cast names or personalities are introduced here.
- Current renderer semantics include idle, curious, startled, suspicious, singing, and struggling.
- Current firmware receives HAND_UPDATE and FACE_SYNC; Hand rendering and local touch gaze are already implemented.

## Active invariants
- INV-01: Preserve continuous gazeX/gazeY. Do not replace it with coarse sprite-direction lookup.
- INV-02: Preserve the black-void visual law and procedural renderer.
- INV-03: The semantic Familiar Bus is not a personality engine and must not define canon/personality.
- INV-04: Host/protocol/simulator/firmware remain separable; no React/browser runtime is introduced to ESP32 firmware.
- INV-05: Existing message types and old FACE_SYNC payloads remain backward-compatible.
- INV-06: No hardware flashing is implied by source changes; firmware behavior remains unverified until compiled/flashed/tested.

## Active work
Familiar Bus foundation:
1. Add shared semantic attention/reaction/trigger signal contract.
2. Add deterministic arbitration/TTL behavior in TypeScript.
3. Adapt semantic state onto FaceState without replacing existing facial state.
4. Wire simulator Hand/touch-like interactions to semantic reactions.
5. Extend firmware structures/rendering to consume semantic state when provided.
6. Add tests and documentation.
7. Run repository validation when an execution environment is available.

## Evidence state
- Source baseline: inspected.
- Runtime behavior on physical CYD: current baseline previously documented, not re-verified in this change.
- Familiar Bus implementation: pending.
- Full pnpm validate after Familiar Bus changes: pending.

## Prohibited collateral changes
- Do not rename provisional fixture identities.
- Do not redesign the Hand portal.
- Do not remove existing protocol messages.
- Do not replace LovyanGFX or the existing firmware architecture.
