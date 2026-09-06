import React from 'react';

export default function EvidenceBreakdown({ candidate }) {
  return (
    <div className="evidence-list">
      {candidate.evidence.map(([label, score, max, note]) => (
        <div className="evidence-row" key={label}>
          <div className="evidence-topline">
            <div><strong>{label}</strong><span>{note}</span></div>
            <b>{score}<small>/{max}</small></b>
          </div>
          <div className="progress-track" aria-hidden="true">
            <span style={{ width: `${(score / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
