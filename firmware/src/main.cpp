#include <Arduino.h>
#include <WiFi.h>
#include "board_config.h"
#include "weasel_protocol.h"
#include "face_renderer.h"

#if __has_include("wifi_secrets.h")
#include "wifi_secrets.h"
#define HAS_WIFI_SECRETS 1
#else
#define HAS_WIFI_SECRETS 0
#endif

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
    Serial.printf("[CYD] Free Heap at Boot: %u bytes\n", ESP.getFreeHeap());
    Serial.printf("[CYD] PSRAM Found: %s\n", psramFound() ? "YES" : "NO (Expected for standard 2.8\" CYD)");
    Serial.printf("[CYD] Flash Size: %u bytes\n", ESP.getFlashChipSize());

    // Wi-Fi Milestone 0 Diagnostic
#if HAS_WIFI_SECRETS
#ifdef WEASEL_WIFI_CONFIGURED
#if WEASEL_WIFI_CONFIGURED
    uint32_t heapBeforeWifi = ESP.getFreeHeap();
    Serial.printf("[WiFi] Testing connection to '%s' (Heap before: %u bytes)...\n", WEASEL_WIFI_SSID, heapBeforeWifi);
    WiFi.mode(WIFI_STA);
    WiFi.begin(WEASEL_WIFI_SSID, WEASEL_WIFI_PASSWORD);

    unsigned long start = millis();
    bool connected = false;
    while (millis() - start < 5000) {
        if (WiFi.status() == WL_CONNECTED) {
            connected = true;
            break;
        }
        delay(100);
    }

    if (connected) {
        uint32_t heapAfterWifi = ESP.getFreeHeap();
        Serial.printf("[WiFi] Connected! IP: %s, RSSI: %d dBm\n", WiFi.localIP().toString().c_str(), WiFi.RSSI());
        Serial.printf("[WiFi] Heap after Wi-Fi: %u bytes (Delta: -%u bytes)\n", heapAfterWifi, heapBeforeWifi - heapAfterWifi);
    } else {
        Serial.println("[WiFi] Connection timed out (5s limit). Continuing hardware diagnostics.");
    }
#else
    Serial.println("[WiFi] M0 Test SKIPPED: WEASEL_WIFI_CONFIGURED is false in wifi_secrets.h");
#endif
#endif
#else
    Serial.println("[WiFi] M0 Test SKIPPED: wifi_secrets.h not present (display & touch diagnostics fully active)");
#endif

    // Initialize display & touch
    renderer.init();
    Serial.println("[CYD] LovyanGFX display initialized. Pure black void active.");

    // Initial diagnostic face (Green with Orange accents: established discovery fixture)
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
