"""
NEURONEXUS - FastAPI REST API Server
Team: Infinite Loopers (Sathyabama Institute of Science and Technology)
Provides production-grade REST endpoints for the NeuroLearn Loop, Community Q&A,
Faculty analytics, and BioAmp EXG signal processing.
"""

from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Optional, Any
from datetime import datetime
import json
import os

from .models import (
    UserProfile, CourseDetail, QuizQuestion, QuizSubmission,
    QuizAttemptResult, ComparisonResult, NeuroSessionRecord,
    CommunityQuestion, CommunityAnswer
)
from .services.recommendation_engine import ExplainableRecommendationEngine
from .services.eeg_processor import EEGSignalProcessor

app = FastAPI(
    title="NEURONEXUS API",
    description="Educational intelligence platform connecting academic performance, topic mastery, personalized revision, and contextual EEG signals.",
    version="1.0.0"
)

# Enable CORS for local SPA clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- In-memory mock store initialized with demo data ---
DEMO_ATTEMPTS = []
DEMO_COMMUNITY_QA = []


@app.get("/api/health", tags=["System"])
def health_check():
    """Health check endpoint confirming backend server availability."""
    return {
        "status": "online",
        "service": "NEURONEXUS Backend",
        "team": "Infinite Loopers",
        "institution": "Sathyabama Institute of Science and Technology",
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/api/courses", tags=["Courses"])
def get_courses():
    """Returns the list of structured academic courses and topics."""
    return [
        {
            "id": "crs_dsa_101",
            "code": "CSE-301",
            "title": "Data Structures & Algorithms",
            "category": "Core Computer Science",
            "badge": "Foundation",
            "instructor": "Dr. K. Ramanathan",
            "duration": "12 Weeks",
            "topics": [
                {"id": "top_trees", "title": "Trees & Binary Search Trees", "subtopics": ["BST Operations", "Tree Traversal", "Tree Balancing"]},
                {"id": "top_graphs", "title": "Graph Traversal & Shortest Paths", "subtopics": ["BFS & DFS", "Shortest Path Algorithms", "Cycle Detection"]},
                {"id": "top_dp", "title": "Dynamic Programming Paradigms", "subtopics": ["Optimal Substructure", "Knapsack Variants"]},
                {"id": "top_hashing", "title": "Hash Tables & Collision Resolution", "subtopics": ["Chaining vs Probing", "Bloom Filters"]}
            ]
        },
        {
            "id": "crs_dbms_102",
            "code": "CSE-304",
            "title": "Database Management Systems",
            "category": "Core Computer Science",
            "badge": "Systems",
            "instructor": "Dr. K. Ramanathan",
            "duration": "10 Weeks",
            "topics": [
                {"id": "top_normalization", "title": "Normalization & BCNF", "subtopics": ["Functional Dependencies", "3NF vs BCNF"]},
                {"id": "top_transactions", "title": "Transactions & ACID", "subtopics": ["Conflict Serializability", "2PL"]}
            ]
        }
    ]


@app.post("/api/neurolearn/assess", response_model=QuizAttemptResult, tags=["NeuroLearn Loop"])
def assess_and_discover(submission: QuizSubmission):
    """
    Core Signature Feature:
    Calculates exact subtopic accuracies from submitted answers,
    discovers genuine knowledge gaps, and generates an explainable revision plan.
    """
    total_q = max(len(submission.answers), 1)
    correct_count = 0
    subtopic_counts = {}

    # Example question mapping for CSE-301 Trees
    question_subtopics = {
        "q_tree_01": "BST Operations",
        "q_tree_02": "Tree Traversal",
        "q_tree_03": "Tree Balancing",
        "q_tree_04": "BST Operations",
        "q_tree_05": "Tree Traversal",
        "q_tree_06": "Tree Balancing",
        "q_tree_07": "Tree Traversal",
        "q_tree_08": "BST Operations",
        "q_tree_09": "Tree Balancing",
        "q_tree_10": "Tree Traversal"
    }

    # Verified correct choices
    correct_key = {
        "q_tree_01": 0, "q_tree_02": 2, "q_tree_03": 2, "q_tree_04": 2,
        "q_tree_05": 0, "q_tree_06": 1, "q_tree_07": 0, "q_tree_08": 1,
        "q_tree_09": 1, "q_tree_10": 1
    }

    for qid, chosen in submission.answers.items():
        sub = question_subtopics.get(qid, "General")
        if sub not in subtopic_counts:
            subtopic_counts[sub] = {"correct": 0, "total": 0}
        subtopic_counts[sub]["total"] += 1

        if chosen == correct_key.get(qid, -1):
            correct_count += 1
            subtopic_counts[sub]["correct"] += 1

    subtopic_breakdown = {}
    for sub, stats in subtopic_counts.items():
        acc = round((stats["correct"] / max(stats["total"], 1)) * 100, 1)
        subtopic_breakdown[sub] = {
            "correct": stats["correct"],
            "total": stats["total"],
            "accuracy": acc
        }

    percentage = round((correct_count / total_q) * 100, 1)

    # Stage 2: Discover Gaps
    from .models import SubtopicAccuracy
    breakdown_models = {
        k: SubtopicAccuracy(**v) for k, v in subtopic_breakdown.items()
    }
    gaps = ExplainableRecommendationEngine.identify_gaps(breakdown_models, threshold=70.0)

    # Stage 3: Personalize Revision Plan
    recommendations = ExplainableRecommendationEngine.generate_plan(submission.topic_id, gaps)

    attempt_id = f"att_srv_{int(datetime.utcnow().timestamp())}"
    result = QuizAttemptResult(
        id=attempt_id,
        user_id=submission.user_id,
        course_id=submission.course_id,
        topic_id=submission.topic_id,
        is_follow_up=submission.is_follow_up,
        timestamp=datetime.utcnow(),
        time_taken_seconds=submission.time_taken_seconds,
        score=correct_count,
        total=total_q,
        percentage=percentage,
        subtopic_breakdown=breakdown_models,
        identified_gaps=gaps,
        recommendations=recommendations
    )

    DEMO_ATTEMPTS.append(result)
    return result


@app.get("/api/neuro/sessions", tags=["Neuro Analysis"])
def get_neuro_sessions(user_id: str = "usr_student_01"):
    """Returns voluntary contextual EEG sessions with signal coverage quality indicators."""
    return [
        {
            "id": "ses_01",
            "topic_title": "Trees & Binary Search Trees",
            "duration_minutes": 30,
            "valid_data_coverage_percent": 93.4,
            "signal_quality_status": "ACCEPTABLE",
            "inferred_focus_indicator": 74.0,
            "note": "Acceptable impedance maintained throughout session."
        },
        {
            "id": "ses_02",
            "topic_title": "Database Normalization",
            "duration_minutes": 20,
            "valid_data_coverage_percent": 41.2,
            "signal_quality_status": "INSUFFICIENT",
            "inferred_focus_indicator": None,
            "note": "Coverage 41.2% < 70% threshold. Focus estimate transparently withheld."
        }
    ]


@app.get("/api/faculty/courses/{course_id}/analytics", tags=["Faculty"])
def get_faculty_analytics(course_id: str):
    """
    Returns aggregated class-level analytics.
    Privacy enforcement: Biometric / EEG signals are excluded from faculty visibility.
    """
    return {
        "course_id": course_id,
        "total_enrolled": 128,
        "class_average_score": 68.5,
        "hardest_subtopics": [
            {"subtopic": "Morris Traversal", "average_accuracy": 34.2, "difficulty": "High"},
            {"subtopic": "AVL RL/LR Double Rotations", "average_accuracy": 48.0, "difficulty": "High"},
            {"subtopic": "BCNF Decomposition", "average_accuracy": 54.1, "difficulty": "Moderate"}
        ],
        "recommended_intervention": "Conduct live interactive recitation on Morris thread pointer mechanics."
    }
