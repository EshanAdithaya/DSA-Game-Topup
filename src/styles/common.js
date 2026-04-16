// ─── Design Tokens — Dark Quantum Space Theme ────────────────────────────────

export const COLORS = {
  // ── Backgrounds ──
  bg:        '#070b18',
  bgGrad:    '#070b18',
  cardBg:    'rgba(255,255,255,0.06)',
  cardBg2:   'rgba(255,255,255,0.04)',
  sectionBg: 'rgba(255,255,255,0.08)',

  // ── Text ──
  text:      '#f1f5f9',
  textMuted: '#94a3b8',
  textFaint: '#475569',

  // ── Borders & Shadows ──
  border:   'rgba(255,255,255,0.10)',
  shadow:   '0 4px 24px rgba(0,0,0,0.50)',
  shadowMd: '0 8px 40px rgba(0,0,0,0.60)',
  shadowLg: '0 16px 64px rgba(0,0,0,0.70)',

  // ── Brand: electric indigo / violet ──
  purple:       '#818cf8',
  purpleLight:  '#a5b4fc',
  purpleDark:   '#6366f1',
  purpleFaint:  'rgba(129,140,248,0.12)',
  purpleBorder: 'rgba(129,140,248,0.28)',
  purpleBg:     'rgba(129,140,248,0.08)',

  // ── Neon accents ──
  cyan:      '#22d3ee',
  cyanNeon:  '#67e8f9',

  green:     '#10b981',
  greenNeon: '#34d399',

  yellow:     '#f59e0b',
  yellowNeon: '#fbbf24',

  pink:     '#ec4899',
  pinkNeon: '#f472b6',

  red:     '#ef4444',
  redNeon: '#f87171',

  orange:     '#f97316',
  orangeNeon: '#fb923c',

  // ── AI badge ──
  ai:       '#a5b4fc',
  aiBg:     'rgba(129,140,248,0.14)',
  aiBorder: 'rgba(129,140,248,0.32)',
};

// ─── Shared style object ───────────────────────────────────────────────────────

export const S = {
  page: {
    minHeight: '100vh',
    background: 'transparent',
    position: 'relative',
    overflowX: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    fontFamily: "'Inter','Space Grotesk','Segoe UI',system-ui,sans-serif",
  },

  container: {
    width: '100%',
    padding: '36px 20px',
    position: 'relative',
    zIndex: 1,
    boxSizing: 'border-box',
  },

  // Gradient text title
  gradTitle: {
    background: 'linear-gradient(135deg, #a5b4fc 0%, #818cf8 45%, #22d3ee 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 800,
    margin: '0 0 4px',
    fontFamily: "'Space Grotesk','Inter',system-ui,sans-serif",
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
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 18,
    padding: '22px',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.07)',
  },
  purpleCard: {
    background: 'rgba(129,140,248,0.08)',
    border: '1px solid rgba(129,140,248,0.26)',
    borderRadius: 18,
    padding: '22px',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(129,140,248,0.10)',
  },

  // ── Inputs ──
  input: {
    width: '100%',
    padding: '13px 16px',
    boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.07)',
    border: '1.5px solid rgba(255,255,255,0.12)',
    borderRadius: 10,
    color: '#f1f5f9',
    fontSize: 15,
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },

  // ── Buttons ──
  btnPrimary: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
    border: 'none',
    borderRadius: 12,
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 22px rgba(99,102,241,0.55)',
    fontFamily: 'inherit',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
  btnStart: {
    padding: '15px 28px',
    background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
    border: 'none',
    borderRadius: 14,
    color: '#fff',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 22px rgba(99,102,241,0.55)',
    fontFamily: 'inherit',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
  btnSecondary: {
    padding: '12px 20px',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.14)',
    borderRadius: 12,
    color: '#f1f5f9',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    transition: 'background 0.15s, border-color 0.15s, transform 0.15s',
  },
  btnLink: {
    background: 'none',
    border: 'none',
    color: '#a5b4fc',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
    padding: 0,
    fontFamily: 'inherit',
  },
  backBtn: {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.14)',
    borderRadius: 10,
    color: '#94a3b8',
    padding: '8px 14px',
    cursor: 'pointer',
    fontSize: 14,
    fontFamily: 'inherit',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    transition: 'background 0.15s, transform 0.15s',
  },

  // ── Error box ──
  errBox: {
    background: 'rgba(239,68,68,0.13)',
    border: '1px solid rgba(239,68,68,0.32)',
    borderRadius: 8,
    padding: '10px 14px',
    color: '#f87171',
    fontSize: 14,
  },

  // ── Stat card ──
  statCard: {
    flex: 1,
    minWidth: 100,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 16,
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
  },

  // ── User chip ──
  userChip: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(129,140,248,0.30)',
    borderRadius: 12,
    padding: '8px 14px',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  },

  // ── Badge ──
  badge: {
    background: 'rgba(129,140,248,0.14)',
    border: '1px solid rgba(129,140,248,0.32)',
    borderRadius: 20,
    padding: '4px 12px',
    color: '#a5b4fc',
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // ── Page header ──
  pageHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 28,
  },
  pageTitle: {
    color: '#f1f5f9',
    fontSize: 24,
    fontWeight: 700,
    margin: 0,
    fontFamily: "'Space Grotesk','Inter',system-ui,sans-serif",
  },

  // ── Leaderboard row ──
  lbRow: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: '14px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    transition: 'background 0.2s, border-color 0.2s',
  },

  // ── Avatar ──
  avatar: {
    width: 68,
    height: 68,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: 28,
    fontWeight: 700,
    flexShrink: 0,
    boxShadow: '0 4px 20px rgba(99,102,241,0.50)',
  },

  // ── Question card ──
  qCard: {
    background: 'rgba(255,255,255,0.06)',
    border: '1.5px solid rgba(129,140,248,0.26)',
    borderRadius: 22,
    padding: '28px',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: '0 8px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)',
  },

  // ── Option button ──
  optBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1.5px solid rgba(255,255,255,0.10)',
    borderRadius: 14,
    padding: '15px 16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    textAlign: 'left',
    fontFamily: 'inherit',
    transition: 'all 0.18s ease',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  },
  optLetter: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    flexShrink: 0,
    background: 'rgba(129,140,248,0.15)',
    border: '1.5px solid rgba(129,140,248,0.38)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#a5b4fc',
    fontWeight: 700,
    fontSize: 14,
  },

  // ── Feature tag ──
  featureTag: {
    color: '#94a3b8',
    fontSize: 13,
    padding: '5px 12px',
    background: 'rgba(255,255,255,0.06)',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.10)',
  },

  // ── Step number ──
  stepN: {
    width: 34,
    height: 34,
    borderRadius: 8,
    flexShrink: 0,
    background: 'rgba(129,140,248,0.15)',
    border: '1.5px solid rgba(129,140,248,0.38)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#a5b4fc',
    fontWeight: 700,
    fontSize: 12,
  },
};

export const globalCss = `
  @keyframes floatUp {
    0%   { transform: translateY(0) scale(1);       opacity: 0.18; }
    100% { transform: translateY(-55px) scale(1.5); opacity: 0; }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.5; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes popIn {
    0%   { transform: scale(0.80); opacity: 0; }
    65%  { transform: scale(1.07); }
    100% { transform: scale(1);    opacity: 1; }
  }
  @keyframes guideIn {
    0%   { transform: scale(0.80) translateY(12px); opacity: 0; }
    60%  { transform: scale(1.04) translateY(-2px); opacity: 1; }
    100% { transform: scale(1)    translateY(0);    opacity: 1; }
  }
  @keyframes blink {
    0%, 90%, 100% { transform: scaleY(1); }
    95%            { transform: scaleY(0.08); }
  }
  * { box-sizing: border-box; }
  body { margin: 0; background: #070b18; }
  input:focus {
    border-color: rgba(129,140,248,0.65) !important;
    box-shadow: 0 0 0 3px rgba(129,140,248,0.18) !important;
  }
  button { font-family: inherit; }
`;
