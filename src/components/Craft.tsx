import { useRef } from 'react'
import { Lines } from './Lines'
import { plates, timeline } from '../config/content'
import { gsap, useScrub } from '../lib/scrub'

const N = plates.length

/** Scene D — craftsmanship. The film holds (graded + softened) while crops of the real watch are annotated. */
export function Craft() {
  const ref = useRef<HTMLElement>(null)
  useScrub(
    ref,
    (tl, q) => {
      const stage = document.querySelector('.stage') as HTMLElement
      const media = stage.querySelector('.stage-media')
      const char = stage.querySelector('.veil--char')
      tl.fromTo(char, { opacity: 0 }, { opacity: 0.86, duration: 0.05 }, 0)
      tl.fromTo(media, { '--blur': '0px' }, { '--blur': '7px', duration: 0.05 }, 0)
      tl.to(char, { opacity: 0, duration: 0.05 }, 0.95)
      tl.to(media, { '--blur': '0px', duration: 0.05 }, 0.95)
      tl.fromTo(q('.craft-index'), { opacity: 0 }, { opacity: 1, duration: 0.04 }, 0.02)
      tl.to(q('.craft-index'), { opacity: 0, duration: 0.04 }, 0.95)

      const u = 1 / N // progress per plate
      plates.forEach((_p, i) => {
        const s = q(`[data-step="${i}"]`)[0]
        const at = i * u
        const inn = i === 0 ? at + 0.035 : at + 0.004
        const out = (i + 1) * u - (i === N - 1 ? 0.05 : 0.03)
        const sel = gsap.utils.selector(s)
        tl.fromTo(sel('.plate-clip'), { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.04, ease: 'power3.inOut' }, inn)
        tl.fromTo(sel('.plate-clip img'), { scale: 1.18 }, { scale: 1, duration: u * 0.9, ease: 'power1.out' }, inn)
        tl.fromTo(sel('.kicker'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.025, ease: 'power2.out' }, inn)
        tl.fromTo(sel('.ln-in'), { yPercent: 118 }, { yPercent: 0, duration: 0.04, ease: 'power3.out', stagger: 0.015 }, inn + 0.008)
        tl.fromTo(sel('.body'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.03, ease: 'power2.out' }, inn + 0.025)
        tl.fromTo(sel('.plate-line'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.035, ease: 'power2.inOut', stagger: 0.012 }, inn + 0.035)
        tl.fromTo(sel('.plate-mark'), { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.02, stagger: 0.012, ease: 'back.out(2)' }, inn + 0.035)
        tl.fromTo(sel('.plate-label'), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.025, stagger: 0.012, ease: 'power2.out' }, inn + 0.055)
        tl.to(s, { opacity: 0, y: -24, duration: 0.03, ease: 'power1.in' }, out)
      })
      tl.set(q('.craft-step'), { opacity: 1 }, 0)
    },
    (p) => {
      const el = ref.current
      if (!el) return
      const i = Math.min(N - 1, Math.floor(p * N))
      el.style.setProperty('--step', String(i))
      el.querySelectorAll('.craft-step').forEach((s, k) => s.classList.toggle('is-on', k === i))
      el.querySelectorAll('.tick').forEach((t, k) => t.classList.toggle('is-on', k === i))
      const c = el.querySelector('.craft-count')
      if (c) c.textContent = `${String(i + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')}`
    },
  )
  return (
    <section id="craft" ref={ref} className="chapter chapter--craft" style={{ height: `${timeline.craft.screens * 100}svh` }} data-from={timeline.craft.from} data-to={timeline.craft.to} aria-labelledby="craft-h">
      <div className="chapter-inner">
        <h2 className="sr-only" id="craft-h">Craftsmanship</h2>
        <div className="craft-index" aria-hidden="true">
          <span className="craft-count">01 / 05</span>
          <span className="craft-ticks">
            {plates.map((p, i) => <i key={p.id} className={`tick${i === 0 ? ' is-on' : ''}`} />)}
          </span>
        </div>
        {plates.map((p, i) => {
          const H = (100 * p.h) / p.w
          return (
            <article key={p.id} className={`craft-step${i === 0 ? ' is-on' : ''}`} data-step={i} aria-label={p.kicker}>
              <div className="craft-copy">
                <p className="kicker">{p.kicker}</p>
                <h3 className="display display--md"><Lines lines={p.lines} /></h3>
                <p className="body">{p.body}</p>
              </div>
              <figure className="plate" style={{ ['--ar' as string]: `${p.w} / ${p.h}`, ['--arn' as string]: p.w / p.h }}>
                <div className="plate-frame">
                  <div className="plate-clip">
                    <img src={p.src} width={p.w} height={p.h} alt={`Close-up crop of the watch: ${p.kicker.replace(/^\d+ — /, '').toLowerCase()}`} loading="lazy" decoding="async" />
                  </div>
                  <svg className="plate-svg" viewBox={`0 0 100 ${H}`} preserveAspectRatio="none" aria-hidden="true">
                    {p.notes.flatMap((n, k) =>
                      n.pts.map((pt, j) => (
                        <g key={`${k}-${j}`}>
                          <path className="plate-line" pathLength={1} d={`M${pt[0] * 100},${pt[1] * H} L${n.label[0] * 100},${n.label[1] * H}`} />
                        </g>
                      )),
                    )}
                  </svg>
                  {p.notes.flatMap((n, k) =>
                    n.pts.map((pt, j) => (
                      <i key={`m${k}-${j}`} className="plate-mark" style={{ left: `${pt[0] * 100}%`, top: `${pt[1] * 100}%`, ['--r' as string]: n.ring ? `${n.ring}%` : '9px' }} />
                    )),
                  )}
                  {p.notes.map((n, k) => (
                    <span key={`l${k}`} className="plate-label" style={{ left: `${n.label[0] * 100}%`, top: `${n.label[1] * 100}%` }}>{n.text}</span>
                  ))}
                </div>
              </figure>
            </article>
          )
        })}
      </div>
    </section>
  )
}
