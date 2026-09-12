# PERFORMANCE LOG — The Screen Weasels

Performance is an integral dimension of the Screen Weasels experience. A sluggish reaction destroys the illusion of autonomous life.

---

## 1. Target Benchmarks

| Metric | Target | Minimum Acceptable | Current Status |
| :--- | :--- | :--- | :--- |
| **Render Frame Rate (1 Face)** | 50–60 FPS | 30 FPS | Unmeasured (Hardware pending) |
| **Render Frame Rate (3 Faces)**| 40–50 FPS | 24 FPS | Unmeasured (Hardware pending) |
| **Render Frame Rate (9 Faces)**| 30 FPS | 20 FPS | Unmeasured (Hardware pending) |
| **Free Heap at Boot** | >300 KB | >250 KB | Unmeasured (Hardware pending) |
| **Free Heap with Wi-Fi + WS** | >140 KB | >100 KB | Unmeasured (Hardware pending) |
| **Hand Portal Latency** | <30 ms | <60 ms | Unmeasured (Software simulated: ~8ms) |
| **Wi-Fi Reconnect Recovery** | <2.0 s | <5.0 s | Unmeasured (Firmware mock: OK) |
| **Audio Feature Frame Rate** | 30 Hz | 20 Hz | Unmeasured (Host mock: OK) |

---

## 2. Empirical Benchmark Runs

*Entries will be appended here as physical tests are executed with exact numbers (heap, frame times, packet round trips).*

### Run 001: Initial Simulator Baseline
* Environment: MacBook Air M1, Node v26, Vite Chrome / Safari engine
* 1-Face Render Loop: 60.0 FPS (Canvas 2D / SVG parametric primitives)
* Hand Event Dispatch: <1 ms local IPC
* Simulated Network Latency: 2–4 ms (WebSocket loopback)
