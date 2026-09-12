# DEMO 01: Milestone 1 — One-Face Cursor Portal

## Objective
Demonstrate the seamless cursor portal: moving the macOS mouse pointer off the MacBook screen edge and into the physical Screen Weasel world.

## Prerequisites
* macOS Host daemon running (`pnpm host`).
* One Screen Weasel CYD running Milestone 1 firmware and connected to local Wi-Fi.
* macOS Accessibility permission granted to the host portal tool.

## Execution Steps
1. Launch Host:
   ```bash
   pnpm host
   ```
2. Observe CYD connect and log `SHELL_HELLO`.
3. Move Mac cursor to the right display border.
4. Push past the border threshold.

## Expected Behavior
* Edge glow illuminates on CYD perimeter.
* Mac cursor disappears.
* Face gaze locks onto the Hand's entry point.
* Fast mouse motion startles the face (brows rise, mouth drops).
* Slow mouse motion produces gentle curiosity.
* Moving mouse back left exits the CYD and restores the normal macOS cursor.

## PASS Criteria
* Latency from border crossing to CYD edge glow is <50 ms.
* Transition feels like a continuous physical portal.
