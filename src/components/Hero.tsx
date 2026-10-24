import { useEffect, useRef } from 'react'
import { Lines } from './Lines'
import { copy, timeline } from '../config/content'
import { gsap, useScrub } from '../lib/scrub'

/** Scene A — opening reveal. The intro plays once the film is ready; scrolling then dissolves the copy. */
export function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null)
  useScrub(ref, (tl, q) => {
    tl.to(q('.hint-wrap'), { opacity: 0, duration: 0.06 }, 0.01)
    tl.to(q('.hero-scrim'), { opacity: 0, duration: 0.25 }, 0.35)
    tl.to(q('.hero-copy'), { opacity: 0, yPercent: -10, duration: 0.22, ease: 'power1.in' }, 0.3)
  })
  useEffect(() => {
    if (!ready) return
    const el = ref.current!
    const tl = gsap.timeline({ delay: 0.35 })
    gsap.fromTo('.stage-media', { scale: 1.07 }, { scale: 1, duration: 3.4, ease: 'power3.out' })
    tl.from(el.querySelectorAll('.ln-in'), { yPercent: 118, duration: 1.5, ease: 'expo.out', stagger: 0.16 })
      .from(el.querySelectorAll('.hero-kicker, .hero-sub'), { opacity: 0, y: 14, duration: 1.2, ease: 'power2.out', stagger: 0.25 }, 0.3)
      .from(el.querySelectorAll('.hint'), { opacity: 0, duration: 1.2 }, 1.2)
    return () => { tl.kill() }
  }, [ready])
  return (
    <section id="reveal" ref={ref} className="chapter" style={{ height: `${timeline.hero.screens * 100}svh` }} data-from={timeline.hero.from} data-to={timeline.hero.to} aria-labelledby="hero-h">
      <div className="chapter-inner">
        <div className="scrim scrim--bottom hero-scrim" style={{ opacity: 1 }} />
        <div className="hero-copy copy-hero">
          <p className="kicker hero-kicker">{copy.hero.kicker}</p>
          <h1 className="display display--xl" id="hero-h">
            <Lines lines={copy.hero.lines} />
          </h1>
          <p className="hero-sub">{copy.hero.sub}</p>
        </div>
        <div className="hint-wrap">
          <a className="hint" href="#exploded" aria-label="Scroll to begin">
            <span>Scroll</span>
            <i />
          </a>
        </div>
      </div>
    </section>
  )
}
