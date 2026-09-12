# DEMO 00: Milestone 0 — Hardware Proof

## Objective
Verify the physical ESP32-2432S028R hardware layer, confirm display controller, touch SPI communication, backlight behavior, and available heap.

## Prerequisites
* One ESP32-2432S028R board.
* USB-C cable connected directly to MacBook Air M1.
* Python 3 with `pyserial` installed (or `tools/cyd-probe.py`).

## Execution Steps
1. Run serial probe:
   ```bash
   python3 tools/cyd-probe.py
   ```
2. Build and flash firmware diagnostic:
   ```bash
   cd firmware
   pio run --target upload
   pio device monitor
   ```

## PASS Criteria
* Serial monitor outputs chip info: ESP32-D0WDQ6-V3, 240MHz, Flash 4MB.
* Free heap reported > 300KB before Wi-Fi.
* Display illuminates black void without backlight flicker.
* One colored procedural face renders in center of display.
* Touching display causes eyes to track finger position in real time.

## Known Limitations
* Uncalibrated touch offsets may have slight positional jitter.
* Wi-Fi credentials must be supplied via local config.
