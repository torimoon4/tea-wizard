import Link from 'next/link'

const footerLinks = {
  'The Apothecary': [
    { label: 'Signature Blends', href: '/apothecary' },
    { label: 'Custom Blend',     href: '/custom-blend' },
    { label: 'Gift Cards',       href: '/gift-cards' },
  ],
  'Explore': [
    { label: 'Ritual Library', href: '/ritual-library' },
    { label: 'The Herbalist',  href: '/herbalist' },
    { label: 'About',          href: '/about' },
  ],
  'Help': [
    { label: 'Shipping & Pickup', href: '/shipping' },
    { label: 'FAQ',               href: '/faq' },
    { label: 'Herbal Safety',     href: '/herbal-safety' },
    { label: 'Contact',           href: '/contact' },
  ],
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Link href="/" className="footer__logo">
            <span className="nav__logo-tea">Tea</span>
            <span className="nav__logo-wizard"> Wizard</span>
          </Link>
          <p className="footer__tagline">Ritual teas crafted with intention.<br />A Moon Artistry creation.</p>
        </div>
        {Object.entries(footerLinks).map(([section, links]) => (
          <div key={section} className="footer__col">
            <p className="footer__col-heading">{section}</p>
            <ul className="footer__col-links">
              {links.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="footer__link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <span>© 2026 Tea Wizard by Moon Artistry. All rights reserved.</span>
          <div className="footer__legal">
            <Link href="/privacy" className="footer__link">Privacy Policy</Link>
            <span>·</span>
            <Link href="/terms" className="footer__link">Terms</Link>
            <span>·</span>
            <Link href="/herbal-safety" className="footer__link">Herbal Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
