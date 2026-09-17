#include <Arduino.h>
#include <WiFi.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>
#include <string.h>
#include "network.h"

static WebSocketsClient webSocket;
static bool networkStarted = false;
static bool wsConnected = false;
static uint32_t outboundSeq = 0;

static WeaselHandState latestHandState{};
static bool handStatePending = false;
static WeaselFamiliarSignal latestFamiliarSignal{};
static bool familiarSignalPending = false;

static constexpr const char* SHELL_ID = "shell_a";
static constexpr const char* FIRMWARE_VERSION = "0.2.0-m1";

static void sendShellHello() {
    JsonDocument doc;

    doc["type"] = "SHELL_HELLO";
    doc["seq"] = ++outboundSeq;
    doc["timestamp"] = millis();

    JsonObject payload = doc["payload"].to<JsonObject>();
    payload["shellId"] = SHELL_ID;
    payload["firmwareVersion"] = FIRMWARE_VERSION;
    payload["freeHeap"] = ESP.getFreeHeap();
    payload["macAddress"] = WiFi.macAddress();

    String message;
    serializeJson(doc, message);

    webSocket.sendTXT(message);

    Serial.printf(
        "[WS] SHELL_HELLO sent: shell=%s heap=%u mac=%s\n",
        SHELL_ID,
        ESP.getFreeHeap(),
        WiFi.macAddress().c_str()
    );
}

static void handleText(uint8_t* payload, size_t length) {
    JsonDocument doc;

    DeserializationError error = deserializeJson(doc, payload, length);
    if (error) {
        Serial.printf("[WS] JSON parse error: %s\n", error.c_str());
        return;
    }

    const char* type = doc["type"] | "UNKNOWN";

    if (strcmp(type, "HAND_UPDATE") == 0) {
        JsonObject hand =
            doc["payload"].as<JsonObject>();

        latestHandState.active =
            hand["active"] | false;

        const char* shellId =
            hand["shellId"] | "none";

        strncpy(
            latestHandState.shellId,
            shellId,
            sizeof(latestHandState.shellId) - 1
        );

        latestHandState.shellId[
            sizeof(latestHandState.shellId) - 1
        ] = '\0';

        latestHandState.x =
            hand["x"] | 0.0f;

        latestHandState.y =
            hand["y"] | 0.0f;

        latestHandState.vx =
            hand["vx"] | 0.0f;

        latestHandState.vy =
            hand["vy"] | 0.0f;

        latestHandState.clicked =
            hand["clicked"] | false;

        latestHandState.edgeGlow =
            hand["edgeGlow"] | 0.0f;

        handStatePending = true;

        Serial.printf(
            "[WS] HAND_UPDATE received: active=%s x=%.1f y=%.1f glow=%.2f\n",
            latestHandState.active ? "true" : "false",
            latestHandState.x,
            latestHandState.y,
            latestHandState.edgeGlow
        );

        return;
    }

    if (strcmp(type, "FAMILIAR_SIGNAL") == 0) {
        JsonObject signal = doc["payload"].as<JsonObject>();

        const char* entityId = signal["entityId"] | "";
        const char* source = signal["source"] | "";
        const char* attention = signal["attention"] | "idle";
        const char* reaction = signal["reaction"] | "neutral";
        const char* trigger = signal["trigger"] | "system";

        strncpy(latestFamiliarSignal.entityId, entityId, sizeof(latestFamiliarSignal.entityId) - 1);
        strncpy(latestFamiliarSignal.source, source, sizeof(latestFamiliarSignal.source) - 1);
        strncpy(latestFamiliarSignal.attention, attention, sizeof(latestFamiliarSignal.attention) - 1);
        strncpy(latestFamiliarSignal.reaction, reaction, sizeof(latestFamiliarSignal.reaction) - 1);
        strncpy(latestFamiliarSignal.trigger, trigger, sizeof(latestFamiliarSignal.trigger) - 1);

        latestFamiliarSignal.entityId[sizeof(latestFamiliarSignal.entityId) - 1] = '\0';
        latestFamiliarSignal.source[sizeof(latestFamiliarSignal.source) - 1] = '\0';
        latestFamiliarSignal.attention[sizeof(latestFamiliarSignal.attention) - 1] = '\0';
        latestFamiliarSignal.reaction[sizeof(latestFamiliarSignal.reaction) - 1] = '\0';
        latestFamiliarSignal.trigger[sizeof(latestFamiliarSignal.trigger) - 1] = '\0';

        latestFamiliarSignal.intensity = signal["intensity"] | 0.0f;
        latestFamiliarSignal.priority = signal["priority"] | 0;
        latestFamiliarSignal.durationMs = signal["durationMs"] | 0;
        latestFamiliarSignal.timestamp = signal["timestamp"].as<uint64_t>();
        latestFamiliarSignal.sequence = signal["sequence"] | 0;

        JsonObject look = signal["look"].as<JsonObject>();
        latestFamiliarSignal.hasLook = !look.isNull();
        latestFamiliarSignal.lookX = latestFamiliarSignal.hasLook ? (look["x"] | 0.0f) : 0.0f;
        latestFamiliarSignal.lookY = latestFamiliarSignal.hasLook ? (look["y"] | 0.0f) : 0.0f;

        familiarSignalPending = true;

        Serial.printf(
            "[WS] FAMILIAR_SIGNAL reaction=%s attention=%s intensity=%.2f\n",
            latestFamiliarSignal.reaction,
            latestFamiliarSignal.attention,
            latestFamiliarSignal.intensity
        );
        return;
    }

    if (strcmp(type, "FACE_SYNC") == 0) {
        JsonArray faces = doc["payload"]["faces"].as<JsonArray>();

        const char* firstId = "none";
        if (!faces.isNull() && faces.size() > 0) {
            firstId = faces[0]["identity"]["id"] | "unknown";
        }

        Serial.printf(
            "[WS] FACE_SYNC received: faces=%u first=%s\n",
            (unsigned)faces.size(),
            firstId
        );
        return;
    }

    if (strcmp(type, "PONG") == 0) {
        Serial.println("[WS] PONG received.");
        return;
    }

    Serial.printf("[WS] RX message: %s\n", type);
}

static void webSocketEvent(
    WStype_t type,
    uint8_t* payload,
    size_t length
) {
    switch (type) {
        case WStype_CONNECTED:
            wsConnected = true;
            Serial.println("[WS] Connected to Mac host.");
            sendShellHello();
            break;

        case WStype_DISCONNECTED:
            if (wsConnected) {
                Serial.println("[WS] Disconnected from Mac host.");
            }
            wsConnected = false;
            break;

        case WStype_TEXT:
            handleText(payload, length);
            break;

        case WStype_ERROR:
            Serial.println("[WS] WebSocket error.");
            break;

        default:
            break;
    }
}

void setupNetwork(
    const char* ssid,
    const char* password,
    const char* hostIp,
    int port
) {
    if (networkStarted) {
        return;
    }

    networkStarted = true;

    if (WiFi.status() != WL_CONNECTED) {
        WiFi.mode(WIFI_STA);
        WiFi.begin(ssid, password);

        unsigned long started = millis();
        while (
            WiFi.status() != WL_CONNECTED &&
            millis() - started < 5000
        ) {
            delay(100);
        }
    }

    Serial.printf(
        "[WS] Target: ws://%s:%d/weasel\n",
        hostIp,
        port
    );

    webSocket.begin(hostIp, port, "/weasel");
    webSocket.onEvent(webSocketEvent);
    webSocket.setReconnectInterval(2000);
}

void sendTouchEvent(
    uint16_t x,
    uint16_t y,
    uint16_t pressure,
    bool active
) {
    if (!wsConnected) {
        return;
    }

    JsonDocument doc;
    doc["type"] = "TOUCH_EVENT";
    doc["seq"] = ++outboundSeq;
    doc["timestamp"] = millis();

    JsonObject payload = doc["payload"].to<JsonObject>();
    payload["active"] = active;
    payload["x"] = x;
    payload["y"] = y;
    payload["pressure"] = pressure;

    String message;
    serializeJson(doc, message);
    webSocket.sendTXT(message);
}

void loopNetwork() {
    if (!networkStarted) {
        return;
    }

    webSocket.loop();
}

bool consumeLatestHandState(
    WeaselHandState* out
) {
    if (
        out == nullptr ||
        !handStatePending
    ) {
        return false;
    }

    *out = latestHandState;
    handStatePending = false;

    return true;
}


bool consumeLatestFamiliarSignal(
    WeaselFamiliarSignal* out
) {
    if (
        out == nullptr ||
        !familiarSignalPending
    ) {
        return false;
    }

    *out = latestFamiliarSignal;
    familiarSignalPending = false;
    return true;
}
