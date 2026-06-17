'use client'
import { useState } from 'react'
import Link from 'next/link'

const links = [
  { label: 'The Apothecary', href: '/apothecary' },
  { label: 'Custom Blend',   href: '/custom-blend' },
  { label: 'The Herbalist',  href: '/herbalist' },
  { label: 'Ritual Library', href: '/ritual-library' },
  { label: 'About',          href: '/about' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="nav">
      <div className="container nav__inner">
        <Link href="/" className="nav__logo">
          <span className="nav__logo-tea">Tea</span>
          <span className="nav__logo-wizard">Wizard</span>
        </Link>
        <div className="nav__links">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="nav-link">{l.label}</Link>
          ))}
        </div>
        <div className="nav__actions">
          <Link href="/sign-in" className="btn-outline">Sign in</Link>
          <Link href="/cart" className="btn-filled">🛒 Cart (0)</Link>
        </div>
        <button className="nav__hamburger" aria-label="Open menu" onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
      </div>
      <div className={`nav__mobile ${open ? 'open' : ''}`}>
        {links.map(l => (
          <Link key={l.href} href={l.href} className="nav__mobile-link" onClick={() => setOpen(false)}>{l.label}</Link>
        ))}
        <div className="nav__mobile-actions">
          <Link href="/sign-in" className="btn-outline">Sign in</Link>
          <Link href="/cart" className="btn-filled">🛒 Cart (0)</Link>
        </div>
      </div>
    </nav>
  )
}
