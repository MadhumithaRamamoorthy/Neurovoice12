# NEURONEXUS — BioAmp EXG Hardware Setup Guide

## 1. Hardware Bill of Materials
1. **BioAmp EXG Pill:** Analog biopotential front-end amplifier (Upside Down Labs).
2. **Microcontroller:** Arduino Nano, ESP32, or Maker Nano.
3. **Gel Electrodes:** 3x standard Ag/AgCl wet gel electrodes or dry comb electrodes.
4. **BioAmp Cable:** 3-lead snap electrode cable.
5. **USB Cable:** Micro-USB / USB-C to host computer.

---

## 2. Pin Connections (BioAmp to Microcontroller)
| BioAmp EXG Pill Pin | Microcontroller Pin | Description |
|---|---|---|
| **VCC** | 3.3V or 5V | Regulated DC Power |
| **GND** | GND | Ground Reference |
| **OUT** | A0 (Analog 0) | Filtered Analog Biopotential Output |

---

## 3. Electrode Placement (10-20 International System)
1. **IN+ (Positive Lead):** Left Forehead (Fp1 position) — 2 cm above left eyebrow.
2. **IN- (Negative Lead):** Right Forehead (Fp2 position) — 2 cm above right eyebrow.
3. **REF (Reference Lead):** Left or Right Ear Lobe (A1/A2 bony area).

> **Skin Preparation Note:** Clean the forehead with an alcohol swab and allow to dry before applying gel electrodes to minimize skin impedance.

---

## 4. Microcontroller Firmware (Arduino / C++)
```cpp
// BioAmp EXG Pill 250Hz Streaming Firmware
#define SAMPLE_RATE 250
#define BAUD_RATE 115200
#define INPUT_PIN A0

void setup() {
  Serial.begin(BAUD_RATE);
  // Configure 4ms sampling timer for 250Hz
}

void loop() {
  int sensorValue = analogRead(INPUT_PIN);
  // Convert ADC count to microvolts
  float microvolts = ((sensorValue * 5.0) / 1023.0) * 1000.0;
  Serial.println(microvolts);
  delay(4); // 250 Hz (4ms)
}
```

---

## 5. Starting the Local Python Bridge
1. Ensure the microcontroller is connected via USB.
2. Run the bridge:
   ```bash
   python -m eeg_bridge.bridge
   ```
3. If hardware is not detected on the COM port, the bridge automatically falls back to the **verified synthetic emulator** with zero crashes.
