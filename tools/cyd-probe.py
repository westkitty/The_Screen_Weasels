#!/usr/bin/env python3
"""
CYD Serial Probe Utility for The Screen Weasels.
Scans available USB serial devices on macOS, identifies CH340 / CP2102 / CH9102 bridges,
and reads bootloader diagnostics from the ESP32-2432S028R.
"""

import glob
import sys
import time

def find_serial_ports():
    patterns = [
        "/dev/cu.usbserial-*",
        "/dev/cu.wchusbserial*",
        "/dev/cu.SLAB_USBtoUART*",
        "/dev/cu.usbmodem*",
    ]
    ports = []
    for pattern in patterns:
        ports.extend(glob.glob(pattern))
    return sorted(ports)

def main():
    print("========================================")
    print("  SCREEN WEASELS — CYD SERIAL PROBE")
    print("========================================")
    ports = find_serial_ports()

    if not ports:
        print("[!] No USB serial ports detected.")
        print("    1. Connect your ESP32 CYD board via USB-C cable.")
        print("    2. Verify cable is a data cable, not power-only.")
        print("    3. Check 'System Settings > General > About > System Report > USB'.")
        sys.exit(1)

    print(f"[*] Found {len(ports)} candidate port(s):")
    for i, port in enumerate(ports):
        print(f"    [{i + 1}] {port}")

    selected = ports[0]
    print(f"\n[*] Probing {selected} at 115200 baud...")

    try:
        import serial
        with serial.Serial(selected, 115200, timeout=2.0) as ser:
            time.sleep(0.2)
            # Toggle DTR/RTS to reset ESP32
            ser.dtr = False
            ser.rts = True
            time.sleep(0.1)
            ser.rts = False
            
            print("[*] Listening for boot log (press Ctrl+C to stop)...")
            start = time.time()
            while time.time() - start < 4.0:
                line = ser.readline()
                if line:
                    decoded = line.decode('utf-8', errors='replace').strip()
                    if decoded:
                        print(f"    | {decoded}")
    except ImportError:
        print("[!] Python 'pyserial' module not found.")
        print("    Install via: pip install pyserial")
        print(f"    Or view serial manually via: screen {selected} 115200")
    except Exception as e:
        print(f"[!] Error opening serial port: {e}")

if __name__ == "__main__":
    main()
