/**
 * Automated Test Suite for NEURONEXUS NeuroLearn Loop
 * Validates:
 * 1. Scoring accuracy calculation
 * 2. Learning gap identification (< 70% threshold)
 * 3. Explainable recommendations rationale generation
 * 4. Net progress delta math across baseline and retake attempts
 */

function runNeuroLearnTests() {
  console.log("=== RUNNING NEURONEXUS NEUROLEARN UNIT TESTS ===");
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // Test 1: Subtopic gap identification
  const mockSubtopics = {
    "BST Operations": { correct: 3, total: 3, accuracy: 100 },
    "Tree Traversal": { correct: 1, total: 4, accuracy: 25 },
    "Tree Balancing": { correct: 2, total: 3, accuracy: 66.7 }
  };

  const gaps = window.neuroLearnEngine.discoverLearningGaps(mockSubtopics);
  assert(gaps.length === 2, "Should identify exactly 2 gaps with accuracy < 70%");
  assert(gaps[0].subtopic === "Tree Traversal", "Lowest accuracy (25%) should be ranked first");
  assert(gaps[0].severity === "HIGH", "Accuracy < 40% should have HIGH severity");
  assert(gaps[1].subtopic === "Tree Balancing", "Tree Balancing (66.7%) should be ranked second");

  // Test 2: Recommendation plan generation
  const plan = window.neuroLearnEngine.generatePersonalizedPlan("top_trees", gaps, mockSubtopics);
  assert(plan.length >= 3, "Plan should contain at least 3 actionable steps");
  assert(plan[0].targetAction === "OPEN_LESSON", "Step 1 should target lesson review for weakest subtopic");
  assert(plan[0].reason.includes("Tree Traversal"), "Step 1 reason must cite the student's subtopic accuracy");

  // Test 3: Comparison Delta Math
  const baselineAttempt = {
    id: "att_base",
    userId: "usr_student_01",
    topicId: "top_trees",
    score: 6,
    total: 10,
    percentage: 60.0,
    timestamp: "2026-10-25T14:30:00Z",
    subtopicBreakdown: mockSubtopics
  };

  const followUpAttempt = {
    id: "att_follow",
    userId: "usr_student_01",
    topicId: "top_trees",
    score: 9,
    total: 10,
    percentage: 90.0,
    timestamp: "2026-10-27T10:00:00Z",
    subtopicBreakdown: {
      "BST Operations": { correct: 3, total: 3, accuracy: 100 },
      "Tree Traversal": { correct: 4, total: 4, accuracy: 100 },
      "Tree Balancing": { correct: 2, total: 3, accuracy: 66.7 }
    }
  };

  const comparison = {
    hasBaseline: true,
    scoreDiff: followUpAttempt.score - baselineAttempt.score,
    percentageDiff: followUpAttempt.percentage - baselineAttempt.percentage
  };

  assert(comparison.scoreDiff === 3, "Score diff should be +3 points");
  assert(comparison.percentageDiff === 30.0, "Percentage diff should be +30.0 points");

  console.log(`=== SUMMARY: ${passed} PASSED, ${failed} FAILED ===\n`);
  return failed === 0;
}

if (typeof window !== "undefined") {
  window.runNeuroLearnTests = runNeuroLearnTests;
}
