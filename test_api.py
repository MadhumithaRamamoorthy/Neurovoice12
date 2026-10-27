"""
NEURONEXUS - Backend Service Unit Tests
Tests the explainable recommendation engine and EEG signal processor rejection rules.
"""

from backend.app.models import SubtopicAccuracy, LearningGap
from backend.app.services.recommendation_engine import ExplainableRecommendationEngine
from backend.app.services.eeg_processor import EEGSignalProcessor


def test_gap_identification_threshold():
    subtopics = {
        "BST Operations": SubtopicAccuracy(correct=3, total=3, accuracy=100.0),
        "Tree Traversal": SubtopicAccuracy(correct=1, total=4, accuracy=25.0),
        "Tree Balancing": SubtopicAccuracy(correct=2, total=3, accuracy=66.7),
    }

    gaps = ExplainableRecommendationEngine.identify_gaps(subtopics, threshold=70.0)

    assert len(gaps) == 2, "Expected 2 gaps with accuracy < 70%"
    assert gaps[0].subtopic == "Tree Traversal"
    assert gaps[0].severity == "HIGH"
    assert gaps[1].subtopic == "Tree Balancing"
    assert "Tree Traversal" in gaps[0].reason


def test_recommendation_reason_generation():
    gaps = [
        LearningGap(
            subtopic="Tree Traversal",
            accuracy=25.0,
            correct=1,
            total=4,
            severity="HIGH",
            reason="Critical knowledge gap."
        )
    ]

    plan = ExplainableRecommendationEngine.generate_plan("top_trees", gaps)
    assert len(plan) >= 3
    assert plan[0].target_action == "OPEN_LESSON"
    assert "25.0%" in plan[0].reason


def test_eeg_signal_rejection_policy():
    # Valid coverage below 70% threshold (e.g. 45%)
    cov, status, is_acceptable = EEGSignalProcessor.validate_signal_quality(450, 1000)
    assert cov == 45.0
    assert status == "INSUFFICIENT"
    assert not is_acceptable

    # Ensure focus estimation returns None transparently!
    estimate = EEGSignalProcessor.estimate_focus_index(
        theta_power=25.0,
        alpha_power=35.0,
        beta_power=20.0,
        valid_coverage_percent=45.0
    )
    assert estimate is None, "Signal with coverage < 70% must return None to prevent fabricated data!"


def test_eeg_signal_acceptable():
    cov, status, is_acceptable = EEGSignalProcessor.validate_signal_quality(920, 1000)
    assert cov == 92.0
    assert status == "ACCEPTABLE"
    assert is_acceptable

    estimate = EEGSignalProcessor.estimate_focus_index(
        theta_power=25.0,
        alpha_power=35.0,
        beta_power=30.0,
        valid_coverage_percent=92.0
    )
    assert estimate is not None
    assert 10.0 <= estimate <= 95.0


if __name__ == "__main__":
    test_gap_identification_threshold()
    test_recommendation_reason_generation()
    test_eeg_signal_rejection_policy()
    test_eeg_signal_acceptable()
    print("[PASS] All backend unit tests completed successfully.")
