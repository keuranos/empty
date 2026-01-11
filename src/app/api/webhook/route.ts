import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

// In-memory storage for demo (use a database in production)
const proUsers: Set<string> = new Set()

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const email = session.metadata?.email || session.customer_email

      if (email) {
        proUsers.add(email)
        console.log(`User ${email} upgraded to Pro`)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const customer = await stripe.customers.retrieve(subscription.customer as string)

      if ('email' in customer && customer.email) {
        proUsers.delete(customer.email)
        console.log(`User ${customer.email} subscription canceled`)
      }
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const customer = await stripe.customers.retrieve(subscription.customer as string)

      if ('email' in customer && customer.email) {
        if (subscription.status === 'active') {
          proUsers.add(customer.email)
        } else {
          proUsers.delete(customer.email)
        }
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}

// Helper to check if user is pro (export for use in other routes)
export function isUserPro(email: string): boolean {
  return proUsers.has(email)
}
