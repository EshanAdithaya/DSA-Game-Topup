// ─── Shared Style Constants ────────────────────────────────────────────────────

export const COLORS = {
  bg: '#080818',
  bgGrad: 'linear-gradient(135deg,#080818 0%,#0d0825 50%,#080818 100%)',
  purple: '#7c3aed',
  purpleLight: '#a78bfa',
  cyan: '#00ccff',
  green: '#00ff88',
  yellow: '#ffd700',
  pink: '#f472b6',
  red: '#ff4466',
  orange: '#ff8800',
  text: '#e2e8f0',
  textMuted: '#94a3b8',
  textFaint: '#64748b',
  border: 'rgba(255,255,255,0.08)',
  cardBg: 'rgba(255,255,255,0.04)',
  purpleBorder: 'rgba(124,58,237,0.25)',
  purpleBg: 'rgba(124,58,237,0.08)',
};

// Shared base styles used across pages
export const S = {
  page: {
    minHeight: '100vh',
    background: COLORS.bgGrad,
    position: 'relative',
    overflowX: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
  },

  container: {
    width: '100%',
    padding: '36px 20px',
    position: 'relative',
    zIndex: 1,
    boxSizing: 'border-box',
  },

  // ── Typography ──
  gradTitle: {
    background: `linear-gradient(90deg,${COLORS.purpleLight},${COLORS.cyan})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 800,
    margin: '0 0 4px',
  },
  subtitle: {
    color: COLORS.textFaint,
    fontSize: 11,
    letterSpacing: 3,
    margin: 0,
    textTransform: 'uppercase',
  },

  // ── Cards ──
  card: {
    background: COLORS.cardBg,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 16,
    padding: '22px',
  },
  purpleCard: {
    background: COLORS.purpleBg,
    border: `1px solid ${COLORS.purpleBorder}`,
    borderRadius: 16,
    padding: '22px',
  },

  // ── Inputs ──
  input: {
    width: '100%',
    padding: '13px 16px',
    boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${COLORS.purpleBorder}`,
    borderRadius: 10,
    color: COLORS.text,
    fontSize: 15,
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s',
  },

  // ── Buttons ──
  btnPrimary: {
    width: '100%',
    padding: '14px',
    background: `linear-gradient(135deg,${COLORS.purple},#0099ff)`,
    border: 'none',
    borderRadius: 10,
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  btnStart: {
    padding: '15px 28px',
    background: `linear-gradient(135deg,${COLORS.purple},#0099ff)`,
    border: 'none',
    borderRadius: 12,
    color: '#fff',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: `0 0 28px rgba(124,58,237,0.35)`,
  },
  btnSecondary: {
    padding: '13px 20px',
    background: 'rgba(255,255,255,0.06)',
    border: `1px solid ${COLORS.border}`,
    borderRadius: 12,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  btnLink: {
    background: 'none',
    border: 'none',
    color: COLORS.purpleLight,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
    padding: 0,
  },
  backBtn: {
    background: 'rgba(255,255,255,0.06)',
    border: `1px solid ${COLORS.border}`,
    borderRadius: 8,
    color: COLORS.textMuted,
    padding: '8px 14px',
    cursor: 'pointer',
    fontSize: 14,
    fontFamily: 'inherit',
  },

  // ── Feedback ──
  errBox: {
    background: 'rgba(255,68,102,0.08)',
    border: '1px solid rgba(255,68,102,0.25)',
    borderRadius: 8,
    padding: '10px 14px',
    color: '#ff6680',
    fontSize: 14,
  },

  // ── Stat card ──
  statCard: {
    flex: 1,
    minWidth: 100,
    background: COLORS.cardBg,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 14,
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
  },

  // ── Nav chip ──
  userChip: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: COLORS.purpleBg,
    border: `1px solid ${COLORS.purpleBorder}`,
    borderRadius: 12,
    padding: '8px 14px',
  },

  // ── Badge ──
  badge: {
    background: 'rgba(124,58,237,0.15)',
    border: `1px solid rgba(124,58,237,0.3)`,
    borderRadius: 20,
    padding: '4px 12px',
    color: COLORS.purpleLight,
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // ── Page header with back btn ──
  pageHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 28,
  },
  pageTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 700,
    margin: 0,
  },

  // ── Leaderboard row ──
  lbRow: {
    background: COLORS.cardBg,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 12,
    padding: '13px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },

  // ── Avatar ──
  avatar: {
    width: 68,
    height: 68,
    borderRadius: '50%',
    background: `linear-gradient(135deg,${COLORS.purple},#0099ff)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: 28,
    fontWeight: 700,
    flexShrink: 0,
  },

  // ── Playing specific ──
  qCard: {
    background: COLORS.cardBg,
    border: `1px solid ${COLORS.purpleBorder}`,
    borderRadius: 20,
    padding: '26px',
    boxShadow: '0 0 40px rgba(124,58,237,0.06)',
  },
  optBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${COLORS.border}`,
    borderRadius: 12,
    padding: '15px 16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    textAlign: 'left',
    fontFamily: 'inherit',
    transition: 'background 0.15s, border-color 0.15s',
  },
  optLetter: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    flexShrink: 0,
    background: 'rgba(124,58,237,0.2)',
    border: '1px solid rgba(124,58,237,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: COLORS.purpleLight,
    fontWeight: 700,
    fontSize: 14,
  },
  featureTag: {
    color: COLORS.textMuted,
    fontSize: 13,
    padding: '5px 11px',
    background: COLORS.cardBg,
    borderRadius: 8,
  },
  stepN: {
    width: 34,
    height: 34,
    borderRadius: 8,
    flexShrink: 0,
    background: 'rgba(124,58,237,0.15)',
    border: `1px solid ${COLORS.purpleBorder}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: COLORS.purpleLight,
    fontWeight: 700,
    fontSize: 12,
  },
};

export const globalCss = `
  @keyframes floatUp {
    0%   { transform: translateY(0) scale(1);   opacity: 0.2; }
    100% { transform: translateY(-40px) scale(1.4); opacity: 0.5; }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.6; }
  }
  * { box-sizing: border-box; }
  body { margin: 0; }
  input:focus {
    border-color: rgba(124,58,237,0.6) !important;
    outline: none !important;
    box-shadow: 0 0 0 2px rgba(124,58,237,0.15);
  }
  button { font-family: inherit; }
`;
