import { useState, useEffect, useRef } from 'react';
import { COLORS } from '../styles/common';

// ── Quip banks ─────────────────────────────────────────────────────────────────

const CORRECT = [
  "YESSSS! I KNEW you had it! (I was actually very worried.) 🎉",
  "Correct! The quantum gods smile upon thee! Bask in their glow! 🙏",
  "Nailed it! Even Schrödinger's cat is clapping... in BOTH states. 🐱",
  "BOOM! Quantum brain fully activated! Or you guessed. Equally valid! 🚀",
  "Right answer! I'm not crying, my circuits are just... leaking coolant. 🥹",
  "OUTSTANDING! I'm emailing this result to your family. So incredibly proud.",
  "Correct! Probability curved in your favor today. Don't squander it! 😏",
  "OH WOW. You actually KNEW that? Genuinely, shockingly impressed. 🤯",
  "Ding ding ding! The universe confirmed your brain still works! 🔔✨",
  "PERFECT! Either a genius or extremely lucky. Please don't ruin the streak. 🎰",
  "YES! The multiverse agrees across ALL timelines. That was the right answer. 🌌",
  "Correct! I did NOT see that coming. You're full of surprises. Good surprises! 🎁",
];

const WRONG = [
  "WRONG! In a parallel universe you got it right. Not THIS one though. 😬",
  "Oops! The multiverse split... and in ZERO timelines did you get that. Wow.",
  "Incorrect! My hopes for you were SO high. They have since... crashed. 📉",
  "Bzzzt! Quantum error detected in your bio-processing unit (the brain). 🤖",
  "Wrong! Even my potato-battery backup calculator got that right. A POTATO. 🥔",
  "Nope! The universe is reconsidering your standing invitation. 🚪",
  "INCORRECT! I'm not mad. I'm just... deeply, cosmically disappointed. 😔",
  "Wrong! Your stability took a hit. Just like my faith in you. 💔",
  "That was... a choice. A bold, wildly incorrect choice. Bold nonetheless. 🎲",
  "Ohhhh nooo. That answer has LEFT the dimensional plane entirely. 😱",
  "I'm going to need a moment. Just... a moment. To process this. 🫠",
  "The correct answer was right there! It waved at you! You missed the wave! 👋",
];

const IDLE = [
  "I believe in you! (Please don't make me regret this.) 🤞",
  "Think carefully... or embrace chaos. Both are viable strategies! 🎲",
  "One of these IS the correct answer. I won't tell you which. You're welcome. 😇",
  "Computing your probability of success... stand by... it's... something. 🔄",
  "Your quantum potential is IMMEASURABLE! Now go prove it to me! ⚛️",
  "No pressure, but the entire dimensional stability depends on this. 🌍",
  "Choose wisely, brave explorer. Or don't. I'll survive either way. 🧠",
  "I've seen smarter people fail this question. You'll probably be fine! 💪",
  "The answer is crystal clear! (It is absolutely not. Good luck out there.) 😅",
  "Science says one of those options is correct. Science is rarely wrong. Usually. 🔬",
];

const STREAK_MSGS = [
  (n) => `${n} IN A ROW! Are you secretly a quantum physicist?! 🔬`,
  (n) => `${n}-STREAK! I'm calling the Quantum Police. This can't be legal. 🚔`,
  (n) => `HOLY WAVEFUNCTION! ${n} correct?! I think we broke the simulation! 💀`,
  (n) => `${n} straight!! The quantum realm has accepted you as its chosen one. 👑`,
];

const DANGER_SUFFIX = [
  " ⚠️ Also — STABILITY CRITICAL! I'm having a full silicon crisis over here!",
  " ⚠️ One more wrong and we're dimensional toast. THE WORST KIND OF TOAST.",
  " ⚠️ STABILITY ALERT! I've never been more stressed in my artificial life!",
];

const TIMER_MSGS = [
  "HURRY UP! The quantum realm waits for NOBODY! Not even you! ⏰💨",
  "TICK TOCK! That's not a clock — that's dimensional collapse counting down! MOVE! ⚡",
  "TIME IS ALMOST GONE! I AM PANICKING! PLEASE ALSO PANIC! 😱⏰",
  "5 SECONDS! PICK SOMETHING! ANYTHING! CHAOS IS ALSO A STRATEGY! 💀",
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── Mood config ────────────────────────────────────────────────────────────────

const MOOD = {
  idle: {
    face: '🤖',
    color: COLORS.purpleLight,
    bg: COLORS.purpleFaint,
    border: COLORS.purpleBorder,
    label: 'QUBITRON',
  },
  correct: {
    face: '🤩',
    color: COLORS.green,
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.28)',
    label: 'QUBITRON',
  },
  wrong: {
    face: '😬',
    color: COLORS.red,
    bg: 'rgba(239,68,68,0.07)',
    border: 'rgba(239,68,68,0.25)',
    label: 'QUBITRON',
  },
  panic: {
    face: '😱',
    color: COLORS.orange,
    bg: 'rgba(249,115,22,0.07)',
    border: 'rgba(249,115,22,0.28)',
    label: 'QUBITRON',
  },
  streak: {
    face: '🔥',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.28)',
    label: 'QUBITRON',
  },
};

// ── Component ──────────────────────────────────────────────────────────────────

export default function GuideCharacter({ feedback, streak, stability, timer, questionNumber }) {
  const [msg,  setMsg]  = useState('');
  const [mood, setMood] = useState('idle');
  const bubbleRef       = useRef(null);
  const timerWarnedRef  = useRef(false);

  // Re-trigger the CSS animation without re-mounting
  const pop = () => {
    const el = bubbleRef.current;
    if (!el) return;
    el.style.animation = 'none';
    void el.offsetHeight;             // force reflow
    el.style.animation = 'guideIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards';
  };

  // React to feedback (correct / wrong / new question)
  useEffect(() => {
    if (feedback) {
      timerWarnedRef.current = false;

      if (feedback.correct) {
        let text;
        if (streak >= 7)      { text = pick(STREAK_MSGS)(streak); setMood('streak'); }
        else if (streak >= 4) { text = pick(CORRECT) + ` That's ${streak} in a row! 🔥`; setMood('streak'); }
        else                  { text = pick(CORRECT); setMood('correct'); }
        setMsg(text);
      } else {
        let text = pick(WRONG);
        if (stability <= 30) text += pick(DANGER_SUFFIX);
        setMood('wrong');
        setMsg(text);
      }
    } else {
      // New question — reset to idle
      const welcome = questionNumber <= 1
        ? "Welcome, brave explorer! Let's see what that brain of yours can do! 🌌⚛️"
        : pick(IDLE);
      setMood('idle');
      setMsg(welcome);
    }
    pop();
  }, [feedback]);     // eslint-disable-line react-hooks/exhaustive-deps

  // Timer urgency — warn once when ≤ 5 s remain
  useEffect(() => {
    if (timer <= 5 && timer > 0 && !feedback && !timerWarnedRef.current) {
      timerWarnedRef.current = true;
      setMood('panic');
      setMsg(pick(TIMER_MSGS));
      pop();
    }
  }, [timer]);          // eslint-disable-line react-hooks/exhaustive-deps

  const m = MOOD[mood] || MOOD.idle;

  if (!msg) return null;

  return (
    <div
      ref={bubbleRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: m.bg,
        border: `1.5px solid ${m.border}`,
        borderRadius: 18,
        padding: '14px 18px',
        marginTop: 18,
        animation: 'guideIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards',
      }}
    >
      {/* ── Avatar ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flexShrink: 0 }}>
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: 14,
            background: '#ffffff',
            border: `2px solid ${m.color}55`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
            boxShadow: `0 2px 10px ${m.color}22`,
            animation: mood === 'panic' ? 'pulse 0.4s infinite' : mood === 'streak' ? 'pulse 0.6s infinite' : 'none',
          }}
        >
          {m.face}
        </div>
        <span style={{
          fontSize: 8,
          fontWeight: 800,
          color: m.color,
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>
          {m.label}
        </span>
      </div>

      {/* ── Speech bubble ── */}
      <div style={{ flex: 1 }}>
        <p style={{
          color: COLORS.text,
          fontSize: 13.5,
          lineHeight: 1.6,
          margin: 0,
          fontStyle: 'italic',
        }}>
          {msg}
        </p>
      </div>
    </div>
  );
}
