// ─── Design Tokens — White/Black Theme with vivid game accents ─────────────────

export const COLORS = {
  // ── Backgrounds ──
  bg:        '#f5f4ff',
  bgGrad:    'linear-gradient(135deg, #ffffff 0%, #f3f0ff 50%, #eef5ff 100%)',
  cardBg:    '#ffffff',
  cardBg2:   '#faf9ff',
  sectionBg: '#f0eeff',

  // ── Text ──
  text:      '#111827',
  textMuted: '#4b5563',
  textFaint: '#9ca3af',

  // ── Borders & Shadows ──
  border:   'rgba(0,0,0,0.08)',
  shadow:   '0 2px 12px rgba(0,0,0,0.07)',
  shadowMd: '0 4px 24px rgba(0,0,0,0.09)',
  shadowLg: '0 8px 40px rgba(0,0,0,0.12)',

  // ── Brand purple ──
  purple:       '#7c3aed',
  purpleLight:  '#8b5cf6',
  purpleDark:   '#5b21b6',
  purpleFaint:  '#ede9fe',
  purpleBorder: 'rgba(124,58,237,0.18)',
  purpleBg:     'rgba(124,58,237,0.06)',

  // ── Vivid game accent colors (kept vivid for in-game elements) ──
  cyan:     '#06b6d4',
  cyanNeon: '#00ccff',

  green:     '#10b981',
  greenNeon: '#00ff88',

  yellow:     '#f59e0b',
  yellowNeon: '#ffd700',

  pink:     '#ec4899',
  pinkNeon: '#f472b6',

  red:     '#ef4444',
  redNeon: '#ff4466',

  orange:     '#f97316',
  orangeNeon: '#ff8800',

  // AI badge
  ai:    '#7c3aed',
  aiBg:  '#f5f3ff',
  aiBorder: 'rgba(124,58,237,0.25)',
};

// ─── Shared style object ───────────────────────────────────────────────────────

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

  gradTitle: {
    background: `linear-gradient(90deg,${COLORS.purple},${COLORS.cyan})`,
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

  card: {
    background: COLORS.cardBg,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 16,
    padding: '22px',
    boxShadow: COLORS.shadow,
  },
  purpleCard: {
    background: COLORS.purpleFaint,
    border: `1px solid ${COLORS.purpleBorder}`,
    borderRadius: 16,
    padding: '22px',
  },

  input: {
    width: '100%',
    padding: '13px 16px',
    boxSizing: 'border-box',
    background: '#ffffff',
    border: '1.5px solid rgba(0,0,0,0.14)',
    borderRadius: 10,
    color: COLORS.text,
    fontSize: 15,
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },

  btnPrimary: {
    width: '100%',
    padding: '14px',
    background: `linear-gradient(135deg,${COLORS.purple},${COLORS.cyan})`,
    border: 'none',
    borderRadius: 10,
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(124,58,237,0.3)',
    fontFamily: 'inherit',
  },
  btnStart: {
    padding: '15px 28px',
    background: `linear-gradient(135deg,${COLORS.purple},${COLORS.cyan})`,
    border: 'none',
    borderRadius: 12,
    color: '#fff',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(124,58,237,0.3)',
    fontFamily: 'inherit',
  },
  btnSecondary: {
    padding: '12px 20px',
    background: '#ffffff',
    border: '1.5px solid rgba(0,0,0,0.1)',
    borderRadius: 12,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    boxShadow: COLORS.shadow,
  },
  btnLink: {
    background: 'none',
    border: 'none',
    color: COLORS.purple,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
    padding: 0,
    fontFamily: 'inherit',
  },
  backBtn: {
    background: '#ffffff',
    border: '1.5px solid rgba(0,0,0,0.1)',
    borderRadius: 8,
    color: COLORS.textMuted,
    padding: '8px 14px',
    cursor: 'pointer',
    fontSize: 14,
    fontFamily: 'inherit',
    boxShadow: COLORS.shadow,
  },

  errBox: {
    background: '#fef2f2',
    border: '1.5px solid #fecaca',
    borderRadius: 8,
    padding: '10px 14px',
    color: '#b91c1c',
    fontSize: 14,
  },

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
    boxShadow: COLORS.shadow,
  },

  userChip: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: '#ffffff',
    border: `1.5px solid ${COLORS.purpleBorder}`,
    borderRadius: 12,
    padding: '8px 14px',
    boxShadow: COLORS.shadow,
  },

  badge: {
    background: COLORS.purpleFaint,
    border: `1px solid ${COLORS.purpleBorder}`,
    borderRadius: 20,
    padding: '4px 12px',
    color: COLORS.purple,
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

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

  lbRow: {
    background: COLORS.cardBg,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 12,
    padding: '13px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    boxShadow: COLORS.shadow,
  },

  avatar: {
    width: 68,
    height: 68,
    borderRadius: '50%',
    background: `linear-gradient(135deg,${COLORS.purple},${COLORS.cyan})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: 28,
    fontWeight: 700,
    flexShrink: 0,
    boxShadow: '0 4px 16px rgba(124,58,237,0.25)',
  },

  qCard: {
    background: COLORS.cardBg,
    border: `2px solid ${COLORS.purpleBorder}`,
    borderRadius: 20,
    padding: '28px',
    boxShadow: COLORS.shadowMd,
  },
  optBtn: {
    background: '#ffffff',
    border: '1.5px solid rgba(0,0,0,0.1)',
    borderRadius: 12,
    padding: '15px 16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    textAlign: 'left',
    fontFamily: 'inherit',
    transition: 'all 0.15s ease',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  },
  optLetter: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    flexShrink: 0,
    background: COLORS.purpleFaint,
    border: `1.5px solid ${COLORS.purpleBorder}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: COLORS.purple,
    fontWeight: 700,
    fontSize: 14,
  },
  featureTag: {
    color: COLORS.textMuted,
    fontSize: 13,
    padding: '5px 11px',
    background: '#ffffff',
    borderRadius: 8,
    border: `1px solid ${COLORS.border}`,
  },
  stepN: {
    width: 34,
    height: 34,
    borderRadius: 8,
    flexShrink: 0,
    background: COLORS.purpleFaint,
    border: `1.5px solid ${COLORS.purpleBorder}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: COLORS.purple,
    fontWeight: 700,
    fontSize: 12,
  },
};

export const globalCss = `
  @keyframes floatUp {
    0%   { transform: translateY(0) scale(1);       opacity: 0.12; }
    100% { transform: translateY(-40px) scale(1.3); opacity: 0.4; }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.55; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes popIn {
    0%   { transform: scale(0.85); opacity: 0; }
    70%  { transform: scale(1.05); }
    100% { transform: scale(1);    opacity: 1; }
  }
  * { box-sizing: border-box; }
  body { margin: 0; background: #f5f4ff; }
  input:focus {
    border-color: rgba(124,58,237,0.5) !important;
    box-shadow: 0 0 0 3px rgba(124,58,237,0.1) !important;
  }
  button { font-family: inherit; }
`;
