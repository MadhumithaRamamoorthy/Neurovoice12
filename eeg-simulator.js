/**
 * NEURONEXUS - EEG Signal Processing & Simulation Layer
 * Manages BioAmp EXG Pill signal streams, signal validation,
 * power spectral decomposition, and responsible contextual focus estimation.
 */

class EEGService {
  constructor(db) {
    this.db = db;
    this.isConnectedToBridge = false;
    this.activeStreaming = false;
    this.streamListeners = [];
    this.streamInterval = null;
    this.currentSessionData = [];
  }

  // Check if local Python bridge is actively running
  async checkBridgeConnection() {
    try {
      const res = await fetch("http://localhost:8000/api/health", { method: "GET", mode: "cors" });
      if (res.ok) {
        this.isConnectedToBridge = true;
        return { connected: true, status: "Live Python Bridge Detected" };
      }
    } catch (e) {
      this.isConnectedToBridge = false;
    }
    return {
      connected: false,
      status: "Local Python bridge offline. Demonstrating with verified deterministic simulated stream."
    };
  }

  // Start a live or simulated recording session
  startSession(topicId = "top_trees", mode = "HIGH_QUALITY") {
    this.activeStreaming = true;
    this.currentSessionData = [];
    const samplingRate = 250; // Hz for standard BioAmp EXG Pill
    let elapsedMinutes = 0;

    const initialPoint = {
      minute: 0,
      focus: mode === "HIGH_QUALITY" ? 70 : null,
      quality: mode === "HIGH_QUALITY" ? 95 : 35,
      state: "Baseline Calibration",
      voltageMicrovolts: 12.4
    };
    this.currentSessionData.push(initialPoint);

    return {
      sessionId: "ses_live_" + Date.now(),
      topicId,
      mode,
      samplingRate,
      isSimulated: !this.isConnectedToBridge
    };
  }

  // Generate realistic synthetic EEG session for student demo
  generateSimulatedSession(topicId = "top_trees", simulateQuality = "ACCEPTABLE") {
    const isGood = simulateQuality === "ACCEPTABLE";
    const topic = this.db.getTopic(topicId) || { title: "Topic Study Session" };

    const timeline = isGood
      ? [
          { minute: 5, focus: 72, quality: 96, state: "Initial Reading" },
          { minute: 10, focus: 79, quality: 95, state: "Invariant Grasp" },
          { minute: 15, focus: 85, quality: 92, state: "Algorithmic Tracing" },
          { minute: 20, focus: 64, quality: 94, state: "Encountered Complex Rotation" },
          { minute: 25, focus: 76, quality: 93, state: "Practicing Code Implementation" },
          { minute: 30, focus: 81, quality: 95, state: "Quiz Completion" }
        ]
      : [
          { minute: 5, focus: null, quality: 44, state: "High Impedance / Contact Noise" },
          { minute: 10, focus: null, quality: 32, state: "Motion Artifact" },
          { minute: 15, focus: null, quality: 41, state: "Electrode Misalignment" },
          { minute: 20, focus: null, quality: 39, state: "Insufficient Data Quality" }
        ];

    const sessionRecord = {
      id: "ses_sim_" + Date.now(),
      userId: this.db.getCurrentUser().id,
      topicId: topicId,
      topicTitle: topic.title,
      startedAt: new Date(Date.now() - 30 * 60000).toISOString(),
      endedAt: new Date().toISOString(),
      durationMinutes: isGood ? 30 : 20,
      source: "DEMO_SIMULATED",
      hardware: "BioAmp EXG Pill (Simulated)",
      samplingRateHz: 250,
      totalSamples: isGood ? 450000 : 300000,
      validDataCoveragePercent: isGood ? 93.8 : 39.1,
      signalQualityStatus: isGood ? "ACCEPTABLE" : "INSUFFICIENT",
      inferredFocusIndicator: isGood ? 76 : null, // Null when inadequate
      timelineData: timeline,
      spectralPower: isGood
        ? { theta: 22.4, alpha: 39.5, beta: 30.1, gamma: 8.0 }
        : null,
      note: isGood
        ? "Good electrode impedance and valid spectral band stability maintained across session."
        : "Valid signal coverage (39.1%) failed minimum 70% threshold. Focus estimate withheld."
    };

    this.db.saveNeuroSession(sessionRecord);
    return sessionRecord;
  }
}

window.eegService = new EEGService(window.neuronexusDB);
