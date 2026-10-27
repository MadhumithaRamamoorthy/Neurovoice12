/**
 * NEURONEXUS - Core Seed Data
 * Team: Infinite Loopers (Sathyabama Institute of Science and Technology)
 * Realistic courses, topics, subtopics, question banks, lessons, and demo user states.
 */

window.NEURONEXUS_SEED = {
  users: [
    {
      id: "usr_student_01",
      name: "Aarav Sharma",
      email: "aarav.sharma@sathyabama.ac.in",
      role: "student",
      department: "Computer Science & Engineering",
      semester: "6th Semester",
      avatar: "AS",
      consentEEG: true,
      parentConsent: true,
      dataSharing: false,
      mentalStatus: "FOCUS",
      enrolledCourses: ["crs_dsa_101", "crs_dbms_102", "crs_py_103", "crs_cloud_104"]
    },
    {
      id: "usr_student_02",
      name: "Priya Nair",
      email: "priya.nair@sathyabama.ac.in",
      role: "student",
      department: "CSE (AI & ML)",
      semester: "6th Semester",
      avatar: "PN",
      consentEEG: true,
      parentConsent: true,
      dataSharing: false,
      mentalStatus: "RELAX",
      enrolledCourses: ["crs_dsa_101", "crs_py_103"]
    },
    {
      id: "usr_student_03",
      name: "Rohan Mehta",
      email: "rohan.mehta@sathyabama.ac.in",
      role: "student",
      department: "Computer Science & Engineering",
      semester: "4th Semester",
      avatar: "RM",
      consentEEG: true,
      parentConsent: true,
      dataSharing: false,
      mentalStatus: "STRESS",
      enrolledCourses: ["crs_dsa_101", "crs_dbms_102"]
    },
    {
      id: "usr_student_04",
      name: "Swathi K.",
      email: "swathi.k@sathyabama.ac.in",
      role: "student",
      department: "CSE (Data Science)",
      semester: "6th Semester",
      avatar: "SK",
      consentEEG: true,
      parentConsent: true,
      dataSharing: false,
      mentalStatus: "RELAX",
      enrolledCourses: ["crs_dbms_102", "crs_cloud_104"]
    },
    {
      id: "usr_student_05",
      name: "Vikram Anand",
      email: "vikram.anand@sathyabama.ac.in",
      role: "student",
      department: "Computer Science & Engineering",
      semester: "8th Semester",
      avatar: "VA",
      consentEEG: false,
      parentConsent: false,
      dataSharing: false,
      mentalStatus: "FATIGUE",
      enrolledCourses: ["crs_dsa_101", "crs_cloud_104"]
    },
    {
      id: "usr_faculty_01",
      name: "Dr. K. Ramanathan",
      email: "k.ramanathan@sathyabama.ac.in",
      role: "faculty",
      department: "Dept. of Computer Science & Engineering",
      avatar: "KR",
      coursesTaught: ["crs_dsa_101", "crs_dbms_102"]
    },
    {
      id: "usr_mentor_01",
      name: "Ananya Sen",
      email: "ananya.sen@alumni.sathyabama.ac.in",
      role: "mentor",
      company: "Tech Lead @ HyperScale Systems",
      expertise: ["Data Structures", "Competitive Programming", "System Design"],
      avatar: "AS",
      rating: 4.9,
      sessionsCompleted: 42,
      availability: "Available Weekends"
    },
    {
      id: "usr_parent_01",
      name: "Mrs. Sharma (Parent of Aarav)",
      email: "parent.sharma@gmail.com",
      role: "parent",
      avatar: "MS",
      childId: "usr_student_01",
      childName: "Aarav Sharma"
    }
  ],

  courses: [
    {
      id: "crs_dsa_101",
      code: "CSE-301",
      title: "Data Structures & Algorithms",
      category: "Core Computer Science",
      badge: "Foundation",
      description: "Master hierarchical structures, graph traversal, and algorithmic paradigms with rigorous time-complexity proofs.",
      instructor: "Dr. K. Ramanathan",
      duration: "12 Weeks",
      topicsCount: 4,
      enrolledCount: 128,
      topics: [
        {
          id: "top_trees",
          title: "Trees & Binary Search Trees",
          description: "Binary trees, BST invariants, balanced AVL trees, and Morris traversals.",
          order: 1,
          duration: "4 hours",
          videoUrl: "https://www.youtube.com/embed/oSWTXtMglKE",
          videoTitle: "Binary Search Trees — Full Tutorial with Examples",
          subtopics: ["BST Operations", "Tree Traversal", "Tree Balancing", "Morris Traversal"],
          lesson: {
            title: "Comprehensive Tree Invariants & Operations",
            summary: "A binary search tree maintains the invariant: left child < node <= right child.",
            content: `
### 1. The Binary Search Tree Invariant
In a binary search tree (BST), every node $X$ satisfies:
- All keys in the left subtree of $X$ are strictly less than $X.key$.
- All keys in the right subtree of $X$ are strictly greater than $X.key$.

\`\`\`python
class TreeNode:
    def __init__(self, key, left=None, right=None):
        self.key = key
        self.left = left
        self.right = right

def bst_insert(root, key):
    if not root:
        return TreeNode(key)
    if key < root.key:
        root.left = bst_insert(root.left, key)
    elif key > root.key:
        root.right = bst_insert(root.right, key)
    return root
\`\`\`

### 2. Tree Traversals
- **In-order (LNR):** Yields sorted sequence for BST. Time $O(N)$, Auxiliary Stack $O(H)$.
- **Pre-order (NLR):** Useful for cloning or serializing trees.
- **Post-order (LRN):** Useful for bottom-up node deletions and height calculations.
- **Level-order (BFS):** Utilizes an auxiliary FIFO queue for topological exploration.

### 3. Tree Balancing (AVL Trees)
The balance factor $BF(node) = Height(left) - Height(right)$ must remain in $\\{-1, 0, +1\\}$.
When $|BF| > 1$, we restore balance using rotations:
- **Left-Left (LL) Case:** Single Right Rotation.
- **Right-Right (RR) Case:** Single Left Rotation.
- **Left-Right (LR) Case:** Left rotation on left child followed by Right rotation on root.
- **Right-Left (RL) Case:** Right rotation on right child followed by Left rotation on root.
            `
          }
        },
        {
          id: "top_graphs",
          title: "Graph Traversal & Shortest Paths",
          description: "Dijkstra, Bellman-Ford, Prim/Kruskal MST, and Topological Ordering.",
          order: 2,
          duration: "5 hours",
          videoUrl: "https://www.youtube.com/embed/tWVWeAqZ0WU",
          videoTitle: "Graph Algorithms — BFS, DFS, Dijkstra Explained",
          subtopics: ["BFS & DFS", "Shortest Path Algorithms", "Minimum Spanning Trees", "Cycle Detection"],
          lesson: {
            title: "Graph Search and Shortest Paths",
            summary: "Representations via adjacency lists and greedy relaxation algorithms.",
            content: `
### Graph Representations
- **Adjacency List:** Space $O(V + E)$, optimal for sparse graphs.
- **Adjacency Matrix:** Space $O(V^2)$, optimal for dense graphs with $O(1)$ edge queries.

### Dijkstra's Single-Source Shortest Path
Requires non-negative edge weights. Runs in $O((V + E) \\log V)$ with a min-priority heap.
            `
          }
        },
        {
          id: "top_dp",
          title: "Dynamic Programming Paradigms",
          description: "Memoization, Tabulation, 0/1 Knapsack, and Longest Common Subsequences.",
          order: 3,
          duration: "6 hours",
          videoUrl: "https://www.youtube.com/embed/vYquumk4nAs",
          videoTitle: "Dynamic Programming — Memoization & Tabulation Deep Dive",
          subtopics: ["Optimal Substructure", "Overlapping Subproblems", "Knapsack Variants", "Matrix Chain Multiplication"],
          lesson: {
            title: "Dynamic Programming Foundations",
            summary: "Breaking complex optimization problems into overlapping subproblems.",
            content: `
### Key Principles
1. **Optimal Substructure:** Optimal solution to problem contains optimal solutions to subproblems.
2. **Overlapping Subproblems:** Subproblems are computed repeatedly; memoization caches results.
            `
          }
        },
        {
          id: "top_hashing",
          title: "Hash Tables & Collision Resolution",
          description: "Universal hashing, open addressing, Robin Hood hashing, and consistent hashing.",
          order: 4,
          duration: "3 hours",
          videoUrl: "https://www.youtube.com/embed/KyUTuwz_b7Q",
          videoTitle: "Hash Tables & Hashing — Complete Tutorial",
          subtopics: ["Hash Functions", "Chaining vs Probing", "Amortized Complexity", "Bloom Filters"],
          lesson: {
            title: "Hash Tables Under the Hood",
            summary: "Constant expected time lookups through hashing and load factor balancing.",
            content: `
### Collision Resolution
- **Separate Chaining:** Linked lists or red-black trees at each bucket.
- **Open Addressing:** Linear probing, quadratic probing, or double hashing.
            `
          }
        }
      ]
    },
    {
      id: "crs_dbms_102",
      code: "CSE-304",
      title: "Database Management Systems",
      category: "Core Computer Science",
      badge: "Systems",
      description: "Relational algebra, normal forms (1NF through BCNF), transaction concurrency, and crash recovery.",
      instructor: "Dr. K. Ramanathan",
      duration: "10 Weeks",
      topicsCount: 3,
      enrolledCount: 94,
      topics: [
        {
          id: "top_normalization",
          title: "Normalization & Functional Dependencies",
          description: "Eliminating insertion, deletion, and update anomalies via 1NF, 2NF, 3NF, and BCNF.",
          order: 1,
          duration: "3 hours",
          videoUrl: "https://www.youtube.com/embed/GFQaEYEc8_8",
          videoTitle: "Database Normalization — 1NF, 2NF, 3NF, BCNF Explained",
          subtopics: ["Functional Dependencies", "1NF & 2NF", "3NF vs BCNF", "Lossless Join Decomposition"],
          lesson: {
            title: "Relational Schema Normalization",
            summary: "Formal rules to decompose relations while preserving dependencies and lossless joins.",
            content: "BCNF guarantees that every non-trivial functional dependency X -> Y has X as a superkey."
          }
        },
        {
          id: "top_transactions",
          title: "Transactions, ACID & Concurrency",
          description: "Strict 2-Phase Locking, Serializability, Write-Ahead Logging (ARIES), and Deadlocks.",
          order: 2,
          duration: "4 hours",
          videoUrl: "https://www.youtube.com/embed/pomxJOFVcQs",
          videoTitle: "ACID Properties & Transaction Management Explained",
          subtopics: ["ACID Properties", "Conflict Serializability", "Two-Phase Locking (2PL)", "Deadlock Detection"],
          lesson: {
            title: "Concurrency Control and Isolation",
            summary: "Ensuring database consistency amid concurrent multi-threaded transactions.",
            content: "Serializability is the gold standard for transaction correctness in database engines."
          }
        },
        {
          id: "top_indexing",
          title: "B+ Tree Indexing & Query Optimization",
          description: "Disk storage models, clustered vs unclustered indices, and cost-based query optimizers.",
          order: 3,
          duration: "4 hours",
          videoUrl: "https://www.youtube.com/embed/aZjYr87r1b8",
          videoTitle: "B+ Tree Indexing & Database Query Optimization",
          subtopics: ["B+ Tree Structure", "Clustered Indexing", "Hash Indexes", "Cost-Based Query Plans"],
          lesson: {
            title: "Physical Storage & B+ Tree Indices",
            summary: "High branching factor index structures designed for block storage I/O minimization.",
            content: "B+ trees keep all leaf nodes linked for rapid range scans."
          }
        }
      ]
    },
    {
      id: "crs_py_103",
      code: "CSE-208",
      title: "Modern Python & Concurrency",
      category: "Software Engineering",
      badge: "Modern",
      description: "Advanced Python internals, async IO event loops, generators, and clean architecture.",
      instructor: "Prof. Priya Chandrasekar",
      duration: "8 Weeks",
      topicsCount: 3,
      enrolledCount: 110,
      topics: [
        {
          id: "top_py_internals",
          title: "Memory Management & GIL",
          description: "CPython reference counting, generational cyclic GC, and GIL constraints.",
          order: 1,
          duration: "3 hours",
          videoUrl: "https://www.youtube.com/embed/F6u5rhUQ6dU",
          videoTitle: "Python Memory Management, GIL & CPython Internals",
          subtopics: ["Reference Counting", "Cyclic GC", "Global Interpreter Lock", "Slots & Memory Profiling"],
          lesson: {
            title: "CPython Internal Architecture",
            summary: "Understanding how CPython handles objects, memory heaps, and threading locks.",
            content: "The GIL protects internal reference counts, making multi-processing essential for CPU-bound tasks."
          }
        },
        {
          id: "top_py_async",
          title: "AsyncIO, Coroutines & Event Loops",
          description: "Non-blocking cooperative multitasking, tasks, futures, and async context managers.",
          order: 2,
          duration: "4 hours",
          videoUrl: "https://www.youtube.com/embed/t5Bo1Je9EmE",
          videoTitle: "Python AsyncIO & Async/Await — Complete Guide",
          subtopics: ["Event Loop Mechanics", "Async / Await Syntax", "Gather vs AsCompleted", "Shielding Tasks"],
          lesson: {
            title: "AsyncIO and Cooperative Concurrency",
            summary: "Achieving high concurrent I/O throughput with single-threaded event loops.",
            content: "Asyncio executes coroutines cooperatively; yielding control upon encountering await statements."
          }
        }
      ]
    },
    {
      id: "crs_cloud_104",
      code: "CSE-412",
      title: "Cloud Data Analytics",
      category: "Data Engineering",
      badge: "Analytics",
      description: "Distributed data pipelines, Spark execution models, and columnar data storage.",
      instructor: "Er. Rajesh Varma",
      duration: "10 Weeks",
      topicsCount: 2,
      enrolledCount: 78,
      topics: [
        {
          id: "top_spark",
          title: "Apache Spark Execution Models",
          description: "RDD transformations, DAG execution, narrow vs wide dependencies, and shuffling.",
          order: 1,
          duration: "4 hours",
          videoUrl: "https://www.youtube.com/embed/_C8kWso4ne4",
          videoTitle: "Apache Spark — RDDs, DAG, and Distributed Computing",
          subtopics: ["RDD Lineage", "DAG Scheduler", "Narrow vs Wide Shuffles", "Tungsten Optimizer"],
          lesson: {
            title: "Distributed Computation with Spark",
            summary: "Fault-tolerant in-memory computing across distributed commodity clusters.",
            content: "Wide transformations force shuffles across executors, serving as primary latency bottlenecks."
          }
        }
      ]
    }
  ],

  // Comprehensive Question Bank per Topic
  questionBanks: {
    top_trees: [
      {
        id: "q_tree_01",
        subtopic: "BST Operations",
        difficulty: "Medium",
        question: "When deleting a node with two children in a Binary Search Tree, which node can replace it while preserving the BST invariant?",
        options: [
          "Either its in-order predecessor or in-order successor",
          "Only its left child",
          "Only its right child",
          "The root node of the entire tree"
        ],
        correctIndex: 0,
        explanation: "To preserve the BST invariant, the replacement node must be strictly greater than all left descendants and strictly less than all right descendants. Both the in-order predecessor (maximum of left subtree) and in-order successor (minimum of right subtree) satisfy this condition exactly."
      },
      {
        id: "q_tree_02",
        subtopic: "Tree Traversal",
        difficulty: "Easy",
        question: "Which traversal of a Binary Search Tree always outputs the node keys in strictly ascending order?",
        options: [
          "Pre-order traversal",
          "Post-order traversal",
          "In-order traversal",
          "Level-order traversal"
        ],
        correctIndex: 2,
        explanation: "In-order traversal visits nodes in the sequence: Left Subtree → Root Node → Right Subtree. Given the BST definition ($Left < Root < Right$), this recursively visits every key in monotonically ascending order."
      },
      {
        id: "q_tree_03",
        subtopic: "Tree Balancing",
        difficulty: "Hard",
        question: "In an AVL tree, an insertion into the left subtree of the right child of node X causes an imbalance with balance factor -2. Which composite rotation restores balance?",
        options: [
          "Single Left rotation (RR)",
          "Single Right rotation (LL)",
          "Right-Left (RL) double rotation",
          "Left-Right (LR) double rotation"
        ],
        correctIndex: 2,
        explanation: "The imbalance occurs in the Right child's Left subtree (RL case). The corrective action requires first performing a Right rotation on the right child, which converts the shape into an RR form, followed by a Left rotation on node X."
      },
      {
        id: "q_tree_04",
        subtopic: "BST Operations",
        difficulty: "Medium",
        question: "What is the worst-case time complexity of searching for an element in an un-balanced Binary Search Tree containing N nodes?",
        options: [
          "O(1)",
          "O(log N)",
          "O(N)",
          "O(N log N)"
        ],
        correctIndex: 2,
        explanation: "When elements are inserted in monotonically sorted order (e.g., 1, 2, 3, 4, 5), an un-balanced BST degenerates into a singly linked list with height N. Search in the worst case must traverse all N nodes, giving O(N) complexity."
      },
      {
        id: "q_tree_05",
        subtopic: "Tree Traversal",
        difficulty: "Hard",
        question: "Morris Traversal achieves tree traversal without using recursion or an auxiliary stack by temporarily creating which construct?",
        options: [
          "Threaded links from each node's in-order predecessor back to the node",
          "A circular linked list at every leaf",
          "An array of parent pointers",
          "A secondary heap"
        ],
        correctIndex: 0,
        explanation: "Morris Traversal utilizes threaded binary trees. Before descending left, it finds the in-order predecessor and sets its right pointer to the current node. Once the left subtree is traversed, the thread is removed and the right link restored, achieving O(1) auxiliary space."
      },
      {
        id: "q_tree_06",
        subtopic: "Tree Balancing",
        difficulty: "Medium",
        question: "What is the maximum height difference allowed between the left and right subtrees of any node in an AVL tree?",
        options: [
          "0",
          "1",
          "2",
          "log N"
        ],
        correctIndex: 1,
        explanation: "By definition, an AVL tree requires the balance factor of every node to be strictly within {-1, 0, +1}. Thus, the absolute difference between heights of left and right subtrees cannot exceed 1."
      },
      {
        id: "q_tree_07",
        subtopic: "Tree Traversal",
        difficulty: "Medium",
        question: "Given the pre-order traversal [10, 5, 2, 7, 15, 12, 20], what is the post-order traversal of this Binary Search Tree?",
        options: [
          "[2, 7, 5, 12, 20, 15, 10]",
          "[2, 5, 7, 10, 12, 15, 20]",
          "[20, 15, 12, 10, 7, 5, 2]",
          "[10, 15, 20, 12, 5, 7, 2]"
        ],
        correctIndex: 0,
        explanation: "Root is 10. Left subtree is [5, 2, 7] and right is [15, 12, 20]. Post-order visits Left then Right then Root: left subtree postorder is [2, 7, 5], right subtree is [12, 20, 15], then root [10]. Result: [2, 7, 5, 12, 20, 15, 10]."
      },
      {
        id: "q_tree_08",
        subtopic: "BST Operations",
        difficulty: "Easy",
        question: "What property must hold true for all keys in the right subtree of node P in a Binary Search Tree?",
        options: [
          "All keys are strictly smaller than P.key",
          "All keys are strictly greater than P.key",
          "At least one key is equal to P.key",
          "Keys must be prime numbers"
        ],
        correctIndex: 1,
        explanation: "The core invariant of a strict BST dictates that every node in the right subtree of P has a key strictly greater than P.key."
      },
      {
        id: "q_tree_09",
        subtopic: "Tree Balancing",
        difficulty: "Hard",
        question: "What is the minimum number of nodes in an AVL tree of height h = 4 (where a single root node has height 0)?",
        options: [
          "7",
          "12",
          "15",
          "31"
        ],
        correctIndex: 1,
        explanation: "The minimum nodes for height h follows Fibonacci-like recurrence: N(0)=1, N(1)=2, N(h) = 1 + N(h-1) + N(h-2). For h=2: 1+2+1=4. For h=3: 1+4+2=7. For h=4: 1+7+4=12 nodes."
      },
      {
        id: "q_tree_10",
        subtopic: "Tree Traversal",
        difficulty: "Medium",
        question: "Which data structure is fundamentally required to execute an iterative Breadth-First Search (Level-Order) traversal on a binary tree?",
        options: [
          "LIFO Stack",
          "FIFO Queue",
          "Min-Heap",
          "Disjoint-Set Union (DSU)"
        ],
        correctIndex: 1,
        explanation: "Level-order traversal visits nodes by horizontal depths. A FIFO (First-In, First-Out) queue ensures that nodes discovered at depth D are visited completely before nodes at depth D+1."
      }
    ],

    top_graphs: [
      {
        id: "q_graph_01",
        subtopic: "Shortest Path Algorithms",
        difficulty: "Medium",
        question: "Why does standard Dijkstra's algorithm fail to produce correct shortest paths on graphs containing negative edge weights?",
        options: [
          "Because it assumes edge weights can only be prime",
          "Because its greedy choice assumes visiting a node finalizes its optimal distance",
          "Because it runs in exponential time",
          "Because it cannot process directed edges"
        ],
        correctIndex: 1,
        explanation: "Dijkstra greedily marks the minimum unvisited distance as finalized. A negative edge traversed later could relax an already finalized node to a lower distance, violating Dijkstra's monotonic greedy guarantee."
      },
      {
        id: "q_graph_02",
        subtopic: "BFS & DFS",
        difficulty: "Easy",
        question: "Which algorithm is optimal for finding the shortest path between two nodes in an unweighted directed graph?",
        options: [
          "Breadth-First Search (BFS)",
          "Depth-First Search (DFS)",
          "Floyd-Warshall",
          "Prim's Algorithm"
        ],
        correctIndex: 0,
        explanation: "In an unweighted graph, each edge has uniform weight 1. BFS discovers vertices level-by-level, guaranteeing that the first time a target vertex is reached, the path length is minimal, in O(V + E) time."
      },
      {
        id: "q_graph_03",
        subtopic: "Cycle Detection",
        difficulty: "Medium",
        question: "In a directed graph, what type of edge in a Depth-First Search tree indicates the presence of a directed cycle?",
        options: [
          "Tree edge",
          "Forward edge",
          "Back edge",
          "Cross edge"
        ],
        correctIndex: 2,
        explanation: "A back edge connects a vertex to one of its active ancestors currently on the DFS recursion stack. Encountering a back edge confirms the existence of a closed directed cycle."
      }
    ],

    top_normalization: [
      {
        id: "q_norm_01",
        subtopic: "3NF vs BCNF",
        difficulty: "Medium",
        question: "A relation R(A, B, C) has functional dependencies AB -> C and C -> B. Candidate keys are AB and AC. Which normal form is R in?",
        options: [
          "Not in 1NF",
          "In 2NF but not 3NF",
          "In 3NF but not BCNF",
          "In BCNF"
        ],
        correctIndex: 2,
        explanation: "For C -> B: C is not a superkey, which violates BCNF. However, B is a prime attribute (part of candidate key AB), which satisfies 3NF's relaxed condition (for every X -> Y, either X is superkey or Y is prime). Hence R is in 3NF but not BCNF."
      },
      {
        id: "q_norm_02",
        subtopic: "Functional Dependencies",
        difficulty: "Easy",
        question: "Which anomaly occurs when deleting one piece of data inadvertently deletes unrelated required information?",
        options: [
          "Insertion anomaly",
          "Update anomaly",
          "Deletion anomaly",
          "Concurrency anomaly"
        ],
        correctIndex: 2,
        explanation: "A deletion anomaly occurs when removing an attribute value (e.g. dropping a student) accidentally destroys independent data (such as course details if not decoupled into separate relations)."
      }
    ]
  },

  // Pre-configured historical attempts to demonstrate baseline comparison
  historicalAttempts: [
    {
      id: "att_base_trees_01",
      userId: "usr_student_01",
      courseId: "crs_dsa_101",
      topicId: "top_trees",
      timestamp: "2026-10-25T14:30:00Z",
      timeTakenSeconds: 380,
      score: 6,
      total: 10,
      percentage: 60,
      answers: {
        q_tree_01: 0, // Correct (BST Operations)
        q_tree_02: 1, // WRONG - chose Post-order instead of In-order (Tree Traversal)
        q_tree_03: 3, // WRONG - chose LR instead of RL (Tree Balancing)
        q_tree_04: 2, // Correct (BST Operations)
        q_tree_05: 1, // WRONG - chose circular instead of threaded (Tree Traversal)
        q_tree_06: 1, // Correct (Tree Balancing)
        q_tree_07: 1, // WRONG - chose sorted order instead of postorder (Tree Traversal)
        q_tree_08: 1, // Correct (BST Operations)
        q_tree_09: 0, // WRONG - chose 7 instead of 12 (Tree Balancing)
        q_tree_10: 1  // Correct (Tree Traversal)
      },
      subtopicBreakdown: {
        "BST Operations": { correct: 3, total: 3, accuracy: 100 },
        "Tree Traversal": { correct: 1, total: 4, accuracy: 25 },
        "Tree Balancing": { correct: 2, total: 3, accuracy: 66.7 }
      },
      identifiedGaps: [
        {
          subtopic: "Tree Traversal",
          accuracy: 25,
          reason: "Accuracy was 25% across 4 assessed questions. Student struggled with Morris threads and post-order conversions."
        },
        {
          subtopic: "Tree Balancing",
          accuracy: 66.7,
          reason: "Accuracy was 66.7% across 3 questions. Confusion observed between Left-Right and Right-Left double rotations."
        }
      ],
      recommendations: [
        {
          id: "rec_01",
          stepNumber: 1,
          title: "Review Tree Traversal Invariants",
          description: "Study In-order (LNR) monotonic property and Morris Traversal thread link mechanics.",
          targetAction: "OPEN_LESSON",
          topicId: "top_trees",
          reason: "Recommended because your accuracy in Tree Traversal was 25%, significantly lower than other evaluated subtopics."
        },
        {
          id: "rec_02",
          stepNumber: 2,
          title: "Practice AVL Rotation Logic",
          description: "Solve 3 guided exercises distinguishing RL (Right-Left) vs LR (Left-Right) composite imbalances.",
          targetAction: "AI_PRACTICE",
          topicId: "top_trees",
          reason: "Recommended because your accuracy in Tree Balancing was 66.7% due to composite rotation misclassification."
        },
        {
          id: "rec_03",
          stepNumber: 3,
          title: "Complete Follow-up Verification Quiz",
          description: "Take the follow-up assessment to verify whether traversal and rotation gaps have resolved.",
          targetAction: "START_RETAKE",
          topicId: "top_trees",
          reason: "Recommended to measure learning delta and confirm progression through the NeuroLearn Loop."
        }
      ]
    }
  ],

  // Community Q&A items (Enhancing Campus-Q&A foundation)
  communityQuestions: [
    {
      id: "qa_01",
      title: "How to intuitively distinguish between LR and RL rotations in AVL trees?",
      category: "Data Structures",
      courseId: "crs_dsa_101",
      author: { name: "Karthik Raja", role: "Student", avatar: "KR" },
      timestamp: "2026-10-26T09:15:00Z",
      votes: 14,
      views: 182,
      tags: ["Trees", "AVL", "DataStructures", "CSE301"],
      content: "Whenever I get a balance factor imbalance, I get confused whether to rotate left child first or right child. Is there an intuitive mental model to memorize this without drawing tables during exams?",
      answers: [
        {
          id: "ans_01_1",
          author: { name: "Ananya Sen", role: "Mentor", avatar: "AS", verified: true },
          timestamp: "2026-10-26T10:30:00Z",
          votes: 18,
          content: "Here is the foolproof rule:\n1. Look at the sign of the parent's Balance Factor: Positive means left-heavy, Negative means right-heavy.\n2. Look at the child where the insertion happened: If parent is left-heavy (+2) but child is right-heavy (-1), you have a 'zigzag' (Left-Right). You ALWAYS first rotate the child to straighten the zigzag into a straight line (Left-Left), then rotate the parent!\n3. Same symmetrically for RL: Parent is right-heavy (-2), child is left-heavy (+1). Rotate right child to turn into RR, then left rotate root."
        },
        {
          id: "ans_01_2",
          author: { name: "Dr. K. Ramanathan", role: "Faculty", avatar: "KR", verified: true },
          timestamp: "2026-10-26T11:45:00Z",
          votes: 11,
          content: "Remember in lecture 14: Double rotation is strictly two single rotations composed sequentially. Practice on paper with 3-node subtrees until the geometric straightening becomes second nature."
        }
      ]
    },
    {
      id: "qa_02",
      title: "Why does BCNF not always preserve Functional Dependencies while 3NF does?",
      category: "DBMS",
      courseId: "crs_dbms_102",
      author: { name: "Divya N.", role: "Student", avatar: "DN" },
      timestamp: "2026-10-26T13:40:00Z",
      votes: 9,
      views: 94,
      tags: ["Normalization", "BCNF", "3NF", "DBMS"],
      content: "In our class test, we decomposed R(A, B, C) with AB->C and C->B. Why did the BCNF decomposition lose the dependency AB->C while 3NF preserved it?",
      answers: [
        {
          id: "ans_02_1",
          author: { name: "Dr. K. Ramanathan", role: "Faculty", avatar: "KR", verified: true },
          timestamp: "2026-10-26T14:10:00Z",
          votes: 15,
          content: "Excellent observation, Divya. 3NF explicitly allows dependencies where the right hand side is a prime attribute. When decomposing to BCNF, C->B forces decomposition into (C, B) and (C, A). Notice neither relation has {A, B} together on one table! To test AB->C, you would need to join both tables on C every single write, which is computationally prohibitive. Thus BCNF strictly trades dependency preservation for total redundancy elimination."
        }
      ]
    },
    {
      id: "qa_03",
      title: "Is Python asyncio faster than multiprocessing for web scraping?",
      category: "Python",
      courseId: "crs_py_103",
      author: { name: "Gautam Pillai", role: "Student", avatar: "GP" },
      timestamp: "2026-10-26T16:00:00Z",
      votes: 6,
      views: 65,
      tags: ["Python", "AsyncIO", "Concurrency"],
      content: "I have 5,000 URLs to fetch. Should I use ProcessPoolExecutor or asyncio with aiohttp? What are the memory differences?",
      answers: [
        {
          id: "ans_03_1",
          author: { name: "Priya Chandrasekar", role: "Faculty", avatar: "PC", verified: true },
          timestamp: "2026-10-26T17:20:00Z",
          votes: 8,
          content: "Use `asyncio` with `aiohttp`! Web scraping is strictly I/O-bound (waiting on network sockets). 5,000 processes will crash your RAM due to OS context switching overhead, whereas 5,000 coroutines take only a few tens of megabytes of memory."
        }
      ]
    }
  ],

  // Mentors list
  mentors: [
    {
      id: "mnt_01",
      name: "Ananya Sen",
      role: "Algorithms & Systems Architect",
      company: "Ex-Google / CloudScale",
      avatar: "AS",
      rating: 4.9,
      reviewsCount: 38,
      topics: ["Trees & BST", "Graph Theory", "Dynamic Programming"],
      bio: "Sathyabama alumna with 5+ years experience mentoring collegiate competitive programmers and system architects.",
      availableSlots: ["Today 5:00 PM", "Tomorrow 11:00 AM", "Saturday 4:00 PM"]
    },
    {
      id: "mnt_02",
      name: "Rajesh Varma",
      role: "Staff Database Engineer",
      company: "AuroraDB Corp",
      avatar: "RV",
      rating: 4.8,
      reviewsCount: 29,
      topics: ["Relational Algebra", "Query Tuning", "Distributed Transactions"],
      bio: "Specialist in database storage engines, B+ tree implementations, and high-concurrency ACID protocols.",
      availableSlots: ["Thursday 6:30 PM", "Friday 3:00 PM"]
    },
    {
      id: "mnt_03",
      name: "Priya Chandrasekar",
      role: "Lead ML Systems Engineer",
      company: "Cortex Analytics",
      avatar: "PC",
      rating: 4.95,
      reviewsCount: 54,
      topics: ["Python Internals", "Async Systems", "Signal Processing"],
      bio: "Passionate about bridging computer science fundamentals with practical machine learning deployments.",
      availableSlots: ["Tomorrow 2:00 PM", "Sunday 10:00 AM"]
    }
  ],

  // Simulated Study Sessions with EEG Contextual signals
  neuroSessions: [
    {
      id: "ses_neuro_01",
      userId: "usr_student_01",
      topicId: "top_trees",
      topicTitle: "Trees & Binary Search Trees",
      startedAt: "2026-10-25T14:15:00Z",
      endedAt: "2026-10-25T14:45:00Z",
      durationMinutes: 30,
      source: "DEMO_SIMULATED",
      hardware: "BioAmp EXG Pill (Simulated)",
      samplingRateHz: 250,
      totalSamples: 450000,
      validDataCoveragePercent: 93.4,
      signalQualityStatus: "ACCEPTABLE",
      inferredFocusIndicator: 74,
      associatedQuizAttemptId: "att_base_trees_01",
      timelineData: [
        { minute: 5, focus: 68, quality: 96, state: "Active Reading" },
        { minute: 10, focus: 75, quality: 94, state: "In-order Traversal" },
        { minute: 15, focus: 82, quality: 93, state: "Morris Algorithm" },
        { minute: 20, focus: 61, quality: 91, state: "Quiz Start (Struggle)" },
        { minute: 25, focus: 71, quality: 94, state: "BST Questioning" },
        { minute: 30, focus: 78, quality: 92, state: "Reviewing Explanations" }
      ],
      spectralPower: {
        theta: 24.5,
        alpha: 38.2,
        beta: 29.8,
        gamma: 7.5
      },
      note: "Observed high cognitive engagement during concept reading, with a transient dip when encountering unfamiliar Morris traversal notation."
    },
    {
      id: "ses_neuro_02",
      userId: "usr_student_01",
      topicId: "top_normalization",
      topicTitle: "Database Normalization & BCNF",
      startedAt: "2026-10-26T11:00:00Z",
      endedAt: "2026-10-26T11:20:00Z",
      durationMinutes: 20,
      source: "DEMO_SIMULATED",
      hardware: "BioAmp EXG Pill (Simulated)",
      samplingRateHz: 250,
      totalSamples: 300000,
      validDataCoveragePercent: 41.2,
      signalQualityStatus: "INSUFFICIENT",
      inferredFocusIndicator: null, // Transparently null!
      timelineData: [
        { minute: 5, focus: null, quality: 45, state: "Electrode Disconnect" },
        { minute: 10, focus: null, quality: 38, state: "High Motion Artifact" },
        { minute: 15, focus: null, quality: 42, state: "Unstable Contact" },
        { minute: 20, focus: null, quality: 40, state: "Session Concluded" }
      ],
      spectralPower: null,
      note: "Signal quality fell below minimum threshold (coverage 41.2% < required 70%). Transparently discarded to avoid invalid inference."
    }
  ]
};
