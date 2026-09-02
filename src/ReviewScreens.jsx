import React, { useState, useEffect, useMemo } from 'react'
import { CATEGORIES, buildMix, buildPrompts } from './data.js'
import { Icon, Btn, IconBtn, Tag, Card, Banner, Kbd } from './ui.jsx'

/* ============================================================ plan review */

/**
 * One screen for the whole plan: the strategic narrative, the category
 * direction it implies, and the actual mix that will be generated. Three
 * screens in the wireframe, but they answer one question — "what are we about
 * to generate, and why" — so they read better together.
 */
export function PlanReview({ run, setRun, onRegenerate, onBack, onContinue }) {
  const [showEvidence, setShowEvidence] = useState(false)
  const s = run.scenario
  const n = s.narrative
  const mix = run.mix
  const allocated = mix.rows.reduce((t, r) => t + r.count, 0)
  const off = allocated - run.count

  function adjust(name, delta) {
    setRun(r => {
      const rows = r.mix.rows.map(row =>
        row.name === name ? { ...row, count: Math.max(0, row.count + delta) } : row
      )
      const total = rows.reduce((t, x) => t + x.count, 0) || 1
      const withPct = rows.map(row => ({ ...row, pct: Math.round((row.count / total) * 100) }))
      const brandedCount = withPct.filter(x => x.branded).reduce((t, x) => t + x.count, 0)
      const nextMix = {
        ...r.mix, rows: withPct, total,
        branded: Math.round((brandedCount / total) * 100),
        unbranded: 100 - Math.round((brandedCount / total) * 100),
      }
      return { ...r, mix: nextMix, prompts: buildPrompts(r.scenario, nextMix) }
    })
  }

  function reset() {
    setRun(r => {
      const mix = buildMix(r.scenario, r.count)
      return { ...r, mix, prompts: buildPrompts(r.scenario, mix) }
    })
  }

  const columns = [
    { key: 'WIN AREA', ...n.win },
    { key: 'FOCUS AREA', ...n.focus },
    { key: 'UNIQUE PROPOSITION', ...n.proposition },
  ]

  return (
    <div className="view">
      <div className="view-head">
        <div>
          <h1 className="view-title">Prompt plan review</h1>
          <p className="view-sub">
            What GEO will generate for {s.brand}, and the strategy reasoning behind each weight.
          </p>
        </div>
        <Btn variant="outlined" icon="refresh" onClick={onRegenerate}>Regenerate plan</Btn>
      </div>

      <Card title="Strategic points"
        right={<Tag tone="primary">AI-generated · grounded</Tag>}>
        <p className="card-lede">
          Synthesized from the brand plan, the deck and live web research — a consulting-strategy
          pass, not a human-reviewed sign-off.
        </p>
        <div className="cols-3">
          {columns.map(c => (
            <div key={c.key} className="narrative-col">
              <div className="nc-key">{c.key}</div>
              <h4 className="nc-title">{c.title}</h4>
              <ul className="nc-points">{c.points.map((p, i) => <li key={i}>{p}</li>)}</ul>
            </div>
          ))}
        </div>

        <button className="disclosure" onClick={() => setShowEvidence(v => !v)}
          aria-expanded={showEvidence}>
          <Icon name={showEvidence ? 'down' : 'chevron'} size={14} />
          {showEvidence ? 'Hide' : 'Show'} the inputs it reasoned over
        </button>
        {showEvidence && (
          <div className="cols-3 is-evidence">
            <div className="narrative-col">
              <div className="nc-key">BRAND PRIORITY</div>
              <ul className="nc-points">{s.priorities.map(p => <li key={p}>{p}</li>)}</ul>
            </div>
            <div className="narrative-col">
              <div className="nc-key">KEY CHARACTERISTICS</div>
              <ul className="nc-points">{n.characteristics.map(p => <li key={p}>{p}</li>)}</ul>
            </div>
            <div className="narrative-col">
              <div className="nc-key">CLINICAL EVIDENCE</div>
              <ul className="nc-points">{n.evidence.map(p => <li key={p}>{p}</li>)}</ul>
            </div>
          </div>
        )}
      </Card>

      <div className="cols-2">
        <Card title="Category direction">
          <table className="tbl">
            <thead><tr><th>Category</th><th className="ta-r">Direction</th></tr></thead>
            <tbody>
              {run.strategy.categoryDirection.map(([c, d]) => (
                <tr key={c}>
                  <td>{c}</td>
                  <td className="ta-r"><Tag tone={d === 'High' ? 'error' : d === 'Moderate' ? 'warning' : 'neutral'}>{d}</Tag></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card title="Strategy blueprint">
          <dl className="kv">
            {run.strategy.blueprint.map(([k, v]) => (
              <React.Fragment key={k}><dt>{k}</dt><dd>{v}</dd></React.Fragment>
            ))}
          </dl>
        </Card>
      </div>

      <Card title="Recommended direction">
        <p className="card-lede">{run.strategy.recommended}</p>
        <Banner tone="warning">{run.strategy.risks}</Banner>
        <Banner tone="info">{run.strategy.alignment}</Banner>
      </Card>

      <Card
        title="Category mix"
        right={<>
          <Tag tone="neutral">{mix.unbranded}% unbranded</Tag>
          <Tag tone="primary">{mix.branded}% branded</Tag>
          <Btn size="sm" variant="text" icon="refresh" onClick={reset}>Reset</Btn>
        </>}
      >
        <p className="card-lede muted">{mix.lifecycleNote} · adjust any row and the prompt set rebuilds.</p>
        <table className="tbl mix">
          <thead>
            <tr><th>Category</th><th className="ta-c">Share</th><th className="ta-c">Prompts</th><th>Why this weight</th></tr>
          </thead>
          <tbody>
            {mix.rows.map(r => (
              <tr key={r.name}>
                <td>
                  {r.name}
                  {r.branded && <Tag tone="primary" className="inline-tag">branded</Tag>}
                </td>
                <td className="ta-c">
                  <span className="bar" style={{ '--w': `${Math.min(100, r.pct * 3)}%` }} />
                  <span className="bar-pct">{r.pct}%</span>
                </td>
                <td className="ta-c">
                  <div className="stepper-inline">
                    <button onClick={() => adjust(r.name, -1)} aria-label={`One fewer ${r.name}`} disabled={r.count === 0}>−</button>
                    <span>{r.count}</span>
                    <button onClick={() => adjust(r.name, 1)} aria-label={`One more ${r.name}`}>+</button>
                  </div>
                </td>
                <td className="muted">{r.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={`mix-total ${off !== 0 ? 'is-off' : ''}`}>
          {allocated} of {run.count} prompts allocated
          {off !== 0 && <> · <b>{off > 0 ? `${off} over` : `${-off} short`}</b> the requested count</>}
        </div>
      </Card>

      <div className="view-foot">
        <Btn variant="text" icon="back" onClick={onBack}>Back</Btn>
        <div className="foot-right">
          <span className="foot-note"><Kbd>Enter</Kbd> to approve</span>
          <Btn variant="filled" onClick={onContinue} iconEnd="chevron">Approve &amp; generate</Btn>
        </div>
      </div>
    </div>
  )
}

/* ============================================================= generation */

export function GenerationView({ run, setRun, onRegenerate, onBack, onContinue, onFlash, onGeneratingChange }) {
  const [state, setState] = useState('generating')
  const [filter, setFilter] = useState('All')
  const [busy, setBusy] = useState(null)

  useEffect(() => {
    setState('generating')
    onGeneratingChange?.(true)
    const t = setTimeout(() => { setState('done'); onGeneratingChange?.(false) }, 1400)
    return () => clearTimeout(t)
  }, [run.runId])

  const categories = useMemo(
    () => ['All', ...new Set(run.prompts.map(p => p.category))],
    [run.prompts]
  )
  const shown = filter === 'All' ? run.prompts : run.prompts.filter(p => p.category === filter)

  function rerollOne(index) {
    const target = run.prompts[index]
    setBusy(index)
    setTimeout(() => {
      setRun(r => {
        const cat = CATEGORIES.find(c => c.name === target.category)
        const used = new Set(r.prompts.map(p => p.text))
        const options = cat.templates
          .map(t => t
            .replace(/{brand}/g, r.scenario.brand)
            .replace(/{molecule}/g, r.scenario.molecule)
            .replace(/{diseaseShort}/g, r.scenario.diseaseShort)
            .replace(/{competitor}/g, r.scenario.competitors[Math.floor(Math.random() * r.scenario.competitors.length)])
            .replace(/{market}/g, r.scenario.markets[0]))
          .filter(t => !used.has(t))
        const next = options.length
          ? options[Math.floor(Math.random() * options.length)]
          : target.text
        const prompts = [...r.prompts]
        prompts[index] = { ...target, text: next }
        return { ...r, prompts }
      })
      setBusy(null)
    }, 450)
  }

  function removeOne(index) {
    setRun(r => ({ ...r, prompts: r.prompts.filter((_, i) => i !== index) }))
    onFlash('Prompt removed')
  }

  return (
    <div className="view">
      <div className="view-head">
        <div>
          <h1 className="view-title">Prompt generation preview</h1>
          <p className="view-sub">
            {run.prompts.length} prompts · {run.scenario.brand} · {run.stamp} · run {run.runId.slice(0, 8)}
          </p>
        </div>
        <Btn variant="outlined" icon="refresh" onClick={onRegenerate}>Regenerate all</Btn>
      </div>

      {state === 'generating' ? (
        <div className="generating">
          <span className="spinner spinner-lg" />
          <p className="gen-line">Generating {run.count} prompts across {run.mix.rows.length} categories…</p>
        </div>
      ) : (
        <>
          <div className="filters" role="tablist" aria-label="Filter by category">
            {categories.map(c => (
              <button key={c} role="tab" aria-selected={filter === c}
                className={`filter ${filter === c ? 'is-on' : ''}`} onClick={() => setFilter(c)}>
                {c}
                <span className="filter-n">
                  {c === 'All' ? run.prompts.length : run.prompts.filter(p => p.category === c).length}
                </span>
              </button>
            ))}
          </div>

          <ul className="prompts">
            {shown.map((p) => {
              const index = run.prompts.indexOf(p)
              return (
                <li key={`${p.text}-${index}`} className={`prompt ${busy === index ? 'is-busy' : ''}`}>
                  <span className="prompt-n">{index + 1}</span>
                  <div className="prompt-main">
                    <p className="prompt-text">{p.text}</p>
                    <div className="prompt-meta">
                      <Tag tone="neutral">{p.category}</Tag>
                      <Tag tone={p.branded ? 'primary' : 'neutral'}>{p.branded ? 'branded' : 'unbranded'}</Tag>
                    </div>
                  </div>
                  <div className="prompt-actions">
                    <IconBtn name="refresh" label="Regenerate this prompt" size={16} onClick={() => rerollOne(index)} />
                    <IconBtn name="copy" label="Copy" size={16}
                      onClick={() => { navigator.clipboard?.writeText(p.text); onFlash('Copied') }} />
                    <IconBtn name="trash" label="Remove" size={16} onClick={() => removeOne(index)} />
                  </div>
                </li>
              )
            })}
          </ul>
        </>
      )}

      <div className="view-foot">
        <Btn variant="text" icon="back" onClick={onBack}>Back to plan</Btn>
        <div className="foot-right">
          <span className="foot-note">{run.prompts.length} prompts ready</span>
          <Btn variant="filled" disabled={state === 'generating'} onClick={onContinue} iconEnd="chevron">
            Send for approval
          </Btn>
        </div>
      </div>
    </div>
  )
}

/* ============================================================== completed */

export function CompletedScreen({ run, onBack, onRestart }) {
  const branded = run.prompts.filter(p => p.branded).length
  const stats = [
    ['Prompts generated', run.prompts.length],
    ['Categories covered', new Set(run.prompts.map(p => p.category)).size],
    ['Branded / unbranded', `${branded} / ${run.prompts.length - branded}`],
    ['Competitors in scope', run.scenario.competitors.length],
  ]
  return (
    <div className="view">
      <div className="done">
        <span className="done-mark"><Icon name="check" size={28} /></span>
        <h1 className="view-title">Universe sent for approval</h1>
        <p className="view-sub">
          {run.prompts.length} prompts for {run.scenario.brand} · {run.scenario.markets.join(', ')} ·
          run {run.runId.slice(0, 8)}
        </p>
        <div className="stats">
          {stats.map(([k, v]) => (
            <div key={k} className="stat"><span className="stat-v">{v}</span><span className="stat-k">{k}</span></div>
          ))}
        </div>
      </div>

      <div className="view-foot">
        <Btn variant="text" icon="back" onClick={onBack}>Back to generation</Btn>
        <div className="foot-right">
          <Btn variant="outlined" icon="refresh" onClick={onRestart}>Start another universe</Btn>
          <Btn variant="filled" iconEnd="chevron">Go to Approval Hub</Btn>
        </div>
      </div>
    </div>
  )
}
