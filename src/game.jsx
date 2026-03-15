import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from './services/api';

// ─── Utility helpers ───────────────────────────────────────────────────────────

function StabilityBar({ value }) {
  const color = value > 60 ? '#00ff88' : value > 30 ? '#ffcc00' : '#ff4466';
  return (
    <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden', height: 12 }}>
      <div
        style={{
          width: `${Math.max(0, Math.min(100, value))}%`,
          height: '100%',
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: 8,
          transition: 'width 0.4s ease, background 0.4s ease',
          boxShadow: `0 0 12px ${color}66`,
        }}
      />
    </div>
  );
}

// ─── Auth Screen ───────────────────────────────────────────────────────────────

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (mode === 'register' && password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      const result = mode === 'register'
        ? await api.register(email, password, username)
        : await api.login(email, password);
      api.setToken(result.token);
      onAuth(result.user);
    } catch (err) {
      setError(err.message || 'Authentication failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.page}>
      <div style={S.authCard}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 52 }}>⚛</div>
          <h1 style={S.gradTitle}>QuantumQuest</h1>
          <p style={S.sub}>THE PROBABILITY PARADOX</p>
        </div>

        <div style={S.tabRow}>
          {['login', 'register'].map((m) => (
            <button key={m} onClick={() => { setMode(m); setError(''); }} style={{ ...S.tab, ...(mode === m ? S.tabOn : {}) }}>
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mode === 'register' && (
            <input style={S.input} type="text" placeholder="Explorer Name" value={username}
              onChange={e => setUsername(e.target.value)} required />
          )}
          <input style={S.input} type="email" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)} required />
          <input style={S.input} type="password" placeholder="Password (min 8 chars)" value={password}
            onChange={e => setPassword(e.target.value)} required />
          {error && <div style={S.errBox}>{error}</div>}
          <button type="submit" disabled={loading} style={S.btnPrimary}>
            {loading ? 'Processing…' : mode === 'login' ? '⚛ Enter the Quantum Realm' : '🚀 Begin Your Journey'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 18, color: '#64748b', fontSize: 14 }}>
          {mode === 'login' ? "No account? " : "Already an explorer? "}
          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }} style={S.linkBtn}>
            {mode === 'login' ? 'Register' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}

// ─── Menu Screen ───────────────────────────────────────────────────────────────

function MenuScreen({ user, onStart, onLeaderboard, onProfile, onLogout }) {
  return (
    <div style={S.page}>
      <div style={{ ...S.container, maxWidth: 820, animation: 'fadeIn 0.5s ease' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
          <div>
            <h1 style={S.gradTitle}>⚛ QuantumQuest</h1>
            <p style={S.sub}>THE PROBABILITY PARADOX</p>
          </div>
          <div style={S.userChip}>
            <span style={{ color: '#60a5fa' }}>◈</span>
            <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{user.username}</span>
            <button onClick={onLogout} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 13 }}>Logout</button>
          </div>
        </header>

        <div style={{ display: 'flex', gap: 12, marginBottom: 22, flexWrap: 'wrap' }}>
          {[
            { icon: '🏆', label: 'Best Score', val: (user.highestScore || 0).toLocaleString() },
            { icon: '⚡', label: 'Total Score', val: (user.totalScore || 0).toLocaleString() },
            { icon: '🎮', label: 'Games Played', val: user.gamesPlayed || 0 },
          ].map(s => (
            <div key={s.label} style={S.statCard}>
              <span style={{ fontSize: 26 }}>{s.icon}</span>
              <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 20 }}>{s.val}</span>
              <span style={{ color: '#64748b', fontSize: 12 }}>{s.label}</span>
            </div>
          ))}
        </div>

        <div style={S.heroCard}>
          <h2 style={{ color: '#60a5fa', margin: '0 0 10px', fontSize: 20 }}>What is QuantumQuest?</h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7, margin: 0 }}>
            Travel through quantum dimensions by solving probability and logical challenges.
            Maintain your <span style={{ color: '#00ff88', fontWeight: 600 }}>Dimensional Stability</span> —
            correct answers power it up, wrong answers drain it. When stability hits zero, invoke the{' '}
            <span style={{ color: '#f472b6', fontWeight: 600 }}>Heart of the Quantum</span> for a second chance!
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
            {['30s per question', 'Difficulty scales each 10 Qs', 'AI-generated questions', '3 Heart Puzzle retries'].map(f => (
              <span key={f} style={S.featureTag}>▸ {f}</span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
          <button onClick={onStart} style={S.btnStart}>⚛ Begin Quantum Exploration</button>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={onLeaderboard} style={{ ...S.btnSec, flex: 1 }}>🏆 Leaderboard</button>
            <button onClick={onProfile} style={{ ...S.btnSec, flex: 1 }}>◈ Profile</button>
          </div>
        </div>

        <div style={S.infoCard}>
          <h3 style={{ color: '#60a5fa', margin: '0 0 14px', fontSize: 17 }}>How to Play</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
            {[
              { n: '01', t: 'Answer Questions', d: 'Solve probability & logic challenges within the time limit' },
              { n: '02', t: 'Maintain Stability', d: 'Correct answers restore +10%, wrong answers drain -20%' },
              { n: '03', t: 'Scale Difficulty', d: 'Every 10 questions, timer shortens and difficulty increases' },
              { n: '04', t: 'Heart Puzzle', d: 'When stability hits 0, solve image puzzles to regain life' },
            ].map(s => (
              <div key={s.n} style={{ display: 'flex', gap: 12 }}>
                <div style={S.stepN}>{s.n}</div>
                <div>
                  <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 14 }}>{s.t}</div>
                  <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 3 }}>{s.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Leaderboard Screen ────────────────────────────────────────────────────────

function LeaderboardScreen({ user, onBack }) {
  const [board, setBoard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getLeaderboard(20), api.getUserRank(user.id)])
      .then(([lb, rank]) => { setBoard(lb); setUserRank(rank); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user.id]);

  const medal = r => r === 1 ? '🥇' : r === 2 ? '🥈' : r === 3 ? '🥉' : `#${r}`;

  return (
    <div style={S.page}>
      <div style={{ ...S.container, maxWidth: 700, animation: 'fadeIn 0.4s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          <button onClick={onBack} style={S.backBtn}>← Back</button>
          <h2 style={{ color: '#e2e8f0', fontSize: 24, fontWeight: 700, margin: 0 }}>🏆 Quantum Leaderboard</h2>
        </div>

        {userRank && (
          <div style={{ ...S.infoCard, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 18 }}>
            <span style={{ color: '#60a5fa' }}>Your Rank:</span>
            <span style={{ color: '#ffd700', fontSize: 22, fontWeight: 700 }}>{medal(userRank.rank)}</span>
            <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{userRank.username}</span>
            <span style={{ color: '#00ff88', marginLeft: 'auto' }}>Best: {(userRank.highestScore || 0).toLocaleString()}</span>
          </div>
        )}

        {loading ? <div style={{ color: '#64748b', textAlign: 'center', padding: 40 }}>Loading…</div> :
          board.length === 0 ? <div style={{ color: '#64748b', textAlign: 'center', padding: 40 }}>No players yet — be the first!</div> :
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {board.map(p => (
              <div key={p.userId} style={{
                ...S.lbRow,
                ...(p.userId === user.id ? { background: 'rgba(37,99,235,0.12)', borderColor: 'rgba(37,99,235,0.4)' } : {})
              }}>
                <span style={{ color: '#ffd700', fontWeight: 700, minWidth: 36, fontSize: 17 }}>{medal(p.rank)}</span>
                <span style={{ color: '#e2e8f0', fontWeight: 600, flex: 1 }}>{p.username}</span>
                <span style={{ color: '#ffd700' }}>Best: {(p.highestScore || 0).toLocaleString()}</span>
                <span style={{ color: '#64748b', fontSize: 13 }}>Games: {p.gamesPlayed}</span>
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  );
}

// ─── Profile Screen ────────────────────────────────────────────────────────────

function ProfileScreen({ user, onBack }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    Promise.all([api.getProfile(), api.getUserRank(user.id)])
      .then(([p, rank]) => setProfile({ ...p, rank: rank?.rank }))
      .catch(() => setProfile({ ...user }));
  }, [user.id]);

  return (
    <div style={S.page}>
      <div style={{ ...S.container, maxWidth: 600, animation: 'fadeIn 0.4s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          <button onClick={onBack} style={S.backBtn}>← Back</button>
          <h2 style={{ color: '#e2e8f0', fontSize: 24, fontWeight: 700, margin: 0 }}>◈ Explorer Profile</h2>
        </div>

        {profile && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ ...S.infoCard, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <div style={S.avatar}>{(profile.username || '?')[0].toUpperCase()}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: '#e2e8f0', fontSize: 22, margin: '0 0 4px' }}>{profile.username}</h3>
                <p style={{ color: '#94a3b8', margin: '0 0 4px', fontSize: 14 }}>{profile.email}</p>
                <p style={{ color: '#60a5fa', margin: 0, fontSize: 13 }}>
                  Member since {new Date(profile.createdAt || Date.now()).toLocaleDateString()}
                </p>
              </div>
              {profile.rank && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28 }}>🏆</div>
                  <div style={{ color: '#ffd700', fontWeight: 700 }}>Rank #{profile.rank}</div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[
                { label: 'Best Score', val: (profile.highestScore || 0).toLocaleString(), color: '#ffd700' },
                { label: 'Total Score', val: (profile.totalScore || 0).toLocaleString(), color: '#00ff88' },
                { label: 'Games Played', val: profile.gamesPlayed || 0, color: '#60a5fa' },
              ].map(s => (
                <div key={s.label} style={{ ...S.statCard, flex: 1, minWidth: 120 }}>
                  <span style={{ color: s.color, fontSize: 24, fontWeight: 700 }}>{s.val}</span>
                  <span style={{ color: '#64748b', fontSize: 12 }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Heart Puzzle Screen ───────────────────────────────────────────────────────

function HeartPuzzleScreen({ retryLeft, onSuccess, onFail }) {
  const [puzzle, setPuzzle] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [msg, setMsg] = useState('');
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.getHeartPuzzle()
      .then(p => setPuzzle(p))
      .catch(() => setMsg('Failed to load puzzle. Network error.'))
      .finally(() => setLoading(false));
  }, []);

  const verify = async () => {
    if (!answer.trim() || !puzzle) return;
    setVerifying(true);
    setMsg('');
    try {
      const res = await api.verifyHeartAnswer(puzzle.solution, answer);
      if (res.correct) { onSuccess(); return; }
      setMsg('✗ Wrong answer! Try again.');
      setAnswer('');
    } catch { setMsg('Verification failed. Please try again.'); }
    finally { setVerifying(false); }
  };

  return (
    <div style={S.page}>
      <div style={{ ...S.container, maxWidth: 560, textAlign: 'center', animation: 'fadeIn 0.4s ease' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 52, marginBottom: 8 }}>💗</div>
          <h2 style={{ color: '#f472b6', fontSize: 26, margin: '0 0 8px' }}>Quantum Heart Puzzle</h2>
          <p style={{ color: '#94a3b8', margin: '0 0 16px' }}>Solve this puzzle to restore your dimensional stability</p>
          <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', gap: 8,
            background: 'rgba(244,114,182,0.08)', border: '1px solid rgba(244,114,182,0.2)',
            borderRadius: 30, padding: '8px 18px' }}>
            {[0,1,2].map(i => <span key={i} style={{ fontSize: 18 }}>{i < retryLeft ? '❤️' : '🖤'}</span>)}
            <span style={{ color: '#f472b6', fontSize: 13, marginLeft: 6 }}>{retryLeft} attempt{retryLeft !== 1 ? 's' : ''} left</span>
          </div>
        </div>

        {loading && <div style={{ color: '#64748b', padding: 40 }}>Fetching quantum puzzle…</div>}

        {puzzle && !loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 16, padding: 20, display: 'flex', justifyContent: 'center' }}>
              {!imgErr ? (
                <img src={puzzle.imageUrl} alt="Heart Puzzle" onError={() => setImgErr(true)}
                  style={{ maxWidth: '100%', maxHeight: 280, borderRadius: 10, border: '2px solid rgba(244,114,182,0.3)' }} />
              ) : (
                <div style={{ padding: 24, color: '#94a3b8' }}>
                  <p>Image unavailable — enter the solution number shown in the original puzzle.</p>
                </div>
              )}
            </div>

            <div style={{ width: '100%', maxWidth: 320 }}>
              <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 8 }}>Enter the numerical answer:</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="number" value={answer} onChange={e => setAnswer(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && verify()}
                  placeholder="0" style={{ ...S.input, flex: 1 }} />
                <button onClick={verify} disabled={verifying || !answer.trim()} style={S.btnHeart}>
                  {verifying ? '…' : 'Verify'}
                </button>
              </div>
              {msg && <div style={{ ...S.errBox, marginTop: 10, color: msg.includes('✗') ? '#ff6680' : '#94a3b8' }}>{msg}</div>}
            </div>
          </div>
        )}

        {msg && !puzzle && <div style={S.errBox}>{msg}</div>}

        <button onClick={onFail} style={{ marginTop: 24, background: 'none', border: 'none',
          color: '#64748b', cursor: 'pointer', fontSize: 13, textDecoration: 'underline' }}>
          Skip (lose attempt)
        </button>
      </div>
    </div>
  );
}

// ─── Game Over Screen ──────────────────────────────────────────────────────────

function GameOverScreen({ score, questionsAnswered, correctAnswers, difficultyReached, onMenu, onPlay }) {
  const acc = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0;
  return (
    <div style={S.page}>
      <div style={{ ...S.container, maxWidth: 500, textAlign: 'center', animation: 'fadeIn 0.5s ease', paddingTop: 80 }}>
        <div style={{ fontSize: 72, marginBottom: 12 }}>
          {score > 1000 ? '⭐' : score > 400 ? '🌟' : '💫'}
        </div>
        <h2 style={{ ...S.gradTitle, fontSize: 32, marginBottom: 6 }}>
          {score > 1000 ? 'Quantum Master!' : score > 400 ? 'Dimension Explored!' : 'Reality Collapsed!'}
        </h2>
        <p style={{ color: '#94a3b8', marginBottom: 32 }}>Your quantum journey has ended</p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
          {[
            { label: 'Final Score', val: score.toLocaleString(), color: '#ffd700' },
            { label: 'Questions', val: questionsAnswered, color: '#00ff88' },
            { label: 'Accuracy', val: `${acc}%`, color: '#60a5fa' },
            { label: 'Max Difficulty', val: difficultyReached, color: '#f472b6' },
          ].map(s => (
            <div key={s.label} style={{ ...S.statCard, minWidth: 100 }}>
              <span style={{ color: s.color, fontSize: 24, fontWeight: 700 }}>{s.val}</span>
              <span style={{ color: '#64748b', fontSize: 12 }}>{s.label}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={onPlay} style={S.btnStart}>⚛ Play Again</button>
          <button onClick={onMenu} style={S.btnSec}>↩ Main Menu</button>
        </div>
      </div>
    </div>
  );
}

// ─── Playing Screen ────────────────────────────────────────────────────────────

function PlayingScreen({ question, questionNumber, score, stability, timer, timeLimit, streak, feedback, onAnswer, onQuit }) {
  const diff = questionNumber <= 10 ? 'easy' : questionNumber <= 20 ? 'medium' : 'hard';
  const diffColors = { easy: '#00ff88', medium: '#ffcc00', hard: '#ff4466' };
  const dc = diffColors[diff];

  return (
    <div style={S.page}>
      <div style={{ ...S.container, maxWidth: 780, animation: 'fadeIn 0.4s ease' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
          <div>
            <h2 style={{ ...S.gradTitle, fontSize: 22, margin: 0 }}>⚛ QuantumQuest</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
              <span style={{ color: '#ffd700', fontWeight: 700 }}>⚡ {score.toLocaleString()}</span>
              {streak > 1 && (
                <span style={{ background: 'rgba(255,160,0,0.15)', border: '1px solid rgba(255,160,0,0.3)',
                  borderRadius: 20, padding: '2px 10px', color: '#ffcc00', fontSize: 13, fontWeight: 600 }}>
                  🔥 {streak}x Streak
                </span>
              )}
            </div>
          </div>
          <button onClick={onQuit} style={{ background: 'rgba(255,68,102,0.1)', border: '1px solid rgba(255,68,102,0.25)',
            borderRadius: 8, color: '#ff6680', padding: '8px 14px', cursor: 'pointer', fontSize: 14 }}>
            ✕ Quit
          </button>
        </div>

        {/* Status bar */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12, padding: '12px 18px', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '2 1 200px' }}>
            <span style={{ color: '#64748b', fontSize: 12 }}>STABILITY</span>
            <div style={{ flex: 1 }}><StabilityBar value={stability} /></div>
            <span style={{ color: stability > 60 ? '#00ff88' : stability > 30 ? '#ffcc00' : '#ff4466', fontWeight: 700, fontSize: 15 }}>
              {stability}%
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#64748b', fontSize: 12 }}>Q</span>
            <span style={{ color: '#60a5fa', fontWeight: 700 }}>{questionNumber}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#64748b', fontSize: 12 }}>LEVEL</span>
            <span style={{ color: dc, fontWeight: 700, fontSize: 12, textTransform: 'uppercase' }}>{diff}</span>
          </div>
        </div>

        {/* Timer */}
        <div style={{ position: 'relative', height: 10, background: 'rgba(255,255,255,0.08)',
          borderRadius: 5, marginBottom: 24, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 5,
            width: `${(timer / timeLimit) * 100}%`,
            background: timer > 10 ? '#2563eb' : '#dc2626',
            transition: 'width 1s linear, background 0.3s',
          }} />
          <span style={{ position: 'absolute', right: 6, top: -20,
            color: timer <= 5 ? '#ff4466' : '#94a3b8', fontWeight: 700, fontSize: 17 }}>
            {timer}s
          </span>
        </div>

        {/* Question card */}
        {question && (
          <div style={S.qCard}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
              <span style={S.badge}>{question.category || 'probability'}</span>
              <span style={{ ...S.badge, background: `${dc}18`, color: dc, borderColor: `${dc}44` }}>{diff}</span>
            </div>
            <p style={{ color: '#e2e8f0', fontSize: 19, lineHeight: 1.7, marginBottom: 24, fontWeight: 500 }}>
              🧠 {question.text}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {['A','B','C','D'].map(letter => {
                const text = question[`option${letter}`];
                if (!text) return null;
                return (
                  <button key={letter} onClick={() => onAnswer(letter)} disabled={!!feedback} style={S.optBtn}>
                    <span style={S.optLetter}>{letter}</span>
                    <span style={{ color: '#e2e8f0', textAlign: 'left' }}>{text}</span>
                  </button>
                );
              })}
            </div>

            {feedback && (
              <div style={{
                marginTop: 18, padding: '14px 18px', borderRadius: 10, fontWeight: 600, fontSize: 15,
                background: feedback.correct ? 'rgba(0,255,136,0.08)' : 'rgba(255,68,102,0.08)',
                border: `1px solid ${feedback.correct ? 'rgba(0,255,136,0.3)' : 'rgba(255,68,102,0.3)'}`,
                color: feedback.correct ? '#00ff88' : '#ff6680',
              }}>
                {feedback.correct ? `✓ Correct! +${feedback.points} pts` : '✗ Wrong!'}
                {!feedback.correct && question.explanation && (
                  <span style={{ display: 'block', color: '#94a3b8', fontSize: 13, marginTop: 4, fontWeight: 400 }}>
                    {question.explanation}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Game Controller ──────────────────────────────────────────────────────

export default function QuantumQuest() {
  const [screen, setScreen] = useState('auth');
  const [user, setUser] = useState(null);

  const [sessionId, setSessionId] = useState(null);
  const [poolQuestions, setPoolQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [score, setScore] = useState(0);
  const [stability, setStability] = useState(100);
  const [timer, setTimer] = useState(30);
  const [timeLimit, setTimeLimit] = useState(30);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [retryChances, setRetryChances] = useState(3);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [difficultyReached, setDifficultyReached] = useState('easy');

  const timerRef = useRef(null);
  const answeredRef = useRef(false);
  const poolRef = useRef([]);
  const qNumRef = useRef(0);

  // Auth
  const handleAuth = useCallback((userData) => {
    setUser(userData);
    setScreen('menu');
  }, []);

  const handleLogout = useCallback(() => {
    api.setToken(null);
    setUser(null);
    setScreen('auth');
  }, []);

  // Timer helpers
  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const startTimer = useCallback((limit) => {
    stopTimer();
    setTimer(limit);
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { clearInterval(timerRef.current); timerRef.current = null; return 0; }
        return t - 1;
      });
    }, 1000);
  }, [stopTimer]);

  // Time-up handler
  useEffect(() => {
    if (timer === 0 && screen === 'playing' && !answeredRef.current && currentQuestion) {
      handleAnswer('TIMEOUT');
    }
  }, [timer]);

  useEffect(() => () => stopTimer(), []);

  // Game start
  const startGame = useCallback(async () => {
    stopTimer();
    answeredRef.current = false;
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
    qNumRef.current = 0;

    let pool = [];
    let sid = null;
    try {
      const [sess, qs] = await Promise.all([api.startSession(), api.getPoolQuestions()]);
      sid = sess.sessionId;
      pool = qs;
    } catch {/* run offline */}

    setSessionId(sid);
    setPoolQuestions(pool);
    poolRef.current = pool;

    setScreen('playing');
    loadQuestion(pool, 0);
  }, [stopTimer]);

  const getDiff = (n) => n < 10 ? 'easy' : n < 20 ? 'medium' : 'hard';
  const getLimit = (n) => Math.max(10, 30 - Math.floor(n / 10) * 5);

  const getFallback = (diff, n) => {
    const qs = [
      { id:`f${n}`, text:`[Q${n}] A fair coin is flipped. P(heads)?`, optionA:'1/4', optionB:'1/2', optionC:'3/4', optionD:'1', correctAnswer:'B', explanation:'A fair coin: P = 1/2' },
      { id:`f${n}`, text:`[Q${n}] Two dice rolled. P(sum=7)?`, optionA:'1/12', optionB:'7/36', optionC:'1/6', optionD:'1/4', correctAnswer:'C', explanation:'6 ways to get 7 out of 36 = 1/6' },
      { id:`f${n}`, text:`[Q${n}] Sequence: 1,4,9,16,?`, optionA:'20', optionB:'25', optionC:'36', optionD:'18', correctAnswer:'B', explanation:'n²: 5²=25' },
      { id:`f${n}`, text:`[Q${n}] P(A)=0.5, P(B)=0.4, independent. P(A∩B)?`, optionA:'0.2', optionB:'0.9', optionC:'0.45', optionD:'0.3', correctAnswer:'A', explanation:'P(A)×P(B)=0.5×0.4=0.2' },
    ];
    return { ...qs[n % qs.length], category: 'probability', difficulty: diff };
  };

  const loadQuestion = useCallback(async (pool, prevNum) => {
    const newNum = prevNum + 1;
    const diff = getDiff(newNum - 1);
    const limit = getLimit(newNum - 1);

    qNumRef.current = newNum;
    setQuestionNumber(newNum);
    setTimeLimit(limit);
    setDifficultyReached(diff);
    setFeedback(null);
    answeredRef.current = false;

    let q;
    if (newNum <= 10 && pool.length >= newNum) {
      q = pool[newNum - 1];
    } else {
      try { q = await api.generateQuestion(diff, newNum); }
      catch { q = getFallback(diff, newNum); }
    }

    setCurrentQuestion(q);
    startTimer(limit);
  }, [startTimer]);

  const handleAnswer = useCallback(async (selected) => {
    if (answeredRef.current) return;
    answeredRef.current = true;
    stopTimer();

    const isTimeout = selected === 'TIMEOUT';
    const q = currentQuestion;
    const isCorrect = !isTimeout && selected === q?.correctAnswer;
    const curStreak = streak;
    const curScore = score;
    const curStab = stability;

    const pts = isCorrect ? Math.round((100 + timer * 5) * (1 + Math.min(curStreak, 10) * 0.1)) : 0;
    const newStreak = isCorrect ? curStreak + 1 : 0;
    const newStab = isCorrect ? Math.min(100, curStab + 10) : Math.max(0, curStab - (isTimeout ? 15 : 20));
    const newScore = curScore + pts;

    setStreak(newStreak);
    setScore(newScore);
    setStability(newStab);
    if (isCorrect) setCorrectAnswers(c => c + 1);
    else setWrongAnswers(w => w + 1);
    setFeedback({ correct: isCorrect, points: pts });

    if (sessionId && q) {
      api.submitAnswer(sessionId, q.id, isTimeout ? 'TIMEOUT' : selected, q.correctAnswer, timer, qNumRef.current, curStreak).catch(() => {});
    }

    if (newStab <= 0) {
      setTimeout(() => {
        setRetryChances(r => {
          if (r > 0) { setScreen('heart'); return r; }
          endGame(newScore, 0);
          return 0;
        });
      }, 1200);
    } else {
      setTimeout(() => {
        loadQuestion(poolRef.current, qNumRef.current);
      }, 1600);
    }
  }, [currentQuestion, streak, score, stability, timer, sessionId, stopTimer, loadQuestion]);

  const endGame = useCallback((finalScore, finalStab) => {
    stopTimer();
    setScreen('gameover');
    if (sessionId) {
      api.endSession(sessionId, finalScore, finalStab, qNumRef.current, correctAnswers, wrongAnswers, difficultyReached).catch(() => {});
    }
    setUser(u => ({
      ...u,
      highestScore: Math.max(u?.highestScore || 0, finalScore),
      totalScore: (u?.totalScore || 0) + finalScore,
      gamesPlayed: (u?.gamesPlayed || 0) + 1,
    }));
  }, [sessionId, correctAnswers, wrongAnswers, difficultyReached, stopTimer]);

  // Heart puzzle
  const handleHeartSuccess = useCallback(() => {
    setStability(50);
    setRetryChances(r => r - 1);
    setScreen('playing');
    loadQuestion(poolRef.current, qNumRef.current);
  }, [loadQuestion]);

  const handleHeartFail = useCallback(() => {
    setRetryChances(r => {
      const next = r - 1;
      if (next <= 0) endGame(score, 0);
      return next;
    });
  }, [score, endGame]);

  // Render
  if (screen === 'auth') return <AuthScreen onAuth={handleAuth} />;

  if (screen === 'menu') return (
    <MenuScreen user={user} onStart={startGame}
      onLeaderboard={() => setScreen('leaderboard')}
      onProfile={() => setScreen('profile')}
      onLogout={handleLogout} />
  );

  if (screen === 'leaderboard') return <LeaderboardScreen user={user} onBack={() => setScreen('menu')} />;
  if (screen === 'profile') return <ProfileScreen user={user} onBack={() => setScreen('menu')} />;

  if (screen === 'heart') return (
    <HeartPuzzleScreen retryLeft={retryChances} onSuccess={handleHeartSuccess} onFail={handleHeartFail} />
  );

  if (screen === 'gameover') return (
    <GameOverScreen
      score={score} questionsAnswered={questionNumber}
      correctAnswers={correctAnswers} difficultyReached={difficultyReached}
      onMenu={() => setScreen('menu')} onPlay={startGame}
    />
  );

  if (screen === 'playing') return (
    <PlayingScreen
      question={currentQuestion} questionNumber={questionNumber}
      score={score} stability={stability}
      timer={timer} timeLimit={timeLimit}
      streak={streak} feedback={feedback}
      onAnswer={handleAnswer}
      onQuit={() => endGame(score, stability)}
    />
  );

  return null;
}

// ─── Style constants ───────────────────────────────────────────────────────────

const S = {
  page: {
    minHeight: '100vh',
    background: '#1e293b',
    position: 'relative', overflowX: 'hidden',
    display: 'flex', justifyContent: 'center',
    fontFamily: "'Inter','Segoe UI',sans-serif",
  },
  container: {
    width: '100%', padding: '36px 20px', position: 'relative', zIndex: 1,
    boxSizing: 'border-box',
  },
  authCard: {
    background: '#0f172a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 20, padding: '40px 32px',
    width: '100%', maxWidth: 420, height: 'fit-content',
    margin: 'auto',
    boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
    position: 'relative', zIndex: 1,
    boxSizing: 'border-box',
  },
  gradTitle: {
    color: '#60a5fa',
    fontSize: 28, fontWeight: 800, margin: '0 0 4px',
  },
  sub: { color: '#64748b', fontSize: 11, letterSpacing: 3, margin: 0 },
  tabRow: {
    display: 'flex', marginBottom: 20,
    background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: 4,
  },
  tab: {
    flex: 1, padding: '10px 0', borderRadius: 8, border: 'none',
    cursor: 'pointer', background: 'transparent', color: '#64748b', fontWeight: 600, transition: 'all 0.2s',
  },
  tabOn: { background: 'rgba(37,99,235,0.2)', color: '#60a5fa' },
  input: {
    width: '100%', padding: '12px 15px', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 10, color: '#e2e8f0', fontSize: 15, fontFamily: 'inherit',
  },
  errBox: {
    background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)',
    borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: 14,
  },
  btnPrimary: {
    width: '100%', padding: '14px', marginTop: 4,
    background: '#2563eb',
    border: 'none', borderRadius: 10, color: '#fff',
    fontSize: 15, fontWeight: 700, cursor: 'pointer',
  },
  linkBtn: {
    background: 'none', border: 'none', color: '#60a5fa',
    cursor: 'pointer', fontWeight: 600, fontSize: 14, padding: 0,
  },
  userChip: {
    display: 'flex', alignItems: 'center', gap: 10,
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12, padding: '8px 14px',
  },
  statCard: {
    flex: 1, minWidth: 100,
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 14, padding: '16px', display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 6,
  },
  heroCard: {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 16, padding: '22px', marginBottom: 22,
  },
  featureTag: {
    color: '#94a3b8', fontSize: 13, padding: '5px 11px',
    background: 'rgba(255,255,255,0.05)', borderRadius: 8,
  },
  btnStart: {
    padding: '15px 28px', background: '#2563eb',
    border: 'none', borderRadius: 12, color: '#fff', fontSize: 16,
    fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  },
  btnSec: {
    padding: '13px 20px', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
    color: '#e2e8f0', fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
  infoCard: {
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16, padding: '20px',
  },
  stepN: {
    width: 34, height: 34, borderRadius: 8, flexShrink: 0,
    background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#60a5fa', fontWeight: 700, fontSize: 12,
  },
  backBtn: {
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8, color: '#94a3b8', padding: '8px 14px', cursor: 'pointer', fontSize: 14,
  },
  lbRow: {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12, padding: '13px 18px',
    display: 'flex', alignItems: 'center', gap: 14,
  },
  avatar: {
    width: 68, height: 68, borderRadius: '50%',
    background: '#2563eb',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontSize: 28, fontWeight: 700, flexShrink: 0,
  },
  btnHeart: {
    padding: '12px 18px', background: '#db2777',
    border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, cursor: 'pointer',
  },
  qCard: {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 20, padding: '26px', boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
  },
  badge: {
    background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)',
    borderRadius: 20, padding: '4px 12px', color: '#60a5fa',
    fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1,
  },
  optBtn: {
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12, padding: '15px 16px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 12,
    transition: 'background 0.15s, border-color 0.15s',
    textAlign: 'left',
  },
  optLetter: {
    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
    background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(37,99,235,0.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#60a5fa', fontWeight: 700, fontSize: 14,
  },
};
