import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const PRICES = {
  wellness: { amount: 1500, label: '$15 deposit — Custom Wellness Blend' },
  ritual:   { amount: 2000, label: '$20 deposit — Ritual Custom Blend (Reiki Infused)' },
}

export async function POST(req: NextRequest) {
  try {
    const { blendRequestId, path, customerEmail } = await req.json()

    if (!blendRequestId || !path || !(path in PRICES)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const price = PRICES[path as keyof typeof PRICES]
    const origin = req.headers.get('origin') || 'https://tea-wizard.vercel.app'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: price.label },
            unit_amount: price.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: customerEmail,
      metadata: { blendRequestId, path },
      success_url: `${origin}/custom-blend/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/custom-blend`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
