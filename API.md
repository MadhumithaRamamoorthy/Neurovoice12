# NEURONEXUS — REST API Specification

The NEURONEXUS FastAPI backend exposes documented, type-validated REST endpoints for academic courses, assessments, explainable recommendation engines, and contextual EEG session logging.

## Base URL
`http://localhost:8000/api`

---

## 1. System Endpoints
### `GET /api/health`
Returns server status and team metadata.
- **Response (200 OK):**
  ```json
  {
    "status": "online",
    "service": "NEURONEXUS Backend",
    "team": "Infinite Loopers",
    "institution": "Sathyabama Institute of Science and Technology",
    "timestamp": "2026-10-27T10:45:00Z"
  }
  ```

---

## 2. Courses & Syllabus
### `GET /api/courses`
Returns structured courses, modules, and subtopics.

---

## 3. NeuroLearn Loop Endpoints
### `POST /api/neurolearn/assess`
Evaluates submitted quiz responses, computes exact subtopic accuracy, discovers knowledge gaps (<70%), and generates personalized revision steps.
- **Request Body:**
  ```json
  {
    "user_id": "usr_student_01",
    "course_id": "crs_dsa_101",
    "topic_id": "top_trees",
    "is_follow_up": false,
    "answers": {
      "q_tree_01": 0,
      "q_tree_02": 1,
      "q_tree_03": 3
    },
    "time_taken_seconds": 180
  }
  ```
- **Response (200 OK):**
  Returns `QuizAttemptResult` containing subtopic breakdown, identified gaps, and explainable recommendations.

---

## 4. Neuro Analysis & EEG Sessions
### `GET /api/neuro/sessions`
Returns stored study sessions with duration, valid data coverage, and contextual focus estimates.

---

## 5. Faculty Intelligence
### `GET /api/faculty/courses/{course_id}/analytics`
Returns aggregated class performance and topic difficulty distributions.
*Note: Strictly excludes individual biometric traces.*
