import { clamp } from './math'
import { imageRect, type Rect } from './layout'

export interface Manifest { count: number; fps: number; duration: number; width: number; height: number }

interface Opts {
  base: string // e.g. './frames'
  variant: 'desktop' | 'mobile'
  onProgress?: (p: number) => void
  onReady?: () => void
  onFail?: () => void
  onFrame?: (t: number) => void
  onLayout?: (rect: Rect, portrait: boolean) => void
}

const MAX_BITMAPS = 40
const CONCURRENCY = 6
const COARSE_STEP = 6

/**
 * Canvas frame-sequence player.
 *  - Compressed frames are downloaded progressively (coarse pass first, then the rest, prioritising what's needed).
 *  - Only a window of decoded ImageBitmaps is kept in memory (LRU-ish by distance from the playhead).
 *  - The playhead eases toward the scroll-driven target, and neighbouring frames are cross-blended for smoothness.
 */
export class FrameSequence {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private m!: Manifest
  private o: Opts
  private blobs: (Blob | undefined)[] = []
  private inflight = new Set<number>()
  private queue: number[] = []
  private bitmaps = new Map<number, ImageBitmap>()
  private decoding = new Set<number>()
  private target = 0
  private cur = 0
  private dir = 1
  private vw = 0
  private vh = 0
  private dpr = 1
  private rect: Rect = { x: 0, y: 0, w: 1, h: 1 }
  private raf = 0
  private last = 0
  private dirty = true
  private destroyed = false
  private ready = false
  private coarse: number[] = []
  private coarseDone = 0
  active = true

  constructor(canvas: HTMLCanvasElement, opts: Opts) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d', { alpha: true })!
    this.o = opts
  }

  private url(i: number) {
    return `${this.o.base}/${this.o.variant}/f_${String(i + 1).padStart(3, '0')}.webp`
  }

  async start() {
    try {
      const res = await fetch(`${this.o.base}/manifest.json`)
      if (!res.ok) throw new Error('manifest')
      this.m = await res.json()
    } catch {
      this.o.onFail?.()
      return
    }
    const n = this.m.count
    this.blobs = new Array(n)
    for (let i = 0; i < n; i += COARSE_STEP) this.coarse.push(i)
    if (!this.coarse.includes(n - 1)) this.coarse.push(n - 1)
    const rest: number[] = []
    for (let i = 0; i < n; i++) if (!this.coarse.includes(i)) rest.push(i)
    this.queue = [...this.coarse, ...rest]
    this.resize()
    this.pump()
  }

  get duration() { return this.m ? (this.m.count - 1) / this.m.fps : 0 }

  private pump() {
    while (this.inflight.size < CONCURRENCY && this.queue.length) {
      const i = this.queue.shift()!
      if (this.blobs[i] || this.inflight.has(i)) continue
      this.inflight.add(i)
      fetch(this.url(i))
        .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.blob() })
        .then((b) => {
          this.blobs[i] = b
          this.inflight.delete(i)
          if (this.coarse.includes(i)) {
            this.coarseDone++
            this.o.onProgress?.(this.coarseDone / this.coarse.length)
            if (!this.ready && this.coarseDone === this.coarse.length) this.becomeReady()
          }
          this.pump()
        })
        .catch(() => {
          this.inflight.delete(i)
          if (i === 0) { this.o.onFail?.(); return }
          // retry once later at the back of the queue
          if (!this.retried.has(i)) { this.retried.add(i); this.queue.push(i) }
          this.pump()
        })
    }
  }
  private retried = new Set<number>()

  private async becomeReady() {
    await this.decode(0)
    this.ready = true
    this.dirty = true
    this.schedule()
    this.o.onReady?.()
  }

  private decode(i: number): Promise<void> {
    const b = this.blobs[i]
    if (!b || this.bitmaps.has(i) || this.decoding.has(i) || this.destroyed) return Promise.resolve()
    this.decoding.add(i)
    return createImageBitmap(b)
      .then((bmp) => {
        this.decoding.delete(i)
        if (this.destroyed) { bmp.close(); return }
        this.bitmaps.set(i, bmp)
        this.evict()
        this.dirty = true
        this.schedule()
      })
      .catch(() => { this.decoding.delete(i) })
  }

  private evict() {
    if (this.bitmaps.size <= MAX_BITMAPS) return
    const c = this.cur * this.m.fps
    const keys = [...this.bitmaps.keys()].sort((a, b) => Math.abs(b - c) - Math.abs(a - c))
    while (this.bitmaps.size > MAX_BITMAPS) {
      const k = keys.shift()!
      this.bitmaps.get(k)?.close()
      this.bitmaps.delete(k)
    }
  }

  /** Called by the scroll system: seconds of video to show. */
  setTarget(t: number) {
    if (!this.m) return
    t = clamp(t, 0, this.duration)
    if (t !== this.target) this.dir = t > this.target ? 1 : -1
    this.target = t
    this.schedule()
  }

  /** Jump without easing (used on resize / first paint). */
  snap(t: number) { this.target = this.cur = clamp(t, 0, this.duration || t); this.dirty = true; this.schedule() }

  resize() {
    this.vw = window.innerWidth
    this.vh = window.innerHeight
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    this.canvas.width = Math.round(this.vw * this.dpr)
    this.canvas.height = Math.round(this.vh * this.dpr)
    const { rect, portrait } = imageRect(this.vw, this.vh, this.m?.width ?? 1280, this.m?.height ?? 720)
    this.rect = rect
    this.o.onLayout?.(rect, portrait)
    this.dirty = true
    this.schedule()
  }

  private pick(i: number): ImageBitmap | undefined {
    const b = this.bitmaps.get(i)
    if (b) return b
    for (let r = 1; r <= 14; r++) {
      const a = this.bitmaps.get(i - r) ?? this.bitmaps.get(i + r)
      if (a) return a
    }
  }

  private want(i: number) {
    if (i < 0 || i >= this.m.count) return
    if (!this.blobs[i]) {
      if (!this.inflight.has(i)) {
        const q = this.queue.indexOf(i)
        if (q > 0) this.queue.splice(q, 1)
        if (q !== 0) this.queue.unshift(i)
        this.pump()
      }
      return
    }
    void this.decode(i)
  }

  private schedule() {
    if (this.raf || this.destroyed || !this.active) return
    this.last = performance.now()
    this.raf = requestAnimationFrame(this.tick)
  }

  private tick = (now: number) => {
    this.raf = 0
    if (this.destroyed) return
    const dt = Math.min(0.1, (now - this.last) / 1000)
    this.last = now
    const d = this.target - this.cur
    if (Math.abs(d) > 0.0005) { this.cur += d * (1 - Math.exp(-dt * 9)); this.dirty = true } else this.cur = this.target
    if (this.dirty && this.ready) this.draw()
    this.o.onFrame?.(this.cur)
    if (Math.abs(this.target - this.cur) > 0.0005 || this.dirty) { this.dirty = false; this.raf = requestAnimationFrame(this.tick) }
  }

  private draw() {
    const { ctx, rect, dpr } = this
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    ctx.clearRect(0, 0, this.vw, this.vh)
    const f = clamp(this.cur * this.m.fps, 0, this.m.count - 1)
    const i0 = Math.floor(f)
    const i1 = Math.min(i0 + 1, this.m.count - 1)
    const a = f - i0
    const b0 = this.pick(i0)
    if (b0) ctx.drawImage(b0, rect.x, rect.y, rect.w, rect.h)
    if (a > 0.03 && i1 !== i0) {
      const b1 = this.pick(i1)
      if (b1 && b1 !== b0) {
        ctx.globalAlpha = a
        ctx.drawImage(b1, rect.x, rect.y, rect.w, rect.h)
        ctx.globalAlpha = 1
      }
    }
    void dpr
    // keep a decode window around the playhead (biased in the scroll direction)
    for (let k = -3; k <= 9; k++) this.want(i0 + k * this.dir)
  }

  destroy() {
    this.destroyed = true
    cancelAnimationFrame(this.raf)
    this.bitmaps.forEach((b) => b.close())
    this.bitmaps.clear()
  }
}
