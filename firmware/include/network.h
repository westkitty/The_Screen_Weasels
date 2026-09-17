#pragma once
#include "weasel_protocol.h"

void setupNetwork(
    const char* ssid,
    const char* password,
    const char* hostIp,
    int port
);

void loopNetwork();

bool consumeLatestHandState(
    WeaselHandState* out
);

bool consumeLatestFamiliarSignal(
    WeaselFamiliarSignal* out
);

void sendTouchEvent(
    uint16_t x,
    uint16_t y,
    uint16_t pressure,
    bool active
);
