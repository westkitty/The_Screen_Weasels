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
        cfg.panel_width      = CYD_SCREEN_WIDTH;
        cfg.panel_height     = CYD_SCREEN_HEIGHT;
        cfg.offset_x         = 0;
        cfg.offset_y         = 0;
        cfg.offset_rotation  = 1; // Landscape
        cfg.readable         = true;
        cfg.invert           = false;
        cfg.rgb_order        = false;
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
    _gfx->setRotation(1);
    _gfx->setBrightness(200);
    clear();
}

void FaceRenderer::clear() {
    _gfx->fillScreen(TFT_BLACK);
}

void FaceRenderer::renderDiagnosticFace(float gazeX, float gazeY, float mouthOpen) {
    int cx = 160;
    int cy = 120;
    int eyeDist = 36;
    int eyeW = 16;
    int eyeH = 14;

    // Clear previous face bounding area (dirty rect)
    _gfx->fillRect(cx - 70, cy - 60, 140, 120, TFT_BLACK);

    // Brows
    _gfx->drawLine(cx - eyeDist - 16, cy - 24, cx - eyeDist + 16, cy - 28, TFT_GREEN);
    _gfx->drawLine(cx + eyeDist - 16, cy - 28, cx + eyeDist + 16, cy - 24, TFT_GREEN);

    // Left Eye
    _gfx->drawEllipse(cx - eyeDist, cy - 6, eyeW, eyeH, TFT_GREEN);
    int pupilLx = (cx - eyeDist) + (int)(gazeX * 6);
    int pupilLy = (cy - 6) + (int)(gazeY * 5);
    _gfx->fillCircle(pupilLx, pupilLy, 4, TFT_ORANGE);

    // Right Eye
    _gfx->drawEllipse(cx + eyeDist, cy - 6, eyeW, eyeH, TFT_GREEN);
    int pupilRx = (cx + eyeDist) + (int)(gazeX * 6);
    int pupilRy = (cy - 6) + (int)(gazeY * 5);
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
    _gfx->drawRect(0, 0, 320, 240, glowColor);
    _gfx->drawRect(1, 1, 318, 238, glowColor);
}
