import { useLayoutEffect, useRef } from 'react'
import { site } from '../config/content'
import { gsap, ScrollTrigger } from '../lib/scrub'

export function Nav({ animated }: { animated: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  useLayoutEffect(() => {
    if (!animated) return
    const ctx = gsap.context(() => {
      gsap.fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } })
      ScrollTrigger.create({
        trigger: '#specs',
        start: 'top 56px',
        end: 'bottom top',
        onToggle: (s) => ref.current?.classList.toggle('nav--light', s.isActive),
      })
    })
    return () => ctx.revert()
  }, [animated])
  return (
    <header className={`nav${animated ? '' : ' nav--static'}`} ref={ref}>
      <a className="skip" href="#specs">Skip to details</a>
      <a className="nav-brand" href="#reveal">{site.brand}</a>
      <nav aria-label="Primary">
        <ul>
          {site.nav.map((l) => (
            <li key={l.label}><a href={l.href}>{l.label}</a></li>
          ))}
        </ul>
      </nav>
      <span className="nav-progress" ref={bar} aria-hidden="true" />
    </header>
  )
}
