import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { api } from '../services/api';
import { S, COLORS } from '../styles/common';

export default function LoginPage() {
  const { user, login } = useGame();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  // Already logged in → go to menu
  if (user) return <Navigate to="/menu" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await api.login(email, password);
      login(result.user, result.token);
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.page}>
      <div style={styles.wrapper}>
        {/* Logo */}
        <div style={styles.logoBlock}>
          <span style={styles.logoIcon}>⚛</span>
          <h1 style={{ ...S.gradTitle, fontSize: 32 }}>QuantumQuest</h1>
          <p style={S.subtitle}>THE PROBABILITY PARADOX</p>
        </div>

        {/* Card */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Sign In</h2>
          <p style={styles.cardSub}>Welcome back, Explorer</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={S.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={S.input}
              />
            </div>

            {error && <div style={S.errBox}>{error}</div>}

            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? (
                <span style={styles.spinner}>↻ Signing in…</span>
              ) : (
                '⚛ Enter the Quantum Realm'
              )}
            </button>
          </form>

          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>or</span>
            <span style={styles.dividerLine} />
          </div>

          <p style={styles.switchText}>
            New explorer?{' '}
            <Link to="/register" style={styles.switchLink}>
              Create an account →
            </Link>
          </p>
        </div>

        {/* Footer hint */}
        <p style={styles.footer}>
          ⚡ Powered by{' '}
          <span style={{ color: COLORS.cyan }}>Heart Game API</span> &amp;{' '}
          <span style={{ color: COLORS.purpleLight }}>Gemini AI</span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    width: '100%',
    maxWidth: 440,
    padding: '48px 20px 32px',
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 24,
  },
  logoBlock: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
  },
  logoIcon: {
    fontSize: 56,
  },
  card: {
    width: '100%',
    background: '#ffffff',
    border: '1.5px solid rgba(0,0,0,0.1)',
    borderRadius: 20,
    padding: '36px 32px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 700,
    margin: '0 0 4px',
  },
  cardSub: {
    color: COLORS.textFaint,
    fontSize: 14,
    margin: '0 0 28px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: 0.5,
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    marginTop: 4,
    background: '#2563eb',
    border: 'none',
    borderRadius: 10,
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    fontFamily: 'inherit',
  },
  spinner: {
    display: 'inline-block',
    animation: 'pulse 1s infinite',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    margin: '22px 0 16px',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: 'rgba(0,0,0,0.08)',
  },
  dividerText: {
    color: COLORS.textFaint,
    fontSize: 13,
  },
  switchText: {
    textAlign: 'center',
    color: COLORS.textFaint,
    fontSize: 14,
    margin: 0,
  },
  switchLink: {
    color: COLORS.purpleLight,
    textDecoration: 'none',
    fontWeight: 600,
  },
  footer: {
    color: COLORS.textFaint,
    fontSize: 13,
    textAlign: 'center',
    margin: 0,
  },
};
