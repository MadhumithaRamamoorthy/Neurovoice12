/**
 * NEURONEXUS - Community Q&A Engine
 * Preserves and significantly upgrades the original CAMPUS-Q&A foundation.
 * Provides category filtering, search, thread details, voting, and responsive submissions.
 */

class CommunityQAEngine {
  constructor(db) {
    this.db = db;
    this.activeFilter = "ALL";
    this.searchQuery = "";
  }

  getFilteredQuestions() {
    let questions = this.db.getQuestionsList();

    // Category filter
    if (this.activeFilter !== "ALL") {
      questions = questions.filter(q => q.category.toUpperCase().includes(this.activeFilter.toUpperCase()));
    }

    // Search query filter
    if (this.searchQuery.trim()) {
      const qLower = this.searchQuery.toLowerCase().trim();
      questions = questions.filter(q =>
        q.title.toLowerCase().includes(qLower) ||
        q.content.toLowerCase().includes(qLower) ||
        (q.tags && q.tags.some(t => t.toLowerCase().includes(qLower)))
      );
    }

    return questions;
  }

  setFilter(category) {
    this.activeFilter = category;
  }

  setSearch(query) {
    this.searchQuery = query;
  }

  submitQuestion(title, category, courseId, content, tags = []) {
    if (!title || title.trim().length < 5) {
      throw new Error("Question title must be at least 5 characters long.");
    }
    if (!content || content.trim().length < 15) {
      throw new Error("Question content must provide sufficient context (minimum 15 characters).");
    }

    return this.db.saveQuestion({
      title: title.trim(),
      category: category || "General",
      courseId: courseId || "crs_dsa_101",
      content: content.trim(),
      tags: tags
    });
  }

  submitAnswer(questionId, content) {
    if (!content || content.trim().length < 5) {
      throw new Error("Answer must contain at least 5 characters.");
    }
    return this.db.addAnswer(questionId, content.trim());
  }

  upvote(questionId) {
    return this.db.upvoteQuestion(questionId);
  }

  upvoteAnswer(questionId, answerId) {
    return this.db.upvoteAnswer(questionId, answerId);
  }
}

window.communityQA = new CommunityQAEngine(window.neuronexusDB);
