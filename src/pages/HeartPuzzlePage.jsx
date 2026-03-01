import { useState, useEffect } from 'react';
import Particles from '../components/Particles';
import { useGame } from '../context/GameContext';
import { api } from '../services/api';
import { S, COLORS } from '../styles/common';

export default function HeartPuzzlePage() {
  const { retryChances, heartSuccess, heartFail } = useGame();

  const [puzzle,    setPuzzle]    = useState(null);
  const [answer,    setAnswer]    = useState('');
  const [loading,   setLoading]   = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [msg,       setMsg]       = useState('');
  const [imgErr,    setImgErr]    = useState(false);

  useEffect(() => {
    setLoading(true);
    setMsg('');
    setImgErr(false);
    api
      .getHeartPuzzle()
      .then(setPuzzle)
      .catch(() => setMsg('Could not load puzzle — check your connection.'))
      .finally(() => setLoading(false));
  }, []);

  const handleVerify = async () => {
    if (!answer.trim() || !puzzle) return;
    setVerifying(true);
    setMsg('');
    try {
      const res = await api.verifyHeartAnswer(puzzle.solution, answer);
      if (res.correct) {
        heartSuccess();
        return;
      }
      setMsg('✗ Incorrect. Try again!');
      setAnswer('');
    } catch {
      setMsg('Verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div style={S.page}>
      <Particles />

      {/* Pink ambient glow */}
      <div style={styles.glow} />

      <div style={styles.wrapper}>
        {/* ── Header ── */}
        <div style={styles.header}>
          <div style={{ fontSize: 56, filter: 'drop-shadow(0 0 20px #f472b688)' }}>💗</div>
          <h2 style={styles.title}>Quantum Heart Puzzle</h2>
          <p style={styles.subtitle}>
            Solve this image puzzle to restore your dimensional stability
          </p>

          {/* Lives */}
          <div style={styles.livesBadge}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ fontSize: 22 }}>
                {i < retryChances ? '❤️' : '🖤'}
              </span>
            ))}
            <span style={{ color: COLORS.pink, fontSize: 14, marginLeft: 4 }}>
              {retryChances} attempt{retryChances !== 1 ? 's' : ''} remaining
            </span>
          </div>
        </div>

        {/* ── Puzzle area ── */}
        <div style={styles.puzzleCard}>
          {loading && (
            <div style={styles.placeholder}>
              <div style={styles.spinnerRing} />
              <p style={{ color: COLORS.textFaint, margin: 0 }}>Fetching quantum puzzle…</p>
            </div>
          )}

          {!loading && !puzzle && msg && (
            <div style={{ textAlign: 'center', padding: 24 }}>
              <div style={S.errBox}>{msg}</div>
            </div>
          )}

          {puzzle && !loading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
              {/* Image */}
              <div style={styles.imageFrame}>
                {!imgErr ? (
                  <img
                    src={puzzle.imageUrl}
                    alt="Heart puzzle"
                    onError={() => setImgErr(true)}
                    style={styles.puzzleImg}
                  />
                ) : (
                  <div style={styles.imgFallback}>
                    <p style={{ color: COLORS.textMuted, margin: '0 0 8px' }}>
                      Image unavailable
                    </p>
                    <p style={{ color: COLORS.textFaint, fontSize: 13, margin: 0 }}>
                      Enter the numerical answer displayed in the puzzle
                    </p>
                  </div>
                )}
              </div>

              {/* Answer input */}
              <div style={styles.answerSection}>
                <label style={styles.answerLabel}>
                  Enter the numerical answer from the puzzle image:
                </label>
                <div style={styles.answerRow}>
                  <input
                    type="number"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                    placeholder="0"
                    style={{ ...S.input, flex: 1 }}
                  />
                  <button
                    onClick={handleVerify}
                    disabled={verifying || !answer.trim()}
                    style={styles.verifyBtn}
                  >
                    {verifying ? '↻' : '✓ Verify'}
                  </button>
                </div>
                {msg && (
                  <div style={{ ...S.errBox, marginTop: 10 }}>{msg}</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Skip ── */}
        <button onClick={heartFail} style={styles.skipBtn}>
          Skip puzzle (lose 1 attempt)
        </button>

        {/* Instruction note */}
        <p style={styles.note}>
          💡 The image shows a number — enter it exactly to restore stability
        </p>
      </div>
    </div>
  );
}

const styles = {
  glow: {
    position: 'fixed',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    width: 700,
    height: 700,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(244,114,182,0.07), transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  wrapper: {
    width: '100%',
    maxWidth: 580,
    padding: '48px 20px 36px',
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
  },
  header: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: COLORS.pink,
    fontSize: 26,
    fontWeight: 700,
    margin: 0,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 15,
    margin: 0,
    maxWidth: 380,
  },
  livesBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: 'rgba(244,114,182,0.08)',
    border: '1px solid rgba(244,114,182,0.2)',
    borderRadius: 30,
    padding: '8px 20px',
    marginTop: 6,
  },
  puzzleCard: {
    width: '100%',
    background: '#ffffff',
    border: '1px solid rgba(244,114,182,0.2)',
    borderRadius: 20,
    padding: '28px 24px',
    boxShadow: '0 4px 24px rgba(244,114,182,0.08)',
    minHeight: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 14,
  },
  spinnerRing: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: '3px solid rgba(244,114,182,0.15)',
    borderTopColor: COLORS.pink,
    animation: 'spin 0.8s linear infinite',
  },
  imageFrame: {
    background: 'rgba(0,0,0,0.04)',
    borderRadius: 12,
    padding: 12,
    border: '1px solid rgba(244,114,182,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '100%',
  },
  puzzleImg: {
    maxWidth: '100%',
    maxHeight: 280,
    borderRadius: 8,
    display: 'block',
  },
  imgFallback: {
    textAlign: 'center',
    padding: '20px 16px',
  },
  answerSection: {
    width: '100%',
    maxWidth: 360,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  answerLabel: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
  answerRow: {
    display: 'flex',
    gap: 10,
  },
  verifyBtn: {
    padding: '13px 18px',
    background: 'linear-gradient(135deg,#db2777,#f472b6)',
    border: 'none',
    borderRadius: 10,
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: 14,
    whiteSpace: 'nowrap',
    fontFamily: 'inherit',
  },
  skipBtn: {
    background: 'none',
    border: 'none',
    color: COLORS.textFaint,
    cursor: 'pointer',
    fontSize: 13,
    textDecoration: 'underline',
    fontFamily: 'inherit',
    padding: 0,
  },
  note: {
    color: COLORS.textFaint,
    fontSize: 13,
    textAlign: 'center',
    margin: 0,
    maxWidth: 380,
  },
};
