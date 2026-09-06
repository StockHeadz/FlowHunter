import React from 'react';

export default function StageBadge({ stage }) {
  const kind = stage.includes('HIGH-CONVICTION') ? 'match' : stage.includes('STRONG') ? 'strong' : 'early';
  return <span className={`stage-badge ${kind}`}>{stage}</span>;
}
