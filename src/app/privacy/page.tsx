import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - ToolBox Pro',
  description: 'Our privacy policy explains how we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  return (
    <div className="py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
            <p className="text-gray-600 mb-4">
              We collect minimal information necessary to provide our services:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Email address (for account creation via Google OAuth)</li>
              <li>Usage data (number of conversions, tool usage)</li>
              <li>Payment information (processed securely by Stripe)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. File Processing</h2>
            <p className="text-gray-600 mb-4">
              Your files are processed securely and temporarily:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Files are processed in memory and never stored permanently</li>
              <li>All processing happens on secure servers</li>
              <li>Files are automatically deleted after processing</li>
              <li>We do not access or view your file contents</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Data Security</h2>
            <p className="text-gray-600">
              We use industry-standard security measures including HTTPS encryption,
              secure authentication, and regular security audits to protect your data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Third-Party Services</h2>
            <p className="text-gray-600 mb-4">
              We use the following third-party services:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Google OAuth for authentication</li>
              <li>Stripe for payment processing</li>
              <li>Vercel for hosting</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
            <p className="text-gray-600">
              You have the right to access, correct, or delete your personal data.
              Contact us at privacy@toolboxpro.com to exercise these rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Contact Us</h2>
            <p className="text-gray-600">
              For privacy-related questions, contact us at privacy@toolboxpro.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
