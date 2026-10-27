/**
 * NEURONEXUS - Gamification & NeuroQuest Engine
 * Team: Infinite Loopers (Sathyabama Institute of Science and Technology)
 * Manages XP, Levels, Study Streaks, Achievement Badges, Leaderboards,
 * and the rapid 60-second NeuroBlitz algorithmic challenge.
 */

class NeuroGamificationEngine {
  constructor(db) {
    this.db = db;
    this.STORAGE_KEY = "neuronexus_gamification_v1";
    this.state = this.loadState();
    this.activeBlitzGame = null;
  }

  loadState() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }

    // Default pre-loaded state for Demo Student Aarav Sharma
    return {
      xp: 2850,
      level: 4,
      levelTitle: "Tree Navigator",
      nextLevelXp: 3500,
      streakDays: 7,
      streakMultiplier: 1.5,
      blitzHighScore: 840,
      badges: [
        {
          id: "badge_loop_champ",
          title: "Loop Champion",
          category: "Mastery",
          icon: "🔄",
          description: "Completed a full 4-stage NeuroLearn Loop with verified improvement.",
          unlocked: true,
          unlockedAt: "2026-10-26"
        },
        {
          id: "badge_delta_conqueror",
          title: "Delta Conqueror",
          category: "Growth",
          icon: "📈",
          description: "Achieved a +25% or greater score improvement between baseline and retake.",
          unlocked: true,
          unlockedAt: "2026-10-26"
        },
        {
          id: "badge_zen_learner",
          title: "Zen Scholar",
          category: "Mindfulness",
          icon: "🧘",
          description: "Maintained a high relaxation state (Stress < 25%, Relax > 70%) during study.",
          unlocked: true,
          unlockedAt: "2026-10-27"
        },
        {
          id: "badge_tree_whisperer",
          title: "Tree Whisperer",
          category: "Curriculum",
          icon: "🌲",
          description: "Scored 100% on BST invariant and AVL tree rotation subtopics.",
          unlocked: true,
          unlockedAt: "2026-10-25"
        },
        {
          id: "badge_campus_beacon",
          title: "Campus Beacon",
          category: "Community",
          icon: "💡",
          description: "Earned 10+ upvotes on an algorithmic explanation in Campus-Q&A.",
          unlocked: false,
          unlockedAt: null
        },
        {
          id: "badge_speed_demon",
          title: "NeuroBlitz Master",
          category: "Speed",
          icon: "⚡",
          description: "Score 600+ points in a single 60-second NeuroBlitz rapid challenge.",
          unlocked: true,
          unlockedAt: "2026-10-27"
        }
      ],
      leaderboard: [
        { rank: 1, name: "Pooja Sundaram", department: "CSE (AI & ML)", xp: 3120, streak: 12, avatar: "PS" },
        { rank: 2, name: "Aarav Sharma (You)", department: "CSE (Core)", xp: 2850, streak: 7, avatar: "AS", isCurrentUser: true },
        { rank: 3, name: "Rohan Mehta", department: "IT", xp: 2640, streak: 9, avatar: "RM" },
        { rank: 4, name: "Swathi K.", department: "CSE (Core)", xp: 2410, streak: 5, avatar: "SK" },
        { rank: 5, name: "Vikram Anand", department: "CSE (Data Science)", xp: 2180, streak: 4, avatar: "VA" }
      ]
    };
  }

  saveState() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
  }

  addXP(amount, reason = "Study Activity") {
    // Check if brainwave monitor is currently in Flow or Relaxed state
    let multiplier = 1.0;
    if (window.brainwaveOscilloscope && window.brainwaveOscilloscope.relaxationLevel >= 70) {
      multiplier = 1.5; // Zen bonus!
    }

    const earned = Math.round(amount * multiplier);
    this.state.xp += earned;

    // Check level up (each level needs 1000 XP)
    const newLevel = Math.floor(this.state.xp / 1000) + 1;
    if (newLevel > this.state.level) {
      this.state.level = newLevel;
      const titles = ["Neuron Initiate", "Synapse Builder", "Algorithmic Apprentice", "Tree Navigator", "Data Architect", "NeuroMaster"];
      this.state.levelTitle = titles[Math.min(newLevel - 1, titles.length - 1)];
      this.state.nextLevelXp = newLevel * 1000;
    }

    // Update current user in leaderboard
    const userRow = this.state.leaderboard.find(u => u.isCurrentUser);
    if (userRow) {
      userRow.xp = this.state.xp;
      this.state.leaderboard.sort((a, b) => b.xp - a.xp);
      this.state.leaderboard.forEach((u, i) => u.rank = i + 1);
    }

    this.saveState();
    return { earned, totalXp: this.state.xp, level: this.state.level, isZenBonus: multiplier > 1.0 };
  }

  // Rapid 60-Second NeuroBlitz Challenge
  startNeuroBlitz() {
    const questionPool = [
      {
        q: "In-order traversal of a strict BST always yields sorted ascending keys.",
        answer: true,
        topic: "Trees",
        explanation: "True: In-order visits Left then Root then Right ($L < N < R$)."
      },
      {
        q: "Standard Dijkstra's algorithm works correctly with negative edge weights.",
        answer: false,
        topic: "Graphs",
        explanation: "False: Dijkstra fails with negative weights because its greedy choice assumes distances never decrease."
      },
      {
        q: "In an AVL tree, the balance factor of every node must be strictly in {-1, 0, +1}.",
        answer: true,
        topic: "AVL Trees",
        explanation: "True: AVL trees enforce $|BF(node)| \\le 1$ at every node."
      },
      {
        q: "Morris Traversal requires an auxiliary stack of size O(H).",
        answer: false,
        topic: "Tree Traversals",
        explanation: "False: Morris Traversal achieves O(1) space by borrowing predecessor right pointers."
      },
      {
        q: "BCNF decomposition guarantees preservation of all functional dependencies.",
        answer: false,
        topic: "DBMS Normalization",
        explanation: "False: 3NF preserves dependencies, but BCNF may trade dependency preservation for zero redundancy."
      },
      {
        q: "Breadth-First Search uses a FIFO Queue to find shortest paths in unweighted graphs.",
        answer: true,
        topic: "Graph Traversal",
        explanation: "True: BFS discovers nodes by level using a FIFO queue."
      },
      {
        q: "Worst-case search in a degenerate unbalanced BST is O(log N).",
        answer: false,
        topic: "BST Operations",
        explanation: "False: Unbalanced BST can degenerate into a linked list of height N, taking O(N) time."
      },
      {
        q: "Python asyncio is optimal for CPU-bound tasks like matrix multiplication.",
        answer: false,
        topic: "Python Concurrency",
        explanation: "False: AsyncIO is for I/O bound tasks; CPU-bound requires multiprocessing due to the GIL."
      }
    ];

    // Shuffle questions
    const shuffled = questionPool.sort(() => Math.random() - 0.5);

    this.activeBlitzGame = {
      questions: shuffled,
      currentIndex: 0,
      score: 0,
      combo: 0,
      maxCombo: 0,
      correctCount: 0,
      totalCount: 0,
      timeLeftSeconds: 60,
      isActive: true,
      timerInterval: null
    };

    return this.activeBlitzGame;
  }

  answerBlitzQuestion(userBoolean) {
    if (!this.activeBlitzGame || !this.activeBlitzGame.isActive) return null;

    const game = this.activeBlitzGame;
    const currentQ = game.questions[game.currentIndex];
    const isCorrect = userBoolean === currentQ.answer;

    game.totalCount += 1;
    if (isCorrect) {
      game.correctCount += 1;
      game.combo += 1;
      game.maxCombo = Math.max(game.maxCombo, game.combo);

      // Score = 50 base * combo multiplier
      const points = 50 * Math.min(game.combo, 4);
      game.score += points;
    } else {
      game.combo = 0; // Combo broken
    }

    // Move to next question or loop pool
    game.currentIndex = (game.currentIndex + 1) % game.questions.length;

    return {
      isCorrect,
      score: game.score,
      combo: game.combo,
      explanation: currentQ.explanation
    };
  }

  endBlitzGame() {
    if (!this.activeBlitzGame) return null;
    const game = this.activeBlitzGame;
    game.isActive = false;
    if (game.timerInterval) clearInterval(game.timerInterval);

    // Save high score and award XP
    if (game.score > this.state.blitzHighScore) {
      this.state.blitzHighScore = game.score;
    }

    const xpEarned = this.addXP(Math.round(game.score / 2), "NeuroBlitz Challenge");

    return {
      finalScore: game.score,
      correctCount: game.correctCount,
      totalCount: game.totalCount,
      maxCombo: game.maxCombo,
      xpEarned: xpEarned.earned,
      isHighScore: game.score >= this.state.blitzHighScore
    };
  }
}

window.neuroGamification = new NeuroGamificationEngine(window.neuronexusDB);
