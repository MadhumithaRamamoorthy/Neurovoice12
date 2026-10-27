# NEURONEXUS — BioAmp EXG Pill Hardware Bridge

## Overview
The **BioAmp EXG Pill** is an open-source, analog front-end biopotential amplifier designed by Upside Down Labs. It records high-resolution EEG signals without requiring expensive proprietary acquisition equipment.

## Intended Hardware Pipeline
```
[Electrodes: Fp1, Fp2, Ear Reference]
         ↓
[BioAmp EXG Pill (Analog Amplification)]
         ↓ Analog Output (A0)
[Microcontroller: Arduino Nano / ESP32 / Maker Nano]
         ↓ USB Serial (115200 baud, 250 Hz)
[Local Python Bridge: eeg_bridge/bridge.py]
         ↓
[Preprocessing: 0.5-45 Hz Bandpass, 50 Hz Notch Filter]
         ↓
[NEURONEXUS Web Platform]
```

## Recommended Electrode Placement
- **Electrode 1 (IN+):** Forehead Left (Fp1)
- **Electrode 2 (IN-):** Forehead Right (Fp2)
- **Electrode 3 (REF):** Left or Right Ear Lobe (A1/A2 Ground Reference)

## Hardware Communication Protocol
- **Baud Rate:** `115200`
- **Sampling Rate:** `250 Hz` (4 ms sample period)
- **ADC Resolution:** 10-bit (Arduino) or 12-bit (ESP32)
- **Format:** Single float ASCII voltage string per newline

## Ethical & Scientific Notice
- **Non-Diagnostic:** Signals captured via single-channel frontal leads provide noisy contextual indicators and **do not** validate clinical attention or neurological diagnoses.
- **Signal Rejection Policy:** If valid sample coverage falls below 70%, NEURONEXUS **withholds the focus estimate** rather than generating fabricated data.
