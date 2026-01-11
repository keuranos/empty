'use client'

import { useSession, signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Crown,
  FileText,
  Image,
  BarChart3,
  Settings,
  CreditCard,
  CheckCircle,
} from 'lucide-react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const success = searchParams.get('success')

  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Sign in to access your dashboard
        </h1>
        <button
          onClick={() => signIn('google')}
          className="btn-primary"
        >
          Sign in with Google
        </button>
      </div>
    )
  }

  const isPro = session.user?.isPro

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Welcome to Pro!</p>
              <p className="text-green-600 text-sm">Your subscription is now active. Enjoy unlimited access!</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {session.user?.name}</p>
          </div>
          {isPro ? (
            <span className="flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-medium">
              <Crown className="w-5 h-5" />
              <span>Pro Member</span>
            </span>
          ) : (
            <Link
              href="/pricing"
              className="btn-primary flex items-center space-x-2"
            >
              <Crown className="w-5 h-5" />
              <span>Upgrade to Pro</span>
            </Link>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Today's Usage</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isPro ? 'Unlimited' : `${session.user?.usageCount || 0} / 5`}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">PDF Tools</p>
                <p className="text-2xl font-bold text-gray-900">4 Available</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Image className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Image Tools</p>
                <p className="text-2xl font-bold text-gray-900">4 Available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Access</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/tools/pdf/merge"
                className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FileText className="w-5 h-5 text-red-500" />
                <span className="font-medium">Merge PDF</span>
              </Link>
              <Link
                href="/tools/pdf/compress"
                className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FileText className="w-5 h-5 text-yellow-500" />
                <span className="font-medium">Compress PDF</span>
              </Link>
              <Link
                href="/tools/image/compress"
                className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Image className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Compress Image</span>
              </Link>
              <Link
                href="/tools/image/resize"
                className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Image className="w-5 h-5 text-indigo-500" />
                <span className="font-medium">Resize Image</span>
              </Link>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Settings className="w-5 h-5 text-gray-400" />
                  <span>Email</span>
                </div>
                <span className="text-gray-600">{session.user?.email}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <span>Plan</span>
                </div>
                <span className={isPro ? 'text-yellow-600 font-medium' : 'text-gray-600'}>
                  {isPro ? 'Pro' : 'Free'}
                </span>
              </div>

              {!isPro && (
                <Link
                  href="/pricing"
                  className="block w-full text-center btn-primary mt-4"
                >
                  Upgrade to Pro
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
