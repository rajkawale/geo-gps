import React from 'react'

/* Stroke icons: 1.7px, round caps/joins, 24 viewBox — per the icon spec. */
const PATHS = {
  home: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  sparkle: <path d="M12 2 21 7v10l-9 5-9-5V7z" />,
  wrench: <><path d="M14.7 6.3a4 4 0 0 0 5 5l-9.4 9.4a2.1 2.1 0 0 1-3-3z" /><path d="M14.7 6.3 18 3" /></>,
  check: <><path d="M20 6 9 17l-5-5" /></>,
  book: <><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22z" /><path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20" /></>,
  back: <><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></>,
  fwd: <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>,
  refresh: <><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></>,
  edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></>,
  upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 9 5-5 5 5" /><path d="M12 4v12" /></>,
  reuse: <><path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 8 5" /><path d="M20 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-8-5" /><path d="M4 21v-5h5" /></>,
  skip: <><path d="m5 4 10 8-10 8z" /><path d="M19 5v14" /></>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  file: <><path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" /><path d="M14 2v5h5" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  bell: <><path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></>,
  chevron: <path d="m9 6 6 6-6 6" />,
  down: <path d="m6 9 6 6 6-6" />,
  plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  x: <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
  panel: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M15 4v16" /></>,
  keyboard: <><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8" /></>,
  trash: <><path d="M4 7h16" /><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /><path d="M6 7l1 13h10l1-13" /></>,
  copy: <><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></>,
}

export function Icon({ name, size = 20, className = '' }) {
  return (
    <svg className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      {PATHS[name] || null}
    </svg>
  )
}

/* Buttons: filled / outlined / text, sizes sm(32) md(36) lg(40). */
export function Btn({ variant = 'outlined', size = 'md', icon, iconEnd, children, className = '', ...rest }) {
  return (
    <button className={`btn btn-${variant} btn-${size} ${className}`} {...rest}>
      {icon && <Icon name={icon} size={16} />}
      {children}
      {iconEnd && <Icon name={iconEnd} size={16} />}
    </button>
  )
}

export function IconBtn({ name, label, size = 18, ...rest }) {
  return (
    <button className="icon-btn" aria-label={label} title={label} {...rest}>
      <Icon name={name} size={size} />
    </button>
  )
}

export function Tag({ tone = 'neutral', children, className = '' }) {
  return <span className={`tag tag-${tone} ${className}`}>{children}</span>
}

export function Card({ title, right, children, className = '' }) {
  return (
    <section className={`card ${className}`}>
      {(title || right) && (
        <header className="card-head">
          {title && <h3 className="card-title">{title}</h3>}
          {right && <div className="card-head-right">{right}</div>}
        </header>
      )}
      {children}
    </section>
  )
}

export function Banner({ tone = 'info', children }) {
  return <div className={`banner banner-${tone}`}>{children}</div>
}

/* Keyboard hint pill, e.g. <Kbd>Enter</Kbd> */
export function Kbd({ children }) {
  return <kbd className="kbd">{children}</kbd>
}
