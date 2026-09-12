#include <Arduino.h>
#include "board_config.h"
#include "face_renderer.h"

static LGFX_CYD gfx;
static FaceRenderer renderer(&gfx);

void setup() {
    Serial.begin(115200);
    delay(500);

    Serial.println("\n========================================");
    Serial.println("  THE SCREEN WEASELS — M0 Diagnostic");
    Serial.println("========================================");

    // Hardware facts logging
    Serial.printf("[CYD] ESP32 Chip Rev: %d, Cores: %d, CPU Freq: %d MHz\n", ESP.getChipRevision(), 2, ESP.getCpuFreqMHz());
    Serial.printf("[CYD] Free Heap at Boot: %d bytes\n", ESP.getFreeHeap());
    Serial.printf("[CYD] PSRAM Found: %s\n", psramFound() ? "YES" : "NO (Expected for 2.8\" CYD)");
    Serial.printf("[CYD] Flash Size: %d bytes\n", ESP.getFlashChipSize());

    // Initialize display & touch
    renderer.init();
    Serial.println("[CYD] LovyanGFX display initialized. Pure black void active.");

    // Initial diagnostic face
    renderer.renderDiagnosticFace(0.0f, 0.0f, 0.0f);
    Serial.println("[CYD] Initial face rendered. Touch screen to test gaze tracking.");
}

void loop() {
    uint16_t touchX = 0;
    uint16_t touchY = 0;

    // Check resistive touch
    if (gfx.getTouch(&touchX, &touchY)) {
        float gazeX = ((float)touchX - 160.0f) / 160.0f;
        float gazeY = ((float)touchY - 120.0f) / 120.0f;
        gazeX = constrain(gazeX, -1.0f, 1.0f);
        gazeY = constrain(gazeY, -1.0f, 1.0f);

        renderer.renderDiagnosticFace(gazeX, gazeY, 0.3f);
        Serial.printf("[Touch] Raw X: %d, Y: %d -> Gaze: (%.2f, %.2f)\n", touchX, touchY, gazeX, gazeY);
        delay(30);
    } else {
        delay(10);
    }
}
