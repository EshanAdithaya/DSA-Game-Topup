import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Particles from '../components/Particles';
import { useGame } from '../context/GameContext';
import { api } from '../services/api';
import { S, COLORS } from '../styles/common';

const medal = (r) => (r === 1 ? '🥇' : r === 2 ? '🥈' : r === 3 ? '🥉' : `#${r}`);

export default function LeaderboardPage() {
  const { user } = useGame();
  const navigate = useNavigate();

  const [board,    setBoard]    = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [recent,   setRecent]   = useState([]);
  const [tab,      setTab]      = useState('top'); // 'top' | 'recent'
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getLeaderboard(20),
      api.getUserRank(user.id),
      api.getRecentGames(8),
    ])
      .then(([lb, rank, rec]) => {
        setBoard(lb);
        setUserRank(rank);
        setRecent(rec);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user.id]);

  return (
    <div style={S.page}>
      <Particles />

      <div style={{ ...S.container, maxWidth: 700, animation: 'fadeIn 0.4s ease' }}>
        {/* ── Header ── */}
        <div style={S.pageHeader}>
          <button onClick={() => navigate('/menu')} style={S.backBtn}>← Back</button>
          <h2 style={S.pageTitle}>🏆 Quantum Leaderboard</h2>
        </div>

        {/* ── User's rank card ── */}
        {userRank && (
          <div style={styles.myRankCard}>
            <div style={styles.myRankLeft}>
              <span style={{ color: COLORS.textFaint, fontSize: 13 }}>Your Rank</span>
              <span style={{ color: COLORS.yellow, fontSize: 26, fontWeight: 800 }}>
                {medal(userRank.rank)}
              </span>
            </div>
            <div style={styles.myRankMid}>
              <span style={{ color: COLORS.text, fontWeight: 700, fontSize: 17 }}>
                {userRank.username}
              </span>
              <span style={{ color: COLORS.textFaint, fontSize: 13 }}>
                {userRank.gamesPlayed} games played
              </span>
            </div>
            <div style={styles.myRankRight}>
              <span style={{ color: COLORS.yellow, fontSize: 20, fontWeight: 700 }}>
                {(userRank.highestScore || 0).toLocaleString()}
              </span>
              <span style={{ color: COLORS.textFaint, fontSize: 12 }}>Best Score</span>
            </div>
          </div>
        )}

        {/* ── Tabs ── */}
        <div style={styles.tabs}>
          {[
            { key: 'top',    label: '🏆 Top Players' },
            { key: 'recent', label: '🕐 Recent Games' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{ ...styles.tab, ...(tab === t.key ? styles.tabActive : {}) }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div style={styles.loading}>Loading leaderboard…</div>
        ) : tab === 'top' ? (
          <TopPlayers board={board} userId={user.id} />
        ) : (
          <RecentGames recent={recent} />
        )}
      </div>
    </div>
  );
}

// ── Top Players list ──────────────────────────────────────────────────────────
function TopPlayers({ board, userId }) {
  if (!board.length) {
    return <div style={styles.empty}>No players yet — be the first!</div>;
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {board.map((p) => (
        <div
          key={p.userId}
          style={{
            ...S.lbRow,
            ...(p.userId === userId
              ? { background: 'rgba(124,58,237,0.1)', borderColor: 'rgba(124,58,237,0.35)' }
              : {}),
          }}
        >
          <span style={styles.rankLabel}>{medal(p.rank)}</span>
          <span style={{ color: COLORS.text, fontWeight: 600, flex: 1 }}>
            {p.username}
            {p.userId === userId && (
              <span style={styles.youBadge}> you</span>
            )}
          </span>
          <div style={styles.rowRight}>
            <span style={{ color: COLORS.yellow, fontWeight: 700 }}>
              {(p.highestScore || 0).toLocaleString()}
            </span>
            <span style={{ color: COLORS.textFaint, fontSize: 13 }}>
              {p.gamesPlayed} games
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Recent Games list ─────────────────────────────────────────────────────────
function RecentGames({ recent }) {
  if (!recent.length) {
    return <div style={styles.empty}>No recent games yet.</div>;
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {recent.map((g, i) => (
        <div key={i} style={S.lbRow}>
          <span style={{ color: COLORS.textFaint, minWidth: 24 }}>#{i + 1}</span>
          <span style={{ color: COLORS.text, fontWeight: 600, flex: 1 }}>{g.username}</span>
          <div style={styles.rowRight}>
            <span style={{ color: COLORS.yellow, fontWeight: 700 }}>
              {(g.score || 0).toLocaleString()}
            </span>
            <span style={{ color: COLORS.textFaint, fontSize: 13 }}>
              {g.questionsAnswered}Q · {g.difficultyReached}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  myRankCard: {
    background: 'rgba(124,58,237,0.08)',
    border: '1px solid rgba(124,58,237,0.3)',
    borderRadius: 14,
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  myRankLeft: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    minWidth: 60,
  },
  myRankMid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    flex: 1,
  },
  myRankRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 2,
  },
  tabs: {
    display: 'flex',
    gap: 0,
    marginBottom: 16,
    background: 'rgba(0,0,0,0.05)',
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    padding: '10px 0',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    background: 'transparent',
    color: COLORS.textFaint,
    fontWeight: 600,
    fontSize: 14,
    transition: 'all 0.2s',
    fontFamily: 'inherit',
  },
  tabActive: {
    background: COLORS.purpleFaint,
    color: COLORS.purple,
  },
  loading: {
    textAlign: 'center',
    color: COLORS.textFaint,
    padding: 48,
  },
  empty: {
    textAlign: 'center',
    color: COLORS.textFaint,
    padding: 48,
  },
  rankLabel: {
    color: COLORS.yellow,
    fontWeight: 700,
    fontSize: 18,
    minWidth: 36,
  },
  youBadge: {
    background: 'rgba(124,58,237,0.2)',
    color: COLORS.purpleLight,
    fontSize: 11,
    borderRadius: 4,
    padding: '1px 6px',
    marginLeft: 4,
    fontWeight: 600,
  },
  rowRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 2,
  },
};
