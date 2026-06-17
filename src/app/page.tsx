import Link from 'next/link'
import Nav from '@/components/Nav'

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        {/* ===== Hero ===== */}
        <section className="hero">
          <div className="container hero__inner">
            <div className="hero__text">
              <p className="eyebrow hero__eyebrow">Ritual Teas · Handcrafted with Intention</p>
              <h1 className="hero__headline">
                Every cup<br />
                is a <em>ritual</em>
              </h1>
              <p className="hero__body">
                Herbal blends designed for the sacred in the everyday — to slow down, reflect, and
                transform an ordinary moment into something meaningful.
              </p>
            </div>
            <div className="hero__visual">
              <div className="hero__moon">☽</div>
              <p className="hero__blend-name">The Dream Realm</p>
              <p className="hero__blend-label">Night Ritual Tea · Featured</p>
            </div>
          </div>
        </section>

        {/* ===== Personalized Blend Portal ===== */}
        <section className="blend-portal">
          <div className="blend-portal__moon-bg" aria-hidden="true">☽</div>
          <div className="blend-portal__copy">
            <p className="eyebrow blend-portal__eyebrow">Personalized Ritual</p>
            <h2 className="blend-portal__headline">
              A blend made<br />
              <em>just for you</em>
            </h2>
            <p className="blend-portal__body">
              Tell us what you&apos;re seeking — physically, emotionally, spiritually — and we&apos;ll craft
              a tea blend that&apos;s entirely your own.
            </p>
          </div>
          <div>
            <Link href="/custom-blend" className="btn-filled-white">
              Start my blend ↗
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
