/**
 * NEURONEXUS - Main Application Controller & Single Page Application Router
 * Team: Infinite Loopers (Sathyabama Institute of Science and Technology)
 */

class NeuronexusApp {
  constructor() {
    this.currentView = "landing";
    this.selectedCourseId = "crs_dsa_101";
    this.selectedTopicId = "top_trees";
    this.activeQuestionFilter = "ALL";
    this.activeThreadId = null;

    this.initEventListeners();
    this.renderHeader();
  }

  initEventListeners() {
    // Listen for custom database events
    window.addEventListener("neuronexus:user_changed", (e) => {
      this.renderHeader();
      this.refreshCurrentView();
    });

    window.addEventListener("neuronexus:qa_updated", () => {
      if (this.currentView === "community") {
        this.renderCommunityView();
      }
    });

    window.addEventListener("neuronexus:attempt_saved", () => {
      if (this.currentView === "dashboard") {
        this.renderDashboardView();
      }
    });

    // Hash based routing
    window.addEventListener("hashchange", () => {
      const hash = window.location.hash.replace("#", "") || "landing";
      this.navigate(hash, false);
    });
  }

  navigate(viewName, updateHash = true) {
    this.currentView = viewName;
    if (updateHash) {
      window.location.hash = viewName;
    }

    // Update active nav links
    document.querySelectorAll(".nav-link").forEach(link => {
      const target = link.getAttribute("data-target");
      if (target === viewName) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    const mainContainer = document.getElementById("main-content");
    window.scrollTo({ top: 0, behavior: "smooth" });

    switch (viewName) {
      case "landing":
        this.renderLandingView();
        break;
      case "dashboard":
        this.renderDashboardView();
        break;
      case "neurolearn":
        this.renderNeuroLearnView();
        break;
      case "courses":
        this.renderCoursesView();
        break;
      case "community":
        this.renderCommunityView();
        break;
      case "ai-classroom":
        this.renderAIClassroomView();
        break;
      case "arena":
      case "gamified":
        this.renderArenaView();
        break;
      case "neuro-analysis":
        this.renderNeuroAnalysisView();
        break;
      case "faculty":
        this.renderFacultyView();
        break;
      case "parents":
        this.renderParentsView();
        break;
      case "mentors":
        this.renderMentorsView();
        break;
      case "privacy":
        this.renderPrivacyView();
        break;
      default:
        this.renderLandingView();
    }
  }

  refreshCurrentView() {
    this.navigate(this.currentView, false);
  }

  renderHeader() {
    const user = window.neuronexusDB.getCurrentUser();
    const roleBadge = document.getElementById("header-role-badge");
    const userName = document.getElementById("header-user-name");
    const userAvatar = document.getElementById("header-user-avatar");
    const roleSelect = document.getElementById("header-role-select");

    if (roleBadge) {
      roleBadge.textContent = user.role.toUpperCase();
      roleBadge.className = user.role === "faculty"
        ? "text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30"
        : user.role === "mentor"
        ? "text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30"
        : user.role === "parent"
        ? "text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30"
        : "text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30";
    }

    if (userName) userName.textContent = user.name;
    if (userAvatar) userAvatar.textContent = user.avatar || "ME";
    if (roleSelect) roleSelect.value = user.id;

    // Toggle faculty nav link visibility
    const facultyNavLink = document.getElementById("nav-faculty-link");
    if (facultyNavLink) {
      facultyNavLink.style.display = (user.role === "faculty" || user.role === "student") ? "flex" : "none";
    }
    // Toggle parent nav link visibility
    const parentsNavLink = document.getElementById("nav-parents-link");
    if (parentsNavLink) {
      parentsNavLink.style.display = (user.role === "parent" || user.role === "faculty") ? "flex" : "none";
    }
  }

  // ============================================================
  // VIEW: LANDING PAGE
  // ============================================================
  renderLandingView() {
    const container = document.getElementById("main-content");
    container.innerHTML = `
      <div class="neural-bg min-h-screen">
        <!-- Hero Section -->
        <section class="max-w-6xl mx-auto px-4 pt-16 pb-20 text-center">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium mb-6 animate-pulse-glow">
            <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
            NEURONEXUS â€¢ SATHYABAMA HACKATHON EDITION â€¢ INFINITE LOOPERS
          </div>

          <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Your Learning Has a Pattern. <br/>
            <span class="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent glow-cyan">
              Discover It.
            </span>
          </h1>

          <p class="max-w-2xl mx-auto text-lg text-slate-300 mb-10 leading-relaxed">
            Understand your learning. Improve your potential. NEURONEXUS connects academic evidence, topic-level mastery gaps, explainable revision plans, and optional contextual focus signals.
          </p>

          <div class="flex flex-wrap items-center justify-center gap-4 mb-16">
            <button onclick="window.neuronexusApp.navigate('neurolearn')" class="btn-primary text-base px-8 py-3.5 shadow-lg">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start NeuroLearn Loop
            </button>
            <button onclick="window.neuronexusApp.startDemoWalkthrough()" class="btn-secondary text-base px-7 py-3.5 border-slate-700">
              <svg class="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Explore 2-Min Demo Walkthrough
            </button>
            <button onclick="window.neuronexusApp.navigate('dashboard')" class="btn-outline-cyan text-base px-6 py-3.5">
              Open Dashboard
            </button>
          </div>

          <!-- Feature Cards Banner -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
            <div class="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 glow-card">
              <div class="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3 font-bold">01</div>
              <h3 class="font-bold text-slate-100 mb-1">Academic Assessment</h3>
              <p class="text-xs text-slate-400">Strict MCQ scoring engine with time tracking and granular subtopic question breakdown.</p>
            </div>
            <div class="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 glow-card">
              <div class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3 font-bold">02</div>
              <h3 class="font-bold text-slate-100 mb-1">Gap Discovery</h3>
              <p class="text-xs text-slate-400">Calculates true mastery by concept. Discovers weak subtopics with zero random guessing.</p>
            </div>
            <div class="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 glow-card">
              <div class="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-3 font-bold">03</div>
              <h3 class="font-bold text-slate-100 mb-1">Explainable Revision</h3>
              <p class="text-xs text-slate-400">Every recommendation specifies exact rationale derived from submitted answers.</p>
            </div>
            <div class="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 glow-card">
              <div class="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-3 font-bold">04</div>
              <h3 class="font-bold text-slate-100 mb-1">Measured Improvement</h3>
              <p class="text-xs text-slate-400">Follow-up assessment compares baseline vs retake to verify knowledge consolidation.</p>
            </div>
          </div>
        </section>

        <!-- Signature Feature: The NeuroLearn Loop Showcase -->
        <section class="max-w-6xl mx-auto px-4 py-16 border-t border-slate-800/80">
          <div class="text-center max-w-3xl mx-auto mb-12">
            <span class="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">SIGNATURE FEATURE</span>
            <h2 class="text-3xl font-bold text-white mt-2 mb-4">The NeuroLearn Loop Workflow</h2>
            <p class="text-sm text-slate-300">
              Traditional platforms stop at a percentage mark. NEURONEXUS closes the loop by turning test answers into actionable, measurable academic improvement.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div class="p-6 bg-slate-900/80 rounded-2xl border border-cyan-500/30 relative">
              <div class="text-xs font-mono font-bold text-cyan-400 mb-2">STAGE 1</div>
              <h3 class="text-lg font-bold text-white mb-2">ASSESS</h3>
              <p class="text-xs text-slate-300 mb-4">Take a topic quiz. Answer rigorous MCQs under timed conditions.</p>
              <div class="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 p-2.5 rounded-lg border border-cyan-800/50">
                Course: DSA<br/>Topic: Trees<br/>Baseline Score: 6/10 (60%)
              </div>
            </div>

            <div class="p-6 bg-slate-900/80 rounded-2xl border border-indigo-500/30 relative">
              <div class="text-xs font-mono font-bold text-indigo-400 mb-2">STAGE 2</div>
              <h3 class="text-lg font-bold text-white mb-2">DISCOVER</h3>
              <p class="text-xs text-slate-300 mb-4">Analyze actual answers to pinpoint exact concept failure points.</p>
              <div class="text-[11px] font-mono text-indigo-300 bg-indigo-950/60 p-2.5 rounded-lg border border-indigo-800/50">
                BST Ops: 100%<br/>Tree Traversal: 25% (Gap)<br/>AVL Balancing: 66% (Gap)
              </div>
            </div>

            <div class="p-6 bg-slate-900/80 rounded-2xl border border-teal-500/30 relative">
              <div class="text-xs font-mono font-bold text-teal-400 mb-2">STAGE 3</div>
              <h3 class="text-lg font-bold text-white mb-2">PERSONALIZE</h3>
              <p class="text-xs text-slate-300 mb-4">Algorithmic roadmap targeting only identified weak subtopics with rationale.</p>
              <div class="text-[11px] font-mono text-teal-300 bg-teal-950/60 p-2.5 rounded-lg border border-teal-800/50">
                1. Review Morris Traversal<br/>2. AI Socratic Practice<br/>3. AVL Rotation drill
              </div>
            </div>

            <div class="p-6 bg-slate-900/80 rounded-2xl border border-emerald-500/30 relative">
              <div class="text-xs font-mono font-bold text-emerald-400 mb-2">STAGE 4</div>
              <h3 class="text-lg font-bold text-white mb-2">IMPROVE</h3>
              <p class="text-xs text-slate-300 mb-4">Follow-up assessment measures true delta. Never fabricates improvement.</p>
              <div class="text-[11px] font-mono text-emerald-300 bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-800/50">
                New Score: 9/10 (90%)<br/>Net Delta: +30%<br/>Cycle: Complete
              </div>
            </div>
          </div>

          <div class="mt-8 text-center">
            <button onclick="window.neuronexusApp.navigate('neurolearn')" class="btn-primary text-sm px-6 py-2.5">
              Launch Interactive NeuroLearn Loop Demo â†’
            </button>
          </div>
        </section>

        <!-- Privacy & Responsible AI Section -->
        <section class="max-w-6xl mx-auto px-4 py-16 border-t border-slate-800/80">
          <div class="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 md:p-12 rounded-3xl border border-slate-800">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-white">Ethical Neurotechnology & Responsible AI</h3>
                <p class="text-xs text-slate-400">Honest science, voluntary consent, and strict boundary separation.</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 text-sm">
              <div class="p-4 bg-slate-800/40 rounded-xl border border-slate-700/60">
                <h4 class="font-semibold text-cyan-300 mb-1">Voluntary Opt-In Consent</h4>
                <p class="text-xs text-slate-300">Biometric or EEG contextual signals are 100% voluntary. All academic features, courses, quizzes, and Q&A remain fully functional without connecting any sensors.</p>
              </div>
              <div class="p-4 bg-slate-800/40 rounded-xl border border-slate-700/60">
                <h4 class="font-semibold text-amber-300 mb-1">No Diagnostic Claims</h4>
                <p class="text-xs text-slate-300">NEURONEXUS does not claim medical or cognitive diagnosis. High focus does not prove learning, nor does low focus prove lack of comprehension.</p>
              </div>
              <div class="p-4 bg-slate-800/40 rounded-xl border border-slate-700/60">
                <h4 class="font-semibold text-emerald-300 mb-1">Transparent Signal Rejection</h4>
                <p class="text-xs text-slate-300">If signal quality or valid coverage falls below 70%, the system transparently reports insufficient data instead of fabricating an unverified estimate.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Footer -->
        <footer class="max-w-6xl mx-auto px-4 py-8 border-t border-slate-800 text-xs text-slate-400 flex flex-wrap justify-between items-center gap-4">
          <div>
            <span class="font-bold text-slate-200">NEURONEXUS</span> â€¢ Developed for Hackathon by <strong class="text-cyan-400">Infinite Loopers</strong> (Sathyabama Institute of Science and Technology).
          </div>
          <div class="flex items-center gap-4">
            <a href="#privacy" onclick="window.neuronexusApp.navigate('privacy')" class="hover:text-cyan-300">Privacy & Consent</a>
            <span>â€¢</span>
            <span class="badge-demo">DEMO MODE ACTIVE</span>
          </div>
        </footer>
      </div>
    `;
  }

  // ============================================================
  // VIEW: STUDENT DASHBOARD
  // ============================================================
  renderDashboardView() {
    const user = window.neuronexusDB.getCurrentUser();
    const attempts = window.neuronexusDB.getAttempts(user.id);
    const courses = window.neuronexusDB.getCourses();
    const sessions = window.neuronexusDB.getNeuroSessions(user.id);
    const container = document.getElementById("main-content");

    // Compute student stats
    const totalQuizzes = attempts.length;
    const avgScore = totalQuizzes > 0
      ? Math.round((attempts.reduce((a, c) => a + c.percentage, 0) / totalQuizzes) * 10) / 10
      : 0;

    const lastAttempt = attempts[attempts.length - 1];

    container.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 py-8">
        <!-- Top Welcome & Status Banner -->
        <div class="flex flex-wrap items-center justify-between gap-4 p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 rounded-2xl border border-slate-800 mb-8">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="badge-demo">DEMO STUDENT</span>
              <span class="text-xs text-slate-400 font-mono">${user.department} â€¢ ${user.semester}</span>
              <span class="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-bold">
                LVL 4: Tree Navigator (2,850 XP)
              </span>
              <span class="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono font-bold">
                ðŸ”¥ 7-Day Streak
              </span>
            </div>
            <h2 class="text-2xl font-bold text-white">Welcome back, ${user.name}</h2>
            <p class="text-sm text-slate-300">Your personalized academic analytics, live mental status, and gamified study loop are active.</p>
          </div>
          <div class="flex items-center gap-3">
            <button onclick="window.neuronexusApp.navigate('arena')" class="btn-secondary text-sm px-4 py-2.5 border-amber-500/40 text-amber-300">
              âš¡ NeuroBlitz Arena
            </button>
            <button onclick="window.neuronexusApp.navigate('neurolearn')" class="btn-primary text-sm px-4 py-2.5">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Start NeuroLearn Loop
            </button>
          </div>
        </div>

        <!-- Metrics Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div class="p-5 bg-slate-900/80 rounded-2xl border border-slate-800">
            <div class="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Enrolled Courses</div>
            <div class="text-3xl font-extrabold text-white">${courses.length}</div>
            <div class="text-xs text-emerald-400 mt-1">4 core computing tracks</div>
          </div>
          <div class="p-5 bg-slate-900/80 rounded-2xl border border-slate-800">
            <div class="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Assessments Taken</div>
            <div class="text-3xl font-extrabold text-violet-400">${totalQuizzes}</div>
            <div class="text-xs text-slate-400 mt-1">Stored attempts with subtopic analytics</div>
          </div>
          <div class="p-5 bg-slate-900/80 rounded-2xl border border-slate-800">
            <div class="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Average Mastery</div>
            <div class="text-3xl font-extrabold text-emerald-400">${avgScore}%</div>
            <div class="text-xs text-slate-400 mt-1">Across evaluated question banks</div>
          </div>
          <div class="p-5 bg-slate-900/80 rounded-2xl border border-slate-800">
            <div class="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Live Mental State</div>
            <div class="text-2xl font-extrabold text-emerald-400">Relaxed (88%)</div>
            <div class="text-xs text-slate-300 mt-1">Stress Level: <strong class="text-emerald-400">14% (LOW)</strong></div>
          </div>
        </div>

        <!-- Live Brainwave Monitor & Mental Status (Stress & Relaxation) Card -->
        <div class="p-6 bg-slate-900/90 rounded-3xl border border-emerald-500/30 mb-8 glow-card">
          <div class="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">LIVE MENTAL STATUS & BIOAMP OSCILLOSCOPE</span>
              </div>
              <h3 class="text-lg font-bold text-white mt-0.5">Real-Time Brainwaves â€¢ Stress & Relaxation Telemetry</h3>
            </div>
            <button onclick="window.neuronexusApp.navigate('neuro-analysis')" class="btn-outline-emerald text-xs px-3.5 py-1.5">
              Open Full Neuro Analysis â†’
            </button>
          </div>

          <!-- Dual Stress & Relaxation Live Indicators -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
              <div class="flex justify-between items-center mb-1">
                <span class="text-xs font-mono font-semibold text-slate-300">STRESS LEVEL</span>
                <span id="dash-stress-val" class="text-xs font-mono font-bold text-emerald-400">14% (LOW / CALM)</span>
              </div>
              <div class="w-full bg-slate-800 rounded-full h-2 mb-1.5 overflow-hidden">
                <div id="dash-stress-bar" class="bg-emerald-500 h-2 rounded-full transition-all duration-500" style="width: 14%"></div>
              </div>
              <div class="text-[11px] text-slate-400">Minimal cortical tension. Sympathetic nervous system settled.</div>
            </div>

            <div class="p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
              <div class="flex justify-between items-center mb-1">
                <span class="text-xs font-mono font-semibold text-slate-300">RELAXATION STATE</span>
                <span id="dash-relax-val" class="text-xs font-mono font-bold text-emerald-400">88% (DEEPLY RELAXED)</span>
              </div>
              <div class="w-full bg-slate-800 rounded-full h-2 mb-1.5 overflow-hidden">
                <div id="dash-relax-bar" class="bg-emerald-500 h-2 rounded-full transition-all duration-500" style="width: 88%"></div>
              </div>
              <div class="text-[11px] text-slate-400">Prominent Alpha wave rhythm. Optimal mental readiness for encoding.</div>
            </div>
          </div>

          <!-- Mini Oscilloscope Canvas -->
          <div class="oscilloscope-screen w-full mb-4">
            <canvas id="dashboard-oscilloscope-canvas" width="840" height="150" class="w-full h-auto block"></canvas>
          </div>

          <!-- Dynamic Mental Status Alert -->
          <div id="dash-mental-alert-box" class="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-500/40 flex items-start justify-between gap-4">
            <div class="flex items-start gap-3">
              <span id="dash-alert-icon" class="text-2xl">ðŸ˜Œ</span>
              <div>
                <div class="flex items-center gap-2">
                  <span id="dash-alert-badge" class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    DEEPLY RELAXED & CALM
                  </span>
                  <span id="dash-alert-band" class="text-xs text-slate-400 font-mono">Alpha Synchrony (10 Hz)</span>
                </div>
                <div id="dash-alert-title" class="text-xs font-bold text-slate-100 mt-1">
                  Optimal Cognitive State: Stress is Low, Relaxation is High
                </div>
                <div id="dash-alert-desc" class="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  The student is in a relaxed, receptive mental state. Perfect time to review complex data structures topics without anxiety.
                </div>
              </div>
            </div>
            <div class="hidden sm:flex flex-col gap-1.5 text-right">
              <span class="text-[10px] text-slate-400 font-mono uppercase">Quick Simulator:</span>
              <div class="flex gap-1.5">
                <button onclick="window.neuronexusApp.setMentalScenario('RELAX')" class="text-[11px] px-2 py-1 rounded bg-slate-800 text-emerald-300 border border-slate-700 hover:bg-slate-700">Relax</button>
                <button onclick="window.neuronexusApp.setMentalScenario('FOCUS')" class="text-[11px] px-2 py-1 rounded bg-slate-800 text-teal-300 border border-slate-700 hover:bg-slate-700">Focus</button>
                <button onclick="window.neuronexusApp.setMentalScenario('STRESS')" class="text-[11px] px-2 py-1 rounded bg-slate-800 text-rose-300 border border-slate-700 hover:bg-slate-700">Stress</button>
                <button onclick="window.neuronexusApp.setMentalScenario('FATIGUE')" class="text-[11px] px-2 py-1 rounded bg-slate-800 text-amber-300 border border-slate-700 hover:bg-slate-700">Fatigue</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Recommended Next Action (Explainable) -->
        <div class="p-6 bg-slate-900/70 rounded-2xl border border-cyan-500/30 mb-8 glow-card">
          <div class="flex items-start justify-between gap-4">
            <div>
              <span class="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">RECOMMENDED NEXT ACTION</span>
              <h3 class="text-lg font-bold text-white mt-1 mb-2">
                ${lastAttempt && lastAttempt.identifiedGaps && lastAttempt.identifiedGaps.length > 0
                  ? `Address Knowledge Gap: ${lastAttempt.identifiedGaps[0].subtopic}`
                  : "Start a Baseline Assessment on Trees & BST"}
              </h3>
              <p class="text-sm text-slate-300 mb-4 max-w-2xl leading-relaxed">
                ${lastAttempt && lastAttempt.identifiedGaps && lastAttempt.identifiedGaps.length > 0
                  ? `Rationale: Your recent assessment on ${lastAttempt.topicId} showed ${lastAttempt.identifiedGaps[0].accuracy}% accuracy in ${lastAttempt.identifiedGaps[0].subtopic}. Completing the targeted revision cycle will bridge this gap.`
                  : "Begin your baseline quiz on Trees & BST to identify weak concepts and generate a custom revision plan."}
              </p>
              <div class="flex items-center gap-3">
                <button onclick="window.neuronexusApp.navigate('neurolearn')" class="btn-primary text-xs px-4 py-2">
                  Launch Recommended Revision â†’
                </button>
                <button onclick="window.neuronexusApp.navigate('courses')" class="btn-secondary text-xs px-4 py-2">
                  Browse Lesson Notes
                </button>
              </div>
            </div>
            <div class="hidden sm:block text-right">
              <span class="badge-demo">EXPLAINABLE AI RULE</span>
            </div>
          </div>
        </div>

        <!-- Two Columns: Enrolled Courses & Recent Attempts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <!-- Courses -->
          <div class="p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-bold text-white">Active Courses</h3>
              <button onclick="window.neuronexusApp.navigate('courses')" class="text-xs text-cyan-400 hover:underline">View All â†’</button>
            </div>
            <div class="space-y-3">
              ${courses.map(c => `
                <div class="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/50 flex items-center justify-between hover:bg-slate-800/70 transition-colors">
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-mono font-semibold text-cyan-300">${c.code}</span>
                      <span class="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">${c.badge}</span>
                    </div>
                    <div class="font-semibold text-slate-100 text-sm mt-0.5">${c.title}</div>
                    <div class="text-xs text-slate-400">${c.instructor} â€¢ ${c.topics.length} topics</div>
                  </div>
                  <button onclick="window.neuronexusApp.selectCourseAndNavigate('${c.id}')" class="btn-outline-cyan text-xs px-3 py-1.5">
                    Open
                  </button>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Recent Attempts -->
          <div class="p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-bold text-white">Assessment History</h3>
              <span class="text-xs text-slate-400 font-mono">${attempts.length} logged</span>
            </div>
            <div class="space-y-3">
              ${attempts.length === 0 ? `
                <div class="p-8 text-center text-slate-400 text-sm">No quiz attempts yet. Start your first quiz in the NeuroLearn Loop!</div>
              ` : attempts.slice().reverse().map(att => `
                <div class="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/50 flex items-center justify-between">
                  <div>
                    <div class="font-semibold text-slate-200 text-sm">Topic: ${att.topicId}</div>
                    <div class="text-xs text-slate-400">${new Date(att.timestamp).toLocaleDateString()} â€¢ ${att.timeTakenSeconds}s duration</div>
                    <div class="text-xs text-cyan-400 mt-1">Score: ${att.score}/${att.total} (${att.percentage}%)</div>
                  </div>
                  <div class="text-right">
                    <span class="text-xs px-2 py-1 rounded-full font-bold ${att.percentage >= 70 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}">
                      ${att.percentage >= 70 ? 'Mastered' : 'Needs Practice'}
                    </span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      window.brainwaveOscilloscope.initCanvas("dashboard-oscilloscope-canvas");
    }, 50);
  }

  // ============================================================
  // VIEW: THE SIGNATURE NEUROLEARN LOOP
  // ============================================================
  renderNeuroLearnView() {
    const container = document.getElementById("main-content");
    const activeState = window.neuroLearnEngine.activeQuizState;

    // Check if an assessment is in progress or completed
    if (activeState && !activeState.submitted) {
      this.renderAssessQuizUI(activeState);
      return;
    }

    if (activeState && activeState.submitted && activeState.result) {
      this.renderAssessmentResults(activeState.result);
      return;
    }

    // Default Entry Stage: Course & Topic Selection
    const courses = window.neuronexusDB.getCourses();
    const defaultTopic = window.neuronexusDB.getTopic("top_trees");
    const priorAttempts = window.neuronexusDB.getAttemptsByTopic("top_trees");

    container.innerHTML = `
      <div class="max-w-4xl mx-auto px-4 py-8">
        <!-- Breadcrumb & Tagline -->
        <div class="mb-6">
          <div class="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
            <span>NEURONEXUS</span> <span>â€º</span> <span>SIGNATURE WORKFLOW</span> <span>â€º</span> <span>NEUROLEARN LOOP</span>
          </div>
          <h2 class="text-3xl font-extrabold text-white">The NeuroLearn Loop</h2>
          <p class="text-sm text-slate-300">A rigorous 4-stage improvement cycle: Assess â†’ Discover â†’ Personalize â†’ Improve.</p>
        </div>

        <!-- 4-Stage Progress Stepper -->
        <div class="grid grid-cols-4 gap-2 mb-8 text-center text-xs font-semibold">
          <div class="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">1. ASSESS</div>
          <div class="p-2.5 rounded-xl bg-slate-800 text-slate-400">2. DISCOVER</div>
          <div class="p-2.5 rounded-xl bg-slate-800 text-slate-400">3. PERSONALIZE</div>
          <div class="p-2.5 rounded-xl bg-slate-800 text-slate-400">4. IMPROVE</div>
        </div>

        <!-- Topic Selection Card -->
        <div class="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 mb-6">
          <h3 class="text-lg font-bold text-white mb-2">Step 1: Select Topic for Assessment</h3>
          <p class="text-xs text-slate-300 mb-4">Choose from the academic syllabus to launch an interactive 10-question evaluation.</p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-4 bg-slate-800/60 rounded-xl border border-cyan-500/40 cursor-pointer">
              <div class="flex justify-between items-center mb-1">
                <span class="text-xs font-mono text-cyan-400">CSE-301 â€¢ DSA</span>
                <span class="text-xs px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-200">Recommended Demo</span>
              </div>
              <h4 class="font-bold text-white">Trees & Binary Search Trees</h4>
              <p class="text-xs text-slate-300 mt-1">Covers BST operations, tree traversals, Morris algorithm, and AVL balancing.</p>
              <div class="text-[11px] text-slate-400 mt-2">10 Evaluated MCQs â€¢ ${priorAttempts.length} prior attempt logged</div>
            </div>

            <div class="p-4 bg-slate-800/30 rounded-xl border border-slate-700/40 opacity-70">
              <div class="flex justify-between items-center mb-1">
                <span class="text-xs font-mono text-slate-400">CSE-304 â€¢ DBMS</span>
                <span class="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">Available</span>
              </div>
              <h4 class="font-bold text-slate-200">Normalization & BCNF</h4>
              <p class="text-xs text-slate-400 mt-1">Functional dependencies, 3NF conditions, and lossless joins.</p>
              <div class="text-[11px] text-slate-500 mt-2">Core relational algebra</div>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <div class="text-xs text-slate-400">
              Baseline history available: <strong class="text-slate-200">${priorAttempts.length > 0 ? 'Yes (Initial score 6/10)' : 'None (Will create baseline)'}</strong>
            </div>
            <div class="flex items-center gap-3">
              <button onclick="window.neuronexusApp.startAssessment('crs_dsa_101', 'top_trees', false)" class="btn-primary text-sm px-6 py-2.5">
                Launch Assessment Quiz (10 Qs) â†’
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      window.brainwaveOscilloscope.initCanvas("dashboard-oscilloscope-canvas");
    }, 50);
  }

  // Stage 1 Assessment Runner
  startAssessment(courseId, topicId, isFollowUp = false) {
    window.neuroLearnEngine.startAssessment(courseId, topicId, isFollowUp);
    this.renderNeuroLearnView();
  }

  renderAssessQuizUI(state) {
    const container = document.getElementById("main-content");
    const qIndex = state.currentIndex;
    const q = state.questions[qIndex];
    const totalQ = state.questions.length;
    const currentChoice = state.userAnswers[q.id];

    container.innerHTML = `
      <div class="max-w-3xl mx-auto px-4 py-8">
        <!-- Header & Stepper -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <div class="text-xs font-mono text-cyan-400 uppercase">Stage 1: Assessment In Progress</div>
            <h2 class="text-xl font-bold text-white">Topic: Trees & Binary Search Trees</h2>
          </div>
          <div class="text-right">
            <div class="text-xs text-slate-400">Question</div>
            <div class="text-lg font-mono font-bold text-cyan-300">${qIndex + 1} / ${totalQ}</div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-slate-800 rounded-full h-2 mb-8 overflow-hidden">
          <div class="bg-cyan-500 h-2 transition-all duration-300" style="width: ${((qIndex + 1) / totalQ) * 100}%"></div>
        </div>

        <!-- Question Card -->
        <div class="p-6 md:p-8 bg-slate-900/90 rounded-2xl border border-slate-800 mb-6">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-xs font-mono px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              ${q.subtopic || 'General'}
            </span>
            <span class="text-xs text-slate-400 font-mono">Difficulty: ${q.difficulty || 'Medium'}</span>
          </div>

          <h3 class="text-lg md:text-xl font-semibold text-slate-100 mb-6 leading-relaxed">
            ${q.question}
          </h3>

          <!-- Options -->
          <div class="space-y-3 mb-8">
            ${q.options.map((opt, idx) => `
              <div onclick="window.neuronexusApp.selectQuizOption('${q.id}', ${idx})"
                   class="p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${currentChoice === idx ? 'bg-cyan-950/40 border-cyan-400 text-cyan-100' : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 text-slate-200'}">
                <div class="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-mono font-bold ${currentChoice === idx ? 'border-cyan-400 bg-cyan-400 text-slate-950' : 'border-slate-500 text-slate-400'}">
                  ${String.fromCharCode(65 + idx)}
                </div>
                <div class="text-sm font-medium flex-1">${opt}</div>
              </div>
            `).join('')}
          </div>

          <!-- Bottom Navigation Controls -->
          <div class="flex items-center justify-between pt-4 border-t border-slate-800">
            <button onclick="window.neuronexusApp.navigateQuizQuestion(${qIndex - 1})"
                    ${qIndex === 0 ? 'disabled' : ''}
                    class="btn-secondary text-xs px-4 py-2 ${qIndex === 0 ? 'opacity-40 cursor-not-allowed' : ''}">
              â† Previous
            </button>

            ${qIndex < totalQ - 1 ? `
              <button onclick="window.neuronexusApp.navigateQuizQuestion(${qIndex + 1})" class="btn-primary text-xs px-5 py-2">
                Next Question â†’
              </button>
            ` : `
              <button onclick="window.neuronexusApp.submitCurrentQuiz()" class="btn-primary text-xs px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600">
                Submit Assessment âœ“
              </button>
            `}
          </div>
        </div>

        <!-- Fast Fill Demo Helper (For Hackathon Judges) -->
        <div class="p-3 bg-slate-900/40 rounded-xl border border-slate-800 text-xs flex items-center justify-between text-slate-400">
          <span>Hackathon Demo Helper:</span>
          <div class="flex items-center gap-2">
            <button onclick="window.neuronexusApp.autoFillQuiz('baseline')" class="text-cyan-400 hover:underline">
              Auto-fill 60% (Baseline with Gaps)
            </button>
            <span>â€¢</span>
            <button onclick="window.neuronexusApp.autoFillQuiz('mastery')" class="text-emerald-400 hover:underline">
              Auto-fill 90% (Mastery / Retake)
            </button>
          </div>
        </div>

      </div>
    `;
  }


  selectQuizOption(questionId, optionIndex) {
    window.neuroLearnEngine.recordAnswer(questionId, optionIndex);
    this.renderAssessQuizUI(window.neuroLearnEngine.activeQuizState);
  }

  navigateQuizQuestion(newIndex) {
    const s = window.neuroLearnEngine.activeQuizState;
    if (newIndex >= 0 && newIndex < s.questions.length) {
      s.currentIndex = newIndex;
      this.renderAssessQuizUI(s);
    }
  }

  submitCurrentQuiz() {
    const result = window.neuroLearnEngine.submitAssessment();
    this.renderAssessmentResults(result);
  }

  autoFillQuiz(scenario = "baseline") {
    const s = window.neuroLearnEngine.activeQuizState;
    s.questions.forEach((q, idx) => {
      if (scenario === "baseline") {
        // Questions 1, 4, 6, 8, 10 correct; 2, 3, 5, 7, 9 incorrect
        if ([0, 3, 5, 7, 9].includes(idx)) {
          s.userAnswers[q.id] = q.correctIndex;
        } else {
          s.userAnswers[q.id] = (q.correctIndex + 1) % 4; // Wrong choice
        }
      } else {
        // 90% scenario: 9 out of 10 correct
        if (idx === 2) {
          s.userAnswers[q.id] = (q.correctIndex + 1) % 4;
        } else {
          s.userAnswers[q.id] = q.correctIndex;
        }
      }
    });
    this.renderAssessQuizUI(s);
  }

  // ============================================================
  // STAGES 2, 3, 4: DISCOVER, PERSONALIZE & IMPROVE RESULTS
  // ============================================================
  renderAssessmentResults(result) {
    const container = document.getElementById("main-content");
    const comparison = window.neuroLearnEngine.compareWithPriorAttempt(result);

    container.innerHTML = `
      <div class="max-w-4xl mx-auto px-4 py-8">
        <!-- Top Status Banner -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <div class="text-xs font-mono text-cyan-400 uppercase">NeuroLearn Loop Analysis</div>
            <h2 class="text-2xl font-bold text-white">Assessment Complete: Results & Personalized Plan</h2>
          </div>
          <button onclick="window.neuronexusApp.resetNeuroLearnLoop()" class="btn-secondary text-xs px-3 py-1.5">
            Restart Cycle
          </button>
        </div>

        <!-- 4-Stage Progress Stepper (Updated) -->
        <div class="grid grid-cols-4 gap-2 mb-8 text-center text-xs font-semibold">
          <div class="p-2.5 rounded-xl bg-slate-800 text-slate-300">1. ASSESS âœ“</div>
          <div class="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">2. DISCOVER</div>
          <div class="p-2.5 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40">3. PERSONALIZE</div>
          <div class="p-2.5 rounded-xl ${comparison.hasBaseline ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-500'}">
            4. IMPROVE ${comparison.hasBaseline ? 'âœ“' : ''}
          </div>
        </div>

        <!-- Improvement Delta Alert if baseline comparison exists -->
        ${comparison.hasBaseline ? `
          <div class="p-6 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 rounded-2xl border border-emerald-500/40 mb-8">
            <div class="flex items-center gap-3 mb-2">
              <span class="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">âœ“</span>
              <div>
                <h3 class="text-lg font-bold text-emerald-300">Measured Learning Improvement Cycle Completed!</h3>
                <p class="text-xs text-slate-300">Comparison derived from real stored assessment records.</p>
              </div>
            </div>
            <div id="comparison-bars-container" class="mt-4"></div>
          </div>
        ` : ''}

        <!-- STAGE 2: DISCOVER (Subtopic Breakdown & Identified Gaps) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="p-6 bg-slate-900/80 rounded-2xl border border-slate-800">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-bold text-white">Stage 2: Topic Accuracy Breakdown</h3>
              <div class="text-right">
                <span class="text-2xl font-bold text-cyan-400">${result.score}/${result.total}</span>
                <span class="text-xs text-slate-400 block">${result.percentage}% Accuracy</span>
              </div>
            </div>
            <div id="subtopic-bars-container"></div>
          </div>

          <div class="p-6 bg-slate-900/80 rounded-2xl border border-slate-800">
            <h3 class="font-bold text-white mb-2">Identified Learning Gaps</h3>
            <p class="text-xs text-slate-400 mb-4">Concepts with accuracy below the 70% threshold:</p>
            ${result.identifiedGaps.length === 0 ? `
              <div class="p-6 text-center bg-emerald-950/20 rounded-xl border border-emerald-500/30 text-emerald-300 text-sm">
                No critical gaps detected! You achieved mastery across all evaluated subtopics.
              </div>
            ` : `
              <div class="space-y-3">
                ${result.identifiedGaps.map(g => `
                  <div class="p-3 bg-slate-800/60 rounded-xl border border-rose-500/30">
                    <div class="flex justify-between items-center text-xs mb-1">
                      <span class="font-bold text-rose-300">${g.subtopic}</span>
                      <span class="px-2 py-0.5 rounded bg-rose-950/60 text-rose-400 font-mono">${g.accuracy}% Accuracy</span>
                    </div>
                    <p class="text-xs text-slate-300">${g.reason}</p>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>

        <!-- STAGE 3: PERSONALIZE (Targeted Revision Plan with Explicit Rationale) -->
        <div class="p-6 bg-slate-900/80 rounded-2xl border border-teal-500/30 mb-8">
          <div class="flex items-center justify-between mb-4">
            <div>
              <span class="text-xs font-mono font-bold text-teal-400 uppercase">Stage 3: Personalize</span>
              <h3 class="text-lg font-bold text-white">Targeted Revision Roadmap</h3>
            </div>
            <span class="badge-demo">EXPLAINABLE RECOMMENDATIONS</span>
          </div>

          <div class="space-y-4">
            ${result.recommendations.map(rec => `
              <div class="p-4 bg-slate-800/40 rounded-xl border border-slate-700/60 hover:border-teal-500/40 transition-colors">
                <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div class="flex items-center gap-2">
                    <span class="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold flex items-center justify-center">
                      ${rec.stepNumber}
                    </span>
                    <h4 class="font-semibold text-slate-100 text-sm">${rec.title}</h4>
                  </div>
                  <button onclick="window.neuronexusApp.executeRecommendation('${rec.targetAction}', '${rec.topicId}', '${rec.subtopic || ''}')"
                          class="btn-primary text-xs px-3.5 py-1.5">
                    Execute Step â†’
                  </button>
                </div>
                <p class="text-xs text-slate-300 mb-2">${rec.description}</p>
                <div class="text-[11px] text-cyan-300/90 font-mono bg-cyan-950/40 px-3 py-1.5 rounded-lg border border-cyan-800/30">
                  <strong>Why recommended:</strong> ${rec.reason}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Review Question Answers & Explanations Accordion -->
        <div class="p-6 bg-slate-900/60 rounded-2xl border border-slate-800">
          <h3 class="font-bold text-white mb-4">Detailed Question Review & Explanations</h3>
          <div class="space-y-3">
            ${window.neuroLearnEngine.activeQuizState.questions.map((q, idx) => {
              const userAns = result.answers[q.id];
              const isCorrect = userAns === q.correctIndex;
              return `
                <div class="p-4 bg-slate-800/30 rounded-xl border ${isCorrect ? 'border-slate-800' : 'border-rose-900/40'}">
                  <div class="flex items-center justify-between text-xs mb-2">
                    <span class="font-mono text-slate-400">Q${idx + 1} â€¢ ${q.subtopic}</span>
                    <span class="px-2 py-0.5 rounded font-bold ${isCorrect ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}">
                      ${isCorrect ? 'Correct âœ“' : 'Incorrect âœ—'}
                    </span>
                  </div>
                  <div class="text-sm font-medium text-slate-200 mb-2">${q.question}</div>
                  <div class="text-xs text-slate-300 space-y-1 mb-2">
                    <div>Your answer: <strong class="${isCorrect ? 'text-emerald-400' : 'text-rose-400'}">${q.options[userAns] || 'None chosen'}</strong></div>
                    ${!isCorrect ? `<div>Correct answer: <strong class="text-emerald-400">${q.options[q.correctIndex]}</strong></div>` : ''}
                  </div>
                  <div class="text-xs text-slate-400 bg-slate-900/70 p-2.5 rounded-lg border border-slate-800 leading-relaxed">
                    <strong>Explanation:</strong> ${q.explanation}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    // Render SVG Charts into containers
    setTimeout(() => {
      window.NeuroCharts.renderSubtopicBars("subtopic-bars-container", result.subtopicBreakdown);
      if (comparison.hasBaseline) {
        window.NeuroCharts.renderComparisonBars("comparison-bars-container", comparison);
      }
    }, 50);
  }

  executeRecommendation(action, topicId, subtopic) {
    if (action === "OPEN_LESSON") {
      this.selectedTopicId = topicId;
      this.navigate("courses");
    } else if (action === "AI_PRACTICE") {
      this.navigate("ai-classroom");
    } else if (action === "START_RETAKE") {
      this.startAssessment("crs_dsa_101", topicId, true);
    } else if (action === "OPEN_COMMUNITY") {
      this.navigate("community");
    }
  }

  resetNeuroLearnLoop() {
    window.neuroLearnEngine.activeQuizState = null;
    this.renderNeuroLearnView();
  }

  // ============================================================
  // VIEW: COURSES & STRUCTURED LESSON READER
  // ============================================================
  renderCoursesView() {
    const courses = window.neuronexusDB.getCourses();
    const currentCourse = window.neuronexusDB.getCourse(this.selectedCourseId) || courses[0];
    const currentTopic = currentCourse.topics.find(t => t.id === this.selectedTopicId) || currentCourse.topics[0];
    const container = document.getElementById("main-content");

    container.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 py-8">
        <div class="flex items-center justify-between mb-8">
          <div>
            <div class="text-xs font-mono text-cyan-400 uppercase">COURSE MANAGEMENT</div>
            <h2 class="text-3xl font-bold text-white">Curriculum & Syllabus</h2>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- Course / Topic Sidebar List -->
          <div class="space-y-4">
            <div class="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Courses</div>
            ${courses.map(c => `
              <div onclick="window.neuronexusApp.selectCourse('${c.id}')"
                   class="p-3.5 rounded-xl border cursor-pointer transition-all ${c.id === this.selectedCourseId ? 'bg-cyan-950/40 border-cyan-400' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'}">
                <div class="text-xs font-mono text-cyan-400">${c.code}</div>
                <div class="font-semibold text-slate-200 text-sm">${c.title}</div>
                <div class="text-xs text-slate-400 mt-1">${c.topics.length} topics â€¢ ${c.duration}</div>
              </div>
            `).join('')}

            <div class="pt-4 border-t border-slate-800">
              <div class="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">Topics in ${currentCourse.code}</div>
              <div class="space-y-2">
                ${currentCourse.topics.map(top => `
                  <div onclick="window.neuronexusApp.selectTopic('${top.id}')"
                       class="p-2.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${top.id === this.selectedTopicId ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200 bg-slate-900/40'}">
                    ${top.title}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Main Lesson Content Reader -->
          <div class="lg:col-span-3">
            <div class="p-6 md:p-8 bg-slate-900/80 rounded-2xl border border-slate-800">
              <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
                <div>
                  <div class="text-xs font-mono text-cyan-400">${currentCourse.title} â€º Topic ${currentTopic.order || 1}</div>
                  <h3 class="text-2xl font-bold text-white mt-1">${currentTopic.title}</h3>
                </div>
                <div class="flex items-center gap-3">
                  <button onclick="window.neuronexusApp.startAssessment('${currentCourse.id}', '${currentTopic.id}')" class="btn-primary text-xs px-4 py-2">
                    Take Topic Quiz â†’
                  </button>
                </div>
              </div>

              <!-- Topic Description & Subtopics Pills -->
              <div class="mb-6">
                <p class="text-sm text-slate-300 mb-3">${currentTopic.description}</p>
                <div class="flex flex-wrap gap-2">
                  ${(currentTopic.subtopics || []).map(sub => `
                    <span class="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                      ${sub}
                    </span>
                  `).join('')}
                </div>
              </div>

              <!-- Lesson Content Block -->
              <div class="prose prose-invert max-w-none text-slate-300 text-sm space-y-4 bg-slate-950/40 p-6 rounded-xl border border-slate-800">
                <h4 class="text-base font-bold text-white">${currentTopic.lesson ? currentTopic.lesson.title : 'Lesson Overview'}</h4>
                <div class="whitespace-pre-line font-mono text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-lg border border-slate-800">
                  ${currentTopic.lesson ? currentTopic.lesson.content : 'Comprehensive course notes and mathematical proofs.'}
                </div>
              </div>

              <!-- Video Tutorial Section -->
              ${currentTopic.videoUrl ? `
              <div class="mt-6">
                <div class="flex items-center gap-2 mb-3">
                  <span class="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
                  <span class="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider">ðŸ“¹ Video Tutorial</span>
                </div>
                <div class="text-xs text-slate-400 mb-3">${currentTopic.videoTitle || 'Watch this topic explained step-by-step'}</div>
                <div class="relative rounded-2xl overflow-hidden border border-slate-700" style="aspect-ratio:16/9;">
                  <iframe
                    src="${currentTopic.videoUrl}"
                    title="${currentTopic.videoTitle || 'Tutorial Video'}"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                    style="width:100%;height:100%;position:absolute;top:0;left:0;"
                  ></iframe>
                </div>
                <div class="mt-2 text-[11px] text-slate-500 italic">âš ï¸ Video requires internet. Sourced from YouTube for educational reference only.</div>
              </div>
              ` : `
              <div class="mt-6 p-4 bg-slate-900/40 rounded-xl border border-dashed border-slate-700 text-xs text-slate-500 text-center">
                ðŸ“¹ No video tutorial linked for this topic yet.
              </div>
              `}

              <div class="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div class="text-xs text-slate-400">
                  Ready to test your knowledge? Launch the NeuroLearn Loop for this topic.
                </div>
                <button onclick="window.neuronexusApp.startAssessment('${currentCourse.id}', '${currentTopic.id}')" class="btn-primary text-xs px-5 py-2">
                  Start Assessment Quiz â†’
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      window.brainwaveOscilloscope.initCanvas("dashboard-oscilloscope-canvas");
    }, 50);
  }

  selectCourse(courseId) {
    this.selectedCourseId = courseId;
    const c = window.neuronexusDB.getCourse(courseId);
    if (c && c.topics.length > 0) {
      this.selectedTopicId = c.topics[0].id;
    }
    this.renderCoursesView();
  }

  selectTopic(topicId) {
    this.selectedTopicId = topicId;
    this.renderCoursesView();
  }

  selectCourseAndNavigate(courseId) {
    this.selectCourse(courseId);
    this.navigate("courses");
  }

  // ============================================================
  // VIEW: COMMUNITY Q&A (CAMPUS-Q&A ENGINE)
  // ============================================================
  renderCommunityView() {
    const questions = window.communityQA.getFilteredQuestions();
    const container = document.getElementById("main-content");

    container.innerHTML = `
      <div class="max-w-5xl mx-auto px-4 py-8">
        <!-- Header -->
        <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <div class="text-xs font-mono text-cyan-400 uppercase">CAMPUS-Q&A CORE PLATFORM</div>
            <h2 class="text-3xl font-bold text-white">Community Discussion & Peer Q&A</h2>
            <p class="text-sm text-slate-300">Ask algorithmic questions, receive verified faculty/mentor solutions, and collaborate.</p>
          </div>
          <button onclick="window.neuronexusApp.openAskQuestionModal()" class="btn-primary text-sm px-5 py-2.5">
            + Ask Question
          </button>
        </div>

        <!-- Filter & Search Toolbar -->
        <div class="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/80 rounded-2xl border border-slate-800 mb-6">
          <div class="flex flex-wrap items-center gap-2">
            ${['ALL', 'Data Structures', 'DBMS', 'Python'].map(cat => `
              <button onclick="window.neuronexusApp.filterCommunityCategory('${cat}')"
                      class="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${this.activeQuestionFilter === cat ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}">
                ${cat}
              </button>
            `).join('')}
          </div>
          <div class="relative w-full sm:w-64">
            <input type="text" id="community-search-input"
                   placeholder="Search questions or tags..."
                   oninput="window.neuronexusApp.searchCommunity(this.value)"
                   class="w-full bg-slate-950 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400" />
          </div>
        </div>

        <!-- Questions List -->
        <div class="space-y-4">
          ${questions.length === 0 ? `
            <div class="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400">
              No questions found matching your criteria. Be the first to ask!
            </div>
          ` : questions.map(q => `
            <div class="p-6 bg-slate-900/70 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all glow-card">
              <div class="flex items-start gap-4">
                <!-- Upvote Counter -->
                <button onclick="window.neuronexusApp.upvoteQuestion('${q.id}')"
                        class="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-cyan-400 text-cyan-300 text-xs font-mono">
                  <span>â–²</span>
                  <span class="font-bold text-sm">${q.votes}</span>
                </button>

                <!-- Thread Details -->
                <div class="flex-1">
                  <div class="flex flex-wrap items-center gap-2 mb-1.5">
                    <span class="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/50">${q.category}</span>
                    <span class="text-xs text-slate-400">Posted by <strong class="text-slate-200">${q.author.name}</strong> (${q.author.role}) â€¢ ${new Date(q.timestamp).toLocaleDateString()}</span>
                  </div>

                  <h3 onclick="window.neuronexusApp.openThreadModal('${q.id}')"
                      class="text-base font-semibold text-slate-100 hover:text-cyan-300 cursor-pointer mb-2">
                    ${q.title}
                  </h3>

                  <p class="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">${q.content}</p>

                  <div class="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                    <div class="flex items-center gap-2">
                      ${(q.tags || []).map(t => `<span class="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">#${t}</span>`).join('')}
                    </div>
                    <button onclick="window.neuronexusApp.openThreadModal('${q.id}')" class="text-cyan-400 hover:underline">
                      ${q.answers.length} Answer${q.answers.length === 1 ? '' : 's'} â†’
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Modals Placeholder -->
      <div id="community-modal-placeholder"></div>
    `;
  }

  filterCommunityCategory(cat) {
    this.activeQuestionFilter = cat;
    window.communityQA.setFilter(cat);
    this.renderCommunityView();
  }

  searchCommunity(query) {
    window.communityQA.setSearch(query);
    this.renderCommunityView();
  }

  upvoteQuestion(questionId) {
    window.communityQA.upvote(questionId);
    this.renderCommunityView();
  }

  openThreadModal(questionId) {
    const q = window.neuronexusDB.getQuestion(questionId);
    if (!q) return;

    const modalPlaceholder = document.getElementById("community-modal-placeholder");
    modalPlaceholder.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
        <div class="w-full max-w-2xl bg-slate-900 rounded-2xl border border-slate-700 p-6 md:p-8 max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-start mb-4">
            <div>
              <span class="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/50">${q.category}</span>
              <h3 class="text-lg font-bold text-white mt-1">${q.title}</h3>
              <div class="text-xs text-slate-400 mt-1">Asked by ${q.author.name} â€¢ ${new Date(q.timestamp).toLocaleString()}</div>
            </div>
            <button onclick="document.getElementById('community-modal-placeholder').innerHTML=''" class="text-slate-400 hover:text-white text-lg font-bold">âœ•</button>
          </div>

          <div class="text-xs text-slate-200 bg-slate-950/60 p-4 rounded-xl border border-slate-800 mb-6 leading-relaxed whitespace-pre-line">
            ${q.content}
          </div>

          <!-- Answers -->
          <h4 class="text-sm font-bold text-white mb-3">${q.answers.length} Answers</h4>
          <div class="space-y-3 mb-6">
            ${q.answers.length === 0 ? `
              <div class="p-4 text-center text-xs text-slate-400 italic">No answers yet. Share your technical knowledge!</div>
            ` : q.answers.map(ans => `
              <div class="p-4 bg-slate-800/50 rounded-xl border ${ans.author.verified ? 'border-cyan-500/30' : 'border-slate-800'}">
                <div class="flex items-center justify-between text-xs mb-2">
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-slate-200">${ans.author.name}</span>
                    <span class="text-[11px] px-2 py-0.2 rounded ${ans.author.verified ? 'bg-cyan-900/60 text-cyan-300 border border-cyan-700' : 'bg-slate-700 text-slate-300'}">
                      ${ans.author.role} ${ans.author.verified ? 'âœ“ Verified' : ''}
                    </span>
                  </div>
                  <span class="text-slate-400 font-mono text-[11px]">${new Date(ans.timestamp).toLocaleDateString()}</span>
                </div>
                <div class="text-xs text-slate-300 leading-relaxed whitespace-pre-line">${ans.content}</div>
              </div>
            `).join('')}
          </div>

          <!-- Post Answer Form -->
          <div class="pt-4 border-t border-slate-800">
            <h5 class="text-xs font-bold text-slate-200 mb-2">Submit an Answer</h5>
            <textarea id="reply-textarea" rows="3" placeholder="Provide mathematical proofs, code samples, or algorithmic rationale..."
                      class="w-full bg-slate-950 text-slate-200 text-xs p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400 mb-3"></textarea>
            <div class="flex justify-end gap-2">
              <button onclick="document.getElementById('community-modal-placeholder').innerHTML=''" class="btn-secondary text-xs px-4 py-2">Close</button>
              <button onclick="window.neuronexusApp.submitAnswer('${q.id}')" class="btn-primary text-xs px-5 py-2">Post Answer</button>
            </div>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      window.brainwaveOscilloscope.initCanvas("dashboard-oscilloscope-canvas");
    }, 50);
  }

  submitAnswer(questionId) {
    const textarea = document.getElementById("reply-textarea");
    if (!textarea || !textarea.value.trim()) return;

    try {
      window.communityQA.submitAnswer(questionId, textarea.value.trim());
      this.openThreadModal(questionId); // refresh modal
    } catch (e) {
      alert(e.message);
    }
  }

  openAskQuestionModal() {
    const modalPlaceholder = document.getElementById("community-modal-placeholder");
    modalPlaceholder.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
        <div class="w-full max-w-lg bg-slate-900 rounded-2xl border border-slate-700 p-6 md:p-8">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold text-white">Ask a Technical Question</h3>
            <button onclick="document.getElementById('community-modal-placeholder').innerHTML=''" class="text-slate-400 hover:text-white font-bold">âœ•</button>
          </div>
          <div class="space-y-4 text-xs">
            <div>
              <label class="block text-slate-300 font-medium mb-1">Title</label>
              <input type="text" id="ask-title" placeholder="e.g. Why does Morris Traversal need threaded links?"
                     class="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400" />
            </div>
            <div>
              <label class="block text-slate-300 font-medium mb-1">Category</label>
              <select id="ask-cat" class="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-700">
                <option value="Data Structures">Data Structures</option>
                <option value="DBMS">DBMS</option>
                <option value="Python">Python</option>
                <option value="Cloud Analytics">Cloud Analytics</option>
              </select>
            </div>
            <div>
              <label class="block text-slate-300 font-medium mb-1">Details & Context</label>
              <textarea id="ask-content" rows="4" placeholder="Explain your confusion or what you've tried..."
                        class="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"></textarea>
            </div>
            <div class="flex justify-end gap-2 pt-2">
              <button onclick="document.getElementById('community-modal-placeholder').innerHTML=''" class="btn-secondary px-4 py-2">Cancel</button>
              <button onclick="window.neuronexusApp.handleAskSubmit()" class="btn-primary px-5 py-2">Submit Question</button>
            </div>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      window.brainwaveOscilloscope.initCanvas("dashboard-oscilloscope-canvas");
    }, 50);
  }

  handleAskSubmit() {
    const title = document.getElementById("ask-title").value;
    const cat = document.getElementById("ask-cat").value;
    const content = document.getElementById("ask-content").value;

    try {
      window.communityQA.submitQuestion(title, cat, "crs_dsa_101", content, ["CampusQA", cat.replace(/\s+/g, '')]);
      document.getElementById('community-modal-placeholder').innerHTML = '';
      this.renderCommunityView();
    } catch (e) {
      alert(e.message);
    }
  }

  // ============================================================
  // VIEW: AI CLASSROOM & SOCRATIC ASSISTANT
  // ============================================================
  renderAIClassroomView() {
    const container = document.getElementById("main-content");
    container.innerHTML = `
      <div class="max-w-4xl mx-auto px-4 py-8">
        <div class="mb-6">
          <div class="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
            <span>NEURONEXUS</span> <span>â€º</span> <span>AI CLASSROOM</span>
          </div>
          <h2 class="text-3xl font-bold text-white">Socratic AI Study Assistant</h2>
          <p class="text-sm text-slate-300">Targeted explanations, step-by-step traces, mistake diagnostics, and practice questions.</p>
        </div>

        <!-- Quick Action Prompt Pills -->
        <div class="flex flex-wrap gap-2.5 mb-6">
          <button onclick="window.neuronexusApp.runAIPreset('explain_mistakes', 'Explain My Recent Quiz Mistakes')" class="btn-secondary text-xs px-3.5 py-2 border-rose-500/30 text-rose-300">
            ðŸ” Explain My Quiz Mistakes
          </button>
          <button onclick="window.neuronexusApp.runAIPreset('simplify', 'Simplify Concept: Binary Search Trees')" class="btn-secondary text-xs px-3.5 py-2 border-cyan-500/30 text-cyan-300">
            ðŸ’¡ Simplify Concept with Analogy
          </button>
          <button onclick="window.neuronexusApp.runAIPreset('step_by_step', 'Step-by-Step AVL Rotation Walkthrough')" class="btn-secondary text-xs px-3.5 py-2 border-indigo-500/30 text-indigo-300">
            ðŸªœ Step-by-Step Algorithm Trace
          </button>
          <button onclick="window.neuronexusApp.runAIPreset('practice', 'Generate 3 Practice Questions')" class="btn-secondary text-xs px-3.5 py-2 border-teal-500/30 text-teal-300">
            ðŸŽ¯ Generate 3 Practice Questions
          </button>
        </div>

        <!-- Conversation Timeline Card -->
        <div class="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 mb-6 min-h-[380px] flex flex-col justify-between">
          <div id="ai-chat-history" class="space-y-4 mb-4 overflow-y-auto max-h-[460px]">
            <div class="p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
              <div class="flex items-center gap-2 mb-1.5 text-xs">
                <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span class="font-bold text-cyan-300">NEURONEXUS Socratic Tutor</span>
                <span class="text-slate-400 font-mono text-[10px]">Deterministic Educational Engine</span>
              </div>
              <p class="text-xs text-slate-300 leading-relaxed">
                Welcome to your AI Classroom! I am grounded in your syllabus and recent assessment results. Click any prompt pill above, or ask me directly about tree traversals, AVL rotations, BCNF normal forms, or memory management.
              </p>
            </div>
          </div>

          <!-- Prompt Input Bar -->
          <div class="pt-4 border-t border-slate-800 flex gap-2">
            <input type="text" id="ai-input" placeholder="Ask a question about your course topics..."
                   onkeydown="if(event.key==='Enter') window.neuronexusApp.submitAICustomPrompt()"
                   class="flex-1 bg-slate-950 text-slate-200 text-xs px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400" />
            <button onclick="window.neuronexusApp.submitAICustomPrompt()" class="btn-primary text-xs px-5 py-3">
              Ask AI â†’
            </button>
          </div>
        </div>

        <div class="text-[11px] text-slate-400 text-center">
          Transparent AI Labeling: If external LLM keys are unconfigured, NEURONEXUS falls back reliably to deterministic socratic responses.
        </div>
      </div>
    `;
  }

  async runAIPreset(mode, promptText) {
    const historyContainer = document.getElementById("ai-chat-history");
    if (!historyContainer) return;

    // Append user query bubble
    historyContainer.innerHTML += `
      <div class="p-3 bg-cyan-950/40 rounded-xl border border-cyan-800/40 text-xs text-cyan-200 ml-8 text-right">
        ${promptText}
      </div>
      <div id="ai-loading" class="p-3 bg-slate-800/20 rounded-xl text-xs text-slate-400 italic">
        Socratic reasoning in progress...
      </div>
    `;
    historyContainer.scrollTop = historyContainer.scrollHeight;

    const res = await window.aiClassroom.askQuestion(promptText, mode, "trees");
    const loadingElem = document.getElementById("ai-loading");
    if (loadingElem) loadingElem.remove();

    historyContainer.innerHTML += `
      <div class="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs text-slate-200 space-y-2 leading-relaxed">
        <div class="flex items-center justify-between text-[11px] text-cyan-400 font-mono">
          <span>AI Response â€¢ ${res.mode.toUpperCase()}</span>
          <span>${res.source}</span>
        </div>
        <div class="whitespace-pre-line">${res.response}</div>
      </div>
    `;
    historyContainer.scrollTop = historyContainer.scrollHeight;
  }

  async submitAICustomPrompt() {
    const input = document.getElementById("ai-input");
    if (!input || !input.value.trim()) return;
    const prompt = input.value.trim();
    input.value = "";
    await this.runAIPreset("general", prompt);
  }

  // ============================================================
  // VIEW: GAMIFIED ARENA (XP, QUESTS, NEUROBLITZ & LEADERBOARD)
  // ============================================================
  renderArenaView() {
    const gamification = window.neuroGamification;
    const state = gamification.state;
    const container = document.getElementById("main-content");
    const xpPercent = Math.round((state.xp % 1000) / 10);

    container.innerHTML = `
      <div class="max-w-5xl mx-auto px-4 py-8">
        <!-- Arena Hero & Level Banner -->
        <div class="flex flex-wrap items-center justify-between gap-6 p-6 md:p-8 bg-slate-900/90 rounded-3xl border border-amber-500/30 mb-8 glow-card">
          <div class="flex items-center gap-5">
            <div class="w-16 h-16 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-300 flex flex-col items-center justify-center font-extrabold shadow-lg">
              <span class="text-xs font-mono uppercase text-slate-400">LVL</span>
              <span class="text-2xl -mt-1 font-mono">${state.level}</span>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  ${state.levelTitle.toUpperCase()}
                </span>
                <span class="text-xs text-emerald-400 font-mono">âš¡ 1.5x Zen XP Multiplier</span>
              </div>
              <h2 class="text-2xl font-bold text-white">Gamified Learning Arena</h2>
              <p class="text-xs text-slate-300 mt-0.5">Earn XP through quizzes, master daily study streaks, and conquer the 60s NeuroBlitz challenge.</p>
            </div>
          </div>

          <!-- XP & Streak Counters -->
          <div class="flex items-center gap-4">
            <div class="text-center p-3 px-4 bg-slate-950/80 rounded-2xl border border-slate-800">
              <div class="text-xs text-slate-400 font-mono uppercase">Total XP</div>
              <div class="text-xl font-mono font-bold text-amber-400">${state.xp.toLocaleString()}</div>
            </div>
            <div class="text-center p-3 px-4 bg-slate-950/80 rounded-2xl border border-slate-800">
              <div class="text-xs text-slate-400 font-mono uppercase">Study Streak</div>
              <div class="text-xl font-mono font-bold text-rose-400">ðŸ”¥ ${state.streakDays} Days</div>
            </div>
          </div>
        </div>

        <!-- Level Progress Bar -->
        <div class="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 mb-8">
          <div class="flex justify-between items-center text-xs mb-2">
            <span class="font-medium text-slate-300">Level ${state.level} Progress</span>
            <span class="font-mono text-amber-300 font-bold">${state.xp} / ${state.nextLevelXp} XP (${xpPercent}%)</span>
          </div>
          <div class="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div class="bg-gradient-to-r from-amber-500 to-emerald-400 h-2.5 rounded-full transition-all duration-700" style="width: ${xpPercent}%"></div>
          </div>
        </div>

        <!-- NEUROBLITZ 60-SECOND RAPID TIME-TRIAL ARENA -->
        <div class="p-6 md:p-8 bg-slate-900/90 rounded-3xl border border-emerald-500/40 mb-8 glow-card">
          <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <div class="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>RAPID TIME-TRIAL CHALLENGE</span>
              </div>
              <h3 class="text-xl font-bold text-white">âš¡ NeuroBlitz: 60-Second Algorithmic Speedrun</h3>
              <p class="text-xs text-slate-300 mt-0.5">Test your reflex recall on BST invariants, AVL balancing, and database normal forms. Build combo streaks for bonus XP!</p>
            </div>
            <div class="text-right">
              <span class="text-xs text-slate-400 font-mono block">Personal Best</span>
              <span class="text-lg font-mono font-bold text-amber-400">${state.blitzHighScore} pts</span>
            </div>
          </div>

          <!-- NeuroBlitz Game Stage -->
          <div id="neuroblitz-stage" class="p-6 bg-slate-950/90 rounded-2xl border border-slate-800 text-center">
            <div class="max-w-md mx-auto py-6">
              <div class="text-4xl mb-3">âš¡</div>
              <h4 class="text-lg font-bold text-white mb-2">Ready for the 60-Second Speedrun?</h4>
              <p class="text-xs text-slate-400 mb-6 leading-relaxed">
                Rapid True / False questions testing fundamental computer science invariants. Combo multipliers increase points up to 4x!
              </p>
              <button onclick="window.neuronexusApp.startNeuroBlitzGame()" class="btn-primary text-sm px-8 py-3">
                Start 60s NeuroBlitz Speedrun â†’
              </button>
            </div>
          </div>
        </div>

        <!-- TWO COLUMNS: ACHIEVEMENTS & LEADERBOARD -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <!-- Achievement Badges -->
          <div class="p-6 bg-slate-900/80 rounded-3xl border border-slate-800">
            <div class="flex justify-between items-center mb-4">
              <div>
                <h3 class="font-bold text-white text-base">Achievement Badges</h3>
                <p class="text-xs text-slate-400">Unlock neuro-academic milestones</p>
              </div>
              <span class="text-xs font-mono font-bold text-amber-400">
                ${state.badges.filter(b => b.unlocked).length} / ${state.badges.length} Unlocked
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              ${state.badges.map(b => `
                <div class="p-3.5 rounded-2xl border transition-all ${b.unlocked ? 'bg-slate-800/40 border-amber-500/30' : 'bg-slate-950/40 border-slate-800/60 opacity-50'}">
                  <div class="flex items-center gap-3 mb-1.5">
                    <span class="text-2xl">${b.icon}</span>
                    <div>
                      <div class="text-xs font-bold text-white">${b.title}</div>
                      <span class="text-[10px] px-1.5 py-0.2 rounded font-mono ${b.unlocked ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-500'}">
                        ${b.category}
                      </span>
                    </div>
                  </div>
                  <p class="text-[11px] text-slate-400 leading-tight">${b.description}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Campus Leaderboard -->
          <div class="p-6 bg-slate-900/80 rounded-3xl border border-slate-800">
            <div class="flex justify-between items-center mb-4">
              <div>
                <h3 class="font-bold text-white text-base">Campus Leaderboard</h3>
                <p class="text-xs text-slate-400">Sathyabama CSE 6th Semester League</p>
              </div>
              <span class="badge-demo">CAMPUS RANK #2</span>
            </div>

            <div class="space-y-2.5">
              ${state.leaderboard.map(u => `
                <div class="p-3.5 rounded-2xl border flex items-center justify-between transition-all ${u.isCurrentUser ? 'bg-emerald-950/30 border-emerald-500/40' : 'bg-slate-800/30 border-slate-800'}">
                  <div class="flex items-center gap-3">
                    <span class="w-6 font-mono font-bold text-sm ${u.rank === 1 ? 'text-amber-400' : u.rank === 2 ? 'text-emerald-400' : 'text-slate-400'}">
                      #${u.rank}
                    </span>
                    <div class="w-8 h-8 rounded-full bg-slate-800 text-slate-200 text-xs font-bold flex items-center justify-center border border-slate-700">
                      ${u.avatar}
                    </div>
                    <div>
                      <div class="text-xs font-bold text-slate-100 ${u.isCurrentUser ? 'text-emerald-300' : ''}">
                        ${u.name}
                      </div>
                      <div class="text-[10px] text-slate-400">${u.department}</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="font-mono font-bold text-xs text-amber-400">${u.xp.toLocaleString()} XP</span>
                    <span class="text-[10px] text-rose-400 block font-mono">ðŸ”¥ ${u.streak}d</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

      </div>
    `;
  }


  // --- NEUROBLITZ GAME PLAY CONTROLLER ---
  startNeuroBlitzGame() {
    const game = window.neuroGamification.startNeuroBlitz();
    const stage = document.getElementById("neuroblitz-stage");
    if (!stage) return;

    // Start 60s countdown
    game.timerInterval = setInterval(() => {
      game.timeLeftSeconds -= 1;
      const timerDisplay = document.getElementById("blitz-timer-val");
      const timerBar = document.getElementById("blitz-timer-bar");

      if (timerDisplay) timerDisplay.textContent = game.timeLeftSeconds + "s";
      if (timerBar) timerBar.style.width = (game.timeLeftSeconds / 60) * 100 + "%";

      if (game.timeLeftSeconds <= 0) {
        clearInterval(game.timerInterval);
        this.finishNeuroBlitzGame();
      }
    }, 1000);

    this.renderBlitzQuestionView();
  }

  renderBlitzQuestionView() {
    const game = window.neuroGamification.activeBlitzGame;
    const stage = document.getElementById("neuroblitz-stage");
    if (!game || !stage) return;

    const currentQ = game.questions[game.currentIndex];

    stage.innerHTML = `
      <div class="max-w-lg mx-auto py-2">
        <!-- Top Telemetry Header -->
        <div class="flex items-center justify-between text-xs mb-3 font-mono">
          <div class="flex items-center gap-2">
            <span class="text-rose-400 font-bold">â±ï¸ <span id="blitz-timer-val">${game.timeLeftSeconds}s</span></span>
            <span>â€¢</span>
            <span class="text-amber-400 font-bold">SCORE: <span id="blitz-score-val">${game.score}</span></span>
          </div>
          <div>
            <span class="px-2 py-0.5 rounded font-bold ${game.combo >= 2 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse' : 'bg-slate-800 text-slate-400'}">
              ${game.combo >= 2 ? `ðŸ”¥ ${game.combo}x COMBO!` : '1x Multiplier'}
            </span>
          </div>
        </div>

        <!-- Timer Countdown Bar -->
        <div class="w-full bg-slate-800 rounded-full h-2 mb-6 overflow-hidden">
          <div id="blitz-timer-bar" class="bg-gradient-to-r from-emerald-500 to-amber-500 h-2 rounded-full transition-all duration-300" style="width: ${(game.timeLeftSeconds / 60) * 100}%"></div>
        </div>

        <!-- Question Card -->
        <div class="p-6 bg-slate-900/80 rounded-2xl border border-slate-700/60 mb-6">
          <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700 mb-2 inline-block">
            ${currentQ.topic}
          </span>
          <h4 class="text-base md:text-lg font-semibold text-white leading-relaxed mt-1">
            "${currentQ.q}"
          </h4>
        </div>

        <!-- True / False Action Buttons -->
        <div class="grid grid-cols-2 gap-4">
          <button onclick="window.neuronexusApp.handleBlitzAnswer(true)" class="p-4 bg-emerald-950/40 border border-emerald-500/50 hover:bg-emerald-900/50 text-emerald-300 rounded-2xl font-bold text-base transition-all hover:scale-105 cursor-pointer shadow-lg">
            âœ“ TRUE
          </button>
          <button onclick="window.neuronexusApp.handleBlitzAnswer(false)" class="p-4 bg-rose-950/40 border border-rose-500/50 hover:bg-rose-900/50 text-rose-300 rounded-2xl font-bold text-base transition-all hover:scale-105 cursor-pointer shadow-lg">
            âœ— FALSE
          </button>
        </div>

        <!-- Result feedback flash -->
        <div id="blitz-feedback" class="text-xs font-mono mt-4 text-slate-400 min-h-[20px]"></div>
      </div>
    `;
  }

  handleBlitzAnswer(userChoice) {
    const res = window.neuroGamification.answerBlitzQuestion(userChoice);
    if (!res) return;

    const feedback = document.getElementById("blitz-feedback");
    if (feedback) {
      feedback.innerHTML = res.isCorrect
        ? `<span class="text-emerald-400 font-bold">âœ“ CORRECT! (+${res.combo * 50} pts)</span> â€¢ <span class="text-slate-300">${res.explanation}</span>`
        : `<span class="text-rose-400 font-bold">âœ— COMBO BROKEN!</span> â€¢ <span class="text-slate-300">${res.explanation}</span>`;
    }

    // Refresh question card after brief moment
    setTimeout(() => {
      this.renderBlitzQuestionView();
    }, 450);
  }

  finishNeuroBlitzGame() {
    const results = window.neuroGamification.endBlitzGame();
    const stage = document.getElementById("neuroblitz-stage");
    if (!results || !stage) return;

    stage.innerHTML = `
      <div class="max-w-md mx-auto py-6">
        <div class="text-4xl mb-2">ðŸ†</div>
        <h4 class="text-2xl font-bold text-white mb-1">Challenge Completed!</h4>
        <p class="text-xs text-slate-400 mb-6">60-second rapid algorithmic recall speedrun finished.</p>

        <div class="grid grid-cols-3 gap-3 p-4 bg-slate-900/80 rounded-2xl border border-slate-800 text-center mb-6">
          <div>
            <div class="text-xs text-slate-400 font-mono uppercase">Score</div>
            <div class="text-xl font-mono font-bold text-amber-400">${results.finalScore}</div>
          </div>
          <div>
            <div class="text-xs text-slate-400 font-mono uppercase">Max Combo</div>
            <div class="text-xl font-mono font-bold text-emerald-400">ðŸ”¥ ${results.maxCombo}x</div>
          </div>
          <div>
            <div class="text-xs text-slate-400 font-mono uppercase">XP Earned</div>
            <div class="text-xl font-mono font-bold text-teal-400">+${results.xpEarned}</div>
          </div>
        </div>

        <div class="flex justify-center gap-3">
          <button onclick="window.neuronexusApp.startNeuroBlitzGame()" class="btn-primary text-xs px-5 py-2.5">
            Play Again âš¡
          </button>
          <button onclick="window.neuronexusApp.renderArenaView()" class="btn-secondary text-xs px-5 py-2.5">
            Back to Arena
          </button>
        </div>
      </div>
    `;
  }

  // ============================================================
  // VIEW: NEURO ANALYSIS DASHBOARD (STRESS, RELAXATION & WAVES)
  // ============================================================
  renderNeuroAnalysisView() {
    const user = window.neuronexusDB.getCurrentUser();
    const sessions = window.neuronexusDB.getNeuroSessions(user.id);
    const container = document.getElementById("main-content");
    const activeSession = sessions[0] || null;

    container.innerHTML = `
      <div class="max-w-5xl mx-auto px-4 py-8">
        <!-- Header -->
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div class="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>BIOAMP EXG INTEGRATION â€¢ 250Hz LIVE STREAM</span>
            </div>
            <h2 class="text-3xl font-bold text-white">Mental Status: Stress, Relaxation & Live Brainwaves</h2>
            <p class="text-sm text-slate-300">Continuous biopotential EEG oscilloscope, real-time stress/relaxation indices, and cognitive workload alerts.</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="badge-demo">SIMULATED STREAM ACTIVE</span>
          </div>
        </div>

        <!-- Science & Safety Warning Banner -->
        <div class="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-700/60 mb-6 flex items-start gap-3 text-xs text-slate-300">
          <div class="text-amber-400 text-lg">ðŸ’¡</div>
          <div>
            <strong class="text-slate-100">Personal Study Assistant (Non-Diagnostic):</strong> Stress and relaxation metrics reflect estimated cortical biopotentials and are strictly private to the student. They guide healthy study rhythms and are <strong>never</strong> shared with faculty for grading or disciplinary review.
          </div>
        </div>

        <!-- DUAL REAL-TIME STRESS & RELAXATION GAUGES -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="p-5 bg-slate-900/90 rounded-3xl border border-slate-800 glow-card">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <span class="text-lg">ðŸ§˜</span>
                <span class="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">RELAXATION STATE</span>
              </div>
              <span id="neuro-relax-val" class="text-sm font-mono font-bold text-emerald-400">88% (DEEPLY RELAXED)</span>
            </div>
            <div class="w-full bg-slate-800 rounded-full h-3 mb-2 overflow-hidden">
              <div id="neuro-relax-bar" class="bg-emerald-500 h-3 rounded-full transition-all duration-500" style="width: 88%"></div>
            </div>
            <p id="neuro-relax-desc" class="text-xs text-slate-300">
              High Alpha band power (10 Hz) observed. The student is calm, grounded, and in an ideal state for deep memory encoding.
            </p>
          </div>

          <div class="p-5 bg-slate-900/90 rounded-3xl border border-slate-800 glow-card">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <span class="text-lg">âš¡</span>
                <span class="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">COGNITIVE STRESS LEVEL</span>
              </div>
              <span id="neuro-stress-val" class="text-sm font-mono font-bold text-emerald-400">14% (LOW / OPTIMAL)</span>
            </div>
            <div class="w-full bg-slate-800 rounded-full h-3 mb-2 overflow-hidden">
              <div id="neuro-stress-bar" class="bg-emerald-500 h-3 rounded-full transition-all duration-500" style="width: 14%"></div>
            </div>
            <p id="neuro-stress-desc" class="text-xs text-slate-300">
              Low cortical muscle tension. No test anxiety or cognitive overload detected.
            </p>
          </div>
        </div>

        <!-- DYNAMIC MENTAL STATUS ALERT BANNER -->
        <div id="live-cognitive-alert-box" class="mb-6">
          <div class="p-5 bg-emerald-950/40 rounded-3xl border border-emerald-500/50 flex items-start justify-between gap-4 alert-card">
            <div class="flex items-start gap-3">
              <span id="alert-icon" class="text-3xl">ðŸ˜Œ</span>
              <div>
                <div class="flex items-center gap-2">
                  <span id="alert-badge" class="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    MENTAL STATUS: DEEPLY RELAXED
                  </span>
                  <span id="alert-sub" class="text-xs text-slate-400 font-mono">Stress: 14% (LOW) â€¢ Relaxation: 88% (HIGH)</span>
                </div>
                <h4 id="alert-title" class="text-base font-bold text-white mt-1">Calm & Receptive Learning State</h4>
                <p id="alert-message" class="text-xs text-slate-200 mt-1 leading-relaxed">
                  Strong 10 Hz Alpha waves with low muscle tension. The student's sympathetic nervous system is settled with minimal anxiety or cognitive strain.
                </p>
                <div id="alert-rec" class="text-xs text-emerald-300 mt-2 font-mono">
                  <strong>Recommendation:</strong> Optimal mental state for conceptual encoding. Ideal for reading new algorithm theory and grasping structural invariants.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- LIVE OSCILLOSCOPE CANVAS -->
        <div class="p-6 bg-slate-900/90 rounded-3xl border border-slate-800 mb-8 glow-card">
          <div class="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <h3 class="font-bold text-white text-base">Oscilloscope Screen: Fp1-Fp2 Differential Trace</h3>
              </div>
              <p class="text-xs text-slate-400">Continuous 60 FPS phosphor sweep â€¢ Real-time microvolts (Î¼V)</p>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="window.neuronexusApp.toggleOscilloscopeAudio()" id="btn-audio-toggle" class="btn-secondary text-xs px-3 py-1.5 border-slate-700">
                ðŸ”Š Audio Alert Chimes: ON
              </button>
            </div>
          </div>

          <!-- Canvas Container -->
          <div class="oscilloscope-screen w-full mb-4">
            <canvas id="eeg-oscilloscope-canvas" width="840" height="240" class="w-full h-auto block"></canvas>
          </div>

          <!-- Interactive Testing Buttons for Judges -->
          <div>
            <div class="text-[11px] font-mono text-emerald-400 uppercase tracking-wider mb-2.5 font-semibold">
              Hackathon Testing Controls: Simulate Student Mental States (Stress vs Relaxation)
            </div>
            <div class="flex flex-wrap gap-2">
              <button onclick="window.neuronexusApp.setMentalScenario('RELAX')" class="btn-secondary text-xs px-3 py-2 border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/40">
                ðŸ˜Œ Deep Relaxation (Stress: 14% | Relax: 88%)
              </button>
              <button onclick="window.neuronexusApp.setMentalScenario('FOCUS')" class="btn-secondary text-xs px-3 py-2 border-teal-500/40 text-teal-300 hover:bg-teal-950/40">
                ðŸŽ¯ Focused Flow (Stress: 28% | Relax: 66%)
              </button>
              <button onclick="window.neuronexusApp.setMentalScenario('STRESS')" class="btn-secondary text-xs px-3 py-2 border-rose-500/40 text-rose-300 hover:bg-rose-950/40">
                âš¡ High Stress Alert (Stress: 86% | Relax: 12%)
              </button>
              <button onclick="window.neuronexusApp.setMentalScenario('FATIGUE')" class="btn-secondary text-xs px-3 py-2 border-amber-500/40 text-amber-300 hover:bg-amber-950/40">
                ðŸ¥± Cognitive Fatigue (Stress: 36% | Relax: 42%)
              </button>
              <button onclick="window.neuronexusApp.setMentalScenario('INSUFFICIENT')" class="btn-secondary text-xs px-3 py-2 border-slate-700 text-slate-300 hover:bg-slate-800">
                âš ï¸ Insufficient Signal (&lt;70% Quality)
              </button>
            </div>
          </div>
        </div>

        <!-- INTERACTIVE GUIDED CALMING & BREATHING TOOL (Available when Stressed) -->
        <div id="calming-box" class="p-6 bg-slate-900/80 rounded-3xl border border-slate-800 mb-8">
          <div class="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-lg">ðŸŒ¬ï¸</span>
                <h3 class="font-bold text-white text-base">Box Breathing Calming Tool (4-7-8 Rhythm)</h3>
              </div>
              <p class="text-xs text-slate-400">Scientifically down-regulates cortisol and lowers cognitive stress in 2 minutes.</p>
            </div>
            <button onclick="window.neuronexusApp.toggleBreathingExercise()" id="btn-breathing" class="btn-primary text-xs px-4 py-2">
              Start 2-Min Calming Breath
            </button>
          </div>
          <div id="breathing-display" class="hidden p-6 bg-slate-950/60 rounded-2xl border border-slate-800 text-center">
            <div id="breath-circle" class="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-400 mx-auto mb-3 flex items-center justify-center font-bold text-sm text-emerald-300 transition-all duration-1000">
              Inhale
            </div>
            <div id="breath-instruction" class="text-sm font-semibold text-white">Inhale slowly through your nose (4s)...</div>
            <div class="text-xs text-slate-400 mt-1">Calming sympathetic arousal and restoring Alpha synchrony</div>
          </div>
        </div>

        <!-- Spectral Frequency Band Breakdown -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div class="p-4 bg-slate-900/70 rounded-2xl border border-slate-800">
            <div class="flex justify-between items-center mb-1">
              <span class="text-xs font-mono font-bold text-emerald-400">ALPHA (8-12 Hz)</span>
              <span id="meter-alpha" class="text-xs font-bold text-slate-200">64%</span>
            </div>
            <div class="w-full bg-slate-800 rounded-full h-1.5 mb-2 overflow-hidden">
              <div id="bar-alpha" class="bg-emerald-500 h-1.5 rounded-full" style="width: 64%"></div>
            </div>
            <p class="text-[11px] text-slate-400">Calm relaxation rhythm; highest when mentally composed.</p>
          </div>

          <div class="p-4 bg-slate-900/70 rounded-2xl border border-slate-800">
            <div class="flex justify-between items-center mb-1">
              <span class="text-xs font-mono font-bold text-teal-400">BETA (13-30 Hz)</span>
              <span id="meter-beta" class="text-xs font-bold text-slate-200">22%</span>
            </div>
            <div class="w-full bg-slate-800 rounded-full h-1.5 mb-2 overflow-hidden">
              <div id="bar-beta" class="bg-teal-500 h-1.5 rounded-full" style="width: 22%"></div>
            </div>
            <p class="text-[11px] text-slate-400">Active problem solving; surges above 25 Hz under stress.</p>
          </div>

          <div class="p-4 bg-slate-900/70 rounded-2xl border border-slate-800">
            <div class="flex justify-between items-center mb-1">
              <span class="text-xs font-mono font-bold text-amber-400">THETA (4-8 Hz)</span>
              <span id="meter-theta" class="text-xs font-bold text-slate-200">10%</span>
            </div>
            <div class="w-full bg-slate-800 rounded-full h-1.5 mb-2 overflow-hidden">
              <div id="bar-theta" class="bg-amber-500 h-1.5 rounded-full" style="width: 10%"></div>
            </div>
            <p class="text-[11px] text-slate-400">Working memory encoding; surges during mental fatigue.</p>
          </div>

          <div class="p-4 bg-slate-900/70 rounded-2xl border border-slate-800">
            <div class="flex justify-between items-center mb-1">
              <span class="text-xs font-mono font-bold text-violet-400">DELTA (0.5-4 Hz)</span>
              <span id="meter-delta" class="text-xs font-bold text-slate-200">4%</span>
            </div>
            <div class="w-full bg-slate-800 rounded-full h-1.5 mb-2 overflow-hidden">
              <div id="bar-delta" class="bg-violet-500 h-1.5 rounded-full" style="width: 4%"></div>
            </div>
            <p class="text-[11px] text-slate-400">Slow wave biopotentials; minimal during active waking state.</p>
          </div>
        </div>

        <!-- Historical Study Session Timeline Chart -->
        <div class="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 mb-8">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-bold text-white">Historical Study Session Timeline</h3>
              <p class="text-xs text-slate-400">Minute-by-minute engagement index logged during 30-min Trees study session</p>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="window.neuronexusApp.switchNeuroSession(0)" class="btn-secondary text-xs px-3 py-1">Good Session (93.4%)</button>
              <button onclick="window.neuronexusApp.switchNeuroSession(1)" class="btn-secondary text-xs px-3 py-1 text-rose-300">Poor Signal (41.2%)</button>
            </div>
          </div>
          <div id="focus-timeline-container" class="min-h-[220px]"></div>
        </div>
      </div>
    `;

    setTimeout(() => {
      window.brainwaveOscilloscope.initCanvas("eeg-oscilloscope-canvas");

      // Subscribe to alert updates
      window.brainwaveOscilloscope.onAlert((alertData) => {
        this.updateNeuroAlertUI(alertData);
      });

      window.NeuroCharts.renderFocusTimeline("focus-timeline-container", activeSession);
    }, 50);
  }

  setMentalScenario(mode) {
    window.brainwaveOscilloscope.setMentalMode(mode);
    const alertData = window.brainwaveOscilloscope.activeAlert;
    this.updateNeuroAlertUI(alertData);
    this.updateDashboardMentalUI(alertData);
  }

  // Alias for backward compatibility
  setBrainwaveState(mode) {
    this.setMentalScenario(mode);
  }

  updateNeuroAlertUI(alertData) {
    if (!alertData) return;

    const rVal = document.getElementById("neuro-relax-val");
    const rBar = document.getElementById("neuro-relax-bar");
    const sVal = document.getElementById("neuro-stress-val");
    const sBar = document.getElementById("neuro-stress-bar");

    if (rVal && alertData.relaxationLevel) {
      rVal.textContent = alertData.relaxationLevel;
      const numR = parseInt(alertData.relaxationLevel) || 50;
      if (rBar) {
        rBar.style.width = numR + "%";
        rBar.className = numR >= 70 ? "bg-emerald-500 h-3 rounded-full transition-all duration-500" : "bg-amber-500 h-3 rounded-full transition-all duration-500";
      }
    }

    if (sVal && alertData.stressLevel) {
      sVal.textContent = alertData.stressLevel;
      const numS = parseInt(alertData.stressLevel) || 20;
      if (sBar) {
        sBar.style.width = numS + "%";
        sBar.className = numS <= 30 ? "bg-emerald-500 h-3 rounded-full transition-all duration-500" : numS <= 65 ? "bg-amber-500 h-3 rounded-full transition-all duration-500" : "bg-rose-500 h-3 rounded-full transition-all duration-500";
      }
    }

    const icon = document.getElementById("alert-icon");
    const badge = document.getElementById("alert-badge");
    const sub = document.getElementById("alert-sub");
    const title = document.getElementById("alert-title");
    const msg = document.getElementById("alert-message");
    const rec = document.getElementById("alert-rec");

    if (icon) icon.textContent = alertData.icon;
    if (badge) badge.textContent = alertData.badge;
    if (sub) sub.textContent = `Stress: ${alertData.stressLevel} â€¢ Relaxation: ${alertData.relaxationLevel}`;
    if (title) title.textContent = alertData.title;
    if (msg) msg.textContent = alertData.message;
    if (rec) rec.innerHTML = `<strong>Recommendation:</strong> ${alertData.recommendation}`;
  }

  updateDashboardMentalUI(alertData) {
    if (!alertData) return;
    const dStressVal = document.getElementById("dash-stress-val");
    const dStressBar = document.getElementById("dash-stress-bar");
    const dRelaxVal = document.getElementById("dash-relax-val");
    const dRelaxBar = document.getElementById("dash-relax-bar");

    if (dStressVal && alertData.stressLevel) {
      dStressVal.textContent = alertData.stressLevel;
      const numS = parseInt(alertData.stressLevel) || 20;
      if (dStressBar) {
        dStressBar.style.width = numS + "%";
        dStressBar.className = numS <= 30 ? "bg-emerald-500 h-2 rounded-full" : numS <= 65 ? "bg-amber-500 h-2 rounded-full" : "bg-rose-500 h-2 rounded-full";
      }
    }

    if (dRelaxVal && alertData.relaxationLevel) {
      dRelaxVal.textContent = alertData.relaxationLevel;
      const numR = parseInt(alertData.relaxationLevel) || 50;
      if (dRelaxBar) {
        dRelaxBar.style.width = numR + "%";
        dRelaxBar.className = numR >= 70 ? "bg-emerald-500 h-2 rounded-full" : "bg-amber-500 h-2 rounded-full";
      }
    }

    const dIcon = document.getElementById("dash-alert-icon");
    const dBadge = document.getElementById("dash-alert-badge");
    const dBand = document.getElementById("dash-alert-band");
    const dTitle = document.getElementById("dash-alert-title");
    const dDesc = document.getElementById("dash-alert-desc");

    if (dIcon) dIcon.textContent = alertData.icon;
    if (dBadge) dBadge.textContent = alertData.badge;
    if (dBand) dBand.textContent = alertData.title;
    if (dTitle) dTitle.textContent = `Stress: ${alertData.stressLevel} | Relaxation: ${alertData.relaxationLevel}`;
    if (dDesc) dDesc.textContent = alertData.recommendation;
  }

  toggleBreathingExercise() {
    const display = document.getElementById("breathing-display");
    const btn = document.getElementById("btn-breathing");
    if (!display) return;

    if (display.classList.contains("hidden")) {
      display.classList.remove("hidden");
      if (btn) btn.textContent = "Stop Calming Breath";
      this.startBreathingPacer();
    } else {
      display.classList.add("hidden");
      if (btn) btn.textContent = "Start 2-Min Calming Breath";
      clearInterval(this.breathingInterval);
    }
  }

  startBreathingPacer() {
    const circle = document.getElementById("breath-circle");
    const instr = document.getElementById("breath-instruction");
    if (!circle || !instr) return;
    let phase = 0;

    const updatePhase = () => {
      if (phase === 0) {
        circle.textContent = "Inhale";
        circle.style.transform = "scale(1.25)";
        circle.style.borderColor = "#10b981";
        circle.style.backgroundColor = "rgba(16, 185, 129, 0.35)";
        instr.textContent = "Inhale slowly through your nose (4 seconds)...";
      } else if (phase === 1) {
        circle.textContent = "Hold";
        circle.style.transform = "scale(1.25)";
        circle.style.borderColor = "#f59e0b";
        circle.style.backgroundColor = "rgba(245, 158, 11, 0.35)";
        instr.textContent = "Hold your breath gently. Keep your chest still (4 seconds)...";
      } else if (phase === 2) {
        circle.textContent = "Exhale";
        circle.style.transform = "scale(0.85)";
        circle.style.borderColor = "#34d399";
        circle.style.backgroundColor = "rgba(52, 211, 153, 0.2)";
        instr.textContent = "Exhale fully through mouth, releasing all tension (4 seconds)...";
      } else {
        circle.textContent = "Rest";
        circle.style.transform = "scale(0.85)";
        circle.style.borderColor = "#8b5cf6";
        circle.style.backgroundColor = "rgba(139, 92, 246, 0.2)";
        instr.textContent = "Rest lungs empty before next cycle (4 seconds)...";
      }
      phase = (phase + 1) % 4;
    };

    updatePhase();
    if (this.breathingInterval) clearInterval(this.breathingInterval);
    this.breathingInterval = setInterval(updatePhase, 4000);
  }

  toggleOscilloscopeAudio() {
    window.brainwaveOscilloscope.soundEnabled = !window.brainwaveOscilloscope.soundEnabled;
    const btn = document.getElementById("btn-audio-toggle");
    if (btn) {
      btn.textContent = window.brainwaveOscilloscope.soundEnabled
        ? "ðŸ”Š Audio Alert Chimes: ON"
        : "ðŸ”‡ Audio Alert Chimes: OFF";
    }
  }

  switchNeuroSession(index) {
    const user = window.neuronexusDB.getCurrentUser();
    const sessions = window.neuronexusDB.getNeuroSessions(user.id);
    const session = sessions[index];
    if (session) {
      window.NeuroCharts.renderFocusTimeline("focus-timeline-container", session);
      window.NeuroCharts.renderSpectralDonut("spectral-donut-container", session.spectralPower);
    }
  }

  // ============================================================
  // VIEW: FACULTY DASHBOARD (AGGREGATE ONLY, STRICT PRIVACY)
  // ============================================================
  renderFacultyView() {
    const analytics = window.facultyAnalytics.getCourseAnalytics("crs_dsa_101");
    const container = document.getElementById("main-content");

    container.innerHTML = `
      <div class="max-w-5xl mx-auto px-4 py-8">
        <!-- Header -->
        <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <div class="text-xs font-mono text-indigo-400 uppercase">FACULTY INTELLIGENCE PORTAL</div>
            <h2 class="text-3xl font-bold text-white">Course Overview: ${analytics.course.title}</h2>
            <p class="text-sm text-slate-300">Aggregated academic mastery patterns and identified class-level curriculum bottlenecks.</p>
          </div>
          <span class="badge-demo">INSTRUCTOR VIEW â€¢ DR. K. RAMANATHAN</span>
        </div>

        <!-- Privacy Shield Notice -->
        <div class="p-4 bg-indigo-950/30 rounded-2xl border border-indigo-500/30 mb-8 text-xs text-slate-300 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
            <span><strong>Privacy Protection Active:</strong> Only aggregated academic assessment statistics are displayed. Individual biometric traces are strictly withheld from instructors.</span>
          </div>
        </div>

        <!-- Overview Metrics -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div class="p-5 bg-slate-900/60 rounded-2xl border border-slate-800">
            <div class="text-xs text-slate-400 uppercase font-mono mb-1">Enrolled Students</div>
            <div class="text-3xl font-bold text-white">${analytics.totalEnrolled}</div>
            <div class="text-xs text-cyan-400 mt-1">Computer Science & Engineering</div>
          </div>
          <div class="p-5 bg-slate-900/60 rounded-2xl border border-slate-800">
            <div class="text-xs text-slate-400 uppercase font-mono mb-1">Average Class Score</div>
            <div class="text-3xl font-bold text-indigo-400">${analytics.averageClassScore}%</div>
            <div class="text-xs text-slate-400 mt-1">Across 10-question standardized assessments</div>
          </div>
          <div class="p-5 bg-slate-900/60 rounded-2xl border border-slate-800">
            <div class="text-xs text-slate-400 uppercase font-mono mb-1">Quizzes Logged</div>
            <div class="text-3xl font-bold text-teal-400">${analytics.totalAttemptsLogged} attempts</div>
            <div class="text-xs text-slate-400 mt-1">Stored attempts in current semester</div>
          </div>
        </div>

        <!-- Most Frequently Missed Topics Table -->
        <div class="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 mb-8">
          <h3 class="font-bold text-white mb-2">Class Subtopic Performance Rankings</h3>
          <p class="text-xs text-slate-400 mb-4">Ranked from highest difficulty to lowest difficulty based on actual student quiz answers:</p>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="text-slate-400 border-b border-slate-800 uppercase font-mono">
                <tr>
                  <th class="pb-3">Subtopic</th>
                  <th class="pb-3">Average Accuracy</th>
                  <th class="pb-3">Questions Evaluated</th>
                  <th class="pb-3 text-right">Difficulty Rating</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60 text-slate-300">
                ${analytics.subtopicRankings.map(s => `
                  <tr>
                    <td class="py-3 font-semibold text-slate-100">${s.subtopic}</td>
                    <td class="py-3 font-mono font-bold ${s.avgAccuracy < 50 ? 'text-rose-400' : 'text-amber-400'}">${s.avgAccuracy}%</td>
                    <td class="py-3 text-slate-400">${s.totalEvaluated} responses</td>
                    <td class="py-3 text-right">
                      <span class="px-2.5 py-1 rounded-full ${s.avgAccuracy < 50 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}">
                        ${s.difficultyRating}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Recommended Teaching Interventions -->
        <div class="p-6 bg-slate-900/80 rounded-2xl border border-slate-800">
          <h3 class="font-bold text-white mb-3">Recommended Pedagogical Interventions</h3>
          <div class="space-y-3">
            ${analytics.recommendedInterventions.map(interv => `
              <div class="p-4 bg-slate-800/40 rounded-xl border border-indigo-500/30">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs font-mono font-bold text-indigo-400">${interv.topic}</span>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">Urgency: ${interv.urgency}</span>
                </div>
                <div class="text-xs text-slate-200 font-medium mb-1">${interv.action}</div>
                <div class="text-xs text-slate-400">Suggested Resource: ${interv.resourceSuggested}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Individual Student Monitor (Faculty) -->
        <div class="mt-8 p-6 bg-slate-900/80 rounded-2xl border border-slate-800">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-bold text-white">Individual Student Monitor</h3>
              <p class="text-xs text-slate-400 mt-1">Select a student to view their real-time cognitive status and academic gaps. EEG stress indicators shown only with explicit student consent.</p>
            </div>
            <span class="text-[10px] px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">FACULTY ONLY</span>
          </div>

          <div class="flex items-center gap-3 mb-5">
            <label class="text-xs text-slate-400 font-mono uppercase">Select Student:</label>
            <select id="faculty-student-selector" onchange="window.neuronexusApp.renderFacultyStudentCard(this.value)"
                    class="bg-slate-950 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-400 cursor-pointer">
              <option value="">â€” Choose a student â€”</option>
              ${window.NEURONEXUS_SEED.users.filter(u => u.role === 'student').map(s => `
                <option value="${s.id}">${s.name} (${s.department}, ${s.semester})</option>
              `).join('')}
            </select>
          </div>

          <div id="faculty-student-card" class="p-5 bg-slate-950/60 rounded-xl border border-dashed border-slate-700 text-center text-xs text-slate-500">
            Select a student above to view their wellbeing status and performance data.
          </div>
        </div>
      </div>
    `;
  }

  renderFacultyStudentCard(studentId) {
    const card = document.getElementById("faculty-student-card");
    if (!card) return;
    if (!studentId) {
      card.innerHTML = `<div class="text-xs text-slate-500">Select a student above to view their wellbeing status and performance data.</div>`;
      return;
    }
    const student = window.NEURONEXUS_SEED.users.find(u => u.id === studentId);
    if (!student) return;

    const stateConfig = {
      FOCUS:  { color: "emerald", label: "FOCUSED", emoji: "ðŸŽ¯", desc: "Actively engaged in learning material", stress: "12% (LOW)",  relax: "84% (HIGH)" },
      RELAX:  { color: "teal",    label: "RELAXED",  emoji: "ðŸ˜Œ", desc: "Calm, absorbing content comfortably",  stress: "8% (LOW)",   relax: "91% (HIGH)" },
      STRESS: { color: "rose",    label: "STRESSED",  emoji: "âš ï¸", desc: "High cognitive load detected",        stress: "74% (HIGH)", relax: "22% (LOW)"  },
      FATIGUE:{ color: "amber",   label: "FATIGUED",  emoji: "ðŸ˜´", desc: "Low alertness, may need a break",    stress: "35% (MOD)",  relax: "48% (MOD)"  },
      INSUFFICIENT: { color: "slate", label: "UNKNOWN", emoji: "â“", desc: "Insufficient data this session",  stress: "N/A",        relax: "N/A"         }
    };
    const state = stateConfig[student.mentalStatus] || stateConfig["INSUFFICIENT"];
    const canShowEEG = student.consentEEG;
    const attempts = window.neuronexusDB.getAttempts(studentId);

    card.innerHTML = `
      <div class="text-left space-y-4">
        <!-- Student Header -->
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-violet-500/30 border border-indigo-500/30 flex items-center justify-center text-lg font-extrabold text-indigo-300">
            ${student.avatar}
          </div>
          <div>
            <div class="font-bold text-slate-100 text-base">${student.name}</div>
            <div class="text-xs text-slate-400">${student.department} â€¢ ${student.semester}</div>
          </div>
          <span class="ml-auto text-xs px-2.5 py-1 rounded-full bg-${state.color}-500/15 text-${state.color}-300 border border-${state.color}-500/30 font-semibold">
            ${state.emoji} ${state.label}
          </span>
        </div>

        ${canShowEEG ? `
        <!-- Mental Status Row (EEG Consented) -->
        <div class="grid grid-cols-3 gap-3">
          <div class="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-center">
            <div class="text-[10px] text-slate-400 uppercase font-mono mb-1">Stress Level</div>
            <div class="text-base font-bold ${state.color === 'rose' ? 'text-rose-400' : 'text-emerald-400'}">${state.stress}</div>
          </div>
          <div class="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-center">
            <div class="text-[10px] text-slate-400 uppercase font-mono mb-1">Relaxation</div>
            <div class="text-base font-bold ${state.color === 'teal' || state.color === 'emerald' ? 'text-teal-400' : 'text-amber-400'}">${state.relax}</div>
          </div>
          <div class="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-center">
            <div class="text-[10px] text-slate-400 uppercase font-mono mb-1">Session State</div>
            <div class="text-base font-bold text-violet-400">${state.label}</div>
          </div>
        </div>
        <div class="text-[11px] text-slate-500 italic bg-slate-900/40 px-3 py-2 rounded-lg border border-slate-800">
          ðŸ§  ${state.desc} â€” These are estimated indicators only. Not for grading or disciplinary use.
        </div>
        ` : `
        <div class="p-3 bg-amber-950/30 rounded-xl border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
          <span>ðŸ”’</span>
          <span>This student has not consented to EEG data sharing. Cognitive stress data is withheld per privacy policy.</span>
        </div>
        `}

        <!-- Academic Gaps Summary -->
        <div>
          <div class="text-xs font-mono font-bold text-slate-400 uppercase mb-2">Recent Quiz Attempts</div>
          ${attempts.length > 0 ? attempts.slice(0, 2).map(att => `
            <div class="flex items-center justify-between p-3 bg-slate-900/40 rounded-lg border border-slate-800 mb-2">
              <div class="text-xs text-slate-300">${att.topicId || 'Topic Quiz'}</div>
              <span class="text-xs font-bold ${att.percentage >= 70 ? 'text-emerald-400' : 'text-rose-400'}">${att.percentage}%</span>
            </div>
          `).join('') : `
            <div class="text-xs text-slate-500 italic">No quiz attempts recorded yet for this student.</div>
          `}
        </div>
      </div>
    `;
  }

  // ============================================================
  // VIEW: PARENT / GUARDIAN WELLBEING PORTAL
  // ============================================================
  renderParentsView() {
    const allStudents = window.NEURONEXUS_SEED.users.filter(u => u.role === 'student' && u.parentConsent === true);
    const container = document.getElementById("main-content");

    container.innerHTML = `
      <div class="max-w-5xl mx-auto px-4 py-8">
        <!-- Header -->
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div class="text-xs font-mono text-amber-400 uppercase tracking-wider">GUARDIAN WELLBEING DASHBOARD</div>
            <h2 class="text-3xl font-bold text-white">Parent Portal</h2>
            <p class="text-sm text-slate-300 mt-1">Monitor your child's estimated study wellbeing from classroom sessions.</p>
          </div>
          <span class="text-[10px] px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold">GUARDIAN VIEW</span>
        </div>

        <!-- Ethics / Privacy Notice -->
        <div class="p-4 bg-amber-950/30 rounded-2xl border border-amber-500/30 mb-8 text-xs text-slate-300">
          <div class="flex items-start gap-3">
            <span class="text-amber-400 text-lg flex-shrink-0">ðŸ›¡ï¸</span>
            <div>
              <div class="font-bold text-amber-300 mb-1">Guardian View â€” Wellbeing Support Only</div>
              <p>This view shows your child's estimated study stress and relaxation indicators to help you support their wellbeing. It is <strong>not a clinical assessment</strong>, not used for grading, and never shared with examiners or institutions. All data is simulated from the current session and clearly labeled as non-diagnostic. Shown only with explicit student and guardian consent.</p>
            </div>
          </div>
        </div>

        <!-- Student Selector -->
        <div class="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 mb-6">
          <div class="flex flex-wrap items-center gap-4 mb-4">
            <label class="text-sm font-semibold text-slate-200">Select your child:</label>
            <select id="parent-student-selector" onchange="window.neuronexusApp.renderParentStudentCard(this.value)"
                    class="bg-slate-950 text-slate-200 text-sm px-4 py-2.5 rounded-xl border border-amber-500/30 focus:outline-none focus:border-amber-400 cursor-pointer min-w-64">
              <option value="">â€” Choose a student â€”</option>
              ${allStudents.map(s => `
                <option value="${s.id}">${s.name} (${s.department})</option>
              `).join('')}
            </select>
          </div>
          <div class="text-[11px] text-slate-500">Only students who have given parent consent are listed.</div>
        </div>

        <!-- Student Card Output -->
        <div id="parent-student-card">
          <div class="p-12 bg-slate-900/40 rounded-2xl border border-dashed border-slate-700 text-center text-slate-400">
            <div class="text-4xl mb-3">ðŸ‘¨â€ðŸ‘©â€ðŸ‘§</div>
            <div class="text-sm">Select your child's name above to view their study wellbeing status.</div>
          </div>
        </div>

        <!-- What these signals mean -->
        <div class="mt-8 p-5 bg-slate-900/60 rounded-2xl border border-slate-800">
          <h4 class="font-bold text-slate-200 mb-3 text-sm">Understanding the Signals</h4>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            ${[
              {state:"FOCUSED", color:"emerald", emoji:"ðŸŽ¯", desc:"Engaged in learning"},
              {state:"RELAXED", color:"teal", emoji:"ðŸ˜Œ", desc:"Calm & absorbing content"},
              {state:"STRESSED", color:"rose", emoji:"âš ï¸", desc:"High cognitive load"},
              {state:"FATIGUED", color:"amber", emoji:"ðŸ˜´", desc:"Needs rest or break"}
            ].map(s => `
              <div class="p-3 bg-slate-950/40 rounded-xl border border-${s.color}-500/20 text-center">
                <div class="text-xl mb-1">${s.emoji}</div>
                <div class="text-xs font-bold text-${s.color}-400">${s.state}</div>
                <div class="text-[10px] text-slate-400 mt-1">${s.desc}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  renderParentStudentCard(studentId) {
    const card = document.getElementById("parent-student-card");
    if (!card) return;
    if (!studentId) {
      card.innerHTML = `
        <div class="p-12 bg-slate-900/40 rounded-2xl border border-dashed border-slate-700 text-center text-slate-400">
          <div class="text-4xl mb-3">ðŸ‘¨â€ðŸ‘©â€ðŸ‘§</div>
          <div class="text-sm">Select your child's name above to view their study wellbeing status.</div>
        </div>`;
      return;
    }
    const student = window.NEURONEXUS_SEED.users.find(u => u.id === studentId);
    if (!student) return;

    const stateConfig = {
      FOCUS:  { color: "emerald", label: "FOCUSED",  emoji: "ðŸŽ¯", desc: "Actively engaged with study material. Your child appears to be in a productive learning state.", stress: "12%",  relax: "84%", stressLevel: "LOW",  relaxLevel: "HIGH",  advice: "Great time! Let them continue â€” this is peak learning mode." },
      RELAX:  { color: "teal",    label: "RELAXED",  emoji: "ðŸ˜Œ", desc: "Calm and comfortable. Your child is absorbing content without significant pressure.", stress: "8%",   relax: "91%", stressLevel: "LOW",  relaxLevel: "HIGH",  advice: "All good â€” your child is in a positive, receptive state." },
      STRESS: { color: "rose",    label: "STRESSED", emoji: "âš ï¸", desc: "Elevated cognitive load detected. This may indicate a challenging topic or exam anxiety.", stress: "74%",  relax: "22%", stressLevel: "HIGH", relaxLevel: "LOW",   advice: "Consider checking in after class. A short break or a kind word may help." },
      FATIGUE:{ color: "amber",   label: "FATIGUED", emoji: "ðŸ˜´", desc: "Reduced alertness. Long sessions or disrupted sleep may be contributing.", stress: "35%",  relax: "48%", stressLevel: "MOD",  relaxLevel: "MOD",   advice: "Encourage a short rest or light activity after this session." },
    };
    const state = stateConfig[student.mentalStatus] || { color:"slate", label:"UNKNOWN", emoji:"â“", desc:"Session data unavailable.", stress:"N/A", relax:"N/A", stressLevel:"N/A", relaxLevel:"N/A", advice:"No session data is available." };

    // Brainwave frequency simulation data
    const waves = {
      FOCUS:  [{band:"Delta",val:8},{band:"Theta",val:18},{band:"Alpha",val:30},{band:"Beta",val:38},{band:"Gamma",val:6}],
      RELAX:  [{band:"Delta",val:10},{band:"Theta",val:20},{band:"Alpha",val:42},{band:"Beta",val:22},{band:"Gamma",val:6}],
      STRESS: [{band:"Delta",val:5},{band:"Theta",val:14},{band:"Alpha",val:15},{band:"Beta",val:54},{band:"Gamma",val:12}],
      FATIGUE:[{band:"Delta",val:28},{band:"Theta",val:32},{band:"Alpha",val:24},{band:"Beta",val:12},{band:"Gamma",val:4}],
    };
    const waveData = waves[student.mentalStatus] || waves["RELAX"];

    // Simulated session timeline
    const sessions = [
      {time:"10:05 AM", state:"FOCUS",  note:"Started lesson review"},
      {time:"10:20 AM", state: student.mentalStatus, note:"Current status"},
      {time:"09:45 AM", state:"RELAX",  note:"Pre-lesson period"},
    ];

    card.innerHTML = `
      <div class="space-y-6">
        <!-- Student Banner -->
        <div class="p-6 bg-slate-900/80 rounded-2xl border border-${state.color}-500/30">
          <div class="flex flex-wrap items-center gap-4 mb-5">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-${state.color}-500/30 to-${state.color}-700/10 border border-${state.color}-500/30 flex items-center justify-center text-2xl font-extrabold text-${state.color}-300">
              ${student.avatar}
            </div>
            <div class="flex-1">
              <div class="text-lg font-bold text-slate-100">${student.name}</div>
              <div class="text-xs text-slate-400">${student.department} â€¢ ${student.semester}</div>
              <div class="text-xs text-slate-500 mt-0.5">Last updated: Just now (simulated session)</div>
            </div>
            <div class="text-center">
              <div class="text-4xl">${state.emoji}</div>
              <div class="text-xs font-bold text-${state.color}-400 mt-1">${state.label}</div>
            </div>
          </div>

          <p class="text-sm text-slate-300 mb-4 bg-slate-950/40 px-4 py-3 rounded-xl border border-slate-800">${state.desc}</p>

          <!-- Stress / Relaxation Gauges -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
              <div class="flex justify-between items-center mb-2">
                <span class="text-xs font-mono text-slate-400 uppercase">Study Stress</span>
                <span class="text-sm font-bold ${state.stressLevel === 'HIGH' ? 'text-rose-400' : state.stressLevel === 'MOD' ? 'text-amber-400' : 'text-emerald-400'}">${state.stress}</span>
              </div>
              <div class="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500 ${state.stressLevel === 'HIGH' ? 'bg-rose-400' : state.stressLevel === 'MOD' ? 'bg-amber-400' : 'bg-emerald-400'}"
                     style="width:${state.stress.replace('%','')}%"></div>
              </div>
              <div class="text-[10px] text-slate-500 mt-1">${state.stressLevel} stress level</div>
            </div>
            <div class="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
              <div class="flex justify-between items-center mb-2">
                <span class="text-xs font-mono text-slate-400 uppercase">Relaxation</span>
                <span class="text-sm font-bold ${state.relaxLevel === 'HIGH' ? 'text-teal-400' : state.relaxLevel === 'MOD' ? 'text-amber-400' : 'text-rose-400'}">${state.relax}</span>
              </div>
              <div class="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500 ${state.relaxLevel === 'HIGH' ? 'bg-teal-400' : state.relaxLevel === 'MOD' ? 'bg-amber-400' : 'bg-rose-400'}"
                     style="width:${state.relax.replace('%','')}%"></div>
              </div>
              <div class="text-[10px] text-slate-500 mt-1">${state.relaxLevel} relaxation level</div>
            </div>
          </div>

          <!-- Brainwave Band Bars -->
          <div class="p-4 bg-slate-950/40 rounded-xl border border-slate-800 mb-4">
            <div class="text-[10px] font-mono text-slate-400 uppercase mb-3">Brainwave Band Activity (Simulated)</div>
            <div class="space-y-2">
              ${waveData.map(w => `
                <div class="flex items-center gap-3">
                  <span class="text-[10px] font-mono text-slate-400 w-10">${w.band}</span>
                  <div class="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div class="h-full rounded-full bg-violet-400 transition-all" style="width:${w.val * 1.8}%;opacity:0.85;"></div>
                  </div>
                  <span class="text-[10px] text-violet-300 font-mono w-6 text-right">${w.val}%</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Parental Advice -->
          <div class="p-3 bg-${state.color}-950/30 rounded-xl border border-${state.color}-500/20 flex items-start gap-2">
            <span class="text-base flex-shrink-0">ðŸ’¡</span>
            <div class="text-xs text-slate-300">${state.advice}</div>
          </div>
        </div>

        <!-- Session Timeline -->
        <div class="p-5 bg-slate-900/60 rounded-2xl border border-slate-800">
          <div class="text-xs font-mono font-bold text-slate-400 uppercase mb-3">Today's Session Timeline</div>
          <div class="space-y-2">
            ${sessions.map((s,i) => {
              const sc = stateConfig[s.state] || { color:"slate", emoji:"â“", label:s.state };
              return `
              <div class="flex items-center gap-3 p-2.5 bg-slate-950/40 rounded-lg border border-slate-800">
                <span class="text-xs font-mono text-slate-500 w-20">${s.time}</span>
                <span class="text-base">${sc.emoji}</span>
                <span class="text-xs font-semibold text-${sc.color}-400">${sc.label}</span>
                <span class="text-xs text-slate-400">â€” ${s.note}</span>
                ${i === 1 ? '<span class="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">LIVE</span>' : ''}
              </div>`;
            }).join('')}
          </div>
        </div>

        <!-- Disclaimer -->
        <div class="text-[11px] text-slate-500 italic text-center p-3 bg-slate-900/30 rounded-xl border border-slate-800">
          ðŸ›¡ï¸ All readings are estimated study wellbeing indicators from session data â€” they are non-clinical, non-diagnostic, and never used for academic evaluation or grading. Shown only with your child's explicit consent.
        </div>
      </div>
    `;
  }

  // ============================================================
  // VIEW: MENTOR DIRECTORY & GUIDANCE MODULE
  // ============================================================
  renderMentorsView() {
    const mentors = window.neuronexusDB.getMentors();
    const container = document.getElementById("main-content");

    container.innerHTML = `
      <div class="max-w-5xl mx-auto px-4 py-8">
        <div class="mb-8">
          <div class="text-xs font-mono text-teal-400 uppercase">PEER & ALUMNI GUIDANCE</div>
          <h2 class="text-3xl font-bold text-white">Mentor Directory</h2>
          <p class="text-sm text-slate-300">Connect with industry alumni and top-ranking peers for 1-on-1 concept reviews.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${mentors.map(m => `
            <div class="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-col justify-between glow-card">
              <div>
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold text-base border border-teal-500/20">
                    ${m.avatar}
                  </div>
                  <div>
                    <h3 class="font-bold text-white text-base">${m.name}</h3>
                    <div class="text-xs text-slate-400">${m.company}</div>
                  </div>
                </div>

                <div class="text-xs text-slate-300 mb-4 leading-relaxed">${m.bio}</div>

                <div class="mb-4">
                  <div class="text-[11px] font-mono text-slate-400 uppercase mb-1.5">Specialties</div>
                  <div class="flex flex-wrap gap-1.5">
                    ${m.topics.map(t => `<span class="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">${t}</span>`).join('')}
                  </div>
                </div>
              </div>

              <div class="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span class="text-xs font-bold text-amber-400">â˜… ${m.rating} (${m.reviewsCount})</span>
                <button onclick="window.neuronexusApp.openMentorModal('${m.id}')" class="btn-primary text-xs px-3.5 py-1.5">
                  Request Session â†’
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div id="mentor-modal-placeholder"></div>
    `;
  }

  openMentorModal(mentorId) {
    const mentors = window.neuronexusDB.getMentors();
    const m = mentors.find(item => item.id === mentorId);
    if (!m) return;

    const modalPlaceholder = document.getElementById("mentor-modal-placeholder");
    modalPlaceholder.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
        <div class="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-700 p-6 md:p-8">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold text-white">Book Mentorship Session</h3>
            <button onclick="document.getElementById('mentor-modal-placeholder').innerHTML=''" class="text-slate-400 hover:text-white font-bold">âœ•</button>
          </div>
          <div class="text-xs text-slate-300 mb-4">
            Requesting 1-on-1 guidance with <strong class="text-teal-300">${m.name}</strong> (${m.company}).
          </div>
          <div class="space-y-3 text-xs mb-6">
            <div>
              <label class="block text-slate-400 mb-1">Select Topic</label>
              <select id="mentor-topic" class="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-700">
                ${m.topics.map(t => `<option value="${t}">${t}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-slate-400 mb-1">Available Slot</label>
              <select id="mentor-slot" class="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-700">
                ${m.availableSlots.map(s => `<option value="${s}">${s}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-slate-400 mb-1">What would you like to review?</label>
              <textarea id="mentor-note" rows="2" placeholder="e.g. Need help tracing Morris traversal in O(1) space..."
                        class="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-teal-400"></textarea>
            </div>
          </div>
          <div class="flex justify-end gap-2">
            <button onclick="document.getElementById('mentor-modal-placeholder').innerHTML=''" class="btn-secondary px-4 py-2 text-xs">Cancel</button>
            <button onclick="window.neuronexusApp.confirmMentorRequest('${m.id}')" class="btn-primary px-5 py-2 text-xs">Confirm Request</button>
          </div>
        </div>

      </div>
    `;
  }

  confirmMentorRequest(mentorId) {
    const topic = document.getElementById("mentor-topic").value;
    const slot = document.getElementById("mentor-slot").value;
    const note = document.getElementById("mentor-note").value;

    window.neuronexusDB.requestMentorSession(mentorId, topic, slot, note);
    document.getElementById("mentor-modal-placeholder").innerHTML = "";
    alert(`Success! Your mentorship session on ${topic} for ${slot} has been booked.`);
  }

  // ============================================================
  // VIEW: PRIVACY, DATA OWNERSHIP & CONSENT MODEL
  // ============================================================
  renderPrivacyView() {
    const user = window.neuronexusDB.getCurrentUser();
    const container = document.getElementById("main-content");

    container.innerHTML = `
      <div class="max-w-4xl mx-auto px-4 py-8">
        <div class="mb-8">
          <div class="text-xs font-mono text-cyan-400 uppercase">ETHICS & PRIVACY ARCHITECTURE</div>
          <h2 class="text-3xl font-bold text-white">Privacy, Consent & Data Ownership</h2>
          <p class="text-sm text-slate-300">You maintain complete sovereign ownership over your academic records and biometric signals.</p>
        </div>

        <!-- Consent Controls Card -->
        <div class="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 mb-8">
          <h3 class="text-lg font-bold text-white mb-4">Your Data Preferences</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-slate-700">
              <div>
                <div class="font-semibold text-slate-200 text-sm">Voluntary EEG / Biometric Signal Logging</div>
                <div class="text-xs text-slate-400">Allows recording of contextual focus indicators via BioAmp EXG sensors during quizzes.</div>
              </div>
              <input type="checkbox" id="consent-eeg" ${user.consentEEG ? 'checked' : ''}
                     onchange="window.neuronexusApp.updateConsent()"
                     class="w-5 h-5 accent-cyan-500 rounded cursor-pointer" />
            </div>

            <div class="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-slate-700">
              <div>
                <div class="font-semibold text-slate-200 text-sm">Anonymized Academic Research Sharing</div>
                <div class="text-xs text-slate-400">Allows aggregated quiz error frequencies to assist faculty curriculum improvements.</div>
              </div>
              <input type="checkbox" id="consent-sharing" ${user.dataSharing ? 'checked' : ''}
                     onchange="window.neuronexusApp.updateConsent()"
                     class="w-5 h-5 accent-cyan-500 rounded cursor-pointer" />
            </div>
          </div>
        </div>

        <!-- Principles of Trust -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-xs">
          <div class="p-5 bg-slate-900/60 rounded-xl border border-slate-800">
            <div class="font-bold text-cyan-300 text-sm mb-2">1. Never Punitive</div>
            <p class="text-slate-300 leading-relaxed">EEG estimates are strictly private to the student and are never exposed to faculty or parents for grading or disciplinary action.</p>
          </div>
          <div class="p-5 bg-slate-900/60 rounded-xl border border-slate-800">
            <div class="font-bold text-amber-300 text-sm mb-2">2. Non-Diagnostic</div>
            <p class="text-slate-300 leading-relaxed">We state clearly that contextual focus is an inferred statistical indicator, not a validated medical or neurological assessment.</p>
          </div>
          <div class="p-5 bg-slate-900/60 rounded-xl border border-slate-800">
            <div class="font-bold text-emerald-300 text-sm mb-2">3. Sovereign Export & Wipe</div>
            <p class="text-slate-300 leading-relaxed">Students can export their entire attempt history or wipe all stored local records with a single click.</p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <button onclick="window.neuronexusApp.exportStudentData()" class="btn-secondary text-xs px-4 py-2">
            Export My Data (JSON)
          </button>
          <button onclick="window.neuronexusApp.resetAllData()" class="btn-secondary text-xs px-4 py-2 border-rose-500/30 text-rose-300">
            Reset Demo Data to Fresh State
          </button>
        </div>
      </div>
    `;
  }

  updateConsent() {
    const eegConsent = document.getElementById("consent-eeg").checked;
    const sharing = document.getElementById("consent-sharing").checked;
    window.neuronexusDB.updateUserConsent(eegConsent, sharing);
  }

  exportStudentData() {
    const user = window.neuronexusDB.getCurrentUser();
    const attempts = window.neuronexusDB.getAttempts(user.id);
    const sessions = window.neuronexusDB.getNeuroSessions(user.id);
    const blob = new Blob([JSON.stringify({ user, attempts, sessions }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `neuronexus_data_${user.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  resetAllData() {
    if (confirm("Reset application to clean demo state?")) {
      window.neuronexusDB.resetToSeed();
      window.neuroLearnEngine.activeQuizState = null;
      alert("Application data restored to clean seed state.");
      this.navigate("dashboard");
    }
  }

  // ============================================================
  // DEMO TOUR / JUDGE WALKTHROUGH CONTROLLER
  // ============================================================
  startDemoWalkthrough() {
    this.navigate("neurolearn");
  }

  switchUserRole(userId) {
    window.neuronexusDB.setCurrentUser(userId);
    const user = window.neuronexusDB.getCurrentUser();
    if (user.role === "faculty") {
      this.navigate("faculty");
    } else if (user.role === "parent") {
      this.navigate("parents");
    } else if (user.role === "mentor") {
      this.navigate("mentors");
    } else {
      this.navigate("dashboard");
    }
  }
}

// Global bootstrap - Instant synchronous init without delay
function initNeuronexus() {
  if (!window.neuronexusApp) {
    window.neuronexusApp = new NeuronexusApp();
    const hash = window.location.hash.replace("#", "") || "landing";
    window.neuronexusApp.navigate(hash, false);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initNeuronexus);
} else {
  initNeuronexus();
}
