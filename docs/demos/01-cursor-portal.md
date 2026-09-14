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
   WEASEL_PORT=18765 pnpm host
   ```
2. Observe CYD connect and log `SHELL_HELLO`.
3. Move Mac cursor to the right display border.
4. Push past the border threshold.

## Expected Behavior
* The localized portal appears at the CYD's physical right seam and follows the entry Y position.
* The Hand activates at the seam and continued physical mouse deltas move it through the 320x240 CYD space.
* Horizontal, vertical, and diagonal motion remain bounded and directionally coherent.
* Face gaze follows the Hand's actual position.
* Reverse horizontal motion returns the Hand through the right seam and deactivates it.
* Re-entry starts at the new edge-entry Y without stale marker trails, flicker, or display corruption.
* The ordinary macOS pointer may remain visible; cursor hiding and confinement are later polish, not Milestone 1 requirements.

## PASS Criteria
* The right-edge portal and moving Hand remain responsive and visually continuous on physical CYD #1.
* The Hand reaches the useful width and height, gaze follows it, return deactivates cleanly, and repeated entries remain stable.
* Physical observation, not host or serial logs alone, determines the visual pass.
