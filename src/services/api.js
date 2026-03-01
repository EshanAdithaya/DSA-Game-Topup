const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('qq_token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('qq_token', token);
    } else {
      localStorage.removeItem('qq_token');
    }
  }

  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(method, endpoint, body = null) {
    const config = {
      method,
      headers: this.getHeaders(),
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  }

  // Auth
  async register(email, password, username) {
    return this.request('POST', '/auth/register', { email, password, username });
  }

  async login(email, password) {
    return this.request('POST', '/auth/login', { email, password });
  }

  async getProfile() {
    return this.request('GET', '/auth/profile');
  }

  // Questions
  async getPoolQuestions() {
    return this.request('GET', '/questions/pool');
  }

  async generateQuestion(difficulty, questionNumber) {
    return this.request('POST', '/questions/generate', { difficulty, questionNumber });
  }

  // Game Session
  async startSession() {
    return this.request('POST', '/game/session/start', {});
  }

  async submitAnswer(sessionId, questionId, answer, correctAnswer, timeRemaining, questionNumber, streak) {
    return this.request('POST', '/game/answer', {
      sessionId,
      questionId: String(questionId),
      answer,
      correctAnswer,
      timeRemaining,
      questionNumber,
      streak,
    });
  }

  async endSession(sessionId, finalScore, finalStability, questionsAnswered, correctAnswers, wrongAnswers, difficultyReached) {
    return this.request('POST', '/game/session/end', {
      sessionId,
      finalScore,
      finalStability,
      questionsAnswered,
      correctAnswers,
      wrongAnswers,
      difficultyReached,
    });
  }

  // Heart API
  async getHeartPuzzle() {
    return this.request('GET', '/heart/puzzle');
  }

  async verifyHeartAnswer(solution, userAnswer) {
    return this.request('POST', '/heart/verify', { solution, userAnswer: Number(userAnswer) });
  }

  // Leaderboard
  async getLeaderboard(limit = 20) {
    return this.request('GET', `/leaderboard?limit=${limit}`);
  }

  async getUserRank(userId) {
    return this.request('GET', `/leaderboard/user/${userId}`);
  }

  async getRecentGames(limit = 10) {
    return this.request('GET', `/leaderboard/recent?limit=${limit}`);
  }
}

export const api = new ApiService();
