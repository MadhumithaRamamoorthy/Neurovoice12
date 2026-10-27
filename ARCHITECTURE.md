# NEURONEXUS Architecture & Systems Design

## 1. System Overview
NEURONEXUS is an intelligent educational technology platform that transforms raw assessment scores into measurable, explainable learning improvements. It integrates academic evidence, granular subtopic mastery analysis, deterministic recommendation engines, and an optional BioAmp EXG EEG signal processing pipeline.

```
+-------------------------------------------------------------------------+
|                              CLIENT TIER                                |
|                                                                         |
|  +--------------------+  +--------------------+  +-------------------+  |
|  |  NeuroLearn Loop   |  |   Campus-Q&A       |  |   AI Classroom    |  |
|  |  (Assess->Discover |  | (Categories, Search|  | (Socratic Tutor,  |  |
|  | ->Personalize->    |  |  Upvoting, Answers)|  |  Analogies, AI)   |  |
|  |   Improve)         |  |                    |  |                   |  |
|  +--------------------+  +--------------------+  +-------------------+  |
|                                                                         |
|  +--------------------+  +--------------------+  +-------------------+  |
|  |   Neuro Analysis   |  | Faculty Analytics  |  | Privacy & Consent |  |
|  | (Focus Dynamics &  |  | (Class Difficulty, |  | (Opt-in EEG, Data|  |
|  | Spectral FFT Bands)|  | No Biometric Leak) |  | Export/Wipe)      |  |
|  +--------------------+  +--------------------+  +-------------------+  |
+-------------------------------------------------------------------------+
                                    │
                                    ▼
+-------------------------------------------------------------------------+
|                            STORAGE LAYER                                |
|                                                                         |
|  - Persistent Atomic LocalStorage & JSON Seed Repository                |
|  - Full CRUD for Quizzes, Attempts, Community Q&A, and Mentors         |
|  - Deterministic Demo Mode (Aarav Sharma - Sathyabama CSE)              |
+-------------------------------------------------------------------------+
                                    │
                                    ▼
+-------------------------------------------------------------------------+
|                  BACKEND & EEG BRIDGE SERVICE TIER                      |
|                                                                         |
|  +-------------------------------+  +--------------------------------+  |
|  |       FastAPI REST Engine     |  |       EEG Hardware Bridge      |  |
|  |  - /api/courses               |  |  - BioAmp EXG Pill (250 Hz)    |  |
|  |  - /api/neurolearn/assess     |  |  - 0.5-45 Hz Bandpass Filter   |  |
|  |  - /api/faculty/analytics     |  |  - 50 Hz Notch Filter          |  |
|  |  - /api/qa                    |  |  - Transparent Rejection Gate  |  |
|  +-------------------------------+  +--------------------------------+  |
+-------------------------------------------------------------------------+
```

## 2. The Signature NeuroLearn Loop Workflow
The platform's flagship feature follows four strictly connected stages:
1. **ASSESS:** The student takes a timed, multiple-choice assessment drawn from structured academic courses (Data Structures, DBMS, Python, Cloud).
2. **DISCOVER:** The engine evaluates every submitted answer to compute exact subtopic accuracy (e.g. BST Operations vs Tree Traversal vs AVL Balancing). Knowledge gaps are flagged whenever subtopic accuracy falls below 70%.
3. **PERSONALIZE:** An explainable recommendation engine generates targeted revision steps. Crucially, **every recommendation includes an explicit mathematical reason** (e.g., *"Recommended because your accuracy in Tree Traversal was 25% across 4 answered questions"*).
4. **IMPROVE:** The student takes a follow-up assessment. The system compares the new score with the baseline, displaying the net percentage point delta (e.g., +30%) and confirming cycle completion.

## 3. Privacy & Ethical Neurotechnology Separation
- **Voluntary Opt-In:** EEG collection is strictly opt-in. Core academic functionality operates 100% without hardware.
- **Faculty Privacy Shield:** Faculty views only see aggregated, anonymized academic performance and topic difficulties. Student biometric traces are **strictly withheld from instructors**.
- **Transparent Signal Rejection:** If valid signal coverage falls below 70%, the system transparently reports *"Focus estimate unavailable because the session does not contain enough valid signal data"* instead of fabricating an estimate.
- **Non-Diagnostic:** The platform makes no claims of medical, psychological, or definitive cognitive diagnosis.
