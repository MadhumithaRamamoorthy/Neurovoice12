/**
 * NEURONEXUS - AI Classroom & Socratic Learning Assistant
 * Supports conceptual simplification, step-by-step algorithm walkthroughs,
 * mistake diagnostics, and dynamic practice generation.
 */

class AIClassroom {
  constructor(db) {
    this.db = db;
    this.history = [];
  }

  // Pre-configured deterministic knowledge base for reliable, immediate demo answers
  // when an external API key is not configured or in offline demo mode.
  getEducationalKnowledgeBase() {
    return {
      "trees": {
        simplify: `**Analogy for Binary Search Trees:**\nThink of a Binary Search Tree like a physical alphabetized library aisle. You walk into the middle: if the author you want begins with 'M' and you are standing at 'R', you know with 100% certainty that your book is to your left. You instantly eliminate half the entire library without glancing at a single other book. That is the $O(\\log N)$ power of the BST invariant!`,
        stepByStep: `**Step-by-step AVL Rotation (Right-Left Case):**\n1. **Identify the Imbalance:** Node X has balance factor -2 (right heavy), and X's right child (Y) has balance factor +1 (left heavy).\n2. **Step 1 - Right Rotation on Child Y:** We rotate Y to the right around its left child Z. Now Z becomes the right child of X, and Y becomes the right child of Z. Notice the structure is now straight (Right-Right).\n3. **Step 2 - Left Rotation on Root X:** We rotate X to the left around Z. Z now becomes the new root of the subtree, with X as its left child and Y as its right child.\n4. **Result:** All balance factors are restored to {-1, 0, +1}.`,
        practice: `**3 Rapid Practice Questions:**\n1. *If an AVL tree has height 3, what is the maximum number of nodes it can contain?* (Answer: $2^4 - 1 = 15$ nodes)\n2. *What is the in-order predecessor of node 15 in BST with elements [10, 5, 2, 7, 15, 12, 20]?* (Answer: 12)\n3. *Why can Morris Traversal achieve O(1) space?* (Answer: It borrows unused right null pointers of predecessor leaves to point back up).`
      },
      "dbms": {
        simplify: `**Analogy for Database Normalization:**\nImagine writing an address book where you write down a friend's full home address next to their name every time they send you a message. If they move, you have to update 50 entries. If you miss one, your data is corrupted (update anomaly)! Normalization simply splits this into two tables: Friends and Addresses, linked by a simple ID.`,
        stepByStep: `**Checking for BCNF Step-by-Step:**\n1. List all non-trivial functional dependencies $X \\to Y$.\n2. Compute the candidate keys of the relation using attribute closures.\n3. For each dependency $X \\to Y$, check: Is $X$ a superkey?\n4. If YES for all dependencies $\\implies$ The relation is in BCNF.\n5. If NO for even one dependency $\\implies$ The relation violates BCNF and must be decomposed.`,
        practice: `**3 Rapid Practice Questions:**\n1. *In relation R(A, B, C, D) with A -> B and B -> C, is R in 2NF?* (Answer: Yes, but violates 3NF due to transitive dependency).\n2. *What is the difference between clustered and unclustered index?* (Answer: Clustered determines physical ordering on disk; only one allowed per table).\n3. *What does the 'I' in ACID guarantee?* (Answer: Isolation - concurrent transactions do not interfere with each other).`
      }
    };
  }

  async askQuestion(promptText, mode = "general", topicContext = "trees") {
    const kb = this.getEducationalKnowledgeBase();
    const topicKey = topicContext.toLowerCase().includes("db") ? "dbms" : "trees";

    // Simulate realistic model reasoning delay (350ms)
    await new Promise(res => setTimeout(res, 350));

    let responseText = "";
    const sourceLabel = "Deterministic Socratic Engine (Deterministic Fallback / Offline Ready)";

    if (mode === "simplify") {
      responseText = kb[topicKey].simplify;
    } else if (mode === "step_by_step") {
      responseText = kb[topicKey].stepStep || kb[topicKey].stepByStep;
    } else if (mode === "practice") {
      responseText = kb[topicKey].practice;
    } else if (mode === "explain_mistakes") {
      const attempts = this.db.getAttempts();
      const last = attempts[attempts.length - 1];
      if (last && last.identifiedGaps && last.identifiedGaps.length > 0) {
        responseText = `**Analysis of Your Recent Assessment Mistakes (${last.topicId}):**\n\n`;
        last.identifiedGaps.forEach(g => {
          responseText += `• **${g.subtopic} (Accuracy ${g.accuracy}%):** ${g.reason}\n`;
        });
        responseText += `\n**Remediation Suggestion:**\nFocus specifically on the transition between Left-Right and Right-Left rotations. Notice that the first rotation always targets the *child* to eliminate the zigzag, whereas the second rotation targets the *root* to restore balance.`;
      } else {
        responseText = `Great job! In your latest assessment, you did not have significant knowledge gaps. You demonstrated high accuracy across all evaluated subtopics.`;
      }
    } else {
      // General question response
      const p = promptText.toLowerCase();
      if (p.includes("traversal") || p.includes("inorder") || p.includes("morris")) {
        responseText = `**Tree Traversals Summary:**\n- **In-order (LNR):** Essential for BST because it visits elements in ascending sorted order ($O(N)$ time, $O(H)$ recursion stack).\n- **Morris Traversal:** Achieves $O(1)$ auxiliary space without recursion by temporarily linking the in-order predecessor's right child to the current node.\n- **Post-order (LRN):** Perfect for bottom-up tasks like calculating subtree heights or freeing allocated nodes in C/C++.`;
      } else if (p.includes("avl") || p.includes("rotation") || p.includes("balance")) {
        responseText = `**AVL Rotations In Brief:**\nAn AVL tree balances itself using four rotational cases:\n- **LL & RR (Single Rotations):** Applied when the insertion is in the outer branch (Left-Left or Right-Right).\n- **LR & RL (Double Rotations):** Applied when the insertion is in the inner branch (zigzag). Always double-rotate: child first, then root.`;
      } else if (p.includes("bcnf") || p.includes("3nf") || p.includes("normal")) {
        responseText = `**3NF vs BCNF Core Distinction:**\n- In **3NF**, for every dependency $X \\to Y$, either $X$ is a superkey OR $Y$ is a prime attribute (part of a candidate key).\n- In **BCNF**, the second condition is eliminated: $X$ MUST strictly be a superkey. This removes all remaining functional redundancy.`;
      } else {
        responseText = `I have received your inquiry: *"${promptText}"*.\n\nIn computer science systems, key design principles rely on invariants: structural guarantees that hold across all operations (such as the BST ordering rule, the AVL height bound $|BF| \\le 1$, or transactional ACID serializability).\n\nFeel free to click any of the quick-action pills above (Simplify, Step-by-Step, Practice Questions, or Explain Mistakes) for deeper exploration!`;
      }
    }

    const messageObj = {
      id: "ai_" + Date.now(),
      prompt: promptText,
      response: responseText,
      mode,
      source: sourceLabel,
      timestamp: new Date().toISOString()
    };

    this.history.push(messageObj);
    return messageObj;
  }
}

window.aiClassroom = new AIClassroom(window.neuronexusDB);
