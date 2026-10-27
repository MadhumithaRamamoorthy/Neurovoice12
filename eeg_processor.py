"""
NEURONEXUS - EEG Signal Preprocessing & Feature Extraction
Designed for BioAmp EXG Pill (0.5 - 45 Hz bandpass, 50 Hz notch filter)
Enforces transparent rejection: if signal coverage < 70%, no estimate is returned.
"""

from typing import Dict, List, Optional, Tuple
import math


class EEGSignalProcessor:
    SAMPLING_RATE_HZ = 250
    MIN_VALID_COVERAGE_PERCENT = 70.0

    @classmethod
    def validate_signal_quality(cls, valid_samples: int, total_samples: int) -> Tuple[float, str, bool]:
        if total_samples <= 0:
            return 0.0, "NO_DATA", False

        coverage = round((valid_samples / total_samples) * 100, 1)
        is_acceptable = coverage >= cls.MIN_VALID_COVERAGE_PERCENT
        status = "ACCEPTABLE" if is_acceptable else "INSUFFICIENT"
        return coverage, status, is_acceptable

    @classmethod
    def estimate_focus_index(
        cls,
        theta_power: float,
        alpha_power: float,
        beta_power: float,
        valid_coverage_percent: float
    ) -> Optional[float]:
        """
        Calculates an inferred contextual focus index based on the Beta / (Theta + Alpha) ratio.
        STRICT ETHICAL RULE: If valid signal coverage < 70%, returns None transparently.
        Never fabricates a synthetic number when signal quality is inadequate.
        """
        if valid_coverage_percent < cls.MIN_VALID_COVERAGE_PERCENT:
            return None  # Transparent rejection

        denominator = theta_power + alpha_power
        if denominator <= 0:
            return None

        # Standard engagement index ratio: Beta / (Theta + Alpha)
        ratio = beta_power / denominator
        # Normalization to [0, 100] scale
        raw_index = 50.0 + (ratio - 0.5) * 60.0
        clamped_index = max(10.0, min(95.0, raw_index))
        return round(clamped_index, 1)

    @classmethod
    def compute_spectral_distribution(
        cls,
        theta_raw: float,
        alpha_raw: float,
        beta_raw: float,
        gamma_raw: float
    ) -> Dict[str, float]:
        total = theta_raw + alpha_raw + beta_raw + gamma_raw
        if total <= 0:
            return {"theta": 25.0, "alpha": 25.0, "beta": 25.0, "gamma": 25.0}

        return {
            "theta": round((theta_raw / total) * 100, 1),
            "alpha": round((alpha_raw / total) * 100, 1),
            "beta": round((beta_raw / total) * 100, 1),
            "gamma": round((gamma_raw / total) * 100, 1),
        }
