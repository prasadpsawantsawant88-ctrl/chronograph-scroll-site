/**
 * ALL replaceable copy, timings and annotation coordinates live here.
 * Nothing below is a verified product claim unless it describes something visible in the film.
 * Placeholder copy is marked  // PLACEHOLDER.
 */

export const site = {
  brand: 'Brand Name', // PLACEHOLDER – no brand is invented; replace with the real one
  product: 'The Chronograph', // PLACEHOLDER
  tagline: 'Green dial. Gold-toned case.', // describes what is visible
  valueProp: 'A green-dial chronograph in a gold-toned case — shown here, piece by piece.', // PLACEHOLDER
  cta: { label: 'Discover the Watch', href: '#specs' },
  secondary: [
    { label: 'Specifications', href: '#specs' },
    { label: 'Craftsmanship', href: '#craft' },
    { label: 'Product details', href: '#details' },
  ],
  nav: [
    { label: 'Reveal', href: '#reveal' },
    { label: 'Exploded', href: '#exploded' },
    { label: 'Craft', href: '#craft' },
    { label: 'Details', href: '#specs' },
  ],
  footerNote: 'Placeholder content — replace in src/config/content.ts.',
}

/**
 * Maps each chapter to a slice of the video (seconds) and to scroll length (in screen heights).
 * Chapters must be contiguous (one `to` equals the next `from`) so the film never jumps.
 * Derived from the supplied video: assembled 0–2s · opening 2–4s · exploded hold 4–6.5s ·
 * reassembly 6.5–8.4s · finished close-up 8.4–10s.
 */
export const timeline = {
  hero: { from: 0.0, to: 1.8, screens: 2.2 },
  open: { from: 1.8, to: 3.9, screens: 2.6 },
  exploded: { from: 3.9, to: 6.3, screens: 4.4 },
  craft: { from: 6.3, to: 6.5, screens: 5.6 }, // film is held (near-still) while details are shown
  reassemble: { from: 6.5, to: 8.4, screens: 2.8 },
  finale: { from: 8.4, to: 9.9, screens: 2.4 },
}

export const copy = {
  hero: {
    kicker: 'Chronograph',
    lines: ['Precision,', '_Revealed._'], // PLACEHOLDER headline (as briefed)
    sub: 'Discover the details behind every second.', // PLACEHOLDER
  },
  open: {
    kicker: '02 — The Opening',
    lines: ['Every Detail', 'Has a _Purpose._'],
    body: 'The crystal and bezel lift away, one layer at a time.',
  },
  exploded: {
    kicker: '03 — Exploded View',
    lines: ['A Study in', '_Precision._'],
    body: 'Crystal, dial, wheels and movement plates, held in suspension.',
  },
  reassemble: {
    kicker: '05 — Reassembly',
    lines: ['Every piece,', 'back in _place._'],
    body: 'The layers return to their positions, and the case closes.',
  },
}

/**
 * Scene C annotations. Coordinates are in SOURCE VIDEO pixels (1280×720) so they track the image
 * at any screen size. `side` is which side the label sits on; `label` is the label anchor point.
 * Only parts that are visible in the exploded frames are labelled.
 */
export interface Annotation {
  n: number
  text: string
  anchor: [number, number]
  label: [number, number]
  side: 'l' | 'r'
}
export const annotations: Annotation[] = [
  { n: 1, text: 'Crystal & bezel', anchor: [828, 100], label: [1000, 62], side: 'r' },
  { n: 2, text: 'Dial & indices', anchor: [482, 186], label: [270, 120], side: 'l' },
  { n: 3, text: 'Gold-toned wheels', anchor: [985, 285], label: [1060, 250], side: 'r' },
  { n: 4, text: 'Movement plates', anchor: [472, 420], label: [270, 360], side: 'l' },
  { n: 5, text: 'Case & screws', anchor: [800, 650], label: [1000, 662], side: 'r' },
]

/** Scene D plates: crops of the real watch (public/plates). Coordinates normalised 0–1 on each plate. */
export interface PlateNote {
  pts: [number, number][]
  label: [number, number]
  text: string
  ring?: number
}
export interface Plate {
  id: string
  src: string
  w: number
  h: number
  kicker: string
  lines: string[]
  body: string
  notes: PlateNote[]
}
export const plates: Plate[] = [
  {
    id: 'dial', src: './plates/dial.webp', w: 800, h: 620,
    kicker: '01 — The Dial', lines: ['A dial of', 'quiet _texture._'],
    body: 'A green dial with a fine linear texture, set with applied indices and a small date aperture.',
    notes: [
      { pts: [[0.61, 0.2]], label: [1.04, 0.1], text: 'Applied baton indices' },
      { pts: [[0.3, 0.55]], label: [1.04, 0.5], text: 'Textured green dial' },
      { pts: [[0.64, 0.78]], label: [1.04, 0.9], text: 'Date aperture' },
    ],
  },
  {
    id: 'subdials', src: './plates/subdials.webp', w: 600, h: 420,
    kicker: '02 — Subdials', lines: ['Three subdials,', '_precisely_ placed.'],
    body: 'Each subdial is framed by a gold-toned rim and structures the chronograph layout.',
    notes: [{ pts: [[0.18, 0.26], [0.72, 0.38], [0.38, 0.62]], ring: 12, label: [1.04, 0.14], text: 'Three subdials' }],
  },
  {
    id: 'hands', src: './plates/hands.webp', w: 600, h: 380,
    kicker: '03 — Hands & Indices', lines: ['Made to be', '_read_ at a glance.'],
    body: 'Gold-toned hands and applied baton indices stand clear of the green dial.',
    notes: [
      { pts: [[0.67, 0.24]], label: [1.04, 0.06], text: 'Applied indices' },
      { pts: [[0.87, 0.45]], label: [1.04, 0.38], text: 'Hands' },
      { pts: [[0.33, 0.64]], label: [1.04, 0.84], text: 'Central pivot' },
    ],
  },
  {
    id: 'case', src: './plates/case.webp', w: 1080, h: 500,
    kicker: '04 — Case', lines: ['Form, edges,', '_finish._'],
    body: 'A gold-toned case with a faceted bezel, a crown and pusher, and visible screws on the lugs.',
    notes: [
      { pts: [[0.89, 0.1]], label: [1.03, 0.02], text: 'Crown' },
      { pts: [[0.73, 0.46]], label: [1.03, 0.48], text: 'Pusher' },
      { pts: [[0.13, 0.6], [0.33, 0.69]], ring: 3.2, label: [0.36, 1.1], text: 'Case screws' },
    ],
  },
  {
    id: 'strap', src: './plates/strap.webp', w: 600, h: 280,
    kicker: '05 — Strap', lines: ['A ribbed strap,', '_matched_ to the dial.'],
    body: 'A green strap with a ribbed texture echoes the colour of the dial.',
    notes: [{ pts: [[0.45, 0.62]], label: [1.03, 0.7], text: 'Ribbed strap texture' }],
  },
]

export const specs = {
  visible: [
    'Gold-toned case with a faceted bezel',
    'Green dial with a fine linear texture',
    'Applied baton indices',
    'Three subdials with gold-toned rims',
    'Date aperture',
    'Crown and two pushers',
    'Visible case screws',
    'Ribbed green strap',
  ],
  // PLACEHOLDER – supply verified values. Nothing here has been confirmed.
  table: [
    ['Reference', 'To be confirmed'],
    ['Movement', 'To be confirmed'],
    ['Case material & size', 'To be confirmed'],
    ['Water resistance', 'To be confirmed'],
    ['Strap', 'To be confirmed'],
    ['Origin', 'To be confirmed'],
    ['Price', 'To be confirmed'],
  ] as [string, string][],
}
