import React, { useState, useEffect, useRef, useMemo } from 'react'
import { comparableFields, strategyColumns } from './data.js'
import { Icon, Btn, Tag, Banner, Kbd } from './ui.jsx'

const UPLOAD_STEPS = [
  "Extracting structure from the uploaded strategy",
  "Scraping competitor and label sources",
  "Validating against your scope inputs",
]
const REUSE_STEPS = [
  "Loading the saved strategy package",
  "Validating against your scope inputs",
]

/**
 * Brand strategy capture. Three ways in — reuse a saved strategy, upload a new
 * one, or skip — and all three land in the same validation table so the scope
 * gets checked either way.
 */
export default function BrandStrategyModal({
  open, scope, library, extracted, current, onClose, onApply, onRemove,
}) {
  const [tab, setTab] = useState('reuse')        // reuse | upload
  const [stage, setStage] = useState('choose')   // choose | processing | validate | summary
  const [entry, setEntry] = useState(null)       // chosen library entry
  const [file, setFile] = useState(null)         // uploaded file
  const [procIdx, setProcIdx] = useState(0)
  const [resolved, setResolved] = useState({})   // field -> 'strategy' | 'scope'
  const [showColumns, setShowColumns] = useState(false)
  const [query, setQuery] = useState('')
  const [comps, setComps] = useState(null)       // competitor set, editable before locking
  const [compDraft, setCompDraft] = useState('')
  const [addingComp, setAddingComp] = useState(false)
  const fileInput = useRef(null)

  const steps = entry ? REUSE_STEPS : UPLOAD_STEPS

  // Reset to a clean state each time the modal is opened.
  useEffect(() => {
    if (!open) return
    setStage('choose'); setEntry(null); setFile(null)
    setResolved({}); setQuery(''); setShowColumns(false)
    setComps(null); setCompDraft(''); setAddingComp(false)
    setTab(library.length ? 'reuse' : 'upload')
  }, [open])

  // Run the fake pipeline. Reuse skips the scrape step, so it's visibly faster.
  useEffect(() => {
    if (stage !== 'processing') return
    setProcIdx(0)
    const tick = entry ? 420 : 700
    const t = setInterval(() => {
      setProcIdx(i => {
        if (i >= steps.length - 1) {
          clearInterval(t)
          setTimeout(() => setStage('validate'), tick / 2)
          return i
        }
        return i + 1
      })
    }, tick)
    return () => clearInterval(t)
  }, [stage])

  // Esc closes, Enter drives the primary action.
  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Enter') return
      if (stage === 'validate' && canContinue) { e.preventDefault(); setStage('summary') }
      else if (stage === 'summary') { e.preventDefault(); apply() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  // The source of truth for the comparison table: a reused entry or an upload.
  const source = useMemo(() => {
    if (entry) {
      return {
        label: `${entry.brand} · ${entry.market} · ${entry.persona}`,
        kind: 'reuse',
        values: { Disease: entry.disease, Markets: entry.market, Brand: entry.brand, Audience: entry.persona },
        objective: entry.objective, priorities: entry.priorities,
        competitors: entry.competitors, risks: entry.risks,
        sources: [`${entry.brand} strategy ${entry.version} · ${entry.owner}`],
      }
    }
    if (file) {
      return {
        label: file.name, kind: 'upload',
        values: {
          Disease: extracted.Disease, Markets: extracted.Markets,
          Brand: extracted.Brand, Audience: extracted.Audience,
        },
        objective: extracted.objective, priorities: extracted.priorities,
        competitors: extracted.competitors, risks: extracted.risks,
        sources: extracted.sources,
      }
    }
    return null
  }, [entry, file, extracted])

  // Seed the editable competitor set once a strategy is chosen. Declared after
  // `source` because it reads it.
  useEffect(() => {
    if (source && comps === null) setComps(source.competitors)
  }, [source, comps])

  const comparisons = useMemo(() => {
    if (!source) return []
    return comparableFields.map(f => {
      const mine = scope[f] || '—'
      const theirs = source.values[f] || '—'
      return { field: f, mine, theirs, match: String(mine).toLowerCase() === String(theirs).toLowerCase() }
    })
  }, [source, scope])

  const mismatches = comparisons.filter(c => !c.match)
  const canContinue = mismatches.every(m => resolved[m.field])

  const filtered = library.filter(e => {
    if (!query.trim()) return true
    const hay = `${e.brand} ${e.market} ${e.persona} ${e.lifecycle} ${e.summary} ${e.owner}`.toLowerCase()
    return hay.split(/\s+/).join(' ').includes(query.toLowerCase())
  })

  if (!open) return null

  function chooseEntry(e) { setEntry(e); setFile(null); setStage('processing') }
  function chooseFile(f) { setFile(f); setEntry(null); setStage('processing') }
  function resolveAll(side) {
    setResolved(r => {
      const next = { ...r }
      mismatches.forEach(m => { next[m.field] = side })
      return next
    })
  }

  function addComp() {
    const v = compDraft.trim()
    if (!v) return
    setComps(list => {
      const base = list || source.competitors
      return base.includes(v) ? base : [...base, v]
    })
    setCompDraft(''); setAddingComp(false)
  }

  function apply() {
    // Fields where the user took the strategy's value overwrite the scope.
    const overrides = {}
    Object.entries(resolved).forEach(([field, side]) => {
      if (side === 'strategy') overrides[field] = source.values[field]
    })
    onApply({
      kind: source.kind,
      label: source.label,
      source,
      entry, file,
      resolved,
      overrides,
      competitors: comps || source.competitors,
      conflicts: mismatches.length,
    })
  }

  return (
    <div className="overlay" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Brand strategy">
        <header className="modal-head">
          <div className="modal-head-text">
            <h2 className="modal-title">Brand strategy</h2>
            <p className="modal-sub">
              {stage === 'choose' && 'Reuse a saved strategy or upload a new one. Either way GEO validates it against your scope.'}
              {stage === 'processing' && 'Reading the strategy…'}
              {stage === 'validate' && 'Where the strategy and your scope disagree, pick which one wins.'}
              {stage === 'summary' && 'Confirm what GEO will use for this run.'}
            </p>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><Icon name="x" size={18} /></button>
        </header>

        <div className="modal-body">
          {/* ------------------------------------------------ already applied */}
          {stage === 'choose' && current && current.kind !== 'skip' && (
            <div className="applied-note">
              <Tag tone="success"><Icon name="check" size={12} /> Applied</Tag>
              <span className="applied-label">{current.label}</span>
              <button className="link-btn" onClick={onRemove}>Remove</button>
            </div>
          )}

          {/* -------------------------------------------------------- choose */}
          {stage === 'choose' && (
            <>
              <div className="tabs" role="tablist">
                <button role="tab" aria-selected={tab === 'reuse'} className={`tab ${tab === 'reuse' ? 'is-active' : ''}`}
                  onClick={() => setTab('reuse')}>
                  <Icon name="reuse" size={16} /> Reuse saved
                  <span className="tab-count">{library.length}</span>
                </button>
                <button role="tab" aria-selected={tab === 'upload'} className={`tab ${tab === 'upload' ? 'is-active' : ''}`}
                  onClick={() => setTab('upload')}>
                  <Icon name="upload" size={16} /> Upload new
                </button>
              </div>

              {tab === 'reuse' && (
                <>
                  <div className="search-field">
                    <Icon name="search" size={16} />
                    <input value={query} onChange={e => setQuery(e.target.value)} autoFocus
                      placeholder="Filter by market, persona or owner…" />
                    {query && <button className="icon-btn sm" onClick={() => setQuery('')} aria-label="Clear"><Icon name="x" size={14} /></button>}
                  </div>

                  <p className="list-caption">
                    {filtered.length} saved {filtered.length === 1 ? 'strategy' : 'strategies'} for <b>{scope.Brand}</b> — one click to use.
                  </p>

                  <ul className="strategy-list">
                    {filtered.map(e => (
                      <li key={e.id}>
                        <button className="strategy-card" onClick={() => chooseEntry(e)}>
                          <div className="sc-top">
                            <span className="sc-brand">{e.brand}</span>
                            <Tag tone={e.match >= 90 ? 'success' : e.match >= 60 ? 'warning' : 'neutral'}>
                              {e.match}% scope match
                            </Tag>
                          </div>
                          <div className="sc-meta">
                            <span className="sc-pill">{e.market}</span>
                            <span className="sc-pill">{e.persona}</span>
                            <span className="sc-pill">{e.lifecycle}</span>
                          </div>
                          <p className="sc-summary">{e.summary}</p>
                          <div className="sc-foot">
                            <span>Updated {e.updated}</span><span className="sc-dot" />
                            <span>{e.owner}</span><span className="sc-dot" />
                            <span>{e.version}</span><span className="sc-dot" />
                            <span>used in {e.usedIn} {e.usedIn === 1 ? 'universe' : 'universes'}</span>
                            <span className="sc-use">Use <Icon name="chevron" size={14} /></span>
                          </div>
                        </button>
                      </li>
                    ))}
                    {filtered.length === 0 && (
                      <li className="empty-row">
                        No saved strategy matches “{query}”.
                        <button className="link-btn" onClick={() => setTab('upload')}>Upload one instead</button>
                      </li>
                    )}
                  </ul>

                  {/* The library rarely covers every market. Say so, always. */}
                  <p className="list-caption">
                    Nothing here for <b>{scope.Markets}</b>?
                    {' '}<button className="link-btn" onClick={() => setTab('upload')}>Upload a new strategy</button>
                    {' '}or reuse the closest one — you'll pick a winner on each field that differs.
                  </p>
                </>
              )}

              {tab === 'upload' && (
                <>
                  <button className="upload-slot" onClick={() => fileInput.current?.click()}>
                    <input ref={fileInput} type="file" accept=".csv,.xml,.xlsx" hidden
                      onChange={e => e.target.files?.[0] && chooseFile(e.target.files[0])} />
                    <Icon name="upload" size={24} />
                    <span className="upload-title">Drop a CSV or XML strategy file</span>
                    <span className="upload-hint">Extraction, source scraping and scope validation run automatically</span>
                  </button>

                  <div className="upload-links">
                    <button className="link-btn" onClick={() => chooseFile({ name: `${scope.Brand?.toLowerCase()}_brand_strategy.csv` })}>
                      <Icon name="file" size={14} /> Use the sample file
                    </button>
                    <button className="link-btn" onClick={() => setShowColumns(v => !v)}>
                      {showColumns ? 'Hide' : 'View'} required columns
                      <Icon name={showColumns ? 'down' : 'chevron'} size={14} />
                    </button>
                  </div>

                  {showColumns && (
                    <table className="tbl">
                      <thead><tr><th>Column</th><th>What to fill</th><th>Example</th></tr></thead>
                      <tbody>
                        {strategyColumns.map(c => (
                          <tr key={c.field}>
                            <td className="mono">{c.field}</td>
                            <td>{c.desc}</td>
                            <td className="muted">{c.example}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </>
              )}
            </>
          )}

          {/* ---------------------------------------------------- processing */}
          {stage === 'processing' && (
            <div className="proc">
              <div className="proc-file"><Icon name="file" size={16} />{entry ? source.label : file?.name}</div>
              {steps.map((s, i) => (
                <div key={s} className={`proc-line ${i < procIdx ? 'is-done' : i === procIdx ? 'is-active' : ''}`}>
                  {i < procIdx
                    ? <span className="proc-check"><Icon name="check" size={11} /></span>
                    : i === procIdx ? <span className="spinner" /> : <span className="proc-pending" />}
                  {s}
                </div>
              ))}
              {entry && <p className="proc-note">Saved strategies skip source scraping — they were scraped when first added.</p>}
            </div>
          )}

          {/* ------------------------------------------------------ validate */}
          {stage === 'validate' && (
            <>
              {mismatches.length > 0 ? (
                <Banner tone="warning">
                  <b>{mismatches.length} field{mismatches.length > 1 ? 's' : ''} disagree</b> with your scope.
                  Pick a winner on each row, or resolve them all at once.
                </Banner>
              ) : (
                <Banner tone="success"><Icon name="check" size={16} /> Every compared field matches your scope.</Banner>
              )}

              {mismatches.length > 1 && (
                <div className="bulk-row">
                  <span>Resolve all {mismatches.length}:</span>
                  <Btn size="sm" variant="outlined" onClick={() => resolveAll('strategy')}>Use strategy values</Btn>
                  <Btn size="sm" variant="outlined" onClick={() => resolveAll('scope')}>Keep my scope</Btn>
                </div>
              )}

              <table className="tbl cmp">
                <thead>
                  <tr><th>Field</th><th>Your scope</th><th>Strategy says</th><th className="ta-r">Which wins?</th></tr>
                </thead>
                <tbody>
                  {comparisons.map(c => (
                    <tr key={c.field} className={!c.match && !resolved[c.field] ? 'is-conflict' : ''}>
                      <td className="cmp-field">{c.field}</td>
                      <td className={resolved[c.field] === 'scope' ? 'is-winner' : ''}>{c.mine}</td>
                      <td className={resolved[c.field] === 'strategy' ? 'is-winner' : ''}>{c.theirs}</td>
                      <td className="ta-r">
                        {c.match ? <Tag tone="success">Match</Tag> : (
                          <div className="choice">
                            <button className={`choice-btn ${resolved[c.field] === 'scope' ? 'is-on' : ''}`}
                              onClick={() => setResolved(r => ({ ...r, [c.field]: 'scope' }))}>Mine</button>
                            <button className={`choice-btn ${resolved[c.field] === 'strategy' ? 'is-on' : ''}`}
                              onClick={() => setResolved(r => ({ ...r, [c.field]: 'strategy' }))}>Strategy</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* ------------------------------------------------------- summary */}
          {stage === 'summary' && (
            <>
              <Banner tone="success"><Icon name="check" size={16} /> Ready to lock — {source.label}</Banner>
              <dl className="summary-grid">
                <dt>Strategic objective</dt>
                <dd>{source.objective}</dd>
                <dt>Strategic priorities</dt>
                <dd>{source.priorities.map(p => <div key={p} className="prio">{p}</div>)}</dd>
                <dt>Competitor set</dt>
                {/* Strategy decks miss competitors all the time — this list is
                    editable right up to the lock. It feeds comparison prompts. */}
                <dd>
                  {(comps || source.competitors).map(c => (
                    <span key={c} className="tag tag-neutral removable">
                      {c}
                      <button className="tag-x" aria-label={`Remove ${c}`}
                        onClick={() => setComps(list => (list || source.competitors).filter(x => x !== c))}>
                        <Icon name="x" size={11} />
                      </button>
                    </span>
                  ))}
                  {addingComp ? (
                    <span className="other-field">
                      <input autoFocus value={compDraft} placeholder="Competitor brand name"
                        onChange={e => setCompDraft(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') addComp()
                          if (e.key === 'Escape') { setAddingComp(false); setCompDraft('') }
                        }} />
                      <button className="other-add" onClick={addComp} disabled={!compDraft.trim()}>Add</button>
                    </span>
                  ) : (
                    <button className="tag tag-primary add-tag" onClick={() => setAddingComp(true)}>
                      <Icon name="plus" size={12} /> Add competitor
                    </button>
                  )}
                </dd>
                <dt>Priority risk areas</dt>
                <dd>{source.risks.map(r => <Tag key={r} tone="warning">{r}</Tag>)}</dd>
                <dt>Source</dt>
                <dd>{source.sources.map(s => <Tag key={s} tone="primary">{s}</Tag>)}</dd>
              </dl>
              {Object.values(resolved).includes('strategy') && (
                <Banner tone="info">
                  {Object.values(resolved).filter(v => v === 'strategy').length} scope field(s) will be
                  overwritten with the strategy's values for this run.
                </Banner>
              )}
            </>
          )}
        </div>

        <footer className="modal-foot">
          {stage === 'choose' && (
            <>
              <Btn variant="text" onClick={() => onApply({ kind: 'skip', label: 'Skipped' })}>
                Skip for now
              </Btn>
              <span className="foot-note">You can add it later from the review screen.</span>
            </>
          )}
          {stage === 'validate' && (
            <>
              <Btn variant="text" onClick={() => setStage('choose')} icon="back">Change strategy</Btn>
              <Btn variant="filled" disabled={!canContinue} onClick={() => setStage('summary')} iconEnd="chevron">
                Continue
              </Btn>
              <span className="foot-note"><Kbd>Enter</Kbd></span>
            </>
          )}
          {stage === 'summary' && (
            <>
              <Btn variant="text" onClick={() => setStage('validate')} icon="back">Back</Btn>
              <Btn variant="filled" onClick={apply} icon="lock">Confirm &amp; lock</Btn>
              <span className="foot-note"><Kbd>Enter</Kbd></span>
            </>
          )}
        </footer>
      </div>
    </div>
  )
}
