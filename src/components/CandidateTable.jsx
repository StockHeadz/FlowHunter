import React from 'react';
import StageBadge from './StageBadge.jsx';

export default function CandidateTable({ rows, selectedTicker, onSelect }) {
  return (
    <div className="table-wrap">
      <table className="candidate-table">
        <thead>
          <tr>
            <th>Ticker</th><th>Status</th><th>Flow</th><th>Upside</th><th>Opportunity</th><th>PCG Similarity</th><th>YTD</th><th>OI</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.ticker}
              className={selectedTicker === row.ticker ? 'selected' : ''}
              onClick={() => onSelect(row.ticker)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelect(row.ticker);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Open ${row.ticker} details`}
            >
              <td><strong>{row.ticker}</strong><small>{row.company}</small></td>
              <td><StageBadge stage={row.stage} /></td>
              <td><span className={`number-score ${row.flow >= 90 ? 'excellent' : row.flow >= 85 ? 'strong' : 'developing'}`}>{row.flow}</span></td>
              <td>{row.upside}</td>
              <td><strong>{row.opportunity}</strong></td>
              <td>{row.similarity}%</td>
              <td className={row.ytd > 0 ? 'positive' : 'negative'}>{row.ytd > 0 ? '+' : ''}{row.ytd}%</td>
              <td>+{row.oiChange}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
