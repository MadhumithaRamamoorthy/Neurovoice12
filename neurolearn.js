/**
 * NEURONEXUS - NeuroLearn Loop Engine
 * Implements the 4-stage signature cycle: ASSESS -> DISCOVER -> PERSONALIZE -> IMPROVE
 * All analytics, learning gap detections, and personalized recommendations are derived
 * strictly from actual submitted student assessment responses and persistent history.
 */

class NeuroLearnEngine {
  constructor(db) {
    this.db = db;
    this.activeQuizState = null;
  }

  // ==========================================
  // STAGE 1: ASSESS
  // ==========================================
  startAssessment(courseId, topicId, isFollowUp = false) {
    const questions = this.db.getQuestions(topicId);
    if (!questions || questions.length === 0) {
      throw new Error(`No assessment questions found for topic ${topicId}`);
    }

    this.activeQuizState = {
      courseId,
      topicId,
      isFollowUp,
      questions: JSON.parse(JSON.stringify(questions)), // copy
      userAnswers: {}, // { questionId: selectedIndex }
      currentIndex: 0,
      startTime: Date.now(),
      submitted: false,
      result: null
    };

    return this.activeQuizState;
  }

  recordAnswer(questionId, optionIndex) {
    if (!this.activeQuizState || this.activeQuizState.submitted) return;
    this.activeQuizState.userAnswers[questionId] = optionIndex;
  }

  submitAssessment() {
    if (!this.activeQuizState) throw new Error("No active assessment to submit.");

    const s = this.activeQuizState;
    const questions = s.questions;
    const endTime = Date.now();
    const durationSeconds = Math.round((endTime - s.startTime) / 1000);

    let correctCount = 0;
    const subtopicStats = {}; // { subtopic: { correct: 0, total: 0 } }

    questions.forEach(q => {
      const sub = q.subtopic || "General";
      if (!subtopicStats[sub]) {
        subtopicStats[sub] = { correct: 0, total: 0 };
      }
      subtopicStats[sub].total += 1;

      const userChoice = s.userAnswers[q.id];
      const isCorrect = userChoice === q.correctIndex;

      if (isCorrect) {
        correctCount += 1;
        subtopicStats[sub].correct += 1;
      }
    });

    // Compute accuracy percentages
    const subtopicBreakdown = {};
    for (const [sub, stats] of Object.entries(subtopicStats)) {
      subtopicBreakdown[sub] = {
        correct: stats.correct,
        total: stats.total,
        accuracy: Math.round((stats.correct / stats.total) * 1000) / 10
      };
    }

    const totalQuestions = questions.length;
    const percentage = Math.round((correctCount / totalQuestions) * 1000) / 10;

    // Identify Learning Gaps strictly based on real accuracy
    const identifiedGaps = this.discoverLearningGaps(subtopicBreakdown);

    // Generate Personalized Revision Plan based on identified gaps
    const recommendations = this.generatePersonalizedPlan(s.topicId, identifiedGaps, subtopicBreakdown);

    const currentUser = this.db.getCurrentUser();
    const attemptRecord = {
      id: "att_" + Date.now(),
      userId: currentUser.id,
      courseId: s.courseId,
      topicId: s.topicId,
      isFollowUp: s.isFollowUp,
      timestamp: new Date().toISOString(),
      timeTakenSeconds: Math.max(durationSeconds, 15),
      score: correctCount,
      total: totalQuestions,
      percentage: percentage,
      answers: { ...s.userAnswers },
      subtopicBreakdown,
      identifiedGaps,
      recommendations
    };

    // Save persistently
    this.db.saveAttempt(attemptRecord);
    s.submitted = true;
    s.result = attemptRecord;

    return attemptRecord;
  }

  // ==========================================
  // STAGE 2: DISCOVER
  // ==========================================
  discoverLearningGaps(subtopicBreakdown) {
    const gaps = [];

    for (const [subtopic, stats] of Object.entries(subtopicBreakdown)) {
      if (stats.accuracy < 70) {
        let reason = "";
        if (stats.accuracy < 40) {
          reason = `Critical knowledge gap: accuracy was only ${stats.accuracy}% across ${stats.total} assessed question(s). Foundational review required.`;
        } else {
          reason = `Moderate knowledge gap: accuracy was ${stats.accuracy}% across ${stats.total} question(s). Targeted practice on edge cases needed.`;
        }

        gaps.push({
          subtopic,
          accuracy: stats.accuracy,
          correct: stats.correct,
          total: stats.total,
          severity: stats.accuracy < 40 ? "HIGH" : "MEDIUM",
          reason
        });
      }
    }

    // Sort by lowest accuracy first
    gaps.sort((a, b) => a.accuracy - b.accuracy);
    return gaps;
  }

  // Compare an attempt against the prior baseline for the same topic
  compareWithPriorAttempt(currentAttempt) {
    const priorAttempts = this.db.getAttemptsByTopic(currentAttempt.topicId, currentAttempt.userId)
      .filter(a => a.id !== currentAttempt.id);

    if (priorAttempts.length === 0) {
      return {
        hasBaseline: false,
        message: "This is your baseline assessment for this topic. Future attempts will calculate your exact mastery improvement delta."
      };
    }

    const previous = priorAttempts[priorAttempts.length - 1]; // most recent prior
    const scoreDiff = currentAttempt.score - previous.score;
    const percentageDiff = Math.round((currentAttempt.percentage - previous.percentage) * 10) / 10;

    const subtopicDeltas = {};
    for (const [sub, currStats] of Object.entries(currentAttempt.subtopicBreakdown)) {
      const prevStats = previous.subtopicBreakdown ? previous.subtopicBreakdown[sub] : null;
      if (prevStats) {
        subtopicDeltas[sub] = {
          prevAccuracy: prevStats.accuracy,
          currAccuracy: currStats.accuracy,
          diff: Math.round((currStats.accuracy - prevStats.accuracy) * 10) / 10
        };
      }
    }

    const improvedTopics = Object.entries(subtopicDeltas)
      .filter(([_, d]) => d.diff > 0)
      .map(([name, d]) => ({ name, diff: d.diff, from: d.prevAccuracy, to: d.currAccuracy }));

    const stagnantOrDeclined = Object.entries(subtopicDeltas)
      .filter(([_, d]) => d.diff <= 0)
      .map(([name, d]) => ({ name, diff: d.diff, from: d.prevAccuracy, to: d.currAccuracy }));

    return {
      hasBaseline: true,
      priorAttemptId: previous.id,
      priorTimestamp: previous.timestamp,
      previousScore: previous.score,
      previousPercentage: previous.percentage,
      currentScore: currentAttempt.score,
      currentPercentage: currentAttempt.percentage,
      scoreDiff,
      percentageDiff,
      subtopicDeltas,
      improvedTopics,
      stagnantOrDeclined
    };
  }

  // ==========================================
  // STAGE 3: PERSONALIZE
  // ==========================================
  generatePersonalizedPlan(topicId, identifiedGaps, subtopicBreakdown) {
    const plan = [];
    let stepNumber = 1;

    if (identifiedGaps.length === 0) {
      // Mastery achieved!
      plan.push({
        id: `rec_${stepNumber}`,
        stepNumber: stepNumber++,
        title: "Mastery Confirmed — Explore Advanced Applications",
        description: "You achieved >=70% across all subtopics. Review real-world system implementations or proceed to the next topic.",
        targetAction: "OPEN_LESSON",
        topicId: topicId,
        reason: "Recommended because your accuracy across all subtopics exceeded the mastery threshold."
      });
      plan.push({
        id: `rec_${stepNumber}`,
        stepNumber: stepNumber++,
        title: "Help Peers in Community Q&A",
        description: "Solidify your understanding by explaining concepts to fellow students in the Campus Q&A forum.",
        targetAction: "OPEN_COMMUNITY",
        topicId: topicId,
        reason: "Peer instruction has been shown to consolidate algorithmic concepts into long-term memory."
      });
      return plan;
    }

    // Step 1: Concept Review for the weakest subtopic
    const worstGap = identifiedGaps[0];
    plan.push({
      id: `rec_${stepNumber}`,
      stepNumber: stepNumber++,
      title: `Concept Deep-Dive: ${worstGap.subtopic}`,
      description: `Review the core principles and illustrated examples for ${worstGap.subtopic} in the course syllabus.`,
      targetAction: "OPEN_LESSON",
      subtopic: worstGap.subtopic,
      topicId: topicId,
      reason: `Recommended because your accuracy in ${worstGap.subtopic} was ${worstGap.accuracy}%, the lowest among all assessed subtopics.`
    });

    // Step 2: Guided AI Practice
    plan.push({
      id: `rec_${stepNumber}`,
      stepNumber: stepNumber++,
      title: `AI Guided Practice: Step-by-Step Breakdown`,
      description: `Request the AI Classroom to break down a sample problem in ${worstGap.subtopic} without revealing the solution early.`,
      targetAction: "AI_PRACTICE",
      subtopic: worstGap.subtopic,
      topicId: topicId,
      reason: `Recommended to bridge the gap in ${worstGap.subtopic} through interactive Socratic tutoring.`
    });

    // Step 3: Secondary gap if exists
    if (identifiedGaps.length > 1) {
      const secondGap = identifiedGaps[1];
      plan.push({
        id: `rec_${stepNumber}`,
        stepNumber: stepNumber++,
        title: `Targeted Revision: ${secondGap.subtopic}`,
        description: `Review invariants and edge cases for ${secondGap.subtopic}.`,
        targetAction: "OPEN_LESSON",
        subtopic: secondGap.subtopic,
        topicId: topicId,
        reason: `Recommended because your accuracy in ${secondGap.subtopic} was ${secondGap.accuracy}% across ${secondGap.total} questions.`
      });
    }

    // Final Step: Follow-up Verification Quiz
    plan.push({
      id: `rec_${stepNumber}`,
      stepNumber: stepNumber++,
      title: "Take Follow-up Improvement Assessment",
      description: "Complete a follow-up assessment to measure your accuracy delta and close out the NeuroLearn cycle.",
      targetAction: "START_RETAKE",
      topicId: topicId,
      reason: "Recommended to mathematically measure score delta against your baseline attempt."
    });

    return plan;
  }
}

window.neuroLearnEngine = new NeuroLearnEngine(window.neuronexusDB);
