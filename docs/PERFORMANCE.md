# PERFORMANCE LOG — The Screen Weasels

Performance is an integral dimension of the Screen Weasels experience. A sluggish reaction destroys the illusion of autonomous life.

Every entry in this document is strictly categorized as one of:
- **TARGET**: Architectural requirement or design goal.
- **MEASURED**: Empirically measured with documented command, environment, method, and result.
- **UNMEASURED**: Pending future milestone execution.

---

## 1. Target Benchmarks vs. Current Reality

| Metric | Target / Expectation | Status | Empirical Evidence / Procedure |
| :--- | :--- | :--- | :--- |
| **Render Frame Rate (1 Face)** | 50–60 FPS | **UNMEASURED** | Pending Milestone 0 hardware flash on physical CYD. |
| **Render Frame Rate (3 Faces)**| 40–50 FPS | **UNMEASURED** | Pending Milestone 2 hardware execution. |
| **Render Frame Rate (9 Faces)**| 30 FPS | **UNMEASURED** | Pending Milestone 3 hardware execution. |
| **Free Heap at Boot** | >300 KB | **UNMEASURED** | Pending Milestone 0 serial boot diagnostics. |
| **Free Heap post-Wi-Fi** | >140 KB | **UNMEASURED** | Pending Milestone 0 Wi-Fi hardware test. |
| **Hand Portal Latency** | <30 ms (<60 ms max) | **UNMEASURED** | Pending Milestone 1 physical display edge crossing. |
| **Wi-Fi Reconnect Recovery** | <2.0 s | **UNMEASURED** | Pending Milestone 1 hardware network drop test. |
| **Audio Feature Rate** | 20–30 Hz | **UNMEASURED** | Pending Milestone 4 ScreenCaptureKit integration. |
| **Protocol Schema Validation** | <10 ms / 5 tests | **MEASURED** | Command: `pnpm --filter @screen-weasels/protocol test`<br>Env: MacBook Air M1, Node v26.7.0<br>Method: Node test runner executing 5 Zod schema and round-trip tests.<br>Result: 106.6 ms total process duration (~0.1–2.5 ms per test). |
| **Simulator Production Build** | Clean build <500 ms | **MEASURED** | Command: `pnpm --filter @screen-weasels/simulator build`<br>Env: MacBook Air M1, Vite 6.4.3<br>Method: Production bundle compilation.<br>Result: 113 ms bundle time, dist size: 4.17 kB HTML + 9.54 kB JS. |
| **Host-Shell Mock Integration**| Handshake + sync <500 ms| **MEASURED** | Command: `pnpm --filter @screen-weasels/tools run test:integration`<br>Env: MacBook Air M1, Node v26.7.0, WebSocket loopback (:8766)<br>Method: Host starts, connects mock shell, verifies SHELL_HELLO, validates FACE_SYNC, verifies TOUCH_EVENT, and rejects malformed packet.<br>Result: Passed in <350 ms. |
