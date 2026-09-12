#include <WiFi.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>
#include "weasel_protocol.h"

// Network management skeleton for Milestone 1
// Reconnection FSM handles dropped Wi-Fi and host restarts gracefully
static WebSocketsClient webSocket;
static bool wsConnected = false;

void setupNetwork(const char* ssid, const char* password, const char* hostIp, int port) {
    Serial.printf("[WiFi] Connecting to %s...\n", ssid);
    WiFi.begin(ssid, password);
    // Non-blocking connect or retry loop will be attached in Milestone 1
}

void loopNetwork() {
    webSocket.loop();
}
