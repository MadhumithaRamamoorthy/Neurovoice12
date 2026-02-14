# NeuroVoice – System Design Document

## 1. System Architecture

EEG Electrodes (Fp1, Fp2, A1 Reference)
        ↓
BioAmp v1.5 Signal Amplifier
        ↓
Maker UNO (Data Transmission)
        ↓
Signal Processing Module
        ↓
Feature Extraction
        ↓
Machine Learning Classifier
        ↓
Text Output Interface

---

## 2. Hardware Components

- BioAmp v1.5
- Maker UNO
- EEG electrode placement (10–20 system)
- Laptop/PC for processing

---

## 3. Software Modules

### Signal Processing
- Noise removal
- Filtering
- Artifact reduction

### Feature Extraction
- Statistical features (mean, variance)
- Frequency band analysis

### Classification
- Supervised ML model
- Brain pattern mapping

---

## 4. Assumptions

- User has intact cognitive ability
- Proper electrode placement is ensured
- Stable signal acquisition environment

---

## 5. Limitations

- EEG signals are low amplitude and noisy
- Requires calibration for each user
- Prototype is not a certified medical device
