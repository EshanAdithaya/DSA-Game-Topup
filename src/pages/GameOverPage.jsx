import { useNavigate } from 'react-router-dom';
import Particles from '../components/Particles';
import { useGame } from '../context/GameContext';
import { S, COLORS } from '../styles/common';

export default function GameOverPage() {
  const navigate = useNavigate();
  const { score, questionNumber, correctAnswers, wrongAnswers, difficultyReached, startGame } = useGame();

  const accuracy = questionNumber > 0 ? Math.round((correctAnswers / questionNumber) * 100) : 0;
  const rank     = getPerformanceRank(score, accuracy);

  return (
    <div style={S.page}>
      <Particles />

      {/* Ambient glow */}
      <div style={styles.glow} />

      <div style={styles.wrapper}>
        {/* ── Icon & title ── */}
        <div style={styles.icon}>{rank.icon}</div>
        <h2 style={{ ...S.gradTitle, fontSize: 34, textAlign: 'center' }}>{rank.title}</h2>
        <p style={styles.sub}>Your quantum journey has ended</p>

        {/* ── Score highlight ── */}
        <div style={styles.scoreHighlight}>
          <span style={styles.scoreLabel}>FINAL SCORE</span>
          <span style={styles.scoreValue}>{score.toLocaleString()}</span>
          <span style={styles.scoreNote}>{rank.message}</span>
        </div>

        {/* ── Stats grid ── */}
        <div style={styles.statsGrid}>
          {[
            { icon: '✅', label: 'Correct',     val: correctAnswers,   color: COLORS.green },
            { icon: '❌', label: 'Wrong',       val: wrongAnswers,     color: COLORS.red },
            { icon: '🎯', label: 'Accuracy',    val: `${accuracy}%`,   color: COLORS.cyan },
            { icon: '📊', label: 'Questions',   val: questionNumber,   color: COLORS.yellow },
            { icon: '⚡', label: 'Max Diff.',   val: difficultyReached,color: COLORS.purpleLight },
          ].map((s) => (
            <div key={s.label} style={styles.statCard}>
              <span style={{ fontSize: 24 }}>{s.icon}</span>
              <span style={{ color: s.color, fontSize: 22, fontWeight: 700, textTransform: 'capitalize' }}>
                {s.val}
              </span>
              <span style={{ color: COLORS.textFaint, fontSize: 12 }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Actions ── */}
        <div style={styles.actions}>
          <button onClick={startGame} style={styles.playAgainBtn}>
            ⚛ Play Again
          </button>
          <button onClick={() => navigate('/leaderboard')} style={S.btnSecondary}>
            🏆 Leaderboard
          </button>
          <button onClick={() => navigate('/menu')} style={S.btnSecondary}>
            ↩ Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Helper ───────────────────────────────────────────────────────────────────

function getPerformanceRank(score, accuracy) {
  if (score >= 2000)
    return { icon: '👑', title: 'Quantum Master!',     message: 'You have conquered the quantum realm!' };
  if (score >= 1000)
    return { icon: '⭐', title: 'Dimension Expert!',  message: 'Outstanding performance, explorer!' };
  if (score >= 500)
    return { icon: '🌟', title: 'Dimension Explored!', message: 'Solid run — keep pushing further!' };
  if (score >= 200)
    return { icon: '💫', title: 'Good Effort!',        message: 'Every journey teaches you something.' };
  return      { icon: '🌀', title: 'Reality Collapsed!', message: 'Try again — the quantum awaits!' };
}

const styles = {
  glow: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    width: 800,
    height: 800,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(124,58,237,0.07), transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  wrapper: {
    width: '100%',
    maxWidth: 560,
    padding: '60px 20px 48px',
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
    textAlign: 'center',
    animation: 'fadeIn 0.5s ease',
  },
  icon: {
    fontSize: 72,
    filter: 'drop-shadow(0 0 20px rgba(124,58,237,0.4))',
    animation: 'fadeIn 0.6s ease',
  },
  sub: {
    color: COLORS.textMuted,
    fontSize: 16,
    margin: 0,
  },
  scoreHighlight: {
    background: 'rgba(124,58,237,0.08)',
    border: '1px solid rgba(124,58,237,0.25)',
    borderRadius: 18,
    padding: '22px 40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    width: '100%',
    boxShadow: '0 0 40px rgba(124,58,237,0.08)',
  },
  scoreLabel: {
    color: COLORS.textFaint,
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  scoreValue: {
    background: `linear-gradient(90deg,${COLORS.purpleLight},${COLORS.cyan})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontSize: 52,
    fontWeight: 800,
    lineHeight: 1,
  },
  scoreNote: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginTop: 4,
  },
  statsGrid: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  statCard: {
    flex: '1 1 90px',
    minWidth: 90,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 14,
    padding: '16px 10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    width: '100%',
    maxWidth: 340,
  },
  playAgainBtn: {
    padding: '15px',
    background: 'linear-gradient(135deg,#7c3aed,#0099ff)',
    border: 'none',
    borderRadius: 12,
    color: '#fff',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 0 28px rgba(124,58,237,0.35)',
    fontFamily: 'inherit',
  },
};
