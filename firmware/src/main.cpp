#include <Arduino.h>
#include <WiFi.h>
#include "board_config.h"
#include "weasel_protocol.h"
#include "face_renderer.h"
#include "network.h"

#if __has_include("wifi_secrets.h")
#include "wifi_secrets.h"
#define HAS_WIFI_SECRETS 1
#else
#define HAS_WIFI_SECRETS 0
#endif

static LGFX_CYD gfx;
static FaceRenderer renderer(&gfx);
static float currentGazeX = 0.0f;
static float currentGazeY = 0.0f;
static float currentMouthOpen = 0.0f;
static bool touchWasActive = false;

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

#if HAS_WIFI_SECRETS
#ifdef WEASEL_WIFI_CONFIGURED
#if WEASEL_WIFI_CONFIGURED
    setupNetwork(
        WEASEL_WIFI_SSID,
        WEASEL_WIFI_PASSWORD,
        WEASEL_HOST_IP,
        WEASEL_HOST_PORT
    );
#endif
#endif
#endif
}

void loop() {
    loopNetwork();

    WeaselHandState hand;

    if (
        consumeLatestHandState(&hand)
    ) {
        float gazeX = 0.0f;
        float gazeY = 0.0f;
        float mouthOpen = 0.0f;

        if (hand.active) {
            gazeX =
                (160.0f - hand.x) /
                160.0f;

            gazeX =
                constrain(
                    gazeX,
                    -1.0f,
                    1.0f
                );

            gazeY =
                (hand.y - 120.0f) /
                120.0f;

            gazeY =
                constrain(
                    gazeY,
                    -1.0f,
                    1.0f
                );

            mouthOpen = 0.15f;
        }

        renderer.clearPreviousPortalHand();

        currentGazeX = gazeX;
        currentGazeY = gazeY;
        currentMouthOpen = mouthOpen;

        renderer.renderDiagnosticFace(
            currentGazeX,
            currentGazeY,
            currentMouthOpen
        );

        renderer.renderPortalHand(
            hand
        );

        Serial.printf(
            "[Hand] VISUAL active=%s x=%.1f y=%.1f gaze=(%.2f, %.2f)\n",
            hand.active ? "true" : "false",
            hand.x,
            hand.y,
            gazeX,
            gazeY
        );
    }

    WeaselFamiliarSignal familiar;

    if (consumeLatestFamiliarSignal(&familiar)) {
        float semanticMouth = currentMouthOpen;

        if (strcmp(familiar.reaction, "startled") == 0) semanticMouth = 1.0f;
        else if (strcmp(familiar.reaction, "curious") == 0) semanticMouth = 0.25f;
        else if (strcmp(familiar.reaction, "pleased") == 0) semanticMouth = 0.45f;
        else if (strcmp(familiar.reaction, "celebrate") == 0) semanticMouth = 0.65f;
        else if (strcmp(familiar.reaction, "irritated") == 0) semanticMouth = 0.12f;
        else if (strcmp(familiar.reaction, "warning") == 0) semanticMouth = 0.20f;
        else if (strcmp(familiar.reaction, "dizzy") == 0) semanticMouth = 0.55f;
        else if (strcmp(familiar.reaction, "error") == 0) semanticMouth = 0.75f;
        else if (strcmp(familiar.reaction, "sleepy") == 0) semanticMouth = 0.05f;
        else if (strcmp(familiar.reaction, "blink") == 0) semanticMouth = 0.10f;

        currentMouthOpen = constrain(semanticMouth, 0.0f, 1.0f);

        renderer.renderDiagnosticFace(
            currentGazeX,
            currentGazeY,
            currentMouthOpen
        );

        Serial.printf(
            "[Familiar] reaction=%s attention=%s intensity=%.2f\n",
            familiar.reaction,
            familiar.attention,
            familiar.intensity
        );
    }

    uint16_t touchX = 0;
    uint16_t touchY = 0;

    // Check resistive touch. Emit transitions once so one press is one semantic event.
    if (gfx.getTouch(&touchX, &touchY)) {
        float gazeX = ((float)touchX - 160.0f) / 160.0f;
        float gazeY = ((float)touchY - 120.0f) / 120.0f;
        gazeX = constrain(gazeX, -1.0f, 1.0f);
        gazeY = constrain(gazeY, -1.0f, 1.0f);

        currentGazeX = gazeX;
        currentGazeY = gazeY;
        currentMouthOpen = 0.3f;

        renderer.renderDiagnosticFace(currentGazeX, currentGazeY, currentMouthOpen);

        if (!touchWasActive) {
            sendTouchEvent(touchX, touchY, 1, true);
            touchWasActive = true;
        }

        Serial.printf("[Touch] Raw X: %d, Y: %d -> Gaze: (%.2f, %.2f)\n", touchX, touchY, gazeX, gazeY);
        delay(30);
    } else {
        if (touchWasActive) {
            sendTouchEvent(touchX, touchY, 0, false);
            touchWasActive = false;
        }
        delay(10);
    }
}
