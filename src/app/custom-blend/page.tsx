'use client'
import { useState } from 'react'
import Link from 'next/link'
import { getSupabase } from '@/lib/supabase'

type Path = 'wellness' | 'ritual' | null

const PHYSICAL_OPTIONS = [
  { value: 'Better sleep',       icon: '🌙', desc: 'Difficulty falling asleep or staying asleep' },
  { value: 'Stress & anxiety',   icon: '🌬️', desc: 'Feeling overwhelmed, tense, or on edge' },
  { value: 'More energy',        icon: '☀️', desc: 'Fatigue, sluggishness, low motivation' },
  { value: 'Digestion',          icon: '🌱', desc: 'Bloating, discomfort, or irregular digestion' },
  { value: 'Mental clarity',     icon: '🔮', desc: 'Brain fog, difficulty focusing, scattered thoughts' },
  { value: 'Hormonal balance',   icon: '🌊', desc: "Supporting the body's natural cycles" },
]

const INTENTIONS = [
  'Grounding','Heart opening','Dreamwork','Clarity','Protection',
  'Self-love','Release','Creativity','Abundance','Shadow work','Peace','Transformation',
]

const CHAKRAS = [
  { value: 'Root',         color: '#C0392B', desc: 'Grounding, safety, stability' },
  { value: 'Sacral',       color: '#E67E22', desc: 'Creativity, pleasure, flow' },
  { value: 'Solar Plexus', color: '#F1C40F', desc: 'Confidence, will, power' },
  { value: 'Heart',        color: '#27AE60', desc: 'Love, compassion, healing' },
  { value: 'Third Eye',    color: '#6B4A8A', desc: 'Intuition, clarity, vision' },
  { value: 'Crown',        color: '#9B59B6', desc: 'Spirituality, connection, divine' },
]

const WELLNESS_STEPS = ['0','1','contact','2w','3w','4w','confirm']
const RITUAL_STEPS   = ['0','1','contact','2r','3r','4r','5r','6r','confirm']

export default function CustomBlendPage() {
  const [step, setStep]   = useState('0')
  const [path, setPath]   = useState<Path>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Contact info
  const [customerName, setCustomerName]   = useState('')
  const [customerEmail, setCustomerEmail] = useState('')

  const [physical, setPhysical]               = useState<string[]>([])
  const [physicalWrite, setPhysicalWrite]     = useState('')
  const [physicalOpen, setPhysicalOpen]       = useState(false)

  const [intentions, setIntentions]             = useState<string[]>([])
  const [intentionWrite, setIntentionWrite]     = useState('')
  const [intentionOpen, setIntentionOpen]       = useState(false)

  const [physicalR, setPhysicalR]               = useState<string[]>([])
  const [physicalRWrite, setPhysicalRWrite]     = useState('')
  const [physicalROpen, setPhysicalROpen]       = useState(false)

  const [chakra, setChakra] = useState<string | null>(null)

  const [wStory1, setWStory1] = useState('')
  const [wStory2, setWStory2] = useState('')
  const [wStory3, setWStory3] = useState('')
  const [rStory1, setRStory1] = useState('')
  const [rStory2, setRStory2] = useState('')
  const [rStory3, setRStory3] = useState('')

  const steps  = path === 'ritual' ? RITUAL_STEPS : WELLNESS_STEPS
  const idx    = steps.indexOf(step)
  const total  = steps.length - 3 // exclude step 0, contact, and confirm
  const pct    = steps.length > 1 ? Math.round((idx / (steps.length - 1)) * 100) : 0

  function go(id: string) {
    setStep(id)
    setSubmitError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function selectPath(p: Path) { setPath(p) }

  function continueFromPath() {
    if (!path) return
    go('contact')
  }

  function toggleArr(arr: string[], set: (v: string[]) => void, val: string) {
    set(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val])
  }

  async function handleSubmit() {
    if (!customerName.trim() || !customerEmail.trim()) return
    setSubmitting(true)
    setSubmitError('')

    const payload = path === 'wellness' ? {
      customer_name: customerName.trim(),
      customer_email: customerEmail.trim(),
      path: 'wellness',
      physical_needs: physical,
      physical_writein: physicalWrite || null,
      story_experiencing: wStory1 || null,
      story_desired_effect: wStory2 || null,
      story_other: wStory3 || null,
    } : {
      customer_name: customerName.trim(),
      customer_email: customerEmail.trim(),
      path: 'ritual',
      intentions,
      intention_writein: intentionWrite || null,
      physical_needs_ritual: physicalR,
      physical_ritual_writein: physicalRWrite || null,
      chakra,
      story_season: rStory1 || null,
      story_symbols: rStory2 || null,
      story_allergies: rStory3 || null,
    }

    const { data, error } = await getSupabase()
      .from('blend_requests')
      .insert([payload])
      .select('id')
      .single()

    if (error || !data) {
      console.error('Supabase error:', error)
      setSubmitError(`Error: ${error?.message ?? 'Could not save request'}`)
      setSubmitting(false)
      return
    }

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        blendRequestId: data.id,
        path,
        customerEmail: customerEmail.trim(),
      }),
    })

    const json = await res.json()

    if (!res.ok || !json.url) {
      setSubmitError('Could not start checkout. Please try again.')
      setSubmitting(false)
      return
    }

    window.location.href = json.url
  }

  const stepLabel: Record<string, string> = {
    '0': 'Custom Blend Builder',
    '1': 'Custom Blend · Choose your path',
    'contact': 'Custom Blend · Your details',
    '2w': 'Custom Blend · Physical needs',
    '3w': 'Custom Blend · Your story',
    '4w': 'Custom Blend · Review',
    '2r': 'Ritual Custom Blend · Intentions',
    '3r': 'Ritual Custom Blend · Physical needs',
    '4r': 'Ritual Custom Blend · Chakra',
    '5r': 'Ritual Custom Blend · Your story',
    '6r': 'Ritual Custom Blend · Review',
    'confirm': 'Request received ✦',
  }

  const innerSteps = steps.slice(1, steps.length - 1)

  function SummaryItem({ label, value }: { label: string; value: string | string[] | null }) {
    const display = Array.isArray(value) ? value.join(', ') : value
    if (!display) return null
    return (
      <div className="review-summary__item">
        <p className="review-summary__label">{label}</p>
        <p className="review-summary__value">{display}</p>
      </div>
    )
  }

  const contactValid = customerName.trim().length > 0 && customerEmail.trim().includes('@')

  return (
    <>
      <header className="builder-header">
        <span className="builder-header__logo">
          <span>Tea</span> <span>Wizard</span>
        </span>
        <span className="builder-header__step-label">{stepLabel[step]}</span>
        <Link href="/" className="btn-outline-white">Save &amp; exit</Link>
      </header>

      <div className="builder-progress-bar-wrap">
        <div className="builder-progress-bar" style={{ width: `${pct}%` }} />
      </div>

      <main className="builder-content">
        {step !== '0' && step !== 'confirm' && (
          <>
            <div className="builder-dots">
              {innerSteps.map((s, i) => {
                const absIdx = i + 1
                if (absIdx < idx)   return <div key={s} className="builder-dot builder-dot--done" />
                if (absIdx === idx) return <div key={s} className="builder-dot builder-dot--current" />
                return <div key={s} className="builder-dot" />
              })}
            </div>
            <p className="builder-step-count">Step {idx} of {total + 1}</p>
          </>
        )}

        {/* ===== STEP 0 — Welcome ===== */}
        {step === '0' && (
          <div className="step-welcome">
            <div className="step-welcome__glyph">✨</div>
            <p className="eyebrow step-welcome__eyebrow">Custom Blend Builder</p>
            <h1 className="step-welcome__headline">Your blend begins here</h1>
            <p className="step-welcome__body">
              Answer a few questions about what you&apos;re seeking — physically, emotionally, and spiritually.
              Tori will review your request personally and respond within 2–3 business days with your
              custom blend recommendation. A small deposit is collected at submission to reserve your spot.
            </p>
            <div className="builder-nav builder-nav--center">
              <button className="btn-filled" onClick={() => go('1')}>Begin →</button>
            </div>
          </div>
        )}

        {/* ===== STEP 1 — Path selection ===== */}
        {step === '1' && (
          <>
            <h2 className="step-heading">What kind of blend are you looking for?</h2>
            <p className="step-sub">Choose a path — this shapes the questions ahead.</p>
            <div className="path-cards">
              <div
                className={`path-card ${path === 'wellness' ? 'path-card--selected' : ''}`}
                onClick={() => selectPath('wellness')}
              >
                <span className="path-card__icon">🌿</span>
                <p className="path-card__tag">Wellness · body · everyday needs</p>
                <p className="path-card__title">Custom Blend</p>
                <p className="path-card__desc">You have a specific physical need — like sleep, stress, digestion, or energy. Simple, effective, and crafted for your body.</p>
              </div>
              <div
                className={`path-card ${path === 'ritual' ? 'path-card--selected' : ''}`}
                onClick={() => selectPath('ritual')}
              >
                <span className="path-card__badge">Reiki infused · intention &amp; spirit</span>
                <span className="path-card__icon">🔮</span>
                <p className="path-card__tag">Spiritual · chakra · intention</p>
                <p className="path-card__title">Ritual Custom Blend</p>
                <p className="path-card__desc">You&apos;re seeking something deeper — a blend charged with Reiki energy and crafted around your spiritual intentions and ritual practice.</p>
              </div>
            </div>
            <div className="builder-nav">
              <button className="btn-outline" onClick={() => go('0')}>← Back</button>
              <button className="btn-filled" disabled={!path} onClick={continueFromPath}>Continue →</button>
            </div>
          </>
        )}

        {/* ===== CONTACT INFO ===== */}
        {step === 'contact' && (
          <>
            <h2 className="step-heading">Where should I <em>reach you?</em></h2>
            <p className="step-sub">So Tori can send your blend recommendation and invoice.</p>
            <div className="story-field">
              <label>Your name</label>
              <textarea
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="First name is fine"
                rows={1}
                style={{ minHeight: 'auto', resize: 'none', paddingTop: 12, paddingBottom: 12 }}
              />
            </div>
            <div className="story-field">
              <label>Email address</label>
              <textarea
                value={customerEmail}
                onChange={e => setCustomerEmail(e.target.value)}
                placeholder="you@example.com"
                rows={1}
                style={{ minHeight: 'auto', resize: 'none', paddingTop: 12, paddingBottom: 12 }}
              />
            </div>
            <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: 28, lineHeight: 1.6 }}>
              Your information is kept private and only used to fulfill your blend request.
            </p>
            <div className="builder-nav">
              <button className="btn-outline" onClick={() => go('1')}>← Back</button>
              <button
                className="btn-filled"
                disabled={!contactValid}
                onClick={() => go(path === 'wellness' ? '2w' : '2r')}
              >Continue →</button>
            </div>
          </>
        )}

        {/* ===== STEP 2W — Physical needs ===== */}
        {step === '2w' && (
          <>
            <h2 className="step-heading">What are your <em>physical needs?</em></h2>
            <p className="step-sub">Select everything that feels relevant — choose as many as you like.</p>
            <div className="choice-grid">
              {PHYSICAL_OPTIONS.map(o => (
                <div
                  key={o.value}
                  className={`choice-card ${physical.includes(o.value) ? 'choice-card--selected' : ''}`}
                  onClick={() => toggleArr(physical, setPhysical, o.value)}
                >
                  <span className="choice-card__icon">{o.icon}</span>
                  <div>
                    <p className="choice-card__label">{o.value}</p>
                    <p className="choice-card__desc">{o.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="writein-toggle" onClick={() => setPhysicalOpen(!physicalOpen)}>
              <p className="writein-toggle__label">
                {physicalOpen ? 'Tap to close' : "Don't see what you need? Write it in"}
              </p>
              <div className={`writein-area ${physicalOpen ? 'writein-area--open' : ''}`} onClick={e => e.stopPropagation()}>
                <textarea value={physicalWrite} onChange={e => setPhysicalWrite(e.target.value)} placeholder="Describe your own physical need..." rows={3} />
              </div>
            </div>
            <div className="builder-nav">
              <button className="btn-outline" onClick={() => go('contact')}>← Back</button>
              <button className="btn-filled" onClick={() => go('3w')}>Continue →</button>
            </div>
          </>
        )}

        {/* ===== STEP 3W — Story ===== */}
        {step === '3w' && (
          <>
            <h2 className="step-heading">Tell me a little <em>more</em></h2>
            <p className="step-sub">The more detail you share, the more intentional your blend can be.</p>
            <div className="story-field">
              <label>What are you experiencing? <span style={{ fontWeight: 300, color: '#888' }}>(symptoms, feelings, patterns)</span></label>
              <textarea value={wStory1} onChange={e => setWStory1(e.target.value)} placeholder="I've been having anxiety that keeps me up at night..." rows={4} />
            </div>
            <div className="story-field">
              <label>What do you want this blend to do for you?</label>
              <textarea value={wStory2} onChange={e => setWStory2(e.target.value)} placeholder="I want to feel more grounded and able to unwind after work..." rows={4} />
            </div>
            <div className="story-field">
              <label>Anything else I should know? <span style={{ fontWeight: 300, color: '#888' }}>(allergies, medications, preferences)</span></label>
              <textarea value={wStory3} onChange={e => setWStory3(e.target.value)} placeholder="Optional..." rows={3} />
            </div>
            <div className="builder-nav">
              <button className="btn-outline" onClick={() => go('2w')}>← Back</button>
              <button className="btn-filled" onClick={() => go('4w')}>Continue →</button>
            </div>
          </>
        )}

        {/* ===== STEP 4W — Review & submit ===== */}
        {step === '4w' && (
          <>
            <h2 className="step-heading">Review your <em>request</em></h2>
            <p className="step-sub">Give everything a final look before you submit.</p>
            <div className="review-banner">
              I&apos;ll review your request <strong>personally</strong> and reach out within <strong>2–3 business days</strong>.
              A <strong>$15 deposit</strong> is collected now to reserve your spot — the remaining $23 is invoiced after I craft your recommendation.
            </div>
            <div className="review-summary">
              <SummaryItem label="Name" value={customerName} />
              <SummaryItem label="Email" value={customerEmail} />
              <SummaryItem label="Path" value="Custom Blend (Wellness)" />
              <SummaryItem label="Physical needs" value={physical} />
              {physicalWrite && <SummaryItem label="Written need" value={physicalWrite} />}
              <SummaryItem label="What you're experiencing" value={wStory1} />
              <SummaryItem label="What you want this blend to do" value={wStory2} />
              <SummaryItem label="Allergies / medications / preferences" value={wStory3} />
            </div>
            {submitError && <p style={{ color: '#c0392b', fontSize: '0.9rem', marginBottom: 16 }}>{submitError}</p>}
            <div className="builder-nav builder-nav--center">
              <button className="btn-outline" style={{ marginRight: 16 }} onClick={() => go('3w')}>← Back</button>
              <button className="btn-submit" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Preparing checkout...' : 'Submit & pay $15 deposit ✦'}
              </button>
            </div>
          </>
        )}

        {/* ===== STEP 2R — Intentions ===== */}
        {step === '2r' && (
          <>
            <h2 className="step-heading">What are your <em>intentions?</em></h2>
            <p className="step-sub">Select all that resonate — this is what your blend will be charged with.</p>
            <div className="pill-grid">
              {INTENTIONS.map(i => (
                <div
                  key={i}
                  className={`pill-option ${intentions.includes(i) ? 'pill-option--selected' : ''}`}
                  onClick={() => toggleArr(intentions, setIntentions, i)}
                >{i}</div>
              ))}
            </div>
            <div className="writein-toggle" onClick={() => setIntentionOpen(!intentionOpen)}>
              <p className="writein-toggle__label">
                {intentionOpen ? 'Tap to close' : "Don't see your intention? Write it in"}
              </p>
              <div className={`writein-area ${intentionOpen ? 'writein-area--open' : ''}`} onClick={e => e.stopPropagation()}>
                <textarea value={intentionWrite} onChange={e => setIntentionWrite(e.target.value)} placeholder="Describe your intention..." rows={3} />
              </div>
            </div>
            <div className="builder-nav">
              <button className="btn-outline" onClick={() => go('contact')}>← Back</button>
              <button className="btn-filled" onClick={() => go('3r')}>Continue →</button>
            </div>
          </>
        )}

        {/* ===== STEP 3R — Wellness (ritual path) ===== */}
        {step === '3r' && (
          <>
            <h2 className="step-heading">Any <em>physical needs</em> to weave in?</h2>
            <p className="step-sub">Your body matters too — select anything that applies. Completely optional.</p>
            <div className="choice-grid">
              {PHYSICAL_OPTIONS.map(o => (
                <div
                  key={o.value}
                  className={`choice-card ${physicalR.includes(o.value) ? 'choice-card--selected' : ''}`}
                  onClick={() => toggleArr(physicalR, setPhysicalR, o.value)}
                >
                  <span className="choice-card__icon">{o.icon}</span>
                  <div>
                    <p className="choice-card__label">{o.value}</p>
                    <p className="choice-card__desc">{o.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="writein-toggle" onClick={() => setPhysicalROpen(!physicalROpen)}>
              <p className="writein-toggle__label">
                {physicalROpen ? 'Tap to close' : "Don't see what you need? Write it in"}
              </p>
              <div className={`writein-area ${physicalROpen ? 'writein-area--open' : ''}`} onClick={e => e.stopPropagation()}>
                <textarea value={physicalRWrite} onChange={e => setPhysicalRWrite(e.target.value)} placeholder="Describe your own physical need..." rows={3} />
              </div>
            </div>
            <div className="builder-nav">
              <button className="btn-outline" onClick={() => go('2r')}>← Back</button>
              <button className="btn-filled" onClick={() => go('4r')}>Continue →</button>
            </div>
          </>
        )}

        {/* ===== STEP 4R — Chakra ===== */}
        {step === '4r' && (
          <>
            <h2 className="step-heading">Which <em>energy center</em> calls to you?</h2>
            <p className="step-sub">Choose one — your blend will be crafted around this chakra&apos;s qualities.</p>
            <div className="chakra-grid">
              {CHAKRAS.map(c => (
                <div
                  key={c.value}
                  className={`chakra-card ${chakra === c.value ? 'chakra-card--selected' : ''}`}
                  onClick={() => setChakra(c.value)}
                >
                  <div className="chakra-card__dot" style={{ background: c.color }} />
                  <p className="chakra-card__name">{c.value}</p>
                  <p className="chakra-card__desc">{c.desc}</p>
                </div>
              ))}
            </div>
            <div className="builder-nav">
              <button className="btn-outline" onClick={() => go('3r')}>← Back</button>
              <button className="btn-filled" onClick={() => go('5r')}>Continue →</button>
            </div>
          </>
        )}

        {/* ===== STEP 5R — Story (ritual path) ===== */}
        {step === '5r' && (
          <>
            <h2 className="step-heading">Share your <em>story</em></h2>
            <p className="step-sub">The more you share, the more deeply I can weave your intentions into the blend.</p>
            <div className="story-field">
              <label>What season of life are you in? What&apos;s present for you right now?</label>
              <textarea value={rStory1} onChange={e => setRStory1(e.target.value)} placeholder="I'm in a season of releasing old patterns and stepping into..." rows={4} />
            </div>
            <div className="story-field">
              <label>Any other intentions, symbols, or details you want woven into your blend?</label>
              <textarea value={rStory2} onChange={e => setRStory2(e.target.value)} placeholder="The moon, roses, the color blue..." rows={4} />
            </div>
            <div className="story-field">
              <label>Herb sensitivities, allergies, or medications? <span style={{ fontWeight: 300, color: '#888' }}>(optional)</span></label>
              <textarea value={rStory3} onChange={e => setRStory3(e.target.value)} placeholder="Optional..." rows={3} />
            </div>
            <div className="builder-nav">
              <button className="btn-outline" onClick={() => go('4r')}>← Back</button>
              <button className="btn-filled" onClick={() => go('6r')}>Continue →</button>
            </div>
          </>
        )}

        {/* ===== STEP 6R — Review & submit (ritual) ===== */}
        {step === '6r' && (
          <>
            <h2 className="step-heading">Review your <em>ritual request</em></h2>
            <p className="step-sub">Give everything a final look before you submit.</p>
            <div className="review-banner">
              I&apos;ll review your request <strong>personally</strong> and reach out within <strong>2–3 business days</strong>.
              A <strong>$20 deposit</strong> is collected now to reserve your spot — the remaining $38 is invoiced after I craft your recommendation.
            </div>
            <div className="review-summary">
              <SummaryItem label="Name" value={customerName} />
              <SummaryItem label="Email" value={customerEmail} />
              <SummaryItem label="Path" value="Ritual Custom Blend" />
              <SummaryItem label="Intentions" value={intentions} />
              {intentionWrite && <SummaryItem label="Written intention" value={intentionWrite} />}
              <SummaryItem label="Physical needs" value={physicalR} />
              {physicalRWrite && <SummaryItem label="Written need" value={physicalRWrite} />}
              <SummaryItem label="Chakra" value={chakra} />
              <SummaryItem label="Season of life" value={rStory1} />
              <SummaryItem label="Other intentions / symbols" value={rStory2} />
              <SummaryItem label="Allergies / medications" value={rStory3} />
            </div>
            {submitError && <p style={{ color: '#c0392b', fontSize: '0.9rem', marginBottom: 16 }}>{submitError}</p>}
            <div className="builder-nav builder-nav--center">
              <button className="btn-outline" style={{ marginRight: 16 }} onClick={() => go('5r')}>← Back</button>
              <button className="btn-submit" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Preparing checkout...' : 'Submit & pay $20 deposit ✦'}
              </button>
            </div>
          </>
        )}

        {/* ===== CONFIRMATION ===== */}
        {step === 'confirm' && (
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
              <strong>A confirmation has been sent to {customerEmail || 'your inbox'}.</strong><br />
              Tori will reach out within 2–3 business days with your custom blend recommendation.
            </div>
            <Link href="/" className="btn-outline">Back to Tea Wizard →</Link>
          </div>
        )}
      </main>
    </>
  )
}
