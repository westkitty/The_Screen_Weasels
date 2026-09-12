#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "========================================================"
echo "  THE SCREEN WEASELS — FULL ROOT VALIDATION GATE"
echo "========================================================"

# Step 1: Protocol Schema Unit Tests
echo -e "\n[1/8] Running Protocol Unit Tests..."
pnpm --filter @screen-weasels/protocol test

# Step 2: Protocol TypeScript Build
echo -e "\n[2/8] Building Protocol Package..."
pnpm --filter @screen-weasels/protocol build

# Step 3: Host Daemon TypeScript Build
echo -e "\n[3/8] Building macOS Host Daemon..."
pnpm --filter @screen-weasels/host build

# Step 4: Simulator Production Build
echo -e "\n[4/8] Building Desktop Simulator (Vite)..."
pnpm --filter @screen-weasels/simulator build

# Step 5: Tools Package Build
echo -e "\n[5/8] Building Diagnostic Tools..."
pnpm --filter @screen-weasels/tools build

# Step 6: Swift Native Bridge Compilation
echo -e "\n[6/8] Compiling Swift Native Bridge..."
(cd host-macos/native-bridge && swift build)

# Step 7: ESP32 Firmware Compilation (PlatformIO)
echo -e "\n[7/8] Compiling ESP32 CYD Firmware (COMPILE ONLY)..."
export PLATFORMIO_CORE_DIR="$ROOT_DIR/.platformio"
"$ROOT_DIR/.venv/bin/pio" run -d firmware

# Step 8: Host & Mock Device Automated Integration Test
echo -e "\n[8/8] Running Host & Mock Shell Integration Test..."
node tools/dist/tools/integration-test.js

echo -e "\n========================================================"
echo "  ALL VALIDATION CHECKS PASSED EMPIRICALLY"
echo "========================================================"
