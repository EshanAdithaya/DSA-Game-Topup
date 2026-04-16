import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { S, COLORS } from '../styles/common';

export default function GameOverPage() {
  const navigate = useNavigate();
  const { score, questionNumber, correctAnswers, wrongAnswers, difficultyReached, startGame } = useGame();

  const accuracy = questionNumber > 0 ? Math.round((correctAnswers / questionNumber) * 100) : 0;
  const rank     = getPerformanceRank(score, accuracy);

  return (
    <div style={S.page}>
      {/* Ambient glow orbs */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', top: '-15%', left: '-10%', animation: 'orbFloat 20s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.09) 0%, transparent 70%)', bottom: '-10%', right: '-10%', animation: 'orbFloat 26s ease-in-out infinite reverse' }} />
      </div>

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
    animation: 'fadeIn 0.6s ease',
  },
  sub: {
    color: COLORS.textMuted,
    fontSize: 16,
    margin: 0,
  },
  scoreHighlight: {
    background: 'rgba(129,140,248,0.10)',
    border: '1px solid rgba(129,140,248,0.30)',
    borderRadius: 22,
    padding: '28px 40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    width: '100%',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: '0 8px 40px rgba(0,0,0,0.40), 0 0 60px rgba(129,140,248,0.10)',
    animation: 'scoreReveal 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards',
  },
  scoreLabel: {
    color: COLORS.textFaint,
    fontSize: 12,
    letterSpacing: 2.5,
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  scoreValue: {
    background: 'linear-gradient(135deg, #a5b4fc 0%, #818cf8 45%, #22d3ee 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontSize: 56,
    fontWeight: 900,
    lineHeight: 1,
    fontFamily: "'Space Grotesk','Inter',system-ui,sans-serif",
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
    background: 'rgba(255,255,255,0.06)',
    border: `1px solid rgba(255,255,255,0.10)`,
    borderRadius: 16,
    padding: '18px 10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
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
    background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 60%, #22d3ee 100%)',
    border: 'none',
    borderRadius: 14,
    color: '#fff',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 28px rgba(99,102,241,0.60)',
    fontFamily: "'Space Grotesk','Inter',system-ui,sans-serif",
    letterSpacing: 0.3,
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
};
