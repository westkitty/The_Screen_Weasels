#pragma once
#include <LovyanGFX.hpp>
#include "board_config.h"
#include "weasel_protocol.h"

class LGFX_CYD : public lgfx::LGFX_Device {
    lgfx::Panel_ILI9341 _panel_instance;
    lgfx::Bus_SPI       _bus_instance;
    lgfx::Light_PWM     _light_instance;
    lgfx::Touch_XPT2046 _touch_instance;

public:
    LGFX_CYD();
};

class FaceRenderer {
public:
    FaceRenderer(LGFX_CYD* display);
    void init();
    void renderDiagnosticFace(float gazeX, float gazeY, float mouthOpen);
    void drawEdgeGlow(float intensity);
    void clearPreviousPortalHand();
    void renderPortalHand(
        const WeaselHandState& hand
    );
    void clear();

private:
    LGFX_CYD* _gfx;
    bool _previousHandActive = false;
    int _previousHandX = 0;
    int _previousHandY = 0;
    int _portalY = 120;
};
