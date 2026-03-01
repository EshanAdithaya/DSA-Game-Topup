export default function StabilityBar({ value }) {
  const clamped = Math.max(0, Math.min(100, value));
  const color =
    clamped > 60 ? '#00ff88' : clamped > 30 ? '#ffcc00' : '#ff4466';

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        overflow: 'hidden',
        height: 12,
        flex: 1,
      }}
    >
      <div
        style={{
          width: `${clamped}%`,
          height: '100%',
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: 8,
          transition: 'width 0.4s ease, background 0.4s ease',
          boxShadow: `0 0 12px ${color}66`,
        }}
      />
    </div>
  );
}
