import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Particles from '../components/Particles';
import StabilityBar from '../components/StabilityBar';
import { useGame } from '../context/GameContext';
import { S, COLORS } from '../styles/common';

const DIFF_COLORS = { easy: COLORS.green, medium: COLORS.yellow, hard: COLORS.red };

export default function PlayingPage() {
  const navigate = useNavigate();
  const {
    currentQuestion, questionNumber, score, stability,
    timer, timeLimit, streak, feedback, endGame, processAnswer,
  } = useGame();

  // If someone navigates directly to /play with no question loaded, redirect
  useEffect(() => {
    if (!currentQuestion && questionNumber === 0) {
      navigate('/menu', { replace: true });
    }
  }, [currentQuestion, questionNumber, navigate]);

  if (!currentQuestion) return null;

  const diff  = questionNumber <= 10 ? 'easy' : questionNumber <= 20 ? 'medium' : 'hard';
  const dc    = DIFF_COLORS[diff];
  const timerPct = (timer / timeLimit) * 100;

  return (
    <div style={S.page}>
      <Particles />

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
                  ? 'linear-gradient(90deg,#7c3aed,#00ccff)'
                  : 'linear-gradient(90deg,#ff4466,#ff8800)',
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
                      e.currentTarget.style.background = 'rgba(124,58,237,0.12)';
                      e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.borderColor = COLORS.border;
                  }}
                >
                  <span style={S.optLetter}>{letter}</span>
                  <span style={{ color: COLORS.text }}>{text}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {feedback && (
            <div
              style={{
                ...styles.feedbackBox,
                background: feedback.correct ? 'rgba(0,255,136,0.08)' : 'rgba(255,68,102,0.08)',
                border:     `1px solid ${feedback.correct ? 'rgba(0,255,136,0.3)' : 'rgba(255,68,102,0.3)'}`,
                color:      feedback.correct ? COLORS.green : COLORS.red,
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
    background: 'rgba(255,68,102,0.1)',
    border: '1px solid rgba(255,68,102,0.25)',
    borderRadius: 8,
    color: '#ff6680',
    padding: '8px 14px',
    cursor: 'pointer',
    fontSize: 14,
    fontFamily: 'inherit',
  },
  statusRow: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    flexWrap: 'wrap',
    background: '#ffffff',
    border: `1px solid ${COLORS.border}`,
    borderRadius: 12,
    padding: '12px 18px',
    marginBottom: 14,
    boxShadow: COLORS.shadow,
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
    background: 'rgba(0,0,0,0.07)',
    borderRadius: 5,
    marginBottom: 28,
    overflow: 'hidden',
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
    color: COLORS.text,
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
    color: COLORS.textMuted,
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
