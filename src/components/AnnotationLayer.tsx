import { annotations } from '../config/content'
import { gsap } from '../lib/scrub'

const W = 1280, H = 720
const pct = (v: number, t: number) => `${(v / t) * 100}%`

/** Technical annotation lines + labels, positioned in source-video pixel space so they track the image. */
export function AnnotationLayer() {
  return (
    <div className="frame-box ann-layer" aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        {annotations.map((a) => {
          const dir = a.side === 'r' ? -1 : 1
          const ex = a.label[0] + dir * 46
          return (
            <path
              key={a.n}
              className="ann-line"
              pathLength={1}
              d={`M${a.anchor[0]},${a.anchor[1]} L${ex},${a.label[1]} L${a.label[0]},${a.label[1]}`}
            />
          )
        })}
      </svg>
      {annotations.map((a) => (
        <span key={`d${a.n}`} className="ann-dot" style={{ left: pct(a.anchor[0], W), top: pct(a.anchor[1], H) }}>
          <i />
          <b>{a.n}</b>
        </span>
      ))}
      {annotations.map((a) => (
        <span
          key={`l${a.n}`}
          className={`ann-label ann-label--${a.side}`}
          style={{ left: pct(a.label[0], W), top: pct(a.label[1], H) }}
        >
          <small>{String(a.n).padStart(2, '0')}</small> {a.text}
        </span>
      ))}
    </div>
  )
}

/** Adds the staggered line-draw / label reveal to a chapter timeline (positions are chapter progress). */
export function annotationTimeline(tl: gsap.core.Timeline, start: number, step: number, outAt: number) {
  const q = gsap.utils.selector(document.querySelector('.ann-layer'))
  annotations.forEach((_, i) => {
    const at = start + i * step
    tl.fromTo(q('.ann-line')[i], { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: step * 1.1, ease: 'power2.inOut' }, at)
    tl.fromTo(q('.ann-dot')[i], { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1, duration: step * 0.5, ease: 'back.out(2)' }, at)
    tl.fromTo(q('.ann-label')[i], { opacity: 0, x: (_: number, el: Element) => (el.classList.contains('ann-label--r') ? -10 : 10) }, { opacity: 1, x: 0, duration: step * 0.9, ease: 'power2.out' }, at + step * 0.7)
  })
  tl.to([...q('.ann-line'), ...q('.ann-dot'), ...q('.ann-label')], { opacity: 0, duration: 0.07, ease: 'power1.in' }, outAt)
}
