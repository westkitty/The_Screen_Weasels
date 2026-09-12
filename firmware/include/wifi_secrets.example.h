#pragma once

/**
 * ============================================================================
 * WI-FI CONFIGURATION EXAMPLE — The Screen Weasels (Milestone 0 & 1)
 * ============================================================================
 * Copy this file to `firmware/include/wifi_secrets.h` and configure your local
 * network credentials. `wifi_secrets.h` is ignored by Git and will never be
 * committed.
 *
 * If `wifi_secrets.h` is not present or WIFI_CONFIGURED is false, the Milestone 0
 * diagnostic will log `[WiFi] Test SKIPPED` and continue with display and touch.
 */

#define WEASEL_WIFI_CONFIGURED true
#define WEASEL_WIFI_SSID       "YOUR_WIFI_SSID"
#define WEASEL_WIFI_PASSWORD   "YOUR_WIFI_PASSWORD"
#define WEASEL_HOST_IP         "192.168.1.100"
#define WEASEL_HOST_PORT       8765
