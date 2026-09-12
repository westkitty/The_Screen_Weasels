#pragma once
#include <Arduino.h>

/**
 * ============================================================================
 * BOARD CONFIGURATION — ESP32-2432S028R ("Cheap Yellow Display" / CYD)
 * ============================================================================
 * NOTE: All pin assignments below are PROVISIONAL implementation hypotheses
 * based on standard Sunton CYD 2.8" schematics. Empirical verification takes
 * place in Milestone 0.
 */

// Display Controller (Default: ILI9341 over SPI)
#define CYD_TFT_MOSI     13
#define CYD_TFT_MISO     12
#define CYD_TFT_SCLK     14
#define CYD_TFT_CS       15
#define CYD_TFT_DC        2
#define CYD_TFT_RST      -1  // Connected to EN
#define CYD_TFT_BL       21  // Backlight PWM (active polarity to be verified)

#define CYD_SCREEN_WIDTH  240
#define CYD_SCREEN_HEIGHT 320

// Touch Controller (XPT2046 on dedicated SPI pins)
#define CYD_TOUCH_CS     33
#define CYD_TOUCH_SCK    25
#define CYD_TOUCH_MOSI   32
#define CYD_TOUCH_MISO   39  // Sensor VN (Input Only)
#define CYD_TOUCH_IRQ    36  // Sensor VP (Input Only)

// Built-in Peripherals
#define CYD_RGB_RED       4  // Active Low
#define CYD_RGB_GREEN    16  // Active Low
#define CYD_RGB_BLUE     17  // Active Low
#define CYD_LDR_PIN      34  // Light sensor (ADC)
#define CYD_AUDIO_OUT    26  // Speaker DAC / PAM8302
