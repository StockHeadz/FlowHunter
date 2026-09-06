import React from 'react';

export default function BarChart({ values }) {
  const width = 520;
  const height = 220;
  const pad = 34;
  const max = Math.max(...values.map((x) => x.value)) * 1.15;
  const plotWidth = width - pad * 2;
  const slot = plotWidth / values.length;
  const barWidth = slot * 0.42;

  return (
    <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Bullish premium over 3, 5, and 10 days">
      {[0, 1, 2, 3].map((n) => {
        const gy = pad + ((height - pad * 2) * n) / 3;
        return <line key={n} x1={pad} x2={width - pad} y1={gy} y2={gy} className="chart-grid" />;
      })}
      {values.map((item, i) => {
        const barHeight = ((height - pad * 2) * item.value) / max;
        const x = pad + slot * i + (slot - barWidth) / 2;
        const y = height - pad - barHeight;
        return (
          <g key={item.label}>
            <rect x={x} y={y} width={barWidth} height={barHeight} rx="8" className="chart-bar" />
            <text x={x + barWidth / 2} y={Math.max(18, y - 9)} textAnchor="middle" className="chart-value">${item.value}M</text>
            <text x={x + barWidth / 2} y={height - 7} textAnchor="middle" className="chart-label">{item.label}</text>
          </g>
        );
      })}
    </svg>
  );
}
