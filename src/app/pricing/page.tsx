'use client'

import { useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { Check, Loader2, Zap } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '0',
    period: '',
    description: 'Perfect for occasional use',
    features: [
      '5 conversions per day',
      'All basic tools',
      'Files up to 10MB',
      'Standard processing',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '9.99',
    period: '/month',
    yearlyPrice: '79.99',
    yearlyPeriod: '/year',
    description: 'Best for professionals',
    features: [
      'Unlimited conversions',
      'All tools included',
      'Files up to 100MB',
      'Priority processing',
      'No ads',
      'Email support',
      'API access (coming soon)',
    ],
    cta: 'Upgrade to Pro',
    popular: true,
  },
]

export default function PricingPage() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const handleCheckout = async (planName: string) => {
    if (!session) {
      signIn('google')
      return
    }

    if (planName === 'Free') {
      return
    }

    setIsLoading(true)

    try {
      const priceId = billingPeriod === 'monthly'
        ? process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY
        : process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId, billingPeriod }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Failed to create checkout session')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Choose the plan that works best for you. Upgrade anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={billingPeriod === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-500'}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-14 h-8 bg-primary-600 rounded-full transition-colors"
            >
              <span
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  billingPeriod === 'yearly' ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={billingPeriod === 'yearly' ? 'text-gray-900 font-medium' : 'text-gray-500'}>
              Yearly
              <span className="ml-2 text-green-600 text-sm font-medium">Save 33%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative card ${
                plan.popular
                  ? 'border-2 border-primary-500 shadow-lg'
                  : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Zap className="w-4 h-4" />
                    <span>Most Popular</span>
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h2>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gray-900">
                    €{plan.name === 'Pro' && billingPeriod === 'yearly' ? plan.yearlyPrice : plan.price}
                  </span>
                  <span className="text-gray-500 ml-1">
                    {plan.name === 'Pro' && billingPeriod === 'yearly' ? plan.yearlyPeriod : plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(plan.name)}
                disabled={isLoading || (session?.user?.isPro && plan.name === 'Pro')}
                className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                  plan.popular
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : session?.user?.isPro && plan.name === 'Pro' ? (
                  <span>Current Plan</span>
                ) : (
                  <span>{plan.cta}</span>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can cancel your subscription at any time. You'll continue to have Pro access until the end of your billing period.
              </p>
            </div>

            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, Mastercard, American Express) through Stripe, our secure payment processor.
              </p>
            </div>

            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-2">
                Is there a refund policy?
              </h3>
              <p className="text-gray-600">
                We offer a 7-day money-back guarantee. If you're not satisfied, contact us within 7 days of purchase for a full refund.
              </p>
            </div>

            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-2">
                Do you offer team plans?
              </h3>
              <p className="text-gray-600">
                Team plans are coming soon! Contact us at support@toolboxpro.com if you're interested in a team or enterprise solution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
