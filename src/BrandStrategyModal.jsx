import React, { useState, useEffect, useRef } from 'react'
import { extractedStrategy, comparableFields, strategyColumns } from './data.js'

const PROC_STEPS = [
  "Extracting structure from the uploaded strategy…",
  "Scraping competitor pages…",
  "Validating against your scope inputs…",
]

export default function BrandStrategyModal({ open, values, onClose, onConfirmed }) {
  const [stage, setStage] = useState('upload') // upload | processing | validate | review
  const [strategyFile, setStrategyFile] = useState(null)
  const [procIdx, setProcIdx] = useState(0)
  const [resolved, setResolved] = useState({})      // field -> 'accepted' | 'edited'
  const [showColumns, setShowColumns] = useState(false)
  const [editing, setEditing] = useState(null)       // field currently being edited
  const [overrides, setOverrides] = useState({})     // field -> corrected user value
  const sInput = useRef(null)

  useEffect(() => {
    if (stage !== 'processing') return
    setProcIdx(0)
    const t = setInterval(() => {
      setProcIdx(i => {
        if (i >= PROC_STEPS.length - 1) {
          clearInterval(t)
          setTimeout(() => setStage('validate'), 500)
          return i
        }
        return i + 1
      })
    }, 800)
    return () => clearInterval(t)
  }, [stage])

  if (!open) return null

  const comparisons = comparableFields.map(f => ({
    field: f,
    user: overrides[f] || values[f] || "—",
    extracted: extractedStrategy[f] || "—",
    match: (overrides[f] || values[f] || "").toLowerCase() === (extractedStrategy[f] || "").toLowerCase(),
  }))
  const mismatches = comparisons.filter(c => !c.match)
  const allResolved = mismatches.every(m => resolved[m.field])

  function startExtract() { if (strategyFile) setStage('processing') }
  function accept(field) { setResolved(r => ({ ...r, [field]: 'accepted' })) }
  function finishReview() { onConfirmed(Object.keys(resolved).length ? 'validated' : 'validated'); onClose() }

  return (
    <div className="overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal modal-lg">
        <div className="modal-head">
          <h3>Brand strategy</h3>
          <p className="muted">Upload the strategy as a CSV or XML file. GEO extracts, scrapes and validates it against your scope.</p>
        </div>

        <div className="modal-body">
          {stage === 'upload' && (
            <div>
              <UploadSlot label="Brand strategy" hint="CSV or XML" accept=".csv,.xml,.xlsx" file={strategyFile}
                onPick={f => setStrategyFile(f)} inputRef={sInput} />

              <div className="cols-toggle" onClick={() => setShowColumns(v => !v)}>
                {showColumns ? 'Hide' : 'View'} the columns a strategist needs to fill {showColumns ? '▾' : '▸'}
              </div>
              {showColumns && (
                <table className="tbl cols">
                  <thead><tr><th>Column</th><th>What to fill</th><th>Example</th></tr></thead>
                  <tbody>
                    {strategyColumns.map(c => (
                      <tr key={c.field}>
                        <td className="cmp-field">{c.field}</td>
                        <td>{c.desc}</td>
                        <td className="example">{c.example}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <div className="sample-link" onClick={() => setStrategyFile({ name: 'brand_strategy_sample.csv' })}>
                No file handy? Use the sample CSV →
              </div>
              <div className="bs-actions">
                <button className="btn btn-p" disabled={!strategyFile} onClick={startExtract}>Extract &amp; validate</button>
                <button className="btn btn-ghost" onClick={() => onConfirmed('text')}>Add as text</button>
                <button className="btn btn-ghost" onClick={() => onConfirmed('skip')}>Skip</button>
              </div>
              <div className="hint-note">Extraction, scraping and validation happen after upload. You can also add the strategy as free text or skip it.</div>
            </div>
          )}

          {stage === 'processing' && (
            <div className="progress-stack">
              <div className="filepill">📄 {strategyFile?.name}</div>
              {PROC_STEPS.map((s, i) => (
                <div key={s} className={`pline ${i < procIdx ? 'done' : i === procIdx ? 'active' : ''}`}>
                  {i < procIdx ? <span className="chk">✓</span> : i === procIdx ? <span className="spin" /> : <span className="dot-pending" />}
                  {s}
                </div>
              ))}
            </div>
          )}

          {stage === 'validate' && (
            <div>
              {mismatches.length > 0 ? (
                <div className="banner warn">
                  <b>{mismatches.length} mismatch{mismatches.length > 1 ? 'es' : ''} found</b>. Accept the strategy value or edit your input on each row.
                </div>
              ) : (
                <div className="banner ok">✓ All compared fields match the uploaded strategy.</div>
              )}

              <div className="cmp-label">Your input vs extracted strategy</div>
              <table className="tbl cmp">
                <thead>
                  <tr><th>Field</th><th>Your input</th><th>Extracted from strategy</th><th>Status</th><th></th></tr>
                </thead>
                <tbody>
                  {comparisons.map(c => (
                    <tr key={c.field} className={c.match || resolved[c.field] ? '' : 'mismatch'}>
                      <td className="cmp-field">{c.field}</td>
                      <td>
                        {editing === c.field
                          ? <input className="inline-edit" autoFocus defaultValue={c.user}
                              onBlur={e => { setOverrides(o => ({ ...o, [c.field]: e.target.value })); setEditing(null) }}
                              onKeyDown={e => { if (e.key === 'Enter') { setOverrides(o => ({ ...o, [c.field]: e.target.value })); setEditing(null) } }} />
                          : c.user}
                      </td>
                      <td>{c.extracted}</td>
                      <td>
                        {resolved[c.field] === 'accepted' ? <span className="pill valid">Accepted</span>
                          : resolved[c.field] === 'edited' ? <span className="pill valid">Edited</span>
                          : c.match ? <span className="pill valid">Match</span>
                          : <span className="pill flag">Mismatch</span>}
                      </td>
                      <td className="row-actions">
                        {!c.match && resolved[c.field] !== 'accepted' && (
                          <button className="mini-btn mini-accept" onClick={() => accept(c.field)}>Accept</button>
                        )}
                        <button className="mini-btn" onClick={() => setEditing(c.field)}>Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="modal-actions">
                <button className="btn btn-s" onClick={() => setStage('upload')}>Back</button>
                <button className="btn btn-p" disabled={mismatches.length > 0 && !allResolved} onClick={() => setStage('review')}>
                  Continue to review
                </button>
              </div>
            </div>
          )}

          {stage === 'review' && (
            <div>
              <div className="banner ok">✓ Interpretation ready. Review before locking.</div>
              <div className="sig">
                <div className="lbl">Strategic objective</div>
                <div className="val">{extractedStrategy.objective}</div>
                <div className="lbl">Strategic priorities</div>
                <div className="val">{extractedStrategy.priorities.map(p => <div key={p} className="prio-line">{p}</div>)}</div>
                <div className="lbl">Competitor set</div>
                <div className="val">{extractedStrategy.competitors.map(c => <span key={c} className="chip">{c}</span>)}</div>
                <div className="lbl">Priority risk areas</div>
                <div className="val">{extractedStrategy.risks.map(r => <span key={r} className="chip chip-risk">{r}</span>)}</div>
                <div className="lbl">Source</div>
                <div className="val">{extractedStrategy.sources.map(s => <span key={s} className="chip">{s}</span>)}</div>
              </div>
              {Object.keys(resolved).length > 0 && (
                <div className="hint-note" style={{ marginTop: 12 }}>
                  {Object.keys(resolved).length} field{Object.keys(resolved).length > 1 ? 's' : ''} resolved — accepted strategy values are applied for this run.
                </div>
              )}
              <div className="modal-actions">
                <button className="btn btn-s" onClick={() => setStage('validate')}>Back</button>
                <button className="btn btn-p" onClick={finishReview}>Confirm &amp; lock</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function UploadSlot({ label, hint, accept, file, onPick, inputRef }) {
  return (
    <div className="upload-slot" onClick={() => inputRef.current?.click()}>
      <input ref={inputRef} type="file" accept={accept} style={{ display: 'none' }}
        onChange={e => e.target.files?.[0] && onPick(e.target.files[0])} />
      <div className="upload-title">{label}</div>
      <div className="upload-hint">{file ? file.name : `Choose ${hint} file`}</div>
      {file && <div className="upload-ok">✓ uploaded</div>}
    </div>
  )
}
