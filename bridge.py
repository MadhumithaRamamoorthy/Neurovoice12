"""
NEURONEXUS - BioAmp EXG Pill Local Communication Bridge
Supports COM serial port connection to Arduino / ESP32 running BioAmp firmware,
or seamless fallback to the local synthetic mock device.
"""

import sys
import time
import json
from .mock_device import BioAmpMockDevice


class BioAmpSerialBridge:
    def __init__(self, port: str = "COM3", baud_rate: int = 115200):
        self.port = port
        self.baud_rate = baud_rate
        self.serial_conn = None
        self.is_connected = False
        self.mock_device = BioAmpMockDevice()

    def connect(self) -> bool:
        """Attempts connection to microcontroller over USB serial."""
        try:
            import serial
            self.serial_conn = serial.Serial(self.port, self.baud_rate, timeout=1)
            self.is_connected = True
            print(f"[NEURONEXUS BRIDGE] Connected to genuine hardware on {self.port} @ {self.baud_rate} baud.")
            return True
        except Exception as e:
            print(f"[NEURONEXUS BRIDGE] Hardware device not detected on {self.port}: {e}")
            print(f"[NEURONEXUS BRIDGE] Operating in DEMO MODE with synthetic BioAmp stream.")
            self.is_connected = False
            return False

    def read_packet(self):
        """Reads one validated voltage packet from serial or emulator."""
        if self.is_connected and self.serial_conn:
            try:
                line = self.serial_conn.readline().decode('utf-8', errors='ignore').strip()
                if line:
                    val = float(line)
                    return {"source": "LIVE_HARDWARE", "voltage_uv": val, "timestamp": time.time()}
            except Exception:
                pass

        # Emulator fallback
        sample = next(self.mock_device.stream_samples())
        return {
            "source": "DEMO_SIMULATED",
            "voltage_uv": sample["voltage_uv"],
            "timestamp": time.time()
        }


if __name__ == "__main__":
    bridge = BioAmpSerialBridge()
    bridge.connect()
    print("Streaming 10 test samples...")
    for _ in range(10):
        pkt = bridge.read_packet()
        print(f"Packet: {pkt}")
        time.sleep(0.1)
