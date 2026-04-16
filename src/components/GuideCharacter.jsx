import { useState, useEffect, useRef } from 'react';
import { COLORS } from '../styles/common';

// ── Quip banks ─────────────────────────────────────────────────────────────────

const CORRECT = [
  "YESSSS! I KNEW you had it! (I was actually very worried.) 🎉",
  "Correct! The quantum gods smile upon thee! Bask in their glow! 🙏",
  "Nailed it! Even Schrödinger's cat is clapping... in BOTH states. 🐱",
  "BOOM! Quantum brain fully activated! Or you guessed. Equally valid! 🚀",
  "Right answer! I'm not crying, my circuits are just... leaking coolant. 🥹",
  "OUTSTANDING! I'm emailing this to your family. So incredibly proud.",
  "Correct! Probability curved in your favor. Don't squander it! 😏",
  "OH WOW. You actually KNEW that? Genuinely, shockingly impressed. 🤯",
  "Ding ding ding! The universe confirmed your brain still works! 🔔✨",
  "PERFECT! Either a genius or extremely lucky. Don't ruin the streak. 🎰",
  "YES! The multiverse agrees across ALL timelines. Correct answer! 🌌",
  "Correct! I did NOT see that coming. You're full of good surprises! 🎁",
];

const WRONG = [
  "WRONG! In a parallel universe you got it right. Not THIS one tho. 😬",
  "Oops! The multiverse split... and in ZERO timelines you got that. Wow.",
  "Incorrect! My hopes for you were SO high. They have since... crashed. 📉",
  "Bzzzt! Quantum error in your bio-processing unit (the brain). 🤖",
  "Wrong! Even my potato-battery backup calculator got that right. 🥔",
  "Nope! The universe is reconsidering your standing invitation. 🚪",
  "INCORRECT! Not mad. Just... deeply, cosmically disappointed. 😔",
  "Wrong! Your stability took a hit. Just like my faith in you. 💔",
  "That was... a choice. A bold, wildly incorrect choice. Bold. 🎲",
  "Ohhhh nooo. That answer has LEFT the dimensional plane entirely. 😱",
  "I need a moment. Just... a moment. To process this. 🫠",
  "The correct answer waved at you! You missed the wave! 👋",
];

const IDLE = [
  "I believe in you! (Please don't make me regret this.) 🤞",
  "Think carefully... or embrace chaos. Both are strategies! 🎲",
  "One of these IS correct. Won't say which. You're welcome. 😇",
  "Computing your probability of success... it's... something. 🔄",
  "Your quantum potential is IMMEASURABLE! Prove it! ⚛️",
  "No pressure, but dimensional stability depends on this. 🌍",
  "Choose wisely, brave explorer. I'll survive either way. 🧠",
  "I've seen smarter people fail this. You'll be fine! Probably. 💪",
  "The answer is crystal clear! (It is absolutely not. Good luck.) 😅",
  "Science says one of those is correct. Science is rarely wrong. 🔬",
];

const STREAK_MSGS = [
  (n) => `${n} IN A ROW! Are you secretly a quantum physicist?! 🔬`,
  (n) => `${n}-STREAK! I'm calling the Quantum Police. Illegal. 🚔`,
  (n) => `HOLY WAVEFUNCTION! ${n} correct?! We broke the sim! 💀`,
  (n) => `${n} straight!! The quantum realm accepts you as chosen one. 👑`,
];

const DANGER_SUFFIX = [
  " ⚠️ Also — STABILITY CRITICAL! I'm having a silicon crisis!",
  " ⚠️ One more wrong and we're dimensional toast. THE WORST TOAST.",
  " ⚠️ STABILITY ALERT! Never more stressed in my artificial life!",
];

const TIMER_MSGS = [
  "HURRY! The quantum realm waits for NOBODY! ⏰💨",
  "TICK TOCK! That's dimensional collapse counting down! MOVE! ⚡",
  "TIME'S ALMOST GONE! I AM PANICKING! YOU SHOULD TOO! 😱⏰",
  "5 SECONDS! PICK SOMETHING! CHAOS IS ALSO A STRATEGY! 💀",
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── Mood themes ─────────────────────────────────────────────────────────────────

const MOOD = {
  idle:    { face: '🤖', color: '#a5b4fc', bg: 'rgba(129,140,248,0.12)', border: 'rgba(129,140,248,0.32)' },
  correct: { face: '🤩', color: '#34d399', bg: 'rgba(16,185,129,0.14)',  border: 'rgba(16,185,129,0.38)'  },
  wrong:   { face: '😬', color: '#f87171', bg: 'rgba(239,68,68,0.14)',   border: 'rgba(239,68,68,0.38)'   },
  panic:   { face: '😱', color: '#fb923c', bg: 'rgba(249,115,22,0.14)',  border: 'rgba(249,115,22,0.38)'  },
  streak:  { face: '🔥', color: '#fbbf24', bg: 'rgba(245,158,11,0.14)', border: 'rgba(245,158,11,0.38)'  },
};

// ── Component ──────────────────────────────────────────────────────────────────

export default function GuideCharacter({ feedback, streak, stability, timer, questionNumber }) {
  const [msg,  setMsg]  = useState('');
  const [mood, setMood] = useState('idle');
  const [vis,  setVis]  = useState(false);   // whether bubble is shown
  const bubbleRef      = useRef(null);
  const timerWarnedRef = useRef(false);
  const hideTimeoutRef = useRef(null);

  const pop = () => {
    const el = bubbleRef.current;
    if (!el) return;
    el.style.animation = 'none';
    void el.offsetHeight;
    el.style.animation = 'guideIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards';
  };

  const show = (text, newMood, autohide = false) => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    setMsg(text);
    setMood(newMood);
    setVis(true);
    // Auto-hide idle messages after 5 s
    if (autohide) {
      hideTimeoutRef.current = setTimeout(() => setVis(false), 5000);
    }
    requestAnimationFrame(pop);
  };

  // React to feedback
  useEffect(() => {
    if (feedback) {
      timerWarnedRef.current = false;
      if (feedback.correct) {
        let text;
        let m = 'correct';
        if (streak >= 7)      { text = pick(STREAK_MSGS)(streak); m = 'streak'; }
        else if (streak >= 4) { text = pick(CORRECT) + ` That's ${streak} in a row! 🔥`; m = 'streak'; }
        else                  { text = pick(CORRECT); }
        show(text, m, false);
      } else {
        let text = pick(WRONG);
        if (stability <= 30) text += pick(DANGER_SUFFIX);
        show(text, 'wrong', false);
      }
    } else {
      // New question
      const welcome = questionNumber <= 1
        ? "Welcome! Let's see what that brain of yours can do! 🌌⚛️"
        : pick(IDLE);
      show(welcome, 'idle', true);
    }
  }, [feedback]);   // eslint-disable-line

  // Timer urgency
  useEffect(() => {
    if (timer <= 5 && timer > 0 && !feedback && !timerWarnedRef.current) {
      timerWarnedRef.current = true;
      show(pick(TIMER_MSGS), 'panic', false);
    }
  }, [timer]);      // eslint-disable-line

  const m = MOOD[mood] || MOOD.idle;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 230,
        pointerEvents: 'none',   // doesn't block clicks on game
      }}
    >
      {/* ── Thought cloud bubble ── */}
      {vis && (
        <div
          ref={bubbleRef}
          style={{
            width: '100%',
            background: m.bg,
            border: `1.5px solid ${m.border}`,
            borderRadius: 22,
            padding: '14px 16px',
            boxShadow: `0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px ${m.border}`,
            position: 'relative',
            marginBottom: 4,
            animation: 'guideIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            // Extra "cloud puffs" using outline trick
          }}
        >
          {/* Cloud puff decorations */}
          <div style={{
            position: 'absolute', top: -8, left: 28,
            width: 18, height: 18, borderRadius: '50%',
            background: m.bg, border: `1.5px solid ${m.border}`,
          }} />
          <div style={{
            position: 'absolute', top: -12, left: 50,
            width: 22, height: 22, borderRadius: '50%',
            background: m.bg, border: `1.5px solid ${m.border}`,
          }} />
          <div style={{
            position: 'absolute', top: -8, left: 76,
            width: 16, height: 16, borderRadius: '50%',
            background: m.bg, border: `1.5px solid ${m.border}`,
          }} />

          <p style={{
            margin: 0,
            color: '#e2e8f0',
            fontSize: 12.5,
            lineHeight: 1.6,
            fontStyle: 'italic',
            fontWeight: 500,
          }}>
            {msg}
          </p>
        </div>
      )}

      {/* ── Thought trail dots (from bubble down to mascot) ── */}
      {vis && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, marginBottom: 4 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: m.bg, border: `1.5px solid ${m.border}` }} />
          <div style={{ width: 7,  height: 7,  borderRadius: '50%', background: m.bg, border: `1.5px solid ${m.border}` }} />
          <div style={{ width: 4,  height: 4,  borderRadius: '50%', background: m.bg, border: `1.5px solid ${m.border}` }} />
        </div>
      )}

      {/* ── Mascot avatar (always visible) ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: 18,
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: `2px solid ${m.color}77`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 30,
            boxShadow: `0 6px 24px ${m.color}44, 0 0 0 4px ${m.color}18`,
            animation: mood === 'panic'  ? 'pulse 0.4s infinite' :
                       mood === 'streak' ? 'pulse 0.7s infinite' : 'none',
            cursor: 'default',
          }}
        >
          {m.face}
        </div>
        <div style={{
          background: m.color,
          color: '#fff',
          fontSize: 8,
          fontWeight: 800,
          letterSpacing: 1,
          padding: '2px 8px',
          borderRadius: 10,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          boxShadow: `0 2px 6px ${m.color}44`,
        }}>
          QUBITRON
        </div>
      </div>
    </div>
  );
}
