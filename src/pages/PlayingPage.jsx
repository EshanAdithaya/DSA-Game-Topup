import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StabilityBar from '../components/StabilityBar';
import GuideCharacter from '../components/GuideCharacter';
import { useGame } from '../context/GameContext';
import { S, COLORS } from '../styles/common';

const DIFF_COLORS = { easy: COLORS.green, medium: COLORS.yellow, hard: COLORS.red };

export default function PlayingPage() {
  const navigate = useNavigate();
  const {
    currentQuestion, questionNumber, score, stability,
    timer, timeLimit, streak, feedback, endGame, processAnswer,
    difficultyReached, correctAnswers,
  } = useGame();

  // If someone navigates directly to /play with no question loaded, redirect
  useEffect(() => {
    if (!currentQuestion && questionNumber === 0) {
      navigate('/menu', { replace: true });
    }
  }, [currentQuestion, questionNumber, navigate]);

  if (!currentQuestion) return null;

  const diff  = difficultyReached;   // driven by correctAnswers, not total questions
  const dc    = DIFF_COLORS[diff];
  const timerPct = (timer / timeLimit) * 100;

  return (
    <div style={S.page}>
      <div style={{ ...S.container, maxWidth: 780, animation: 'fadeIn 0.3s ease' }}>

        {/* ── Top bar ── */}
        <div style={styles.topBar}>
          <div>
            <h2 style={{ ...S.gradTitle, fontSize: 20, margin: 0 }}>⚛ QuantumQuest</h2>
            <div style={styles.scoreRow}>
              <span style={{ color: COLORS.yellow, fontWeight: 700 }}>
                ⚡ {score.toLocaleString()}
              </span>
              {streak > 1 && (
                <span style={styles.streakChip}>🔥 {streak}x Streak</span>
              )}
            </div>
          </div>
          <button onClick={endGame} style={styles.quitBtn}>✕ Quit</button>
        </div>

        {/* ── Status row ── */}
        <div style={styles.statusRow}>
          <div style={styles.stabilityGroup}>
            <span style={styles.statusLabel}>STABILITY</span>
            <StabilityBar value={stability} />
            <span style={{
              color: stability > 60 ? COLORS.green : stability > 30 ? COLORS.yellow : COLORS.red,
              fontWeight: 700,
              fontSize: 15,
              minWidth: 44,
              textAlign: 'right',
            }}>
              {stability}%
            </span>
          </div>
          <div style={styles.statusMeta}>
            <div style={styles.metaChip}>
              <span style={styles.statusLabel}>Q</span>
              <span style={{ color: COLORS.purpleLight, fontWeight: 700 }}>{questionNumber}</span>
            </div>
            <div style={styles.metaChip}>
              <span style={styles.statusLabel}>LEVEL</span>
              <span style={{ color: dc, fontWeight: 700, fontSize: 12, textTransform: 'uppercase' }}>
                {diff}
              </span>
            </div>
            {/* Correct-answers → next level progress */}
            {diff !== 'hard' && (
              <div style={styles.metaChip}>
                <span style={styles.statusLabel}>NEXT LVL</span>
                <span style={{ color: COLORS.cyan, fontWeight: 700, fontSize: 12 }}>
                  {correctAnswers % 10}/10 ✓
                </span>
              </div>
            )}
            {diff === 'hard' && (
              <div style={styles.metaChip}>
                <span style={{ color: COLORS.yellow, fontWeight: 700, fontSize: 11 }}>
                  MAX LEVEL 👑
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Timer bar ── */}
        <div style={styles.timerWrap}>
          <div
            style={{
              ...styles.timerFill,
              width: `${timerPct}%`,
              background:
                timer > 10
                  ? 'linear-gradient(90deg, #6366f1, #818cf8)'
                  : 'linear-gradient(90deg, #dc2626, #ef4444)',
              boxShadow:
                timer > 10
                  ? '0 0 12px rgba(129,140,248,0.6)'
                  : '0 0 12px rgba(239,68,68,0.7)',
            }}
          />
          <span
            style={{
              ...styles.timerLabel,
              color: timer <= 5 ? COLORS.red : COLORS.textMuted,
              animation: timer <= 5 ? 'pulse 0.5s infinite' : 'none',
            }}
          >
            {timer}s
          </span>
        </div>

        {/* ── Question card ── */}
        <div style={S.qCard}>
          {/* Meta badges */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
            <span style={S.badge}>{currentQuestion.category || 'probability'}</span>
            <span style={{ ...S.badge, background: `${dc}18`, color: dc, borderColor: `${dc}44` }}>
              {diff}
            </span>
            {currentQuestion._source === 'ai' && (
              <span style={styles.aiBadge}>🤖 AI Generated</span>
            )}
            {currentQuestion._source === 'pool' && (
              <span style={styles.poolBadge}>📚 Pool Question</span>
            )}
          </div>

          {/* Question text */}
          <p style={styles.questionText}>🧠 {currentQuestion.text}</p>

          {/* Options */}
          <div style={styles.optionsGrid}>
            {['A', 'B', 'C', 'D'].map((letter) => {
              const text = currentQuestion[`option${letter}`];
              if (!text) return null;
              return (
                <button
                  key={letter}
                  onClick={() => processAnswer(letter)}
                  disabled={!!feedback}
                  style={{
                    ...S.optBtn,
                    opacity: feedback ? 0.7 : 1,
                    cursor: feedback ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (!feedback) {
                      e.currentTarget.style.background = 'rgba(129,140,248,0.14)';
                      e.currentTarget.style.borderColor = 'rgba(129,140,248,0.50)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(129,140,248,0.20)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span style={S.optLetter}>{letter}</span>
                  <span style={{ color: '#e2e8f0', fontSize: 14, lineHeight: 1.4 }}>{text}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {feedback && (
            <div
              style={{
                ...styles.feedbackBox,
                background: feedback.correct ? 'rgba(16,185,129,0.14)' : 'rgba(239,68,68,0.14)',
                border:     `1px solid ${feedback.correct ? 'rgba(16,185,129,0.40)' : 'rgba(239,68,68,0.40)'}`,
                color:      feedback.correct ? COLORS.greenNeon : COLORS.redNeon,
                boxShadow:  feedback.correct ? '0 0 20px rgba(16,185,129,0.12)' : '0 0 20px rgba(239,68,68,0.12)',
              }}
            >
              {feedback.correct
                ? `✓ Correct! +${feedback.points} pts`
                : '✗ Wrong!'}
              {!feedback.correct && feedback.explanation && (
                <span style={styles.explanation}>{feedback.explanation}</span>
              )}
            </div>
          )}
        </div>

        {/* ── Qubitron guide ── */}
        <GuideCharacter
          feedback={feedback}
          streak={streak}
          stability={stability}
          timer={timer}
          questionNumber={questionNumber}
        />
      </div>
    </div>
  );
}

const styles = {
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  scoreRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  streakChip: {
    background: 'rgba(255,160,0,0.15)',
    border: '1px solid rgba(255,160,0,0.3)',
    borderRadius: 20,
    padding: '2px 10px',
    color: COLORS.yellow,
    fontSize: 13,
    fontWeight: 600,
  },
  quitBtn: {
    background: 'rgba(239,68,68,0.12)',
    border: '1px solid rgba(239,68,68,0.32)',
    borderRadius: 10,
    color: '#f87171',
    padding: '8px 14px',
    cursor: 'pointer',
    fontSize: 14,
    fontFamily: 'inherit',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    transition: 'background 0.15s',
  },
  statusRow: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    flexWrap: 'wrap',
    background: 'rgba(255,255,255,0.06)',
    border: `1px solid rgba(255,255,255,0.10)`,
    borderRadius: 14,
    padding: '12px 18px',
    marginBottom: 14,
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
  },
  stabilityGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flex: '2 1 200px',
  },
  statusLabel: {
    color: COLORS.textFaint,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 1,
    whiteSpace: 'nowrap',
  },
  statusMeta: {
    display: 'flex',
    gap: 16,
    marginLeft: 'auto',
  },
  metaChip: {
    display: 'flex',
    gap: 6,
    alignItems: 'center',
  },
  timerWrap: {
    position: 'relative',
    height: 10,
    background: 'rgba(255,255,255,0.08)',
    borderRadius: 5,
    marginBottom: 28,
    overflow: 'hidden',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)',
  },
  timerFill: {
    height: '100%',
    borderRadius: 5,
    transition: 'width 1s linear, background 0.3s',
  },
  timerLabel: {
    position: 'absolute',
    right: 0,
    top: 14,
    fontWeight: 700,
    fontSize: 18,
  },
  questionText: {
    color: '#f1f5f9',
    fontSize: 19,
    lineHeight: 1.7,
    marginBottom: 24,
    fontWeight: 500,
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
  },
  feedbackBox: {
    marginTop: 18,
    padding: '14px 18px',
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 15,
  },
  explanation: {
    display: 'block',
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 4,
    fontWeight: 400,
  },
  aiBadge: {
    background: COLORS.aiBg,
    border: `1px solid ${COLORS.aiBorder}`,
    borderRadius: 20,
    padding: '3px 10px',
    color: COLORS.ai,
    fontSize: 12,
    fontWeight: 600,
  },
  poolBadge: {
    background: 'rgba(16,185,129,0.1)',
    border: '1px solid rgba(16,185,129,0.3)',
    borderRadius: 20,
    padding: '3px 10px',
    color: COLORS.green,
    fontSize: 12,
    fontWeight: 600,
  },
};
