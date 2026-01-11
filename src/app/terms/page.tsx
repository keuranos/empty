import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - ToolBox Pro',
  description: 'Terms of service for using ToolBox Pro tools and services.',
}

export default function TermsPage() {
  return (
    <div className="py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600">
              By accessing or using ToolBox Pro, you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Service Description</h2>
            <p className="text-gray-600">
              ToolBox Pro provides online tools for PDF and image processing. We offer both
              free and paid subscription tiers with different usage limits and features.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>You must not upload illegal, harmful, or copyrighted content</li>
              <li>You must not attempt to circumvent usage limits</li>
              <li>You must not use automated systems to access our services</li>
              <li>You are responsible for maintaining your account security</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Subscription and Payments</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Pro subscriptions are billed monthly or annually</li>
              <li>You may cancel at any time; access continues until period end</li>
              <li>Refunds are available within 7 days of purchase</li>
              <li>Prices may change with 30 days notice</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Limitation of Liability</h2>
            <p className="text-gray-600">
              ToolBox Pro is provided "as is" without warranties. We are not liable for
              any damages arising from the use of our services, including data loss
              or service interruptions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Changes to Terms</h2>
            <p className="text-gray-600">
              We may update these terms at any time. Continued use of the service
              after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Contact</h2>
            <p className="text-gray-600">
              For questions about these terms, contact us at legal@toolboxpro.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
