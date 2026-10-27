"""
NEURONEXUS - BioAmp EXG Pill Synthetic Device Emulator
Generates calibrated 250 Hz bio-potential signals with realistic Alpha (8-12 Hz)
and Beta (14-30 Hz) rhythm modulation, noise injection, and impedance artifacts.
"""

import time
import math
import random
from typing import Generator, Dict, Any


class BioAmpMockDevice:
    SAMPLING_RATE_HZ = 250
    SAMPLE_INTERVAL_SEC = 1.0 / SAMPLING_RATE_HZ

    def __init__(self, simulate_artifacts: bool = False):
        self.simulate_artifacts = simulate_artifacts
        self.start_time = time.time()
        self.sample_count = 0

    def stream_samples(self) -> Generator[Dict[str, Any], None, None]:
        """Yields continuous microvolt voltage readings with timestamps."""
        while True:
            t = self.sample_count * self.SAMPLE_INTERVAL_SEC
            self.sample_count += 1

            # Baseline EEG signal synthesis:
            # 10 Hz Alpha wave (approx 20 uV amplitude)
            alpha = 20.0 * math.sin(2 * math.pi * 10.0 * t)
            # 20 Hz Beta wave (approx 12 uV amplitude)
            beta = 12.0 * math.sin(2 * math.pi * 20.0 * t)
            # 5 Hz Theta wave (approx 15 uV amplitude)
            theta = 15.0 * math.sin(2 * math.pi * 5.0 * t)
            # Gaussian sensor noise
            noise = random.gauss(0, 3.0)

            # Optional motion or ocular artifact
            artifact = 0.0
            if self.simulate_artifacts and random.random() < 0.02:
                artifact = random.uniform(80.0, 150.0)

            voltage_uv = alpha + beta + theta + noise + artifact

            yield {
                "sample_index": self.sample_count,
                "timestamp": round(t, 4),
                "voltage_uv": round(voltage_uv, 2),
                "is_clipped": abs(voltage_uv) > 100.0
            }

            time.sleep(self.SAMPLE_INTERVAL_SEC)
