import type { ReactNode } from 'react'

/** `_text_` renders as <em>. Each line is wrapped in a mask so it can slide up from clipped. */
export function renderEm(s: string): ReactNode {
  return s.split(/(_[^_]+_)/g).map((p, i) =>
    p.startsWith('_') && p.endsWith('_') ? <em key={i}>{p.slice(1, -1)}</em> : p,
  )
}

export function Lines({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((l, i) => (
        <span className="ln" key={i}>
          <span className="ln-in">{renderEm(l)}</span>{' '}
        </span>
      ))}
    </>
  )
}
