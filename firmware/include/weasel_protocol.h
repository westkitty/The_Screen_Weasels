#pragma once
#include <Arduino.h>

struct WeaselHandState {
    bool active;
    char shellId[16];
    float x;
    float y;
    float vx;
    float vy;
    bool clicked;
    float edgeGlow;
};

struct WeaselFaceIdentity {
    char id[32];
    char name[32];
    char primaryColor[8];
    char accentColor[8];
    char eyeShape[16];
    char toothType[16];
    uint32_t traitSeed;
};

struct WeaselFaceState {
    char id[32];
    float x;
    float y;
    float vx;
    float vy;
    float scale;
    float gazeX;
    float gazeY;
    float mouthOpen;
    float browAngle;
    char expression[16];
    bool grabbed;
};

struct WeaselSyncedFace {
    WeaselFaceIdentity identity;
    WeaselFaceState state;
};

struct WeaselAudioFrame {
    float rms;
    float bass;
    float mid;
    float treble;
    bool beat;
    uint32_t timestamp;
};
