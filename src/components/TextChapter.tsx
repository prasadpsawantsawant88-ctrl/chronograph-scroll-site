import { useRef, type ReactNode } from 'react'
import { Lines } from './Lines'
import { useScrub } from '../lib/scrub'
import type { Timeline } from '../lib/types'

interface Props {
  id: string
  from: number
  to: number
  screens: number
  kicker: string
  lines: string[]
  body: string
  side?: 'left' | 'right'
  /** chapter progress where the copy has fully arrived / starts leaving */
  inAt?: number
  outAt?: number
  extra?: (tl: Timeline) => void
  children?: ReactNode
}

/** A pinned chapter with a masked headline reveal, driven entirely by scroll progress. */
export function TextChapter({ id, from, to, screens, kicker, lines, body, side = 'left', inAt = 0.1, outAt = 0.88, extra, children }: Props) {
  const ref = useRef<HTMLElement>(null)
  useScrub(ref, (tl, q) => {
    tl.fromTo(q('.scrim'), { opacity: 0 }, { opacity: 1, duration: 0.1 }, inAt - 0.06)
    tl.fromTo(q('.kicker'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.06, ease: 'power2.out' }, inAt - 0.03)
    tl.fromTo(q('.ln-in'), { yPercent: 118 }, { yPercent: 0, duration: 0.09, ease: 'power3.out', stagger: 0.035 }, inAt)
    tl.fromTo(q('.body'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.07, ease: 'power2.out' }, inAt + 0.05)
    tl.to(q('.copy, .scrim'), { opacity: 0, yPercent: -6, duration: 0.08, ease: 'power1.in' }, outAt)
    extra?.(tl)
  })
  return (
    <section id={id} ref={ref} className="chapter" style={{ height: `${screens * 100}svh` }} data-from={from} data-to={to} aria-labelledby={`${id}-h`}>
      <div className="chapter-inner">
        <div className={`scrim scrim--${side}`} />
        <div className={`copy copy--${side}`}>
          <p className="kicker">{kicker}</p>
          <h2 className="display" id={`${id}-h`}>
            <Lines lines={lines} />
          </h2>
          <p className="body">{body}</p>
          {children}
        </div>
      </div>
    </section>
  )
}
