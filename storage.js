/**
 * NEURONEXUS - Persistent LocalStorage Repository
 * Manages atomic data persistence, user preferences, quiz results,
 * NeuroLearn Loop history, and community interactions.
 */

class NeuronexusStorage {
  constructor() {
    this.STORAGE_KEY_PREFIX = "neuronexus_v1_";
    this.SEED_VERSION = "v3"; // bump to force re-seed with new users/videos
    this.init();
  }

  init() {
    const storedVersion = localStorage.getItem(this.STORAGE_KEY_PREFIX + "seedVersion");
    if (!localStorage.getItem(this.STORAGE_KEY_PREFIX + "initialized") || storedVersion !== this.SEED_VERSION) {
      this.resetToSeed();
    }
  }

  resetToSeed() {
    const seed = window.NEURONEXUS_SEED;
    localStorage.setItem(this.STORAGE_KEY_PREFIX + "users", JSON.stringify(seed.users));
    localStorage.setItem(this.STORAGE_KEY_PREFIX + "courses", JSON.stringify(seed.courses));
    localStorage.setItem(this.STORAGE_KEY_PREFIX + "questionBanks", JSON.stringify(seed.questionBanks));
    localStorage.setItem(this.STORAGE_KEY_PREFIX + "attempts", JSON.stringify(seed.historicalAttempts));
    localStorage.setItem(this.STORAGE_KEY_PREFIX + "communityQA", JSON.stringify(seed.communityQuestions));
    localStorage.setItem(this.STORAGE_KEY_PREFIX + "mentors", JSON.stringify(seed.mentors));
    localStorage.setItem(this.STORAGE_KEY_PREFIX + "neuroSessions", JSON.stringify(seed.neuroSessions));
    localStorage.setItem(this.STORAGE_KEY_PREFIX + "currentUserId", "usr_student_01");
    localStorage.setItem(this.STORAGE_KEY_PREFIX + "initialized", "true");
    localStorage.setItem(this.STORAGE_KEY_PREFIX + "seedVersion", this.SEED_VERSION);
    localStorage.setItem(this.STORAGE_KEY_PREFIX + "lastReset", new Date().toISOString());
  }

  // --- User / Role Management ---
  getCurrentUser() {
    const userId = localStorage.getItem(this.STORAGE_KEY_PREFIX + "currentUserId") || "usr_student_01";
    const users = this.getUsers();
    return users.find(u => u.id === userId) || users[0];
  }

  setCurrentUser(userId) {
    localStorage.setItem(this.STORAGE_KEY_PREFIX + "currentUserId", userId);
    window.dispatchEvent(new CustomEvent("neuronexus:user_changed", { detail: this.getCurrentUser() }));
  }

  getUsers() {
    const data = localStorage.getItem(this.STORAGE_KEY_PREFIX + "users");
    return data ? JSON.parse(data) : [];
  }

  updateUserConsent(consentEEG, dataSharing) {
    const users = this.getUsers();
    const current = this.getCurrentUser();
    const idx = users.findIndex(u => u.id === current.id);
    if (idx !== -1) {
      users[idx].consentEEG = consentEEG;
      users[idx].dataSharing = dataSharing;
      localStorage.setItem(this.STORAGE_KEY_PREFIX + "users", JSON.stringify(users));
      window.dispatchEvent(new CustomEvent("neuronexus:consent_updated", { detail: users[idx] }));
    }
  }

  // --- Courses & Topics ---
  getCourses() {
    const data = localStorage.getItem(this.STORAGE_KEY_PREFIX + "courses");
    return data ? JSON.parse(data) : [];
  }

  getCourse(courseId) {
    return this.getCourses().find(c => c.id === courseId) || null;
  }

  getTopic(topicId) {
    const courses = this.getCourses();
    for (const c of courses) {
      const top = c.topics.find(t => t.id === topicId);
      if (top) return { ...top, courseId: c.id, courseTitle: c.title };
    }
    return null;
  }

  getQuestions(topicId) {
    const data = localStorage.getItem(this.STORAGE_KEY_PREFIX + "questionBanks");
    const banks = data ? JSON.parse(data) : {};
    return banks[topicId] || [];
  }

  // --- Quiz & Assessment History ---
  getAttempts(userId = null) {
    const data = localStorage.getItem(this.STORAGE_KEY_PREFIX + "attempts");
    const list = data ? JSON.parse(data) : [];
    if (userId) return list.filter(a => a.userId === userId);
    return list;
  }

  getAttempt(attemptId) {
    return this.getAttempts().find(a => a.id === attemptId) || null;
  }

  getAttemptsByTopic(topicId, userId = null) {
    const user = userId || this.getCurrentUser().id;
    return this.getAttempts(user)
      .filter(a => a.topicId === topicId)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  saveAttempt(attempt) {
    const attempts = this.getAttempts();
    attempts.push(attempt);
    localStorage.setItem(this.STORAGE_KEY_PREFIX + "attempts", JSON.stringify(attempts));
    window.dispatchEvent(new CustomEvent("neuronexus:attempt_saved", { detail: attempt }));
    return attempt;
  }

  // --- Neuro / EEG Sessions ---
  getNeuroSessions(userId = null) {
    const data = localStorage.getItem(this.STORAGE_KEY_PREFIX + "neuroSessions");
    const list = data ? JSON.parse(data) : [];
    if (userId) return list.filter(s => s.userId === userId);
    return list;
  }

  saveNeuroSession(session) {
    const sessions = this.getNeuroSessions();
    sessions.push(session);
    localStorage.setItem(this.STORAGE_KEY_PREFIX + "neuroSessions", JSON.stringify(sessions));
    window.dispatchEvent(new CustomEvent("neuronexus:neuro_session_saved", { detail: session }));
    return session;
  }

  // --- Community Q&A (Campus-Q&A Core) ---
  getQuestionsList() {
    const data = localStorage.getItem(this.STORAGE_KEY_PREFIX + "communityQA");
    return data ? JSON.parse(data) : [];
  }

  getQuestion(id) {
    return this.getQuestionsList().find(q => q.id === id) || null;
  }

  saveQuestion(questionData) {
    const list = this.getQuestionsList();
    const newQ = {
      id: "qa_" + Date.now(),
      title: questionData.title,
      category: questionData.category,
      courseId: questionData.courseId || "crs_dsa_101",
      author: {
        name: this.getCurrentUser().name,
        role: this.getCurrentUser().role === "faculty" ? "Faculty" : "Student",
        avatar: this.getCurrentUser().avatar || "ME"
      },
      timestamp: new Date().toISOString(),
      votes: 1,
      views: 1,
      tags: questionData.tags || [],
      content: questionData.content,
      answers: []
    };
    list.unshift(newQ);
    localStorage.setItem(this.STORAGE_KEY_PREFIX + "communityQA", JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("neuronexus:qa_updated"));
    return newQ;
  }

  addAnswer(questionId, content) {
    const list = this.getQuestionsList();
    const q = list.find(item => item.id === questionId);
    if (!q) return null;
    const user = this.getCurrentUser();
    const newAns = {
      id: "ans_" + Date.now(),
      author: {
        name: user.name,
        role: user.role === "faculty" ? "Faculty" : user.role === "mentor" ? "Mentor" : "Student",
        avatar: user.avatar || "ME",
        verified: user.role === "faculty" || user.role === "mentor"
      },
      timestamp: new Date().toISOString(),
      votes: 0,
      content: content
    };
    q.answers.push(newAns);
    localStorage.setItem(this.STORAGE_KEY_PREFIX + "communityQA", JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("neuronexus:qa_updated"));
    return newAns;
  }

  upvoteQuestion(questionId) {
    const list = this.getQuestionsList();
    const q = list.find(item => item.id === questionId);
    if (q) {
      q.votes = (q.votes || 0) + 1;
      localStorage.setItem(this.STORAGE_KEY_PREFIX + "communityQA", JSON.stringify(list));
      window.dispatchEvent(new CustomEvent("neuronexus:qa_updated"));
      return q.votes;
    }
    return 0;
  }

  upvoteAnswer(questionId, answerId) {
    const list = this.getQuestionsList();
    const q = list.find(item => item.id === questionId);
    if (q) {
      const a = q.answers.find(ans => ans.id === answerId);
      if (a) {
        a.votes = (a.votes || 0) + 1;
        localStorage.setItem(this.STORAGE_KEY_PREFIX + "communityQA", JSON.stringify(list));
        window.dispatchEvent(new CustomEvent("neuronexus:qa_updated"));
        return a.votes;
      }
    }
    return 0;
  }

  // --- Mentors ---
  getMentors() {
    const data = localStorage.getItem(this.STORAGE_KEY_PREFIX + "mentors");
    return data ? JSON.parse(data) : [];
  }

  requestMentorSession(mentorId, topic, slot, note) {
    const requests = JSON.parse(localStorage.getItem(this.STORAGE_KEY_PREFIX + "mentorRequests") || "[]");
    const req = {
      id: "mreq_" + Date.now(),
      mentorId,
      studentId: this.getCurrentUser().id,
      studentName: this.getCurrentUser().name,
      topic,
      slot,
      note,
      status: "CONFIRMED",
      createdAt: new Date().toISOString()
    };
    requests.push(req);
    localStorage.setItem(this.STORAGE_KEY_PREFIX + "mentorRequests", JSON.stringify(requests));
    return req;
  }
}

window.neuronexusDB = new NeuronexusStorage();
