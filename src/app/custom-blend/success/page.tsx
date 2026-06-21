import Link from 'next/link'

export default function BlendSuccessPage() {
  return (
    <>
      <header className="builder-header">
        <span className="builder-header__logo">
          <span>Tea</span> <span>Wizard</span>
        </span>
        <span className="builder-header__step-label">Request received ✦</span>
        <Link href="/" className="btn-outline-white">Save &amp; exit</Link>
      </header>

      <div className="builder-progress-bar-wrap">
        <div className="builder-progress-bar" style={{ width: '100%' }} />
      </div>

      <main className="builder-content">
        <div className="confirmation">
          <div className="confirmation__moon">🌙</div>
          <p className="eyebrow confirmation__eyebrow">Request received</p>
          <h2 className="confirmation__headline">Your blend is in my hands</h2>
          <p className="confirmation__body">
            I&apos;ll review your request personally and craft something made just for you.
            Expect to hear back within 2–3 business days — keep an eye on your inbox,
            as I may have a few follow-up questions.
          </p>
          <div className="confirmation__inbox-box">
            <strong>Your deposit has been received.</strong><br />
            A receipt has been sent to your email. Tori will reach out within 2–3 business days
            with your custom blend recommendation.
          </div>
          <Link href="/" className="btn-outline">Back to Tea Wizard →</Link>
        </div>
      </main>
    </>
  )
}
