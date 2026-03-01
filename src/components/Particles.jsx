import { useMemo } from 'react';
import { globalCss } from '../styles/common';

const PARTICLE_COUNT = 24;

// Soft pastel versions of brand colors — visible but subtle on white
const POOL = [
  '#c4b5fd', // soft purple
  '#a5f3fc', // soft cyan
  '#a7f3d0', // soft green
  '#fbcfe8', // soft pink
  '#fde68a', // soft yellow
  '#ddd6fe', // lighter purple
  '#bae6fd', // lighter cyan
];

export default function Particles() {
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id:       i,
        x:        Math.random() * 100,
        y:        Math.random() * 100,
        size:     Math.random() * 10 + 5,
        duration: Math.random() * 9 + 5,
        delay:    Math.random() * 5,
        color:    POOL[i % POOL.length],
        opacity:  Math.random() * 0.4 + 0.15,
      })),
    [],
  );

  return (
    <>
      <style>{globalCss}</style>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              position:     'absolute',
              left:         `${p.x}%`,
              top:          `${p.y}%`,
              width:        p.size,
              height:       p.size,
              borderRadius: '50%',
              background:   p.color,
              opacity:      p.opacity,
              filter:       'blur(1px)',
              animation:    `floatUp ${p.duration}s ${p.delay}s ease-in-out infinite alternate`,
            }}
          />
        ))}
      </div>
    </>
  );
}
