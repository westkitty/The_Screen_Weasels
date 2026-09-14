#include "face_renderer.h"

LGFX_CYD::LGFX_CYD() {
    {
        auto cfg = _bus_instance.config();
        cfg.spi_host = VSPI_HOST;
        cfg.spi_mode = 0;
        cfg.freq_write = 40000000;
        cfg.freq_read  = 16000000;
        cfg.spi_3wire = false;
        cfg.use_lock = true;
        cfg.dma_channel = SPI_DMA_CH_AUTO;
        cfg.pin_sclk = CYD_TFT_SCLK;
        cfg.pin_mosi = CYD_TFT_MOSI;
        cfg.pin_miso = CYD_TFT_MISO;
        cfg.pin_dc   = CYD_TFT_DC;
        _bus_instance.config(cfg);
        _panel_instance.setBus(&_bus_instance);
    }
    {
        auto cfg = _panel_instance.config();
        cfg.pin_cs           = CYD_TFT_CS;
        cfg.pin_rst          = CYD_TFT_RST;
        cfg.panel_width      = CYD_RUNTIME_WIDTH;
        cfg.panel_height     = CYD_RUNTIME_HEIGHT;
        cfg.memory_width     = CYD_RUNTIME_WIDTH;
        cfg.memory_height    = CYD_RUNTIME_HEIGHT;
        cfg.offset_x         = 0;
        cfg.offset_y         = 0;
        cfg.offset_rotation  = 0;
        cfg.readable         = true;
        cfg.invert           = false;
        cfg.rgb_order        = true;
        cfg.dlen_16bit       = false;
        cfg.bus_shared       = false;
        _panel_instance.config(cfg);
    }
    {
        auto cfg = _light_instance.config();
        cfg.pin_bl = CYD_TFT_BL;
        cfg.invert = false;
        cfg.freq   = 44100;
        cfg.pwm_channel = 7;
        _light_instance.config(cfg);
        _panel_instance.setLight(&_light_instance);
    }
    {
        auto cfg = _touch_instance.config();
        cfg.x_min      = 300;
        cfg.x_max      = 3900;
        cfg.y_min      = 200;
        cfg.y_max      = 3700;
        cfg.pin_int    = CYD_TOUCH_IRQ;
        cfg.bus_shared = false;
        cfg.spi_host   = HSPI_HOST;
        cfg.freq       = 2500000;
        cfg.pin_sclk   = CYD_TOUCH_SCK;
        cfg.pin_mosi   = CYD_TOUCH_MOSI;
        cfg.pin_miso   = CYD_TOUCH_MISO;
        cfg.pin_cs     = CYD_TOUCH_CS;
        _touch_instance.config(cfg);
        _panel_instance.setTouch(&_touch_instance);
    }
    setPanel(&_panel_instance);
}

FaceRenderer::FaceRenderer(LGFX_CYD* display) : _gfx(display) {}

void FaceRenderer::init() {
    _gfx->init();
    // Rotation 6 keeps MV=0 while selecting the upright, unmirrored landscape
    // orientation on this CYD's ILI9341 mounting.
    _gfx->setRotation(6);
    _gfx->setBrightness(200);
    clear();
}

void FaceRenderer::clear() {
    _gfx->fillScreen(TFT_BLACK);
}

void FaceRenderer::renderDiagnosticFace(float gazeX, float gazeY, float mouthOpen) {
    int cx = _gfx->width() / 2;
    int cy = _gfx->height() / 2;
    int eyeDist = 36;
    int eyeW = 16;
    int eyeH = 14;

    // Repair only the changing eye and mouth regions. Clearing the entire
    // face at cursor update frequency produces visible LCD flicker.
    _gfx->fillRect(cx - eyeDist - 20, cy - 24, 40, 38, TFT_BLACK);
    _gfx->fillRect(cx + eyeDist - 20, cy - 24, 40, 38, TFT_BLACK);
    _gfx->fillRect(cx - 26, cy + 12, 52, 31, TFT_BLACK);

    // Brows
    _gfx->drawLine(cx - eyeDist - 16, cy - 24, cx - eyeDist + 16, cy - 28, TFT_GREEN);
    _gfx->drawLine(cx + eyeDist - 16, cy - 28, cx + eyeDist + 16, cy - 24, TFT_GREEN);

    // Left Eye
    _gfx->drawEllipse(cx - eyeDist, cy - 6, eyeW, eyeH, TFT_GREEN);
    int pupilLx = (cx - eyeDist) + (int)(gazeX * 9);
    int pupilLy = (cy - 6) + (int)(gazeY * 7);
    _gfx->fillCircle(pupilLx, pupilLy, 4, TFT_ORANGE);

    // Right Eye
    _gfx->drawEllipse(cx + eyeDist, cy - 6, eyeW, eyeH, TFT_GREEN);
    int pupilRx = (cx + eyeDist) + (int)(gazeX * 9);
    int pupilRy = (cy - 6) + (int)(gazeY * 7);
    _gfx->fillCircle(pupilRx, pupilRy, 4, TFT_ORANGE);

    // Nose
    _gfx->fillTriangle(cx, cy, cx - 4, cy + 8, cx + 4, cy + 8, TFT_ORANGE);

    // Mouth
    int mw = 22;
    int mh = 3 + (int)(mouthOpen * 10);
    _gfx->drawEllipse(cx, cy + 26, mw, mh, TFT_GREEN);
}

void FaceRenderer::drawEdgeGlow(float intensity) {
    if (intensity <= 0.05f) return;
    uint16_t glowColor = _gfx->color565(56, 189, 248); // Cyan
    _gfx->drawRect(0, 0, _gfx->width(), _gfx->height(), glowColor);
    _gfx->drawRect(1, 1, _gfx->width() - 2, _gfx->height() - 2, glowColor);
}

void FaceRenderer::clearPreviousPortalHand() {
    if (_previousHandActive && _previousHandX > 8) {
        _gfx->fillRect(
            _previousHandX - 11,
            _previousHandY - 11,
            23,
            23,
            TFT_BLACK
        );
    }
}

void FaceRenderer::renderPortalHand(
    const WeaselHandState& hand
) {
    int screenWidth = _gfx->width();
    int screenHeight = _gfx->height();
    uint16_t black = TFT_BLACK;

    uint16_t deepBlue =
        _gfx->color565(
            0,
            22,
            48
        );

    uint16_t dimBlue =
        _gfx->color565(
            0,
            65,
            110
        );

    uint16_t cobalt =
        _gfx->color565(
            0,
            125,
            190
        );

    uint16_t cyan =
        _gfx->color565(
            0,
            220,
            255
        );

    if (!hand.active) {
        if (_previousHandActive) {
            _gfx->fillRect(
                screenWidth - 46,
                0,
                46,
                screenHeight,
                black
            );
        }

        _previousHandActive = false;
        return;
    }

    int handX =
        constrain(
            (int)roundf(
                (1.0f - hand.x / 320.0f) *
                (screenWidth - 1)
            ),
            0,
            screenWidth - 1
        );

    int handY =
        constrain(
            (int)roundf(
                (hand.y / 240.0f) *
                (screenHeight - 1)
            ),
            0,
            screenHeight - 1
        );

    if (!_previousHandActive) {
        _portalY =
            constrain(
                handY,
                10,
                screenHeight - 11
            );
    }

    int portalY = _portalY;

    _gfx->fillRect(
        screenWidth - 2,
        0,
        2,
        screenHeight,
        cyan
    );

    _gfx->fillRect(
        screenWidth - 4,
        0,
        2,
        screenHeight,
        cobalt
    );

    _gfx->fillRect(
        screenWidth - 7,
        0,
        3,
        screenHeight,
        dimBlue
    );

    _gfx->fillRect(
        screenWidth - 11,
        0,
        4,
        screenHeight,
        deepBlue
    );

    _gfx->fillCircle(
        screenWidth - 1,
        portalY,
        34,
        deepBlue
    );

    _gfx->fillCircle(
        screenWidth - 1,
        portalY,
        25,
        dimBlue
    );

    _gfx->fillCircle(
        screenWidth - 1,
        portalY,
        17,
        cobalt
    );

    _gfx->fillCircle(
        screenWidth - 1,
        portalY,
        10,
        cyan
    );

    _gfx->fillCircle(
        screenWidth - 9,
        portalY,
        6,
        cyan
    );

    _gfx->fillCircle(
        screenWidth - 9,
        portalY,
        2,
        TFT_WHITE
    );

    _gfx->drawFastHLine(
        screenWidth - 25,
        portalY,
        25,
        cyan
    );

    if (portalY > 0) {
        _gfx->drawFastHLine(
            screenWidth - 17,
            portalY - 1,
            17,
            cobalt
        );
    }

    if (portalY < screenHeight - 1) {
        _gfx->drawFastHLine(
            screenWidth - 17,
            portalY + 1,
            17,
            cobalt
        );
    }

    if (handX > 8) {
        _gfx->fillCircle(
            handX,
            handY,
            8,
            deepBlue
        );

        _gfx->fillCircle(
            handX,
            handY,
            5,
            cobalt
        );

        _gfx->fillCircle(
            handX,
            handY,
            3,
            cyan
        );

        _gfx->fillCircle(
            handX,
            handY,
            1,
            TFT_WHITE
        );
    }

    _previousHandActive = true;
    _previousHandX = handX;
    _previousHandY = handY;
}
