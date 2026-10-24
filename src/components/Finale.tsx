import { useRef } from 'react'
import { Lines } from './Lines'
import { site, timeline } from '../config/content'
import { useScrub } from '../lib/scrub'

/** Scene F — the finished watch, product name, value proposition and call to action. */
export function Finale() {
  const ref = useRef<HTMLElement>(null)
  useScrub(ref, (tl, q) => {
    tl.fromTo(q('.scrim'), { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0.35)
    tl.fromTo(q('.kicker'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' }, 0.5)
    tl.fromTo(q('.ln-in'), { yPercent: 118 }, { yPercent: 0, duration: 0.16, ease: 'power3.out', stagger: 0.05 }, 0.54)
    tl.fromTo(q('.body'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' }, 0.7)
    tl.fromTo(q('.cta-row > *'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out', stagger: 0.04 }, 0.78)
  })
  return (
    <section id="finale" ref={ref} className="chapter" style={{ height: `${timeline.finale.screens * 100}svh` }} data-from={timeline.finale.from} data-to={timeline.finale.to} aria-labelledby="finale-h">
      <div className="chapter-inner">
        <div className="scrim scrim--left" />
        <div className="copy copy--final">
          <p className="kicker">{site.brand}</p>
          <h2 className="display display--final" id="finale-h"><Lines lines={[site.product]} /></h2>
          <p className="body">{site.tagline} {site.valueProp}</p>
          <div className="cta-row">
            <a className="cta" href={site.cta.href}>
              <span>{site.cta.label}</span>
              <svg viewBox="0 0 24 8" aria-hidden="true"><path d="M0 4h22M18 1l4 3-4 3" /></svg>
            </a>
            <ul className="links">
              {site.secondary.map((l) => (
                <li key={l.label}><a href={l.href}>{l.label}</a></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
