import React, { useEffect, useMemo, useState } from 'react';
import CandidateTable from './components/CandidateTable.jsx';
import StageBadge from './components/StageBadge.jsx';
import ScoreRing from './components/ScoreRing.jsx';
import LineChart from './components/LineChart.jsx';
import BarChart from './components/BarChart.jsx';
import EvidenceBreakdown from './components/EvidenceBreakdown.jsx';
import OptionsLookup from './components/OptionsLookup.jsx';
import { getDashboardData, getSignal } from './services/api.js';

const filters = [
  ['All', 'All'],
  ['High Conviction', 'HIGH-CONVICTION MATCH'],
  ['Strong', 'STRONG ACCUMULATION'],
  ['Early', 'EARLY ACCUMULATION']
];

export default function App() {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState('All');
  const [selectedTicker, setSelectedTicker] = useState('PCG');
  const [detailTab, setDetailTab] = useState('overview');
  const [signal, setSignal] = useState(null);
  const [signalLoading, setSignalLoading] = useState(false);
  const [signalError, setSignalError] = useState('');

  useEffect(() => {
    let active = true;
    getDashboardData().then((result) => active && setData(result));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;

    setSignalLoading(true);
    setSignalError('');

    getSignal(selectedTicker)
      .then((result) => {
        if (active) {
          setSignal(result);
        }
      })
      .catch((error) => {
        if (active) {
          setSignal(null);
          setSignalError(error.message || 'Unable to load live signal.');
        }
      })
      .finally(() => {
        if (active) {
          setSignalLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [selectedTicker]);

  const filtered = useMemo(() => {
    if (!data) return [];
    if (filter === 'All') return data.candidates;
    return data.candidates.filter((c) => c.stage === filter);
  }, [data, filter]);

  if (!data) {
    return <div className="loading-screen"><div className="loading-orb" /><strong>Loading FlowHunter…</strong></div>;
  }

  const selected = data.candidates.find((c) => c.ticker === selectedTicker) ?? data.candidates[0];
  const top = data.candidates[0];
  const selectedPrints = data.prints[selected.ticker] ?? [];
  const updated = data.status.updatedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' });

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-group">
          <img className="brand-logo" src="/flowhunter-logo.jpeg" alt="FlowHunter logo" />
          <div>
            <h1>FlowHunter</h1>
            <p>Options-flow accumulation intelligence</p>
          </div>
        </div>
        <div className="status-cluster" title="This build uses static demo data">
          <span className="status-dot demo" />
          <div><strong>Demo signals + Live market context</strong><small>Updated {updated} · {data.status.delayLabel}</small></div>
        </div>
      </header>

      <section className="hero-card">
        <div className="hero-copy">
          <div className="eyebrow">Top demo opportunity</div>
          <div className="hero-title-row">
            <div><h2>{top.ticker}</h2><span>{top.company}</span></div>
            <StageBadge stage={top.stage} />
          </div>
          <p>{top.setup}</p>
          <div className="signal-reasons">
            <span>3-session accumulation</span>
            <span>+{top.oiChange}% OI</span>
            <span>${top.premium.d3}M bullish premium / 3D</span>
            <span>{top.similarity}% PCG similarity</span>
          </div>
        </div>
        <div className="hero-score-area">
          <ScoreRing value={top.opportunity} label="Demo Opportunity" />
          <div className="hero-mini-scores">
            <div><span>Demo Flow</span><strong>{top.flow}</strong></div>
            <div><span>Demo Upside</span><strong>{top.upside}</strong></div>
          </div>
        </div>
      </section>

      <section className="toolbar" aria-label="Candidate filters">
        <div className="filter-group">
          {filters.map(([label, value]) => (
            <button key={value} className={filter === value ? 'active' : ''} onClick={() => setFilter(value)}>{label}</button>
          ))}
        </div>
        <div className="toolbar-note">{filtered.length} qualifying setup{filtered.length === 1 ? '' : 's'}</div>
      </section>

      <main className="dashboard-grid">
        <section className="panel candidates-panel">
          <div className="panel-heading">
            <div><span className="section-kicker">Demo signals</span><h3>Candidate leaderboard</h3></div>
            <span>Ranked by opportunity</span>
          </div>
          <CandidateTable rows={filtered} selectedTicker={selected.ticker} onSelect={(ticker) => { setSelectedTicker(ticker); setDetailTab('overview'); }} />
        </section>

        <section className="panel detail-panel">
          <div className="detail-header">
            <div>
              <div className="detail-symbol"><h3>{selected.ticker}</h3><span>${selected.price.toFixed(2)}</span></div>
              <p>{selected.company} · {selected.setup}</p>
            </div>
            <StageBadge stage={selected.stage} />
          </div>

          <div className="detail-score-strip">
            <div className="opportunity-block"><span>Demo Opportunity</span><strong>{selected.opportunity}</strong><small>/100</small></div>
            <div><span>Demo Flow</span><strong>{selected.flow}</strong></div>
            <div><span>Demo Upside</span><strong>{selected.upside}</strong></div>
            <div><span>PCG similarity</span><strong>{selected.similarity}%</strong></div>
            <div><span>OI change</span><strong>+{selected.oiChange}%</strong></div>
            <div><span>YTD</span><strong className={selected.ytd > 0 ? 'positive' : 'negative'}>{selected.ytd > 0 ? '+' : ''}{selected.ytd}%</strong></div>
          </div>

          <div className="panel" style={{ marginBottom: "14px", padding: "14px 16px" }}>
          <div className="panel-heading" style={{ marginBottom: "10px" }}>
            <div>
              <span className="section-kicker">Live signal</span>
              <h3>{selected.ticker} market context</h3>
            </div>
            <span>{signalLoading ? "Loading…" : signal?.stage || "Unavailable"}</span>
          </div>

          {signalError ? (
            <div className="empty-state">
              <strong>Live signal unavailable</strong>
              <span>{signalError}</span>
            </div>
          ) : signal ? (
            <div className="detail-score-strip">
              <div className="opportunity-block">
                <span>Stock context</span>
                <strong>{signal.stockContextScore}</strong>
                <small>/100</small>
              </div>
              <div>
                <span>Flow score</span>
                <strong>{signal.flowScore ?? "Pending"}</strong>
              </div>
              <div>
                <span>Opportunity</span>
                <strong>{signal.opportunityScore ?? "Pending"}</strong>
              </div>
              <div>
                <span>5D return</span>
                <strong className={signal.factors.momentum.return5dPct >= 0 ? "positive" : "negative"}>
                  {signal.factors.momentum.return5dPct > 0 ? "+" : ""}
                  {signal.factors.momentum.return5dPct}%
                </strong>
              </div>
              <div>
                <span>Relative volume</span>
                <strong>{signal.factors.volume.relativeVolume}x</strong>
              </div>
          {signal.optionsContext?.available && (
            <>
              <div>
                <span>Options contracts</span>
                <strong>{signal.optionsContext.countFetched}</strong>
              </div>
              <div>
                <span>Calls / puts</span>
                <strong>{signal.optionsContext.callCount} / {signal.optionsContext.putCount}</strong>
              </div>
              <div>
                <span>Expirations</span>
                <strong>{signal.optionsContext.expirationCount}</strong>
              </div>
              <div>
                <span>Nearest expiry</span>
                <strong>{signal.optionsContext.nearestExpiration ?? "—"}</strong>
              </div>
              <div>
                <span>Call share</span>
                <strong>{signal.optionsContext.chainStructure?.callSharePct ?? "—"}%</strong>
              </div>
              <div>
                <span>Put share</span>
                <strong>{signal.optionsContext.chainStructure?.putSharePct ?? "—"}%</strong>
              </div>
              <div>
                <span>Nearest-expiry concentration</span>
                <strong>{signal.optionsContext.chainStructure?.nearestExpirationConcentrationPct ?? "—"}%</strong>
              </div>
<div>
  <span>Near-money contracts</span>
  <strong>{signal.optionsContext.nearMoneyContext?.contractCount ?? "—"}</strong>
</div>
<div>
  <span>ITM</span>
  <strong>{signal.optionsContext.nearMoneyContext?.itmCount ?? "—"}</strong>
  <span>
    {signal.optionsContext.nearMoneyContext?.moneynessBreakdown?.ITM?.calls ?? "—"}C / {signal.optionsContext.nearMoneyContext?.moneynessBreakdown?.ITM?.puts ?? "—"}P
  </span>
</div>
<div>
  <span>ATM</span>
  <strong>{signal.optionsContext.nearMoneyContext?.atmCount ?? "—"}</strong>
  <span>
    {signal.optionsContext.nearMoneyContext?.moneynessBreakdown?.ATM?.calls ?? "—"}C / {signal.optionsContext.nearMoneyContext?.moneynessBreakdown?.ATM?.puts ?? "—"}P
  </span>
</div>
<div>
  <span>OTM</span>
  <strong>{signal.optionsContext.nearMoneyContext?.otmCount ?? "—"}</strong>
  <span>
    {signal.optionsContext.nearMoneyContext?.moneynessBreakdown?.OTM?.calls ?? "—"}C / {signal.optionsContext.nearMoneyContext?.moneynessBreakdown?.OTM?.puts ?? "—"}P
  </span>
</div>
            </>
          )}
            </div>
          ) : (
            <div className="empty-state">
              <strong>No live signal loaded</strong>
            </div>
          )}
        </div>

        <div className="detail-tabs" role="tablist">
            <button className={detailTab === 'overview' ? 'active' : ''} onClick={() => setDetailTab('overview')}>Overview</button>
            <button className={detailTab === 'why' ? 'active' : ''} onClick={() => setDetailTab('why')}>Why this score</button>
            <button className={detailTab === 'prints' ? 'active' : ''} onClick={() => setDetailTab('prints')}>Qualifying prints</button>
          </div>

          {detailTab === 'overview' && (
            <div className="chart-grid">
              <div className="chart-card"><div className="chart-title"><div><span>Flow score</span><h4>5-session acceleration</h4></div><b>+{selected.trend.at(-1) - selected.trend[0]}</b></div><LineChart values={selected.trend} /></div>
              <div className="chart-card"><div className="chart-title"><div><span>Premium</span><h4>Cumulative bullish premium</h4></div><b>${selected.premium.d10}M</b></div><BarChart values={[{ label: '3D', value: selected.premium.d3 }, { label: '5D', value: selected.premium.d5 }, { label: '10D', value: selected.premium.d10 }]} /></div>
            </div>
          )}

          {detailTab === 'why' && <EvidenceBreakdown candidate={selected} />}

          {detailTab === 'prints' && (
            <div className="prints-section">
              {selectedPrints.length ? (
                <div className="table-wrap"><table><thead><tr><th>Date</th><th>Contract</th><th>Size</th><th>V/OI</th><th>Premium</th><th>Read</th></tr></thead><tbody>{selectedPrints.map((p, i) => <tr key={`${p.contract}-${i}`}><td>{p.date}</td><td>{p.contract}</td><td>{p.size}</td><td>{p.voi}</td><td>{p.premium}</td><td>{p.read}</td></tr>)}</tbody></table></div>
              ) : <div className="empty-state"><strong>No detailed print feed for {selected.ticker}</strong><span>The production API can populate qualifying prints here.</span></div>}
            </div>
          )}
        </section>

        <section className="panel logic-panel">
          <div className="panel-heading"><div><span className="section-kicker">Model</span><h3>Scanner logic</h3></div><span>Explainable scoring</span></div>
          <div className="logic-grid">
            {[
              ['Flow persistence', '20%'], ['Opening OI evidence', '18%'], ['Execution quality', '12%'],
              ['Premium commitment', '10%'], ['Strike / expiry clustering', '10%'], ['Underlying upside', '10%'],
              ['Price confirmation', '8%'], ['Relative activity', '5%'], ['IV structure', '4%'], ['Stock volume', '3%']
            ].map(([label, weight]) => <div className="logic-card" key={label}><span>{label}</span><strong>{weight}</strong></div>)}
          </div>
          <div className="formula-callout"><span>Opportunity score</span><strong>70% Flow + 30% Upside</strong><small>Current prototype weighting — validate against historical outcomes before relying on it.</small></div>
        </section>

        <section className="panel alerts-panel">
          <div className="panel-heading"><div><span className="section-kicker">Monitoring</span><h3>Alert center</h3></div><span>Most recent</span></div>
          <div className="alert-stack">
            {data.alerts.map((alert) => (
              <article className="alert-card" key={`${alert.ticker}-${alert.time}`}>
                <div className="alert-main"><div className="alert-symbol">{alert.ticker}</div><div><div className="alert-topline"><StageBadge stage={alert.stage} /><time>{alert.time}</time></div><p>{alert.body}</p></div></div>
                <button className="text-button" onClick={() => { setSelectedTicker(alert.ticker); setDetailTab('why'); window.scrollTo({ top: 420, behavior: 'smooth' }); }}>Inspect signal →</button>
              </article>
            ))}
          </div>
        </section>

        <OptionsLookup initialTicker={selectedTicker} />

      <section className="panel validation-panel">
          <div className="panel-heading"><div><span className="section-kicker">Validation</span><h3>Historical outcomes</h3></div><span>Production milestone</span></div>
          <div className="validation-empty">
            <div className="validation-icon">↗</div>
            <div><strong>Backtesting is the next credibility layer</strong><p>Once real historical data is connected, show hit rate, median forward return, max favorable excursion, and sample size by score band. This prevents the scoring model from becoming a visually convincing but unvalidated signal.</p></div>
          </div>
        </section>
      </main>

      <footer>
        <img src="/flowhunter-logo.jpeg" alt="" />
        <div><strong>FlowHunter v0.2</strong><span>Demo data only · Not investment advice · Real-time production mode requires licensed market and options data.</span></div>
      </footer>
    </div>
  );
}
