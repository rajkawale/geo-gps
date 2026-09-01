import React from 'react'
import { promptStrategy, promptMix, battleNarrative } from './data.js'

export function PromptStrategyReview({ onBack, onContinue }) {
  return (
    <div className="view strategy">
      <div className="strategy-head">
        <div>
          <h2>Prompt Strategy Review</h2>
          <p className="sub">Prompt strategy derived from the approved brand strategy and context.</p>
        </div>
        <button className="btn btn-s btn-sm">Adjust Strategy</button>
      </div>

      <div className="banner info why-note"><b>Why:</b> Safety High — Brand Strategy tolerability priority + elevated current evidence demand.</div>

      <div className="runtime-bar">
        {promptStrategy.runtime.map(([k, v]) => (
          <span key={k} className="runtime-item"><b>{k}</b> {v}</span>
        ))}
      </div>

      <div className="rv-card">
        <div className="card-head"><span className="card-title">Prompt Strategy</span></div>
        <div className="rcp-summary">{promptStrategy.recommended}</div>
      </div>

      <div className="two-col">
        <div className="rv-card">
          <div className="card-head"><span className="card-title">Category Direction</span></div>
          <table className="tbl">
            <thead><tr><th>Category</th><th>Direction</th></tr></thead>
            <tbody>
              {promptStrategy.categoryDirection.map(([c, d]) => (
                <tr key={c}><td>{c}</td><td className={`dir dir-${d.toLowerCase()}`}>{d}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rv-card">
          <div className="card-head"><span className="card-title">Strategy Blueprint Summary</span></div>
          {promptStrategy.blueprint.map(([k, v]) => (
            <div key={k} className="rv-row"><span className="k">{k}</span><span className="v">{v}</span></div>
          ))}
        </div>
      </div>

      <div className="rv-card">
        <div className="card-head"><span className="card-title">Competitive / Journey Implications</span></div>
        <div className="rcp-summary">{promptStrategy.implications}</div>
      </div>
      <div className="rv-card">
        <div className="card-head"><span className="card-title">Risks &amp; Depriorities</span></div>
        <div className="rcp-summary">{promptStrategy.risks}</div>
        <div className="rcp-summary muted" style={{ marginTop: 8 }}>{promptStrategy.alignment}</div>
      </div>

      <div className="view-actions spread">
        <button className="btn btn-s" onClick={onBack}>Back to Context</button>
        <button className="btn btn-p" onClick={onContinue}>Approve &amp; Continue →</button>
      </div>
    </div>
  )
}

export function PromptMixPlanReview({ onBack, onContinue }) {
  return (
    <div className="view mix">
      <h2>Prompt Mix Plan Review</h2>
      <p className="sub">Exactly what the universe is about to generate, and why.</p>

      <div className="orient-bar">
        <span className="orient-label">Orientation</span>
        <span className="orient-pct"><b>{promptMix.unbranded}%</b> Unbranded</span>
        <span className="orient-pct"><b>{promptMix.branded}%</b> Branded</span>
        <span className="muted">{promptMix.lifecycleNote}</span>
      </div>

      <div className="rv-card">
        <table className="tbl mix-tbl">
          <thead><tr><th>Category</th><th>%</th><th>Count</th><th>Why this weight?</th></tr></thead>
          <tbody>
            {promptMix.categories.map(([c, pct, count, why]) => (
              <tr key={c}><td>{c}</td><td>{pct}</td><td>{count}</td><td className="why">{why}</td></tr>
            ))}
          </tbody>
        </table>
        <div className="mix-total">{promptMix.total}</div>
      </div>

      <div className="view-actions spread">
        <button className="btn btn-s" onClick={onBack}>Back to Prompt Strategy</button>
        <div className="btn-group">
          <button className="btn btn-s">Reset to Recommended</button>
          <button className="btn btn-s">Download Mix Plan</button>
          <button className="btn btn-p" onClick={onContinue}>Confirm Mix &amp; Generate →</button>
        </div>
      </div>
    </div>
  )
}

export function CompletedScreen({ onBack }) {
  return (
    <div className="view completed">
      <div className="done-hero">
        <div className="done-ck">✓</div>
        <div className="done-title">Universe complete</div>
        <div className="muted">13 prompts generated and ready for approval.</div>
      </div>
      <div className="view-actions spread">
        <button className="btn btn-s" onClick={onBack}>Back to Generation</button>
        <button className="btn btn-p">Go to Approval Hub →</button>
      </div>
    </div>
  )
}

export function BattleNarrative({ onBack, onContinue }) {
  const [showEvidence, setShowEvidence] = React.useState(false)
  return (
    <div className="view battle">
      <div className="strategy-head">
        <div>
          <h2>Strategic Points</h2>
          <p className="sub">AI-generated · grounded · 3 strategic points generated.</p>
        </div>
        <button className="btn btn-s btn-sm">↻ Regenerate strategic points</button>
      </div>

      <div className="banner info">{battleNarrative.summary}</div>

      <div className="battle-cols">
        {battleNarrative.columns.map(c => (
          <div key={c.key} className="battle-col">
            <div className="battle-col-head">{c.key}</div>
            <div className="battle-col-title">{c.title}</div>
            <ul className="battle-points">{c.points.map((p, i) => <li key={i}>{p}</li>)}</ul>
          </div>
        ))}
      </div>

      <div className="evidence-toggle" onClick={() => setShowEvidence(v => !v)}>
        {showEvidence ? 'Hide details ▾' : 'Show details — brand priority, characteristics, evidence ▸'}
      </div>
      {showEvidence && (
        <div className="battle-cols evidence">
          {battleNarrative.evidence.map(e => (
            <div key={e.key} className="battle-col">
              <div className="battle-col-head">{e.key}</div>
              <ul className="battle-points">{e.items.map((p, i) => <li key={i}>{p}</li>)}</ul>
            </div>
          ))}
        </div>
      )}

      <div className="view-actions spread">
        <button className="btn btn-s" onClick={onBack}>Back</button>
        <button className="btn btn-p" onClick={onContinue}>Proceed to Prompt Strategy →</button>
      </div>
    </div>
  )
}
