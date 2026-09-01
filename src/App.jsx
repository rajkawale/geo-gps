import React, { useState, useEffect } from 'react'
import { NAV, STEPS, SCOPE_FIELDS, PARAM_FIELDS, chatScript, guidanceSections, mockPrompts } from './data.js'
import BrandStrategyModal from './BrandStrategyModal.jsx'
import { PromptPlanReview, CompletedScreen } from './ReviewScreens.jsx'

export default function App() {
  const [stepIndex, setStepIndex] = useState(-1)
  const [values, setValues] = useState({})
  const [phase, setPhase] = useState('scoping') // scoping | review | generation
  const [bsOpen, setBsOpen] = useState(false)
  const [bsStatus, setBsStatus] = useState(null)

  const atEnd = stepIndex >= chatScript.length - 1
  const bsDone = !!bsStatus

  function advance() {
    if (stepIndex < chatScript.length - 1) {
      const next = stepIndex + 1
      setStepIndex(next)
      const s = chatScript[next]
      if (s.set) setValues(v => ({ ...v, ...s.set }))
    }
  }

  function confirmBrandStrategy(resolution) {
    setBsStatus(resolution)
    const label = resolution === 'skip' ? 'Skipped'
      : resolution === 'text' ? 'Added as text'
      : 'Validated · uploaded'
    setValues(v => ({ ...v, "Brand Strategy": label }))
    setBsOpen(false)
  }

  // Enter advances the primary action during scoping
  React.useEffect(() => {
    function onKey(e) {
      if (e.key !== 'Enter' || phase !== 'scoping' || bsOpen) return
      if (stepIndex < chatScript.length - 1) advance()
      else if (!bsDone) setBsOpen(true)
      else setPhase('review')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, stepIndex, bsOpen, bsDone])

  const activeStep = ({ scoping: 1, review: 1, plan: 3, generation: 2, completed: 5 })[phase] || 1

  return (
    <div className={`layout ${phase === 'scoping' ? 'with-config' : ''}`}>
      <LeftNav />
      <div className="main">
        <TopBar active={activeStep} />

        {phase === 'scoping' && (
          <>
            <ScopeChat stepIndex={stepIndex} />
            <InputBar
              atEnd={atEnd}
              bsDone={bsDone}
              onAdvance={advance}
              onBrandStrategy={() => setBsOpen(true)}
              onReview={() => setPhase('review')}
            />
          </>
        )}

        {phase === 'review' && (
          <ReviewScreen
            values={values}
            onBack={() => setPhase('scoping')}
            onContinue={() => setPhase('plan')}
          />
        )}

        {phase === 'plan' && (
          <PromptPlanReview onBack={() => setPhase('review')} onContinue={() => setPhase('generation')} />
        )}

        {phase === 'generation' && (
          <GenerationView values={values} onBack={() => setPhase('plan')} onNext={() => setPhase('completed')} />
        )}

        {phase === 'completed' && (
          <CompletedScreen onBack={() => setPhase('generation')} />
        )}
      </div>

      {phase === 'scoping' && <ConfigPanel values={values} />}

      <BrandStrategyModal
        open={bsOpen}
        values={values}
        onClose={() => setBsOpen(false)}
        onConfirmed={confirmBrandStrategy}
      />
    </div>
  )
}

/* ---------------- chrome ---------------- */

function LeftNav() {
  return (
    <aside className="nav">
      <div className="logo"><div className="m">GG</div><span className="logo-text">GEO GPS</span></div>
      {NAV.map(n => (
        <div key={n.label} className={`nav-item ${n.active ? 'active' : ''}`}>
          <span className="ic" style={{ background: n.color }} /><span className="nav-label">{n.label}</span>
        </div>
      ))}
    </aside>
  )
}

function TopBar({ active }) {
  return (
    <div className="topbar">
      <div className="stepper">
        {STEPS.map((s, i) => {
          const n = i + 1
          const cls = n === active ? 'active' : n < active ? 'done' : ''
          return (
            <React.Fragment key={s}>
              <div className={`step ${cls}`}><div className="n">{n < active ? '✓' : n}</div><span className="step-label">{s}</span></div>
              {i < STEPS.length - 1 && <div className="step-sep" />}
            </React.Fragment>
          )
        })}
      </div>
      <div className="userchip"><div className="av">RK</div><span className="userchip-name">Signed in</span></div>
    </div>
  )
}

function ConfigPanel({ values }) {
  const row = k => (
    <div key={k} className="cfg-field">
      <span className="k">{k}</span>
      <span className={`v ${values[k] ? (k === 'Brand Strategy' ? 'added' : '') : 'empty'}`}>{values[k] || '-'}</span>
    </div>
  )
  return (
    <aside className="config">
      <h3>Configuration</h3>
      <div className="sub">Real-time prompt settings</div>
      <div className="cfg-group">Scope</div>
      {SCOPE_FIELDS.map(row)}
      <div className="cfg-group">Parameters</div>
      {PARAM_FIELDS.map(row)}
    </aside>
  )
}

/* ---------------- scoping chat ---------------- */

function ScopeChat({ stepIndex }) {
  const ref = React.useRef(null)
  React.useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight
  }, [stepIndex])
  return (
    <div className="chat" ref={ref}>
      <div className="welcome">Welcome to GEO GPS!</div>
      <div className="chat-hint">Answer a few questions to scope the run — press Enter to continue.</div>
      {chatScript.slice(1, stepIndex + 1).map((s, i) => <Step key={i} s={s} />)}
    </div>
  )
}

function Step({ s }) {
  return (
    <React.Fragment>
      <div className="msg agent"><div className="bubble">{s.q}</div>
        {s.opts && (
          <div className="optgroup">
            <div className="cap">{s.type === 'multi' ? 'Select one or more options' : 'Select an option'}</div>
            <div className="opts">{s.opts.map(o => <div key={o} className={`opt ${o === s.a ? 'sel' : ''}`}>{o}</div>)}</div>
            <button className="confirm-sel">Confirm selection</button>
          </div>
        )}
      </div>
      <div className="msg user"><div className="bubble">{s.a}</div></div>
      <div className="confirm">✓ {s.note}</div>
    </React.Fragment>
  )
}

function InputBar({ atEnd, bsDone, onAdvance, onBrandStrategy, onReview }) {
  let cta
  if (!atEnd) {
    cta = <button className="cont" onClick={onAdvance}>Continue</button>
  } else if (!bsDone) {
    cta = <button className="cont" onClick={onBrandStrategy}>Brand strategy →</button>
  } else {
    cta = <button className="cont" onClick={onReview}>Review configuration →</button>
  }
  return (
    <div className="inputbar">
      <div className="box">Type your response…</div>
      <button className="act">Start Over</button>
      <button className="act">Back</button>
      {cta}
    </div>
  )
}

/* ---------------- review screen (matches the live product) ---------------- */

function ReviewScreen({ values, onBack, onContinue }) {
  const fields = [
    ["DISEASE", values.Disease],
    ["INDICATION", values.Indication],
    ["BRAND", values.Brand],
    ["MOLECULE", values.Molecule],
    ["MARKETS", values.Markets],
    ["AUDIENCE", values.Audience],
    ["STAGE", values.Stage],
    ["INTENT", values.Intent],
    ["BRAND LIFECYCLE", values["Brand Lifecycle"]],
    ["UNIVERSE TYPE", values["Prompt Orientation"]],
    ["FOCUS / THEME", values.Themes],
    ["KEYWORDS", values.Keywords],
    ["COUNT", values.Count],
    ["BRAND STRATEGY", values["Brand Strategy"]],
  ]
  return (
    <div className="view review">
      <h2>Review your configuration</h2>
      <p className="sub">Confirm all fields are correct before continuing.</p>

      <div className="rv-card">
        <div className="card-head">
          <span className="card-title">Runtime Context Package</span>
          <span className="badge warning">⚠ Generated with Warnings</span>
          <span className="badge muted">v2</span>
          <button className="btn-ghost">↻ Refresh</button>
        </div>
        <div className="rcp-summary">Cardiovascular and Metabolic Diseases · India · en-US · Patient · Treatment Initiation · Lifestyle &amp; Weight Management</div>
        <div className="banner warn" style={{ margin: '10px 0 8px' }}>⚠ No active guardrails found</div>
        <div className="banner warn">Runtime context package was generated with missing signal inputs. Some guidance may be incomplete.</div>
        <div className="rcp-lock">Lock this package to confirm it as the input for prompt planning.
          <button className="btn btn-s btn-sm" style={{ marginLeft: 'auto' }}>🔒 Lock package</button>
        </div>
        <div className="rcp-actions">
          <button className="btn-ghost">↻ Regenerate package</button>
          <button className="btn-ghost">💾 Save draft</button>
          <button className="btn-ghost">Version history</button>
        </div>
      </div>

      <div className="rv-card">
        <div className="card-head">
          <span className="card-title">Scope Summary</span>
          <span className="badge blue">SCOPE</span>
        </div>
        <div className="rcp-summary">Disease: Cardiovascular and Metabolic Diseases, Markets: India, Persona: Patient, Stage: Treatment Initiation, Intents: Lifestyle &amp; Weight Management</div>
        <div className="rcp-summary muted">Unbranded · 47ab167c-14a6-6dbc-a371 · 13 prompts</div>
      </div>

      <div className="rv-card">
        <div className="card-head"><span className="card-title">Guidance sections</span></div>
        {guidanceSections.map(g => (
          <div key={g.label} className="guidance-item">
            <span>{g.label}</span>
            <span className={`badge ${g.tone}`}>{g.badge}</span>
          </div>
        ))}
      </div>

      <div className="rv-card">
        <div className="card-head"><span className="card-title">Confirm all fields</span></div>
        {fields.map(([k, v]) => (
          <div key={k} className="field-row">
            <span className="field-k">{k}</span>
            <span className={`field-v ${k === 'BRAND STRATEGY' ? 'blue' : ''}`}>{v || 'Not set (optional)'}</span>
            {k === 'BRAND STRATEGY'
              ? <span className="badge green">✓ Validated</span>
              : <button className="btn-edit">Edit</button>}
          </div>
        ))}
      </div>

      <div className="view-actions spread">
        <button className="btn btn-s" onClick={onBack}>Back to chat</button>
        <button className="btn btn-p" onClick={onContinue}>Confirm Scope &amp; Continue</button>
      </div>
    </div>
  )
}

/* ---------------- generation (emits mock prompts) ---------------- */

function GenerationView({ values, onBack, onNext }) {
  const [state, setState] = useState('generating')
  useEffect(() => {
    const t = setTimeout(() => setState('done'), 1500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="view gen">
      <div className="gen-head">
        <div>
          <h2>Prompt Generation Preview</h2>
          <p className="sub">{values.Count} prompts · 1 Sept 2026, 08:25</p>
        </div>
        <button className="btn btn-s">↻ Regenerate</button>
      </div>

      {state === 'generating' ? (
        <div className="gen-center">
          <div className="spin-big" />
          <div className="big">Generating your prompts…</div>
        </div>
      ) : (
        <div className="prompt-list">
          {mockPrompts.map((p, i) => (
            <div key={i} className="prompt-row">
              <span className="prompt-num">{i + 1}</span>
              <span className="prompt-text">{p}</span>
            </div>
          ))}
        </div>
      )}

      <div className="view-actions spread">
        <button className="btn btn-s" onClick={onBack}>Back</button>
        <button className="btn btn-p" disabled={state === 'generating'} onClick={onNext}>Next →</button>
      </div>
    </div>
  )
}
