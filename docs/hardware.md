# HARDWARE SPECIFICATION — ESP32-2432S028R ("Cheap Yellow Display")

> **IMPORTANT**: Exact wiring varies across production batches. All constants below are isolated in `firmware/include/board_config.h` and must be verified empirically in Milestone 0.

---

## 1. Typical CYD 2.8" Pin Assignment Table

| Function | Pin (GPIO) | Notes / Quirk |
| :--- | :--- | :--- |
| **TFT MOSI** | GPIO 13 | SPI Master Out |
| **TFT MISO** | GPIO 12 | SPI Master In |
| **TFT SCLK** | GPIO 14 | SPI Clock |
| **TFT CS** | GPIO 15 | Active Low |
| **TFT DC / RS** | GPIO 2 | Data / Command |
| **TFT Backlight** | GPIO 21 | PWM controlled (`ledc`). Active polarity varies by batch. |
| **Touch CS** | GPIO 33 | XPT2046 SPI Chip Select |
| **Touch SCK** | GPIO 25 | Dedicated touch SPI clock |
| **Touch MOSI** | GPIO 32 | Dedicated touch SPI data out |
| **Touch MISO** | GPIO 39 | Dedicated touch SPI data in (Input only) |
| **Touch IRQ** | GPIO 36 | Touch interrupt (Input only) |
| **RGB LED Red** | GPIO 4 | Built-in rear RGB LED (Active Low) |
| **RGB LED Green** | GPIO 16 | Built-in rear RGB LED (Active Low) |
| **RGB LED Blue** | GPIO 17 | Built-in rear RGB LED (Active Low) |
| **Light Sensor (LDR)**| GPIO 34 | Analog input (ADC1_CH6) |
| **Audio Out** | GPIO 26 | PAM8302 mono amplifier input |
| **TF / SD Card CS** | GPIO 5 | MicroSD SPI CS |
| **TF / SD Card SCK**| GPIO 18 | MicroSD SPI Clock |
| **TF / SD Card MOSI**| GPIO 23 | MicroSD SPI MOSI |
| **TF / SD Card MISO**| GPIO 19 | MicroSD SPI MISO |

---

## 2. Hardware Quirks & Verifications Needed

1. **Display Controller (ILI9341 vs. ST7789v)**:
   * Most units ship with ILI9341.
   * If ST7789v is present, color inversion registers and row/column offsets (e.g. 0 vs 20 pixel offset) must be configured in LovyanGFX.
2. **Backlight Inversion**:
   * Some boards require `ledcWrite(0, 255)` for 100% brightness; others require `ledcWrite(0, 0)`.
3. **Touch Coordinate Orientation**:
   * Resistive touch sensors output raw ADC values (typically ~300 to ~3800).
   * A 2-point or 4-point calibration step is required to map raw X/Y to 320x240 display coordinates.
4. **USB-C Data Lines**:
   * Verify whether the USB-C port is data+power or power-only (some early units have micro-USB for UART and USB-C for power).
   * If the user's unit has single/dual USB-C, verify connection to the CH340 / CP2102 chip.
