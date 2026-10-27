"""
NEURONEXUS - Explainable Recommendation Engine
Computes granular topic gaps and generates transparent revision plans
where every step includes an explicit mathematical rationale.
"""

from typing import Dict, List, Tuple
from ..models import SubtopicAccuracy, LearningGap, RevisionStep


class ExplainableRecommendationEngine:
    @staticmethod
    def identify_gaps(subtopic_breakdown: Dict[str, SubtopicAccuracy], threshold: float = 70.0) -> List[LearningGap]:
        gaps = []
        for subtopic, stats in subtopic_breakdown.items():
            if stats.accuracy < threshold:
                if stats.accuracy < 40.0:
                    severity = "HIGH"
                    reason = (
                        f"Critical knowledge gap: accuracy was {stats.accuracy}% across "
                        f"{stats.total} assessed question(s). Foundational review required."
                    )
                else:
                    severity = "MEDIUM"
                    reason = (
                        f"Moderate knowledge gap: accuracy was {stats.accuracy}% across "
                        f"{stats.total} question(s). Practice on edge cases recommended."
                    )
                gaps.append(LearningGap(
                    subtopic=subtopic,
                    accuracy=stats.accuracy,
                    correct=stats.correct,
                    total=stats.total,
                    severity=severity,
                    reason=reason
                ))

        # Sort from lowest accuracy to highest
        gaps.sort(key=lambda g: g.accuracy)
        return gaps

    @staticmethod
    def generate_plan(topic_id: str, gaps: List[LearningGap]) -> List[RevisionStep]:
        steps = []
        step_num = 1

        if not gaps:
            steps.append(RevisionStep(
                id=f"rec_{step_num}",
                step_number=step_num,
                title="Mastery Confirmed: Review Advanced Applications",
                description="All evaluated subtopics met or exceeded the 70% threshold.",
                target_action="OPEN_LESSON",
                topic_id=topic_id,
                reason="Recommended because student achieved comprehensive mastery across all subtopics."
            ))
            return steps

        # Primary gap intervention
        worst = gaps[0]
        steps.append(RevisionStep(
            id=f"rec_{step_num}",
            step_number=step_num,
            title=f"Targeted Concept Review: {worst.subtopic}",
            description=f"Review fundamental invariants and illustrative proofs for {worst.subtopic}.",
            target_action="OPEN_LESSON",
            subtopic=worst.subtopic,
            topic_id=topic_id,
            reason=f"Recommended because accuracy in {worst.subtopic} was {worst.accuracy}%, the lowest assessed."
        ))
        step_num += 1

        # Interactive practice
        steps.append(RevisionStep(
            id=f"rec_{step_num}",
            step_number=step_num,
            title=f"AI Socratic Practice on {worst.subtopic}",
            description=f"Solve step-by-step diagnostic problems with real-time feedback.",
            target_action="AI_PRACTICE",
            subtopic=worst.subtopic,
            topic_id=topic_id,
            reason=f"Interactive problem solving helps overcome specific error patterns detected in {worst.subtopic}."
        ))
        step_num += 1

        # Verification assessment
        steps.append(RevisionStep(
            id=f"rec_{step_num}",
            step_number=step_num,
            title="Follow-Up Improvement Assessment",
            description="Retake the topic evaluation to measure your learning progress delta.",
            target_action="START_RETAKE",
            topic_id=topic_id,
            reason="Required to measure percentage point change against your baseline attempt."
        ))

        return steps
