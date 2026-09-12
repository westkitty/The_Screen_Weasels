#pragma once
#include <Arduino.h>

struct WeaselHandState {
    bool active;
    float x;
    float y;
    float vx;
    float vy;
    bool clicked;
    float edgeGlow;
};

struct WeaselFaceState {
    char id[16];
    float x;
    float y;
    float scale;
    float gazeX;
    float gazeY;
    float mouthOpen;
    char expression[16];
};

struct WeaselAudioFrame {
    float rms;
    float bass;
    float mid;
    float treble;
    bool beat;
};
