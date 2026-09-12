# THE SCREEN WEASELS

> **Two neighboring physical worlds inhabited by persistent, silent, colored geometric entities.**

The Screen Weasels are two ESP32-2432S028R ("Cheap Yellow Display" / CYD) 320x240 screens sitting alongside a MacBook. They do not know they are inside displays. They do not understand that a human owns the hardware. They exist in a black void, communicating through position, gaze, timing, facial expression, and proximity.

The macOS cursor can cross over the screen border into their world as an outside force—the **Hand**—triggering a perimeter edge-glow, curiosity, startle reactions, and physical grab/throw interactions.

---

## Core Premise & Visual Law

* **The World**: Black Void (`#000000`) + Silent Colored Faces.
* **The Entities**: Nine persistent identities with stable visual traits, color signatures, and autonomous personality seeds (currently using provisional development fixtures; final cast to be chosen by Andrew).
* **Established Discovery Anchor**: A green face with an orange nose/accents and sharp teeth (`fixture_weasel_01`).
* **No Fourth Wall**: No speech bubbles, no dialogue, no XP, no chores, no pet-health meters, no AI chat wrappers.
* **The Hand**: The Mac pointer seamlessly crosses the display boundary into the CYD screen.
* **Audio Reactivity**: Creatures respond expressively to whatever is playing on the Mac (YouTube, music, video).
* **Media Mode**: Either shell can switch into a tactile physical media controller, shunting creatures to the twin shell.

---

## Unified Validation Gate

Before any hardware flashing or milestone progression, the entire system is validated by a single root command:

```bash
pnpm validate
```

This gate runs:
1. **Protocol Schema Tests**: Zod schema boundary validation and `FACE_SYNC` round-trip tests.
2. **Protocol Package Build**: TypeScript compilation of `@screen-weasels/protocol`.
3. **Host Daemon Build**: TypeScript compilation of `@screen-weasels/host`.
4. **Simulator Production Build**: Production Vite compilation of `@screen-weasels/simulator`.
5. **Diagnostic Tools Build**: TypeScript compilation of `@screen-weasels/tools`.
6. **Swift Native Bridge**: Compiles `weasel-bridge` on macOS.
7. **ESP32 Firmware Compilation**: Headless PlatformIO build of the CYD firmware (COMPILE ONLY).
8. **Integration Smoke Test**: Automated handshake, typed sync, and error rejection between host and mock shell.

---

## Quick Start (Development Simulator)

```bash
# Install workspace dependencies
pnpm install

# Run the complete validation suite
pnpm validate

# Launch the Dual-Shell Desktop Simulator
pnpm simulator
```

---

## Repository Structure

```
The_Screen_Weasels/
├── docs/               # Technical specs, hardware pinouts, decision records, performance logs
│   ├── PROJECT_STATE.md
│   ├── DECISIONS.md
│   ├── PERFORMANCE.md
│   ├── architecture.md
│   ├── hardware.md
│   ├── protocol.md
│   ├── face-system.md
│   ├── test-plan.md
│   └── demos/
├── protocol/           # Shared Zod schemas, TypeScript types, and packet serialization
├── simulator/          # Dual-shell 320x240 web simulator (Vite + Canvas/SVG)
├── host-macos/         # Mac coordinator daemon (Node.js/TS) & native bridge (Swift)
├── firmware/           # ESP32 CYD firmware (PlatformIO + LovyanGFX provisional stack)
├── tools/              # Mock device, mock host, integration tests, serial port probe
└── assets/             # Reference vectors and assets
```
