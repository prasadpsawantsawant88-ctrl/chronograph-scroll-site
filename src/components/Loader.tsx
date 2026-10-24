import { useEffect, useState } from 'react'

export function Loader({ progress, done }: { progress: number; done: boolean }) {
  const [gone, setGone] = useState(false)
  useEffect(() => {
    if (!done) return
    const id = setTimeout(() => setGone(true), 1100)
    return () => clearTimeout(id)
  }, [done])
  if (gone) return null
  return (
    <div className={`loader${done ? ' is-done' : ''}`} role="status" aria-live="polite">
      <div className="loader-inner">
        <p className="kicker">Preparing the film</p>
        <div className="loader-bar"><span style={{ transform: `scaleX(${progress})` }} /></div>
        <p className="loader-pct">{Math.round(progress * 100)}</p>
      </div>
    </div>
  )
}
