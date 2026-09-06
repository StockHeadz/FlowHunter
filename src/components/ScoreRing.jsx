import React from 'react';

export default function ScoreRing({ value, label, size = 'lg' }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={`score-ring ${size}`} style={{ '--score': `${pct * 3.6}deg` }} aria-label={`${label}: ${value} out of 100`}>
      <div className="score-ring-inner">
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}
