"""
NEURONEXUS - Pydantic Data Models & Schemas
Team: Infinite Loopers (Sathyabama Institute of Science and Technology)
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime


class UserProfile(BaseModel):
    id: str
    name: str
    email: str
    role: str = "student"
    department: str = "Computer Science & Engineering"
    avatar: str = "AS"
    consent_eeg: bool = True
    data_sharing: bool = False


class TopicOverview(BaseModel):
    id: str
    title: str
    description: str
    order: int
    duration: str
    subtopics: List[str]


class CourseDetail(BaseModel):
    id: str
    code: str
    title: str
    category: str
    badge: str
    description: str
    instructor: str
    duration: str
    topics: List[TopicOverview]


class QuizQuestion(BaseModel):
    id: str
    subtopic: str
    difficulty: str
    question: str
    options: List[str]
    correct_index: int
    explanation: str


class QuizSubmission(BaseModel):
    user_id: str
    course_id: str
    topic_id: str
    is_follow_up: bool = False
    answers: Dict[str, int]  # question_id -> chosen_index
    time_taken_seconds: int


class SubtopicAccuracy(BaseModel):
    correct: int
    total: int
    accuracy: float


class LearningGap(BaseModel):
    subtopic: str
    accuracy: float
    correct: int
    total: int
    severity: str
    reason: str


class RevisionStep(BaseModel):
    id: str
    step_number: int
    title: str
    description: str
    target_action: str
    subtopic: Optional[str] = None
    topic_id: str
    reason: str


class QuizAttemptResult(BaseModel):
    id: str
    user_id: str
    course_id: str
    topic_id: str
    is_follow_up: bool
    timestamp: datetime
    time_taken_seconds: int
    score: int
    total: int
    percentage: float
    subtopic_breakdown: Dict[str, SubtopicAccuracy]
    identified_gaps: List[LearningGap]
    recommendations: List[RevisionStep]


class SubtopicDelta(BaseModel):
    prev_accuracy: float
    curr_accuracy: float
    diff: float


class ComparisonResult(BaseModel):
    has_baseline: bool
    message: Optional[str] = None
    prior_attempt_id: Optional[str] = None
    previous_score: Optional[int] = None
    previous_percentage: Optional[float] = None
    current_score: Optional[int] = None
    current_percentage: Optional[float] = None
    score_diff: Optional[int] = None
    percentage_diff: Optional[float] = None
    subtopic_deltas: Optional[Dict[str, SubtopicDelta]] = None


class TimelinePoint(BaseModel):
    minute: int
    focus: Optional[float]
    quality: float
    state: str


class NeuroSessionRecord(BaseModel):
    id: str
    user_id: str
    topic_id: str
    topic_title: str
    started_at: datetime
    ended_at: datetime
    duration_minutes: int
    source: str = "DEMO_SIMULATED"
    hardware: str = "BioAmp EXG Pill"
    sampling_rate_hz: int = 250
    total_samples: int
    valid_data_coverage_percent: float
    signal_quality_status: str
    inferred_focus_indicator: Optional[float]
    timeline_data: List[TimelinePoint]
    spectral_power: Optional[Dict[str, float]]
    note: str


class CommunityAnswer(BaseModel):
    id: str
    author_name: str
    author_role: str
    author_avatar: str
    verified: bool
    timestamp: datetime
    votes: int
    content: str


class CommunityQuestion(BaseModel):
    id: str
    title: str
    category: str
    course_id: str
    author_name: str
    author_role: str
    author_avatar: str
    timestamp: datetime
    votes: int
    views: int
    tags: List[str]
    content: str
    answers: List[CommunityAnswer]
