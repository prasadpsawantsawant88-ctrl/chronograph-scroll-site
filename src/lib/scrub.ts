import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scrubs a GSAP timeline across the full pinned (sticky) length of a chapter.
 * The timeline is normalised to a duration of 1, so tween positions are scroll progress (0–1).
 */
export function useScrub(
  ref: RefObject<HTMLElement | null>,
  build: (tl: gsap.core.Timeline, q: gsap.utils.SelectorFunc) => void,
  onProgress?: (p: number) => void,
) {
  useLayoutEffect(() => {
    const el = ref.current!
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'none' } })
      build(tl, gsap.utils.selector(el))
      tl.set({}, {}, 1) // pad to exactly 1
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.7,
        animation: tl,
        onUpdate: onProgress ? (s) => onProgress(s.progress) : undefined,
      })
    }, el)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export { gsap, ScrollTrigger }
