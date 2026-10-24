import { Specs } from './Specs'
import { Nav } from './Nav'
import { copy, plates, site } from '../config/content'
import { renderEm } from './Lines'

/** Reduced-motion experience: no pinning, no scrubbing — the same content as plain, readable sections. */
export function StaticStory() {
  const h = (lines: string[]) => lines.map((l, i) => <span key={i} className="static-ln">{renderEm(l)} </span>)
  return (
    <>
      <Nav animated={false} />
      <main id="main" className="static">
        <section id="reveal" className="static-sec static-hero">
          <img src="./media/poster-assembled.webp" alt="A green-dial chronograph with a gold-toned case resting on a desk" />
          <div className="static-copy">
            <p className="kicker">{copy.hero.kicker}</p>
            <h1 className="display display--xl">{h(copy.hero.lines)}</h1>
            <p className="hero-sub">{copy.hero.sub}</p>
          </div>
        </section>
        <section id="exploded" className="static-sec">
          <img src="./media/poster-exploded.webp" alt="The same watch with its crystal, dial, wheels and movement plates separated in mid-air" />
          <div className="static-copy">
            <p className="kicker">{copy.exploded.kicker}</p>
            <h2 className="display display--lg">{h(copy.exploded.lines)}</h2>
            <p className="body">{copy.exploded.body}</p>
          </div>
        </section>
        <section id="craft" className="static-sec static-craft">
          <h2 className="sr-only">Craftsmanship</h2>
          {plates.map((p) => (
            <article key={p.id}>
              <img src={p.src} width={p.w} height={p.h} alt={`Close-up crop of the watch: ${p.kicker.replace(/^\d+ — /, '').toLowerCase()}`} loading="lazy" />
              <p className="kicker">{p.kicker}</p>
              <h3 className="display display--md">{h(p.lines)}</h3>
              <p className="body">{p.body}</p>
            </article>
          ))}
        </section>
        <section id="finale" className="static-sec">
          <img src="./media/poster-final.webp" alt="The finished watch in close-up" />
          <div className="static-copy">
            <p className="kicker">{site.brand}</p>
            <h2 className="display display--final">{site.product}</h2>
            <p className="body">{site.tagline} {site.valueProp}</p>
            <a className="cta" href={site.cta.href}><span>{site.cta.label}</span></a>
          </div>
        </section>
      </main>
      <Specs />
    </>
  )
}
