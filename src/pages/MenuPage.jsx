import { useNavigate } from 'react-router-dom';
import Particles from '../components/Particles';
import { useGame } from '../context/GameContext';
import { S, COLORS } from '../styles/common';

export default function MenuPage() {
  const { user, logout, startGame } = useGame();
  const navigate = useNavigate();

  return (
    <div style={S.page}>
      <Particles />

      <div style={{ ...S.container, maxWidth: 820, animation: 'fadeIn 0.5s ease' }}>
        {/* ── Header ── */}
        <header style={styles.header}>
          <div>
            <h1 style={{ ...S.gradTitle, fontSize: 28 }}>⚛ QuantumQuest</h1>
            <p style={S.subtitle}>THE PROBABILITY PARADOX</p>
          </div>
          <div style={S.userChip}>
            <span style={{ color: COLORS.purpleLight }}>◈</span>
            <span style={{ color: COLORS.text, fontWeight: 600 }}>{user?.username}</span>
            <button onClick={logout} style={styles.logoutBtn}>Logout</button>
          </div>
        </header>

        {/* ── Stats ── */}
        <div style={styles.statsRow}>
          {[
            { icon: '🏆', label: 'Best Score',   val: (user?.highestScore || 0).toLocaleString() },
            { icon: '⚡', label: 'Total Score',  val: (user?.totalScore || 0).toLocaleString() },
            { icon: '🎮', label: 'Games Played', val: user?.gamesPlayed || 0 },
          ].map((s) => (
            <div key={s.label} style={S.statCard}>
              <span style={{ fontSize: 28 }}>{s.icon}</span>
              <span style={{ color: COLORS.text, fontWeight: 700, fontSize: 22 }}>{s.val}</span>
              <span style={{ color: COLORS.textFaint, fontSize: 12 }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Hero ── */}
        <div style={{ ...S.purpleCard, marginBottom: 22 }}>
          <h2 style={{ color: COLORS.purpleLight, margin: '0 0 10px', fontSize: 20 }}>
            What is QuantumQuest?
          </h2>
          <p style={{ color: COLORS.textMuted, lineHeight: 1.7, margin: 0 }}>
            Travel through quantum dimensions by solving probability and logical challenges.
            Maintain your{' '}
            <span style={{ color: COLORS.green, fontWeight: 600 }}>Dimensional Stability</span>{' '}
            — correct answers restore it, wrong ones drain it. When stability hits zero, invoke
            the{' '}
            <span style={{ color: COLORS.pink, fontWeight: 600 }}>Heart of the Quantum</span>{' '}
            for a second chance!
          </p>
          <div style={styles.features}>
            {[
              '30s per question',
              'Difficulty scales every 10 Qs',
              'AI-generated questions',
              '3 Heart Puzzle retries',
            ].map((f) => (
              <span key={f} style={S.featureTag}>▸ {f}</span>
            ))}
          </div>
        </div>

        {/* ── Action buttons ── */}
        <div style={styles.actions}>
          <button onClick={startGame} style={styles.startBtn}>
            ⚛ Begin Quantum Exploration
          </button>
          <div style={styles.secondaryRow}>
            <button onClick={() => navigate('/leaderboard')} style={{ ...S.btnSecondary, flex: 1 }}>
              🏆 Leaderboard
            </button>
            <button onClick={() => navigate('/profile')} style={{ ...S.btnSecondary, flex: 1 }}>
              ◈ My Profile
            </button>
          </div>
        </div>

        {/* ── How to Play ── */}
        <div style={S.card}>
          <h3 style={{ color: COLORS.purpleLight, margin: '0 0 16px', fontSize: 17 }}>
            How to Play
          </h3>
          <div style={styles.steps}>
            {[
              { n: '01', t: 'Answer Questions',  d: 'Solve probability & logic challenges within the time limit' },
              { n: '02', t: 'Maintain Stability', d: 'Correct answers restore +10%, wrong answers drain -20%' },
              { n: '03', t: 'Scale Difficulty',  d: 'Every 10 questions, timer shortens & difficulty increases' },
              { n: '04', t: 'Heart Puzzle',       d: 'When stability hits 0, solve an image puzzle to regain life' },
            ].map((s) => (
              <div key={s.n} style={styles.step}>
                <div style={S.stepN}>{s.n}</div>
                <div>
                  <div style={{ color: COLORS.text, fontWeight: 600, fontSize: 14 }}>{s.t}</div>
                  <div style={{ color: COLORS.textMuted, fontSize: 12, marginTop: 3 }}>{s.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
    flexWrap: 'wrap',
    gap: 14,
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    color: COLORS.textFaint,
    cursor: 'pointer',
    fontSize: 13,
    fontFamily: 'inherit',
  },
  statsRow: {
    display: 'flex',
    gap: 12,
    marginBottom: 22,
    flexWrap: 'wrap',
  },
  features: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginBottom: 24,
  },
  startBtn: {
    padding: '16px 28px',
    background: 'linear-gradient(135deg,#7c3aed,#0099ff)',
    border: 'none',
    borderRadius: 12,
    color: '#fff',
    fontSize: 17,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 0 30px rgba(124,58,237,0.35)',
    fontFamily: 'inherit',
  },
  secondaryRow: {
    display: 'flex',
    gap: 12,
  },
  steps: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
    gap: 14,
  },
  step: {
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
  },
};
