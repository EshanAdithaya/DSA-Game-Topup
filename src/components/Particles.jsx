import { useMemo } from 'react';
import { globalCss } from '../styles/common';

const PARTICLE_COUNT = 18;

export default function Particles() {
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 8 + 4,
        delay: Math.random() * 4,
        color: i % 3 === 0 ? '#00ccff' : i % 3 === 1 ? '#7c3aed' : '#a78bfa',
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
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: p.color,
              opacity: 0.35,
              animation: `floatUp ${p.duration}s ${p.delay}s ease-in-out infinite alternate`,
            }}
          />
        ))}
      </div>
    </>
  );
}
