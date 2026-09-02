import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import {
  NAV, STEPS, SCOPE_FIELDS, PARAM_FIELDS,
  pickScenario, buildScript, buildStrategyLibrary, buildExtracted, stepFor,
  buildGuidance, buildMix, buildPrompts, buildStrategyDirection, newRunId, nowStamp,
} from './data.js'

import BrandStrategyModal from './BrandStrategyModal.jsx'
import { PlanReview, GenerationView, CompletedScreen } from './ReviewScreens.jsx'
import { AiMark, Icon, Btn, IconBtn, Tag, Card, Banner, Kbd } from './ui.jsx'

const SCREENS = ['chat', 'review', 'plan', 'generation', 'completed']

/* Build everything derived from one scenario. Called on load, on "new scenario",
   and on any regenerate — which is what makes the mock data differ every time. */
function makeRun(prevId) {
  const scenario = pickScenario(prevId)
  const script = buildScript(scenario)
  const count = Number(script.find(s => s.key === 'Count').a)
  const mix = buildMix(scenario, count)
  return {
    scenario,
    script,
    count,
    mix,
    prompts: buildPrompts(scenario, mix),
    strategy: buildStrategyDirection(scenario, mix),
    library: buildStrategyLibrary(scenario),
    extracted: buildExtracted(scenario),
    guidance: buildGuidance(scenario),
    runId: newRunId(),
    stamp: nowStamp(),
  }
}

export default function App() {
  const [run, setRun] = useState(() => makeRun())
  const [answers, setAnswers] = useState({})       // step key -> answer
  const [manual, setManual] = useState({})         // field -> value, edited on the review screen
  const [custom, setCustom] = useState({})         // step key -> ["Saudi Arabia", …] added via "Other"
  const [stepIndex, setStepIndex] = useState(0)    // current question
  const [answeredTo, setAnsweredTo] = useState(0)  // furthest question answered
  const [bs, setBs] = useState(null)               // brand strategy result
  const [bsOpen, setBsOpen] = useState(false)
  const [navOpen, setNavOpen] = useState(true)
  const [toast, setToast] = useState(null)
  const [generating, setGenerating] = useState(false)

  // ---- navigation stack: real back/forward, nothing is a one-way door ----
  // One piece of state, not two, so the pointer can never disagree with the
  // stack it points into.
  const [nav, setNav] = useState({ stack: ['chat'], idx: 0, furthest: 0 })
  const screen = nav.stack[nav.idx]

  const go = useCallback((next) => {
    setNav(n => {
      if (n.stack[n.idx] === next) return n
      const stack = [...n.stack.slice(0, n.idx + 1), next]
      return {
        stack, idx: stack.length - 1,
        // `furthest` only ever grows, so a screen you've reached once stays
        // reachable from the stepper even after you navigate back past it.
        furthest: Math.max(n.furthest, SCREENS.indexOf(next)),
      }
    })
  }, [])

  const canBack = nav.idx > 0
  const canFwd = nav.idx < nav.stack.length - 1
  const back = useCallback(() => setNav(n => n.idx > 0 ? { ...n, idx: n.idx - 1 } : n), [])
  const forward = useCallback(() => setNav(n => n.idx < n.stack.length - 1 ? { ...n, idx: n.idx + 1 } : n), [])
  const furthest = nav.furthest

  const script = run.script
  const step = script[stepIndex]
  const scopeDone = answeredTo >= script.length

  /* --------------------------------------------------------- derived values */

  const values = useMemo(() => {
    const v = {}
    script.forEach((s, i) => {
      if (i >= answeredTo) return
      Object.assign(v, s.set)                 // defaults the step resolves
      const a = answers[s.key]                // what the user actually chose
      if (a == null) return
      const written = Array.isArray(a) ? a.join(', ') : a
      if (s.optional && (!written || written === 'Skipped')) v[s.field] = 'Not set (optional)'
      else if (written) v[s.field] = written
    })
    // Fields the user handed to the brand strategy during validation, then any
    // direct edit made on the review screen — the last word wins.
    if (bs?.overrides) Object.assign(v, bs.overrides)
    Object.assign(v, manual)
    v['Brand Strategy'] = bs ? bs.label : 'Not set (optional)'
    return v
  }, [answers, answeredTo, script, bs, manual])

  // Live scope object the modal validates against.
  const scope = {
    Disease: values.Disease, Markets: values.Markets,
    Brand: values.Brand, Audience: values.Audience,
  }

  function flash(msg) {
    setToast(msg)
    clearTimeout(flash.t)
    flash.t = setTimeout(() => setToast(null), 2600)
  }

  /* -------------------------------------------------------- chat mechanics */

  function answer(value, { advance = true } = {}) {
    const key = script[stepIndex].key
    setAnswers(a => ({ ...a, [key]: value }))
    setAnsweredTo(n => Math.max(n, stepIndex + 1))
    if (advance) {
      if (stepIndex < script.length - 1) setStepIndex(i => i + 1)
      else if (!bs) setBsOpen(true)
    }
  }

  /** A value typed into an "Other" field becomes a real option from then on. */
  function addCustom(stepKey, value) {
    const v = value.trim()
    if (!v) return
    setCustom(c => {
      const list = c[stepKey] || []
      return list.includes(v) ? c : { ...c, [stepKey]: [...list, v] }
    })
  }

  /** Options for a step = its own list plus anything the user has added. */
  const optionsFor = useCallback(
    (s) => [...(s.opts || []), ...(custom[s.key] || [])],
    [custom]
  )

  function jumpToStep(key) {
    const target = stepFor(script, key)
    if (!target) return
    go('chat')
    setStepIndex(script.indexOf(target))
  }

  function newScenario() {
    const next = makeRun(run.scenario.id)
    setRun(next)
    setAnswers({}); setManual({}); setCustom({}); setStepIndex(0); setAnsweredTo(0); setBs(null)
    setNav({ stack: ['chat'], idx: 0, furthest: 0 })
    flash(`New scenario loaded — ${next.scenario.brand} · ${next.scenario.indication}`)
  }

  function regenerate() {
    const mix = buildMix(run.scenario, run.count)
    setRun(r => ({
      ...r, mix,
      prompts: buildPrompts(r.scenario, mix),
      strategy: buildStrategyDirection(r.scenario, mix),
      guidance: buildGuidance(r.scenario),
      runId: newRunId(), stamp: nowStamp(),
    }))
    flash('Regenerated — new mix, new prompts')
  }

  function applyStrategy(result) {
    setBs(result)
    setBsOpen(false)
    setAnsweredTo(n => Math.max(n, script.length))
    // A competitor added or removed in the modal changes which comparison
    // prompts get written, so the prompt set is rebuilt against the new set.
    if (result.competitors) {
      setRun(r => {
        const scenario = { ...r.scenario, competitors: result.competitors }
        return {
          ...r, scenario,
          prompts: buildPrompts(scenario, r.mix),
          strategy: buildStrategyDirection(scenario, r.mix),
        }
      })
    }
    flash(result.kind === 'skip'
      ? 'Brand strategy skipped — you can add it any time from Review'
      : `Brand strategy locked — ${result.label}`)
  }

  /* ------------------------------------------------------------- shortcuts */

  useEffect(() => {
    function onKey(e) {
      if (bsOpen) return
      const typing = ['INPUT', 'TEXTAREA'].includes(e.target.tagName)
      if ((e.metaKey || e.altKey) && e.key === 'ArrowLeft') { e.preventDefault(); back() }
      if ((e.metaKey || e.altKey) && e.key === 'ArrowRight') { e.preventDefault(); forward() }
      if (e.key === 'Enter' && !typing && screen !== 'chat') {
        const btn = document.querySelector('.view .btn-filled:not(:disabled)')
        if (btn) { e.preventDefault(); btn.click() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [back, forward, screen, bsOpen])

  /* ------------------------------------------------------------------ view */

  const activeStep = Math.max(0, SCREENS.indexOf(screen))

  // Safety net: the pulse must never survive leaving the generation screen.
  useEffect(() => { if (screen !== 'generation') setGenerating(false) }, [screen])

  return (
    <div className="shell">
      <Rail open={navOpen} onToggle={() => setNavOpen(v => !v)} />

      <div className="page">
        <AppHeader
          scenario={run.scenario}
          count={run.count}
          screen={screen}
          canBack={canBack} canFwd={canFwd}
          onBack={back} onFwd={forward}
          onNewScenario={newScenario}
          generating={generating}
        />

        <Stepper active={activeStep} furthest={furthest} onJump={i => go(SCREENS[i])} />

        <main className="page-body">
          {screen === 'chat' && (
            <ScopeChat
              run={run} step={step} stepIndex={stepIndex} answeredTo={answeredTo}
              answers={answers} bs={bs}
              optionsFor={optionsFor} onAddCustom={addCustom}
              onAnswer={answer}
              onStepBack={() => setStepIndex(i => Math.max(0, i - 1))}
              onStepTo={setStepIndex}
              onOpenStrategy={() => setBsOpen(true)}
              onReview={() => go('review')}
              scopeDone={scopeDone}
            />
          )}

          {screen === 'review' && (
            <ReviewScreen
              run={run} values={values} bs={bs}
              optionsFor={optionsFor} onAddCustom={addCustom}
              onEditField={jumpToStep}
              onSetValue={(key, val) => setManual(m => ({ ...m, [key]: val }))}
              onOpenStrategy={() => setBsOpen(true)}
              onRegenerate={regenerate}
              onBack={back}
              onContinue={() => go('plan')}
            />
          )}

          {screen === 'plan' && (
            <PlanReview run={run} setRun={setRun} onRegenerate={regenerate}
              onBack={back} onContinue={() => go('generation')} />
          )}

          {screen === 'generation' && (
            <GenerationView run={run} setRun={setRun} onRegenerate={regenerate}
              onBack={back} onContinue={() => go('completed')} onFlash={flash}
              onGeneratingChange={setGenerating} />
          )}

          {screen === 'completed' && (
            <CompletedScreen run={run} onBack={back} onRestart={newScenario} />
          )}
        </main>
      </div>

      {screen === 'chat' && (
        <ConfigPanel values={values} bs={bs} onJump={jumpToStep}
          onOpenStrategy={() => setBsOpen(true)} scenario={run.scenario} />
      )}

      <BrandStrategyModal
        open={bsOpen}
        scope={scope}
        library={run.library}
        extracted={run.extracted}
        current={bs}
        onClose={() => setBsOpen(false)}
        onApply={applyStrategy}
        onRemove={() => { setBs(null); flash('Brand strategy removed') }}
      />

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}

/* ============================================================== app chrome */

function Rail({ open, onToggle }) {
  return (
    <aside className={`rail ${open ? 'expanded' : 'collapsed'}`}>
      <div className="brand-row">
        <AiMark size={24} />
        <span className="brand-name">GEO GPS</span>
      </div>

      <button className="new-btn" title="New prompt universe">
        <Icon name="plus" size={18} /><span className="label">New universe</span>
      </button>

      <div className="section-label">Workspace</div>
      {NAV.map(n => (
        <button key={n.label} className={`nav-item ${n.active ? 'is-active' : ''}`}
          title={n.label} aria-label={n.label} aria-current={n.active ? 'page' : undefined}>
          <Icon name={n.icon} size={20} />
          <span className="label">{n.label}</span>
          {n.count != null && <span className={`count ${n.active ? 'is-active' : ''}`}>{n.count}</span>}
        </button>
      ))}

      <div className="footer-row">
        <button className="nav-item" onClick={onToggle} title={open ? 'Collapse' : 'Expand'} aria-label="Toggle navigation">
          <Icon name="panel" size={20} />
          <span className="label">Collapse</span>
        </button>
      </div>
    </aside>
  )
}

function AppHeader({ scenario, count, screen, canBack, canFwd, onBack, onFwd, onNewScenario, generating }) {
  const crumb = {
    chat: 'Scoping', review: 'Review configuration', plan: 'Prompt plan',
    generation: 'Generation', completed: 'Completed',
  }[screen]
  return (
    <header className="app-header">
      <div className="zone-l">
        <div className="hist-btns">
          <IconBtn name="back" label="Back (⌘←)" onClick={onBack} disabled={!canBack} />
          <IconBtn name="fwd" label="Forward (⌘→)" onClick={onFwd} disabled={!canFwd} />
        </div>
        {generating ? <AiMark size={32} pulsing /> : <AiMark size={24} />}
        <div className="crumbs">
          <span className="title">{scenario.brand} · {scenario.indication}</span>
          <span className="sub">{scenario.disease} · New prompt universe / {crumb}</span>
        </div>
      </div>
      {/* Center zone: an AI status pill while producing, otherwise empty —
          both are documented configurations, and empty beats a truncated tag. */}
      <div className="zone-c">
        {generating && <Tag tone="primary">Generating {count} prompts…</Tag>}
      </div>
      <div className="zone-r">
        <Btn size="sm" variant="outlined" icon="refresh" onClick={onNewScenario}>New scenario</Btn>
        <IconBtn name="bell" label="Notifications" />
        <span className="avatar">RK</span>
      </div>
    </header>
  )
}

function Stepper({ active, furthest, onJump }) {
  return (
    <nav className="stepper" aria-label="Progress">
      {STEPS.map((s, i) => {
        const state = i === active ? 'is-active' : i < active ? 'is-done' : ''
        const reachable = i <= furthest
        return (
          <React.Fragment key={s}>
            <button className={`step ${state} ${reachable ? 'is-reachable' : ''}`}
              disabled={!reachable} onClick={() => onJump(i)}
              aria-current={i === active ? 'step' : undefined}
              title={reachable ? `Go to ${s}` : `${s} — not reached yet`}>
              <span className="step-n">{i < active ? <Icon name="check" size={12} /> : i + 1}</span>
              <span className="step-label">{s}</span>
            </button>
            {i < STEPS.length - 1 && <span className={`step-line ${i < active ? 'is-done' : ''}`} />}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

/* ============================================================= scoping chat */

function ScopeChat({
  run, step, stepIndex, answeredTo, answers, bs, optionsFor, onAddCustom,
  onAnswer, onStepBack, onStepTo, onOpenStrategy, onReview, scopeDone,
}) {
  const scrollRef = useRef(null)
  const [draft, setDraft] = useState('')
  const [multi, setMulti] = useState([])
  const [otherOpen, setOtherOpen] = useState(false)
  const [otherText, setOtherText] = useState('')

  // Reset the working input whenever the visible question changes.
  useEffect(() => {
    const prior = answers[step?.key]
    if (step?.type === 'multi') setMulti(Array.isArray(prior) ? prior : (step.a || []))
    else setDraft(typeof prior === 'string' ? prior : '')
    setOtherOpen(false); setOtherText('')
  }, [stepIndex, step?.key])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [stepIndex, answeredTo, bs])

  const answered = run.script.slice(0, Math.min(stepIndex, answeredTo))

  function submitFree(text) {
    const v = (text ?? draft).trim()
    if (!v && !step.optional) return
    onAnswer(v || 'Skipped')
  }

  /** Commit an "Other" value: it joins the option list, then gets selected. */
  function submitOther() {
    const v = otherText.trim()
    if (!v) { setOtherOpen(false); return }
    onAddCustom(step.key, v)
    setOtherText(''); setOtherOpen(false)
    if (step.type === 'multi') setMulti(m => m.includes(v) ? m : [...m, v])
    else onAnswer(v)
  }

  return (
    <div className="chat-wrap">
      <div className="chat" ref={scrollRef}>
        <div className="chat-intro">
          <AiMark size={32} />
          <h1 className="chat-hello">Let's scope this universe.</h1>
          <p className="chat-lede">
            {run.script.length} questions, then a brand strategy check. Answer with a click,
            or type and press <Kbd>Enter</Kbd>.
          </p>
        </div>

        {answered.map((s, i) => (
          <AnsweredTurn key={s.key} s={s} value={answers[s.key] ?? s.a} onEdit={() => onStepTo(i)} />
        ))}

        {stepIndex < run.script.length && (
          <div className="turn">
            <div className="msg ai">
              <span className="msg-avatar ai"><AiMark size={18} /></span>
              <div className="msg-body">
                <div className="bubble ai">{step.q}</div>
                <div className="who">GEO agent · question {stepIndex + 1} of {run.script.length}</div>
              </div>
            </div>

            {(step.type === 'single' || step.type === 'multi') && (
              <div className="opts" role="group" aria-label={step.q}>
                {optionsFor(step).map(o => {
                  const on = step.type === 'multi'
                    ? multi.includes(o)
                    : (answers[step.key] ?? step.a) === o
                  return (
                    <button key={o} className={`opt ${on ? 'is-on' : ''}`}
                      onClick={() => {
                        if (step.type === 'multi') {
                          setMulti(m => m.includes(o) ? m.filter(x => x !== o) : [...m, o])
                        } else {
                          onAnswer(o)   // single select answers and advances in one click
                        }
                      }}>
                      {step.type === 'multi' && <span className="opt-box">{on && <Icon name="check" size={12} />}</span>}
                      {o}
                    </button>
                  )
                })}

                {/* Open vocabulary: the list is the common cases, not the limit. */}
                {step.allowOther && (otherOpen ? (
                  <span className="other-field">
                    <input autoFocus value={otherText} placeholder={step.otherHint}
                      onChange={e => setOtherText(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') submitOther()
                        if (e.key === 'Escape') { setOtherOpen(false); setOtherText('') }
                      }} />
                    <button className="other-add" onClick={submitOther} disabled={!otherText.trim()}>
                      Add
                    </button>
                  </span>
                ) : (
                  <button className="opt opt-other" onClick={() => setOtherOpen(true)}>
                    <Icon name="plus" size={13} /> {step.otherLabel || 'Other'}
                  </button>
                ))}

                {step.type === 'multi' && (
                  <button className="opt opt-done" disabled={!multi.length && !step.optional}
                    onClick={() => onAnswer(multi.length ? multi : ['Skipped'])}>
                    Done <Icon name="chevron" size={14} />
                  </button>
                )}
              </div>
            )}

            {(step.type === 'free' || step.type === 'number') && step.suggestions && (
              <div className="opts">
                {step.suggestions.map(o => (
                  <button key={o} className="opt" onClick={() => onAnswer(o)}>{o}</button>
                ))}
                {step.optional && (
                  <button className="opt opt-ghost" onClick={() => onAnswer('Skipped')}>Skip</button>
                )}
              </div>
            )}
          </div>
        )}

        {scopeDone && (
          <div className="turn">
            <div className="msg ai">
              <span className="msg-avatar ai"><AiMark size={18} /></span>
              <div className="msg-body">
                <div className="bubble ai">
                  Scope captured. {bs
                    ? bs.kind === 'skip'
                      ? 'Brand strategy was skipped — you can still add it, here or from the review screen.'
                      : `Brand strategy applied from ${bs.label}.`
                    : 'Last thing: add a brand strategy so the prompt mix can weight against it.'}
                </div>
                <div className="who">GEO agent</div>
              </div>
            </div>
            <div className="opts">
              {(!bs || bs.kind === 'skip') && (
                <button className="opt is-primary" onClick={onOpenStrategy}>
                  <Icon name="reuse" size={14} /> {bs ? 'Add brand strategy now' : 'Reuse or upload a strategy'}
                </button>
              )}
              {bs && bs.kind !== 'skip' && (
                <button className="opt" onClick={onOpenStrategy}><Icon name="edit" size={14} /> Change strategy</button>
              )}
              <button className="opt is-primary" onClick={onReview}>
                Review configuration <Icon name="chevron" size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="prompt-panel">
        <div className="pp-chips">
          <Tag tone="primary"><Icon name="file" size={12} /> {run.scenario.brand}</Tag>
          <Tag tone="neutral">{run.scenario.indication}</Tag>
          {bs && bs.kind !== 'skip' && <Tag tone="success"><Icon name="check" size={12} /> strategy locked</Tag>}
        </div>
        <div className="pp-input">
          <input
            value={draft}
            disabled={stepIndex >= run.script.length || step?.type === 'single' || step?.type === 'multi'}
            placeholder={
              stepIndex >= run.script.length ? 'Scope complete — review or adjust above'
                : step?.type === 'single' || step?.type === 'multi' ? 'Pick an option above'
                  : step?.type === 'number' ? 'Type a number, then Enter'
                    : 'Type your answer, then Enter'
            }
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') submitFree() }}
          />
          <div className="pp-tools">
            <Btn size="sm" variant="text" icon="back" onClick={onStepBack} disabled={stepIndex === 0}>Back</Btn>
            <Btn size="sm" variant="filled" onClick={() => {
              if (step?.type === 'multi') onAnswer(multi.length ? multi : ['Skipped'])
              else if (step?.type === 'single') onAnswer(answers[step.key] ?? step.a)
              else if (stepIndex < run.script.length) submitFree()
              else onReview()
            }}>
              {stepIndex >= run.script.length ? 'Review' : 'Send'}
            </Btn>
          </div>
        </div>
        <p className="pp-hint">
          <Icon name="keyboard" size={13} /> <Kbd>Enter</Kbd> sends · <Kbd>⌘←</Kbd> back a screen · click any
          answered question or config row to change it
        </p>
      </div>
    </div>
  )
}

function AnsweredTurn({ s, value, onEdit }) {
  const shown = Array.isArray(value) ? value.join(', ') : value
  return (
    <div className="turn is-answered">
      <div className="msg ai">
        <span className="msg-avatar ai"><AiMark size={18} /></span>
        <div className="msg-body">
          <div className="bubble ai">{s.q}</div>
        </div>
      </div>
      <div className="msg user">
        <div className="msg-body">
          <div className="bubble user">{shown}</div>
          <div className="who">
            You · <button className="link-btn" onClick={onEdit}>change</button>
          </div>
        </div>
        <span className="msg-avatar user">RK</span>
      </div>
    </div>
  )
}

/* =========================================================== config panel */

function ConfigPanel({ values, bs, onJump, onOpenStrategy, scenario }) {
  const rows = (keys) => keys.map(k => {
    const v = values[k]
    const set = v && v !== 'Not set (optional)'
    if (k === 'Brand Strategy') {
      return (
        <div key={k} className="cfg-row">
          <span className="cfg-k">{k}</span>
          <button className={`cfg-v ${bs && bs.kind !== 'skip' ? 'is-strategy' : 'is-empty'}`}
            onClick={onOpenStrategy}>
            {bs ? (bs.kind === 'skip' ? 'Skipped — add' : bs.label) : 'Add'}
            <Icon name={bs && bs.kind !== 'skip' ? 'edit' : 'plus'} size={13} />
          </button>
        </div>
      )
    }
    return (
      <div key={k} className="cfg-row">
        <span className="cfg-k">{k}</span>
        <button className={`cfg-v ${set ? '' : 'is-empty'}`} onClick={() => onJump(k)}
          title={set ? `Change ${k}` : `${k} not answered yet`}>
          {set ? v : '—'}
          {set && <Icon name="edit" size={13} />}
        </button>
      </div>
    )
  })

  return (
    <aside className="config">
      <div className="config-head">
        <h2 className="config-title">Configuration</h2>
        <p className="config-sub">Fills as you answer · click any row to change it</p>
      </div>
      <div className="cfg-group">Scope</div>
      {rows(SCOPE_FIELDS)}
      <div className="cfg-group">Parameters</div>
      {rows(PARAM_FIELDS)}
      <div className="cfg-note">
        <Icon name="sparkle" size={14} />
        Competitor set from strategy: {scenario.competitors.join(', ')}
      </div>
    </aside>
  )
}

/* ========================================================== review screen */

const FIELD_LABELS = [
  ['Disease', 'DISEASE'], ['Indication', 'INDICATION'], ['Brand', 'BRAND'],
  ['Molecule', 'MOLECULE'], ['Markets', 'MARKETS'], ['Audience', 'AUDIENCE'],
  ['Stage', 'STAGE'], ['Intent', 'INTENT'], ['Brand Lifecycle', 'BRAND LIFECYCLE'],
  ['Prompt Orientation', 'UNIVERSE TYPE'], ['Themes', 'FOCUS / THEME'],
  ['Keywords', 'KEYWORDS'], ['Count', 'COUNT'], ['Brand Strategy', 'BRAND STRATEGY'],
]

const OTHER_OPTION = '+ Other…'

function ReviewScreen({
  run, values, bs, optionsFor, onAddCustom,
  onEditField, onSetValue, onOpenStrategy, onRegenerate, onBack, onContinue,
}) {
  const [editing, setEditing] = useState(null)
  const [otherFor, setOtherFor] = useState(null)   // field being typed free-hand
  const [locked, setLocked] = useState(false)
  const gaps = run.guidance.filter(g => g.status === 'partial')
  const s = run.scenario

  /** Save a typed value; anything typed into an open list joins that list. */
  function commitEdit(key, stepDef, raw) {
    const val = raw.trim()
    if (val) {
      if (stepDef?.allowOther) onAddCustom(stepDef.key, val)
      onSetValue(key, val)
    }
    setEditing(null); setOtherFor(null)
  }

  return (
    <div className="view">
      <div className="view-head">
        <div>
          <h1 className="view-title">Review your configuration</h1>
          <p className="view-sub">Confirm all fields before the plan is built. Every row is editable here — no need to go back to the chat.</p>
        </div>
        <Btn variant="outlined" icon="refresh" onClick={onRegenerate}>Regenerate package</Btn>
      </div>

      <Card
        title="Runtime Context Package"
        right={<>
          {gaps.length
            ? <Tag tone="warning">Generated with warnings</Tag>
            : <Tag tone="success">Complete</Tag>}
          <Tag tone="neutral">{run.runId.slice(0, 8)}</Tag>
        </>}
      >
        <p className="card-lede">
          {values.Disease} · {values.Markets} · {values.Audience} · {values.Stage} · {values.Intent}
        </p>
        {gaps.map(g => (
          <Banner key={g.label} tone="warning">
            <b>{g.label}:</b> {g.detail}
          </Banner>
        ))}
        <div className={`lock-row ${locked ? 'is-locked' : ''}`}>
          <Icon name="lock" size={16} />
          <span>{locked
            ? 'Package locked as the input for prompt planning.'
            : 'Lock this package to confirm it as the input for prompt planning.'}</span>
          <Btn size="sm" variant={locked ? 'outlined' : 'filled'} onClick={() => setLocked(v => !v)}>
            {locked ? 'Unlock' : 'Lock package'}
          </Btn>
        </div>
      </Card>

      <Card title="Guidance sections" right={<Tag tone="neutral">{run.guidance.length - gaps.length}/{run.guidance.length} ready</Tag>}>
        <ul className="guidance">
          {run.guidance.map(g => (
            <li key={g.label} className={g.status === 'partial' ? 'is-partial' : ''}>
              <span className="g-label">{g.label}</span>
              {g.status === 'partial'
                ? <Tag tone="warning">Partial</Tag>
                : <Tag tone={g.tone}>{g.badge}</Tag>}
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Confirm all fields">
        <div className="fields">
          {FIELD_LABELS.map(([key, label]) => {
            const v = values[key]
            const isStrategy = key === 'Brand Strategy'
            const missing = !v || v === 'Not set (optional)'
            const stepDef = stepFor(run.script, key)

            return (
              <div key={key} className={`field-row ${missing ? 'is-missing' : ''}`}>
                <span className={`field-status ${missing ? 'warn' : 'ok'}`}>
                  <Icon name={missing ? 'x' : 'check'} size={12} />
                </span>
                <span className="field-k">{label}</span>

                {editing === key && stepDef?.opts && otherFor !== key ? (
                  <select className="field-edit" autoFocus defaultValue={missing ? '' : v}
                    onChange={e => {
                      if (e.target.value === OTHER_OPTION) { setOtherFor(key); return }
                      onSetValue(key, e.target.value); setEditing(null)
                    }}>
                    {/* the current value first, so a custom one still shows */}
                    {[...new Set([!missing && v, ...optionsFor(stepDef)].filter(Boolean))]
                      .map(o => <option key={o}>{o}</option>)}
                    {stepDef.allowOther && <option>{OTHER_OPTION}</option>}
                  </select>
                ) : editing === key ? (
                  <input className="field-edit" autoFocus
                    placeholder={otherFor === key ? stepDef?.otherHint : undefined}
                    defaultValue={otherFor === key || missing ? '' : v}
                    onBlur={e => commitEdit(key, stepDef, e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') commitEdit(key, stepDef, e.target.value) }} />
                ) : (
                  <span className={`field-v ${isStrategy && !missing ? 'is-strategy' : ''}`}>
                    {missing ? 'Not set (optional)' : v}
                  </span>
                )}

                {isStrategy ? (
                  <Btn size="sm" variant={missing ? 'filled' : 'outlined'}
                    icon={missing ? 'reuse' : 'edit'} onClick={onOpenStrategy}>
                    {missing ? 'Add strategy' : 'Change'}
                  </Btn>
                ) : (
                  <Btn size="sm" variant="outlined" icon="edit"
                    onClick={() => { setOtherFor(null); setEditing(key) }}>Edit</Btn>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {bs?.kind === 'skip' && (
        <Banner tone="info">
          Brand strategy was skipped. The mix will fall back to the statistical prior only — no
          strategy weighting. <button className="link-btn" onClick={onOpenStrategy}>Add one now</button>
        </Banner>
      )}

      <div className="view-foot">
        <Btn variant="text" icon="back" onClick={onBack}>Back</Btn>
        <div className="foot-right">
          <span className="foot-note">{s.competitors.length} competitors · {run.count} prompts planned</span>
          <Btn variant="filled" onClick={onContinue} iconEnd="chevron">Confirm scope &amp; continue</Btn>
        </div>
      </div>
    </div>
  )
}
