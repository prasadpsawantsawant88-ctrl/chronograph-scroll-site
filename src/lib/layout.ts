export interface Rect { x: number; y: number; w: number; h: number }

/** Where the video frame is drawn inside the viewport. Landscape: cover. Portrait: oversized, upper area. */
export function imageRect(vw: number, vh: number, iw = 1280, ih = 720): { rect: Rect; portrait: boolean } {
  const portrait = vw / vh < 1.05
  if (!portrait) {
    const s = Math.max(vw / iw, vh / ih)
    const w = iw * s, h = ih * s
    return { rect: { x: (vw - w) / 2, y: (vh - h) / 2, w, h }, portrait }
  }
  const w = vw * 1.5, h = (w * ih) / iw
  return { rect: { x: (vw - w) / 2, y: vh * 0.34 - h / 2, w, h }, portrait }
}
