import React from 'react';

export default function LineChart({ values, labels = ['D-4', 'D-3', 'D-2', 'D-1', 'Today'] }) {
  const width = 520;
  const height = 220;
  const padX = 34;
  const padY = 28;
  const min = Math.min(50, ...values) - 2;
  const max = 100;
  const x = (i) => padX + ((width - padX * 2) * i) / Math.max(1, values.length - 1);
  const y = (v) => height - padY - ((v - min) / (max - min)) * (height - padY * 2);
  const points = values.map((v, i) => `${x(i)},${y(v)}`).join(' ');

  return (
    <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Flow score trend from ${values[0]} to ${values.at(-1)}`}>
      {[0, 1, 2, 3].map((n) => {
        const gy = padY + ((height - padY * 2) * n) / 3;
        return <line key={n} x1={padX} x2={width - padX} y1={gy} y2={gy} className="chart-grid" />;
      })}
      <polyline points={points} className="chart-line-shadow" />
      <polyline points={points} className="chart-line" />
      {values.map((v, i) => (
        <g key={`${v}-${i}`}>
          <circle cx={x(i)} cy={y(v)} r="5.5" className="chart-point" />
          <text x={x(i)} y={y(v) - 12} textAnchor="middle" className="chart-value">{v}</text>
          <text x={x(i)} y={height - 7} textAnchor="middle" className="chart-label">{labels[i] ?? ''}</text>
        </g>
      ))}
    </svg>
  );
}
