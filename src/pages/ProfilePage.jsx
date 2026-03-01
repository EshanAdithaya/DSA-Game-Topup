import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Particles from '../components/Particles';
import { useGame } from '../context/GameContext';
import { api } from '../services/api';
import { S, COLORS } from '../styles/common';

export default function ProfilePage() {
  const { user } = useGame();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [rank,    setRank]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getProfile(), api.getUserRank(user.id)])
      .then(([p, r]) => { setProfile(p); setRank(r); })
      .catch(() => setProfile({ ...user }))
      .finally(() => setLoading(false));
  }, [user.id]);

  const accuracy = profile
    ? profile.gamesPlayed > 0
      ? Math.round(((profile.totalScore || 0) / (profile.gamesPlayed * 100)) * 10)
      : 0
    : 0;

  return (
    <div style={S.page}>
      <Particles />

      <div style={{ ...S.container, maxWidth: 640, animation: 'fadeIn 0.4s ease' }}>
        {/* ── Header ── */}
        <div style={S.pageHeader}>
          <button onClick={() => navigate('/menu')} style={S.backBtn}>← Back</button>
          <h2 style={S.pageTitle}>◈ Explorer Profile</h2>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: COLORS.textFaint, padding: 60 }}>
            Loading profile…
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* ── Profile hero card ── */}
            <div style={styles.heroCard}>
              <div style={S.avatar}>
                {(profile?.username || '?')[0].toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={styles.username}>{profile?.username}</h3>
                <p style={styles.email}>{profile?.email}</p>
                <p style={styles.since}>
                  Member since{' '}
                  {new Date(profile?.createdAt || Date.now()).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              {rank && (
                <div style={styles.rankBox}>
                  <span style={{ fontSize: 32 }}>
                    {rank.rank === 1 ? '🥇' : rank.rank === 2 ? '🥈' : rank.rank === 3 ? '🥉' : '🏆'}
                  </span>
                  <span style={styles.rankNum}>Rank #{rank.rank}</span>
                </div>
              )}
            </div>

            {/* ── Stats grid ── */}
            <div style={styles.statsGrid}>
              {[
                { icon: '🏆', label: 'Best Score',   val: (profile?.highestScore || 0).toLocaleString(), color: COLORS.yellow },
                { icon: '⚡', label: 'Total Score',  val: (profile?.totalScore || 0).toLocaleString(),  color: COLORS.green },
                { icon: '🎮', label: 'Games Played', val: profile?.gamesPlayed || 0,                    color: COLORS.purpleLight },
              ].map((s) => (
                <div key={s.label} style={styles.statCard}>
                  <span style={{ fontSize: 28 }}>{s.icon}</span>
                  <span style={{ color: s.color, fontSize: 24, fontWeight: 700 }}>{s.val}</span>
                  <span style={{ color: COLORS.textFaint, fontSize: 12 }}>{s.label}</span>
                </div>
              ))}
            </div>

            {/* ── Achievement badges ── */}
            <div style={S.card}>
              <h3 style={styles.sectionTitle}>Achievements</h3>
              <div style={styles.badgesGrid}>
                {[
                  { icon: '🎮', label: 'First Game',    unlocked: (profile?.gamesPlayed || 0) >= 1 },
                  { icon: '🔟', label: '10 Games',      unlocked: (profile?.gamesPlayed || 0) >= 10 },
                  { icon: '⭐', label: '1000 Points',   unlocked: (profile?.highestScore || 0) >= 1000 },
                  { icon: '🔥', label: 'On Fire',       unlocked: (profile?.highestScore || 0) >= 2000 },
                  { icon: '💎', label: 'Diamond',       unlocked: (profile?.highestScore || 0) >= 5000 },
                  { icon: '👑', label: 'Quantum King',  unlocked: (profile?.gamesPlayed || 0) >= 50 },
                ].map((a) => (
                  <div
                    key={a.label}
                    style={{
                      ...styles.achievementBadge,
                      opacity: a.unlocked ? 1 : 0.35,
                      filter: a.unlocked ? 'none' : 'grayscale(1)',
                    }}
                    title={a.unlocked ? a.label : `${a.label} (locked)`}
                  >
                    <span style={{ fontSize: 26 }}>{a.icon}</span>
                    <span style={{ color: a.unlocked ? COLORS.text : COLORS.textFaint, fontSize: 11 }}>
                      {a.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Quick actions ── */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/menu')}
                style={{ ...S.btnSecondary, flex: 1 }}
              >
                ← Main Menu
              </button>
              <button
                onClick={() => navigate('/leaderboard')}
                style={{ ...S.btnSecondary, flex: 1 }}
              >
                🏆 Leaderboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  heroCard: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 18,
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    flexWrap: 'wrap',
  },
  username: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: 700,
    margin: '0 0 4px',
  },
  email: {
    color: COLORS.textMuted,
    fontSize: 14,
    margin: '0 0 4px',
  },
  since: {
    color: COLORS.purpleLight,
    fontSize: 13,
    margin: 0,
  },
  rankBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
  },
  rankNum: {
    color: COLORS.yellow,
    fontWeight: 700,
    fontSize: 16,
  },
  statsGrid: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    minWidth: 130,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    color: COLORS.purpleLight,
    fontSize: 15,
    fontWeight: 700,
    margin: '0 0 16px',
  },
  badgesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
    gap: 12,
  },
  achievementBadge: {
    background: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    padding: '14px 8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    cursor: 'default',
    transition: 'opacity 0.2s',
  },
};
