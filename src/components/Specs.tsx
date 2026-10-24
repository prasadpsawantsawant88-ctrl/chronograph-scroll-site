import { specs, site } from '../config/content'

/** Ivory "product details" page that closes the film like a curtain. Only visible facts are stated. */
export function Specs() {
  return (
    <section id="specs" className="specs" aria-labelledby="specs-h">
      <div className="specs-inner">
        <header>
          <p className="kicker kicker--dark">06 — Details</p>
          <h2 className="display display--lg" id="specs-h">The watch, <em>in detail.</em></h2>
        </header>
        <div className="specs-grid">
          <section id="details" aria-labelledby="vis-h">
            <h3 id="vis-h" className="specs-h">Visible in the film</h3>
            <ul className="visible-list">
              {specs.visible.map((v) => <li key={v}>{v}</li>)}
            </ul>
          </section>
          <section aria-labelledby="spec-h">
            <h3 id="spec-h" className="specs-h">Specifications</h3>
            <dl className="spec-table">
              {specs.table.map(([k, v]) => (
                <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
            <p className="note">Verified values are not supplied with this project. Replace these rows in <code>src/config/content.ts</code>.</p>
          </section>
        </div>
      </div>
      <footer className="footer">
        <span className="footer-brand">{site.brand}</span>
        <nav aria-label="Footer">
          {site.nav.map((l) => <a key={l.label} href={l.href}>{l.label}</a>)}
        </nav>
        <small>© {new Date().getFullYear()} {site.brand}. {site.footerNote}</small>
      </footer>
    </section>
  )
}
