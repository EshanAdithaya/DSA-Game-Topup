import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Particles from '../components/Particles';
import { useGame } from '../context/GameContext';
import { api } from '../services/api';
import { S, COLORS } from '../styles/common';

export default function RegisterPage() {
  const { user, login } = useGame();
  const [username, setUsername] = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  if (user) return <Navigate to="/menu" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const result = await api.register(email, password, username);
      login(result.user, result.token);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.page}>
      <Particles />

      <div style={styles.wrapper}>
        {/* Logo */}
        <div style={styles.logoBlock}>
          <span style={styles.logoIcon}>⚛</span>
          <h1 style={{ ...S.gradTitle, fontSize: 32 }}>QuantumQuest</h1>
          <p style={S.subtitle}>THE PROBABILITY PARADOX</p>
        </div>

        {/* Card */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Create Account</h2>
          <p style={styles.cardSub}>Join the quantum exploration</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Explorer Name</label>
              <input
                type="text"
                placeholder="Choose your explorer alias"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                maxLength={30}
                style={S.input}
              />
            </div>

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
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={S.input}
              />
              {password.length > 0 && (
                <PasswordStrength password={password} />
              )}
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Confirm Password</label>
              <input
                type="password"
                placeholder="Re-enter your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                style={{
                  ...S.input,
                  borderColor:
                    confirm && confirm !== password
                      ? 'rgba(255,68,102,0.5)'
                      : undefined,
                }}
              />
            </div>

            {error && <div style={S.errBox}>{error}</div>}

            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? '↻ Creating account…' : '🚀 Begin Your Journey'}
            </button>
          </form>

          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>or</span>
            <span style={styles.dividerLine} />
          </div>

          <p style={styles.switchText}>
            Already an explorer?{' '}
            <Link to="/login" style={styles.switchLink}>
              Sign in →
            </Link>
          </p>
        </div>

        <p style={styles.terms}>
          By registering you agree to play responsibly and maintain your dimensional stability.
        </p>
      </div>
    </div>
  );
}

// ── Password strength indicator ────────────────────────────────────────────────
function PasswordStrength({ password }) {
  const checks = [
    { label: '8+ characters', ok: password.length >= 8 },
    { label: 'Uppercase', ok: /[A-Z]/.test(password) },
    { label: 'Number', ok: /\d/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const colors = ['#ff4466', '#ffcc00', '#00ff88'];
  const labels = ['Weak', 'Fair', 'Strong'];

  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background: i < score ? colors[score - 1] : 'rgba(255,255,255,0.1)',
              transition: 'background 0.3s',
            }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        {checks.map((c) => (
          <span
            key={c.label}
            style={{
              fontSize: 11,
              color: c.ok ? COLORS.green : COLORS.textFaint,
              display: 'flex',
              alignItems: 'center',
              gap: 3,
            }}
          >
            {c.ok ? '✓' : '○'} {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    width: '100%',
    maxWidth: 460,
    padding: '40px 20px 32px',
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 22,
  },
  logoBlock: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
  },
  logoIcon: {
    fontSize: 52,
    filter: 'drop-shadow(0 0 16px #7c3aed88)',
  },
  card: {
    width: '100%',
    background: 'rgba(12,8,32,0.96)',
    border: '1px solid rgba(124,58,237,0.3)',
    borderRadius: 20,
    padding: '34px 30px',
    boxShadow: '0 0 60px rgba(124,58,237,0.12), inset 0 1px 0 rgba(255,255,255,0.05)',
    backdropFilter: 'blur(20px)',
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
    margin: '0 0 26px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
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
    background: 'linear-gradient(135deg,#7c3aed,#0099ff)',
    border: 'none',
    borderRadius: 10,
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    margin: '20px 0 14px',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: 'rgba(255,255,255,0.08)',
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
  terms: {
    color: COLORS.textFaint,
    fontSize: 12,
    textAlign: 'center',
    margin: 0,
    maxWidth: 340,
  },
};
