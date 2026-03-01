import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const GameContext = createContext(null);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getDifficulty = (correctCount) => (correctCount < 10 ? 'easy' : correctCount < 20 ? 'medium' : 'hard');
const getTimeLimit  = (correctCount) => Math.max(10, 30 - Math.floor(correctCount / 10) * 5);

const FALLBACK_QUESTIONS = [
  { id:'f1', text:'A fair coin is flipped. What is P(heads)?', optionA:'1/4', optionB:'1/2', optionC:'3/4', optionD:'1', correctAnswer:'B', category:'probability', explanation:'A fair coin: P(heads) = 1/2' },
  { id:'f2', text:'Two dice are rolled. What is P(sum = 7)?', optionA:'1/12', optionB:'7/36', optionC:'1/6', optionD:'1/4', correctAnswer:'C', category:'probability', explanation:'6 ways to get sum 7 out of 36 outcomes = 1/6' },
  { id:'f3', text:'Sequence: 1, 4, 9, 16, ?', optionA:'20', optionB:'25', optionC:'36', optionD:'18', correctAnswer:'B', category:'patterns', explanation:'Pattern is perfect squares (n²). 5² = 25' },
  { id:'f4', text:'P(A) = 0.5, P(B) = 0.4, A and B are independent. P(A ∩ B) = ?', optionA:'0.2', optionB:'0.9', optionC:'0.45', optionD:'0.3', correctAnswer:'A', category:'probability', explanation:'P(A∩B) = P(A) × P(B) = 0.5 × 0.4 = 0.2' },
  { id:'f5', text:'A bag has 3 red and 7 blue balls. P(drawing red) = ?', optionA:'3/10', optionB:'7/10', optionC:'1/3', optionD:'3/7', correctAnswer:'A', category:'probability', explanation:'3 red out of 10 total = 3/10' },
  { id:'f6', text:'What is the expected value when rolling a fair die?', optionA:'3', optionB:'3.5', optionC:'4', optionD:'2.5', correctAnswer:'B', category:'probability', explanation:'E = (1+2+3+4+5+6)/6 = 21/6 = 3.5' },
];

const getFallback = (diff, n) => ({
  ...FALLBACK_QUESTIONS[n % FALLBACK_QUESTIONS.length],
  id: `fallback-${n}`,
  difficulty: diff,
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function GameProvider({ children }) {
  const navigate = useNavigate();

  // ── Auth state ──
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('qq_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  // ── Game state ──
  const [sessionId,        setSessionId]        = useState(null);
  const [currentQuestion,  setCurrentQuestion]  = useState(null);
  const [questionNumber,   setQuestionNumber]   = useState(0);
  const [score,            setScore]            = useState(0);
  const [stability,        setStability]        = useState(100);
  const [timer,            setTimer]            = useState(30);
  const [timeLimit,        setTimeLimit]        = useState(30);
  const [streak,           setStreak]           = useState(0);
  const [feedback,         setFeedback]         = useState(null);
  const [retryChances,     setRetryChances]     = useState(3);
  const [correctAnswers,   setCorrectAnswers]   = useState(0);
  const [wrongAnswers,     setWrongAnswers]      = useState(0);
  const [difficultyReached,setDifficultyReached]= useState('easy');

  // ── Refs to avoid stale closures in async / timer callbacks ──
  const timerIntervalRef   = useRef(null);
  const answeredRef        = useRef(false);
  const poolRef            = useRef([]);
  const qNumRef            = useRef(0);
  const scoreRef           = useRef(0);
  const stabilityRef       = useRef(100);
  const streakRef          = useRef(0);
  const timerValRef        = useRef(30);
  const correctRef         = useRef(0);
  const wrongRef           = useRef(0);
  const retryRef           = useRef(3);
  const diffRef            = useRef('easy');
  const sessionRef         = useRef(null);
  const questionRef        = useRef(null);

  // Keep refs in sync with state
  useEffect(() => { scoreRef.current     = score;            }, [score]);
  useEffect(() => { stabilityRef.current = stability;        }, [stability]);
  useEffect(() => { streakRef.current    = streak;           }, [streak]);
  useEffect(() => { correctRef.current   = correctAnswers;   }, [correctAnswers]);
  useEffect(() => { wrongRef.current     = wrongAnswers;     }, [wrongAnswers]);
  useEffect(() => { retryRef.current     = retryChances;     }, [retryChances]);
  useEffect(() => { diffRef.current      = difficultyReached;}, [difficultyReached]);
  useEffect(() => { sessionRef.current   = sessionId;        }, [sessionId]);
  useEffect(() => { questionRef.current  = currentQuestion;  }, [currentQuestion]);

  // Restore token on mount
  useEffect(() => {
    const token = localStorage.getItem('qq_token');
    if (token) api.setToken(token);
  }, []);

  // ── Timer ──────────────────────────────────────────────────────────────────

  const stopTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback((limit) => {
    stopTimer();
    timerValRef.current = limit;
    setTimer(limit);
    timerIntervalRef.current = setInterval(() => {
      timerValRef.current -= 1;
      setTimer(timerValRef.current);
      if (timerValRef.current <= 0) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
        if (!answeredRef.current) {
          processAnswer('TIMEOUT');
        }
      }
    }, 1000);
  }, [stopTimer]); // eslint-disable-line

  useEffect(() => () => stopTimer(), [stopTimer]);

  // ── Auth ───────────────────────────────────────────────────────────────────

  const login = useCallback((userData, token) => {
    api.setToken(token);
    localStorage.setItem('qq_token', token);
    localStorage.setItem('qq_user', JSON.stringify(userData));
    setUser(userData);
    navigate('/menu');
  }, [navigate]);

  const logout = useCallback(() => {
    api.setToken(null);
    localStorage.removeItem('qq_token');
    localStorage.removeItem('qq_user');
    setUser(null);
    navigate('/login');
  }, [navigate]);

  // ── Load question ──────────────────────────────────────────────────────────

  const loadQuestion = useCallback(async (pool, prevQNum) => {
    const newNum  = prevQNum + 1;
    // Difficulty and timer are driven by how many questions were answered CORRECTLY
    const diff    = getDifficulty(correctRef.current);
    const limit   = getTimeLimit(correctRef.current);

    qNumRef.current = newNum;
    setQuestionNumber(newNum);
    setTimeLimit(limit);
    setDifficultyReached(diff);
    diffRef.current = diff;
    setFeedback(null);
    answeredRef.current = false;

    let q;
    if (newNum <= 10 && pool.length >= newNum) {
      q = { ...pool[newNum - 1], _source: 'pool' };
    } else {
      try {
        const aiQ = await api.generateQuestion(diff, newNum);
        q = { ...aiQ, _source: 'ai' };
      } catch {
        q = { ...getFallback(diff, newNum), _source: 'fallback' };
      }
    }

    setCurrentQuestion(q);
    questionRef.current = q;
    startTimer(limit);
  }, [startTimer]);

  // ── End game ───────────────────────────────────────────────────────────────

  const endGame = useCallback(() => {
    stopTimer();
    const finalScore   = scoreRef.current;
    const finalStab    = stabilityRef.current;
    const qAnswered    = qNumRef.current;
    const correct      = correctRef.current;
    const wrong        = wrongRef.current;
    const diff         = diffRef.current;
    const sid          = sessionRef.current;

    if (sid) {
      api.endSession(sid, finalScore, finalStab, qAnswered, correct, wrong, diff).catch(() => {});
    }

    setUser((u) => {
      if (!u) return u;
      const updated = {
        ...u,
        highestScore: Math.max(u.highestScore || 0, finalScore),
        totalScore:   (u.totalScore || 0) + finalScore,
        gamesPlayed:  (u.gamesPlayed || 0) + 1,
      };
      localStorage.setItem('qq_user', JSON.stringify(updated));
      return updated;
    });

    navigate('/game-over');
  }, [stopTimer, navigate]);

  // ── Process answer (called by button click OR timer expiry) ────────────────

  const processAnswer = useCallback((selected) => {
    if (answeredRef.current) return;
    answeredRef.current = true;
    stopTimer();

    const q         = questionRef.current;
    const isTimeout = selected === 'TIMEOUT';
    const isCorrect = !isTimeout && selected === q?.correctAnswer;
    const curStreak = streakRef.current;
    const pts       = isCorrect
      ? Math.round((100 + timerValRef.current * 5) * (1 + Math.min(curStreak, 10) * 0.1))
      : 0;

    const newStreak  = isCorrect ? curStreak + 1 : 0;
    const newStab    = isCorrect
      ? Math.min(100, stabilityRef.current + 10)
      : Math.max(0, stabilityRef.current - (isTimeout ? 15 : 20));
    const newScore   = scoreRef.current + pts;

    streakRef.current    = newStreak;
    scoreRef.current     = newScore;
    stabilityRef.current = newStab;

    setStreak(newStreak);
    setScore(newScore);
    setStability(newStab);
    setFeedback({ correct: isCorrect, points: pts, explanation: q?.explanation });

    if (isCorrect) { correctRef.current += 1; setCorrectAnswers((c) => c + 1); }
    else           { wrongRef.current   += 1; setWrongAnswers((w) => w + 1); }

    // Submit to backend
    const sid = sessionRef.current;
    if (sid && q) {
      api.submitAnswer(
        sid, q.id, isTimeout ? 'TIMEOUT' : selected,
        q.correctAnswer, timerValRef.current,
        qNumRef.current, curStreak,
      ).catch(() => {});
    }

    if (newStab <= 0) {
      setTimeout(() => {
        if (retryRef.current > 0) {
          navigate('/heart-puzzle');
        } else {
          endGame();
        }
      }, 1400);
    } else {
      setTimeout(() => {
        loadQuestion(poolRef.current, qNumRef.current);
      }, 1600);
    }
  }, [stopTimer, navigate, endGame, loadQuestion]);

  // ── Start game ─────────────────────────────────────────────────────────────

  const startGame = useCallback(async () => {
    stopTimer();

    // Reset all game state
    scoreRef.current     = 0;
    stabilityRef.current = 100;
    streakRef.current    = 0;
    qNumRef.current      = 0;
    correctRef.current   = 0;
    wrongRef.current     = 0;
    retryRef.current     = 3;
    diffRef.current      = 'easy';
    answeredRef.current  = false;
    poolRef.current      = [];

    setScore(0);
    setStability(100);
    setStreak(0);
    setQuestionNumber(0);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setRetryChances(3);
    setDifficultyReached('easy');
    setFeedback(null);
    setCurrentQuestion(null);

    let sid  = null;
    let pool = [];
    try {
      const [sessData, qs] = await Promise.all([api.startSession(), api.getPoolQuestions()]);
      sid  = sessData.sessionId;
      pool = qs;
    } catch { /* offline mode – use fallback questions */ }

    setSessionId(sid);
    sessionRef.current = sid;
    poolRef.current    = pool;

    navigate('/play');
    loadQuestion(pool, 0);
  }, [stopTimer, navigate, loadQuestion]);

  // ── Heart puzzle handlers ──────────────────────────────────────────────────

  const heartSuccess = useCallback(() => {
    stabilityRef.current = 50;
    setStability(50);
    const newRetry = retryRef.current - 1;
    retryRef.current = newRetry;
    setRetryChances(newRetry);
    navigate('/play');
    loadQuestion(poolRef.current, qNumRef.current);
  }, [navigate, loadQuestion]);

  const heartFail = useCallback(() => {
    const newRetry = retryRef.current - 1;
    retryRef.current = newRetry;
    setRetryChances(newRetry);
    if (newRetry <= 0) {
      endGame();
    } else {
      navigate('/heart-puzzle');
    }
  }, [endGame, navigate]);

  // ── Context value ──────────────────────────────────────────────────────────

  const value = {
    // Auth
    user, login, logout,

    // Game state (read-only for pages)
    sessionId, currentQuestion, questionNumber,
    score, stability, timer, timeLimit, streak,
    feedback, retryChances, correctAnswers, wrongAnswers, difficultyReached,

    // Actions
    startGame, processAnswer, endGame, heartSuccess, heartFail,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within <GameProvider>');
  return ctx;
}
