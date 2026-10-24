import { useEffect, useRef, type MutableRefObject } from 'react'
import { FrameSequence } from '../lib/sequence'
import { smoothstep } from '../lib/math'
import { AnnotationLayer } from './AnnotationLayer'

interface Props {
  seqRef: MutableRefObject<FrameSequence | null>
  failed: boolean
  onReady: () => void
  onProgress: (p: number) => void
  onFail: () => void
}

/** Fixed full-viewport film: poster → canvas sequence, colour veils, annotation layer, grain and dust. */
export function Stage({ seqRef, failed, onReady, onProgress, onFail }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = root.current!
    const mobile = window.matchMedia('(max-width: 820px), (max-aspect-ratio: 1/1)').matches
    const seq = new FrameSequence(canvas.current!, {
      base: './frames',
      variant: mobile ? 'mobile' : 'desktop',
      onProgress,
      onReady,
      onFail,
      onLayout: (r, portrait) => {
        const s = el.style
        s.setProperty('--ix', `${r.x}px`)
        s.setProperty('--iy', `${r.y}px`)
        s.setProperty('--iw', `${r.w}px`)
        s.setProperty('--ih', `${r.h}px`)
        el.dataset.portrait = portrait ? '1' : '0'
        // soft top/bottom fade of the oversized portrait frame
        s.setProperty('--m0', `${r.y}px`)
        s.setProperty('--m1', `${r.y + r.h * 0.16}px`)
        s.setProperty('--m2', `${r.y + r.h * 0.84}px`)
        s.setProperty('--m3', `${r.y + r.h}px`)
      },
      onFrame: (t) => {
        // grade the room: warm studio → deep forest while the watch is exploded → back to warm
        const g = smoothstep(2.6, 4.2, t) * (1 - smoothstep(6.6, 7.8, t))
        el.style.setProperty('--green', g.toFixed(3))
      },
    })
    seqRef.current = seq
    void seq.start()
    const onResize = () => seq.resize()
    window.addEventListener('resize', onResize)

    // subtle pointer parallax (fine pointers only)
    let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0
    const fine = window.matchMedia('(pointer: fine)').matches
    const loop = () => {
      cx += (tx - cx) * 0.06
      cy += (ty - cy) * 0.06
      el.style.setProperty('--mx', cx.toFixed(4))
      el.style.setProperty('--my', cy.toFixed(4))
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(loop) : 0
    }
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2
      ty = (e.clientY / window.innerHeight - 0.5) * 2
      if (!raf) raf = requestAnimationFrame(loop)
    }
    if (fine) window.addEventListener('pointermove', onMove, { passive: true })

    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
      seq.destroy()
      seqRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="stage" ref={root} data-poster="assembled" data-failed={failed ? '1' : '0'} aria-hidden="true">
      <div className="stage-tilt">
        <div className="stage-media">
          <div className="frame-box">
            <img className="poster poster--assembled" src="./media/poster-assembled.webp" alt="" decoding="async" />
            <img className="poster poster--exploded" src="./media/poster-exploded.webp" alt="" loading="lazy" decoding="async" />
            <img className="poster poster--final" src="./media/poster-final.webp" alt="" loading="lazy" decoding="async" />
          </div>
          <canvas ref={canvas} className="stage-canvas" />
        </div>
        <div className="veil veil--green" />
        <div className="veil veil--char" />
        <div className="veil veil--vignette" />
        <AnnotationLayer />
      </div>
      <div className="motes">
        {Array.from({ length: 14 }, (_, i) => (
          <span key={i} style={{ left: `${(i * 47) % 100}%`, animationDelay: `${-i * 1.9}s`, animationDuration: `${15 + (i % 5) * 3}s`, width: 1 + (i % 3), height: 1 + (i % 3) }} />
        ))}
      </div>
      <div className="grain" />
    </div>
  )
}
