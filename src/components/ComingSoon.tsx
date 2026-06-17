import Link from 'next/link'
import Nav from './Nav'

export default function ComingSoon({ pageName }: { pageName: string }) {
  return (
    <>
      <Nav />
      <main className="coming-soon">
        <div className="coming-soon__inner">
          <div className="coming-soon__glyph">✦</div>
          <h1 className="coming-soon__heading">{pageName} is brewing...</h1>
          <p className="coming-soon__sub">This part of Tea Wizard is still being crafted. Check back soon.</p>
          <Link href="/" className="btn-outline">Back to Tea Wizard →</Link>
        </div>
      </main>
    </>
  )
}
