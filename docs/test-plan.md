# TEST & VERIFICATION PLAN — The Screen Weasels

Every milestone requires empirical verification across automated tests, simulator checks, and physical hardware gates.

---

## 1. Automated Verification Suite
* **Protocol Serialization**:
  * Command: `pnpm test`
  * Verifies Zod schema parsing, field boundaries, and round-trip JSON serialization.
* **Simulator Build**:
  * Command: `pnpm --filter @screen-weasels/simulator build`
  * Verifies TypeScript compilation and bundle generation for the web engine.

---

## 2. Milestone Verification Matrix

| Milestone | Automated Test | Simulator Test | Hardware Verification |
| :--- | :--- | :--- | :--- |
| **M0: Hardware Proof** | Protocol unit tests pass | N/A | CYD boots, logs chip info, renders living face, tracks touch. |
| **M1: Cursor Portal** | Schema validates HandState | Mock hand edge entry & velocity test | Pointer crosses Mac edge -> CYD edge glows -> Face snaps gaze. |
| **M2: Hand Physics** | Physics math unit tests | Grab, drag, throw, momentum release | Touch/Mouse grabs face on CYD; throw flings face across display. |
| **M3: Two Worlds** | Dual shell session routing | Simulated migration between windows | Face disappears from Shell A, seamlessly appears on Shell B. |
| **M4: Audio React** | FFT bucket unit tests | Audio mock generates beat/energy frames | Real music on Mac causes rhythmic head-bobs & fake singing. |
| **M5: Media Mode** | Media control state tests | Media UI toggle in simulator | Shell A becomes tactile media player; creatures shunt to Shell B. |
