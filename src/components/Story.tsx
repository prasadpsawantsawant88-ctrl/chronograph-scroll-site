import { useLayoutEffect, useRef, useState } from 'react'
import { Stage } from './Stage'
import { Hero } from './Hero'
import { TextChapter } from './TextChapter'
import { Exploded } from './Exploded'
import { Craft } from './Craft'
import { Finale } from './Finale'
import { Specs } from './Specs'
import { Nav } from './Nav'
import { Loader } from './Loader'
import { copy, timeline } from '../config/content'
import { clamp } from '../lib/math'
import { ScrollTrigger } from '../lib/scrub'
import type { FrameSequence } from '../lib/sequence'

interface Range { top: number; len: number; from: number; to: number; poster: string }

/** The animated experience: fixed film stage + sticky chapters + one master scroll→video-time mapping. */
export function Story() {
  const story = useRef<HTMLDivElement>(null)
  const seq = useRef<FrameSequence | null>(null)
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  useLayoutEffect(() => {
    const root = story.current!
    const stage = document.querySelector('.stage') as HTMLElement
    const posters = ['assembled', 'assembled', 'exploded', 'exploded', 'exploded', 'final']
    let ranges: Range[] = []

    const measure = () => {
      const base = root.getBoundingClientRect().top + window.scrollY
      ranges = [...root.querySelectorAll<HTMLElement>('[data-from]')].map((c, i) => ({
        top: base + c.offsetTop,
        len: Math.max(1, c.offsetHeight - window.innerHeight),
        from: Number(c.dataset.from),
        to: Number(c.dataset.to),
        poster: posters[i] ?? 'final',
      }))
    }
    const update = (y: number) => {
      if (!ranges.length) return
      let r = ranges[0]
      for (const c of ranges) if (y >= c.top - 1) r = c
      const p = clamp((y - r.top) / r.len, 0, 1)
      seq.current?.setTarget(r.from + (r.to - r.from) * p)
      stage.dataset.poster = r.poster
    }
    measure()
    const st = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => update(s.scroll()) })
    const onRefresh = () => { measure(); update(window.scrollY) }
    ScrollTrigger.addEventListener('refresh', onRefresh)
    update(window.scrollY)
    return () => { st.kill(); ScrollTrigger.removeEventListener('refresh', onRefresh) }
  }, [ready])

  return (
    <>
      <Stage seqRef={seq} failed={failed} onProgress={setProgress} onReady={() => setReady(true)} onFail={() => { setFailed(true); setReady(true) }} />
      <Nav animated />
      <main id="main" className="story" ref={story}>
        <Hero ready={ready} />
        <TextChapter id="open" {...timeline.open} {...copy.open} side="right" inAt={0.12} outAt={0.86} />
        <Exploded />
        <Craft />
        <TextChapter id="reassemble" {...timeline.reassemble} {...copy.reassemble} side="left" inAt={0.14} outAt={0.72} />
        <Finale />
      </main>
      <Specs />
      <Loader progress={progress} done={ready} />
    </>
  )
}
