# THE SCREEN WEASELS

> **Two neighboring physical worlds inhabited by persistent, silent, colored geometric entities.**

The Screen Weasels are two ESP32-2432S028R ("Cheap Yellow Display" / CYD) 320x240 screens sitting alongside a MacBook. They do not know they are inside displays. They do not understand that a human owns the hardware. They exist in a black void, communicating through position, gaze, timing, facial expression, and proximity.

The macOS cursor can cross over the screen border into their world as an outside force—the **Hand**—triggering a perimeter edge-glow, curiosity, startle reactions, and physical grab/throw interactions.

---

## Core Premise & Visual Law

* **The World**: Black Void (`#000000`) + Silent Colored Faces.
* **The Entities**: Nine persistent identities with stable visual traits, color signatures, and autonomous personality seeds.
* **No Fourth Wall**: No speech bubbles, no dialogue, no XP, no chores, no pet-health meters, no AI chat wrappers.
* **The Hand**: The Mac pointer seamlessly crosses the display boundary into the CYD screen.
* **Audio Reactivity**: Creatures respond expressively to whatever is playing on the Mac (YouTube, music, video).
* **Media Mode**: Either shell can switch into a tactile physical media controller, shunting creatures to the twin shell.

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
├── tools/              # Mock device, mock host, serial port diagnostics
└── assets/             # Reference vectors and assets
```

---

## Quick Start (Development Simulator)

```bash
# Install workspace dependencies
pnpm install

# Run protocol automated tests
pnpm test

# Launch the Dual-Shell Desktop Simulator
pnpm simulator
```

---

## Development Milestones

* **Milestone 0 — Hardware Proof**: Diagnostic flash on one CYD, verifying display controller, touch, Wi-Fi, and heap limits. Render first living face tracking touch.
* **Milestone 1 — One-Face Cursor Portal**: Mac pointer crosses screen threshold into physical CYD with perimeter edge lighting and velocity-dependent gaze reactions.
* **Milestone 2 — Hand Physics**: Click, grab, drag, momentum throw, and face struggle physics.
* **Milestone 3 — Two Worlds**: Twin shell coordination, 9 persistent identities, subtle migration.
* **Milestone 4 — They Hear**: ScreenCaptureKit system audio feature extraction driving personality-based music reactions.
* **Milestone 5 — Media Invasion**: Tactile playback controller surface on one screen, shunting creatures to twin.
