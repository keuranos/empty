import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      '5 conversions per day',
      'Basic file processing',
      'Standard processing speed',
      'Files up to 10MB',
    ],
  },
  pro_monthly: {
    name: 'Pro Monthly',
    price: 9.99,
    priceId: process.env.STRIPE_PRICE_MONTHLY,
    features: [
      'Unlimited conversions',
      'All tools included',
      'Priority processing',
      'Files up to 100MB',
      'No ads',
      'Email support',
    ],
  },
  pro_yearly: {
    name: 'Pro Yearly',
    price: 79.99,
    priceId: process.env.STRIPE_PRICE_YEARLY,
    features: [
      'Everything in Pro Monthly',
      'Save 33% annually',
      'Priority email support',
      'Early access to new features',
    ],
  },
}
