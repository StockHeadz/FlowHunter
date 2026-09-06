import React, { useState } from 'react';
import { getOptionsContracts } from '../services/api.js';

export default function OptionsLookup() {
  const [ticker, setTicker] = useState('PCG');
  const [result, setResult] = useState(null);
  const [contractType, setContractType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    const symbol = ticker.trim().toUpperCase();

    if (!symbol) {
      setError('Enter a ticker symbol.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await getOptionsContracts(symbol, contractType);
      setTicker(symbol);
      setResult(data);
    } catch (err) {
      setResult(null);
      setError(err.message || 'Unable to load options contracts.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <span className="section-kicker">Massive</span>
          <h3>Live options lookup</h3>
        </div>
        <span>Contract reference data</span>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {[
          ['all', 'All'],
          ['call', 'Calls'],
          ['put', 'Puts'],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setContractType(value)}
            aria-pressed={contractType === value}
            style={{
              padding: '8px 12px',
              borderRadius: '999px',
              border: contractType === value ? '1px solid currentColor' : '1px solid rgba(255,255,255,0.15)',
              background: contractType === value ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
              color: 'inherit',
              cursor: 'pointer',
              font: 'inherit',
              fontWeight: contractType === value ? '700' : '500',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
        <input
          type="text"
          value={ticker}
          onChange={(event) => setTicker(event.target.value.toUpperCase())}
          placeholder="PCG"
          maxLength={10}
          aria-label="Ticker symbol"
          style={{
            flex: '1',
            minWidth: '0',
            padding: '12px 14px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(255,255,255,0.05)',
            color: 'inherit',
            font: 'inherit',
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 18px',
            borderRadius: '10px',
            border: '0',
            cursor: loading ? 'wait' : 'pointer',
            fontWeight: '700',
          }}
        >
          {loading ? 'Loading…' : 'Load options'}
        </button>
      </form>

      {error && (
        <p style={{ marginBottom: '16px' }}>
          {error}
        </p>
      )}

      {result && (
        <>
          <p style={{ marginBottom: '14px' }}>
            <strong>{result.underlyingTicker}</strong>
            {' · '}
            {result.count} contracts returned
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th align="left">Type</th>
                  <th align="right">Strike</th>
                  <th align="left">Expiration</th>
                  <th align="left">Contract</th>
                </tr>
              </thead>

              <tbody>
                {result.contracts.map((contract) => (
                  <tr key={contract.ticker}>
                    <td>{contract.contractType}</td>
                    <td align="right">${contract.strikePrice}</td>
                    <td>{contract.expirationDate}</td>
                    <td>{contract.ticker}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
