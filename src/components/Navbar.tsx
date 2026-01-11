'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Menu, X, FileText, Image, ChevronDown, User, LogOut, Crown } from 'lucide-react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">ToolBox Pro</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center ml-10 space-x-4">
              <div className="relative">
                <button
                  onClick={() => setToolsOpen(!toolsOpen)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50"
                >
                  <span>Tools</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {toolsOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                    <div className="px-4 py-2 text-sm font-medium text-gray-400">PDF Tools</div>
                    <Link href="/tools/pdf/merge" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Merge PDF</Link>
                    <Link href="/tools/pdf/split" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Split PDF</Link>
                    <Link href="/tools/pdf/compress" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Compress PDF</Link>
                    <Link href="/tools/pdf/to-image" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">PDF to Image</Link>
                    <div className="border-t border-gray-100 my-2"></div>
                    <div className="px-4 py-2 text-sm font-medium text-gray-400">Image Tools</div>
                    <Link href="/tools/image/compress" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Compress Image</Link>
                    <Link href="/tools/image/resize" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Resize Image</Link>
                    <Link href="/tools/image/convert" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Convert Image</Link>
                    <Link href="/tools/image/to-pdf" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Image to PDF</Link>
                  </div>
                )}
              </div>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50">
                Pricing
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                {session.user?.isPro && (
                  <span className="flex items-center space-x-1 text-yellow-600 text-sm font-medium">
                    <Crown className="w-4 h-4" />
                    <span>Pro</span>
                  </span>
                )}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      {session.user?.image ? (
                        <img src={session.user.image} alt="" className="w-8 h-8 rounded-full" />
                      ) : (
                        <User className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 hidden group-hover:block">
                    <div className="px-4 py-2 text-sm text-gray-500">{session.user?.email}</div>
                    <div className="border-t border-gray-100 my-1"></div>
                    <Link href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Dashboard</Link>
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <button onClick={() => signIn('google')} className="text-gray-600 hover:text-gray-900 px-3 py-2">
                  Sign in
                </button>
                <Link href="/pricing" className="btn-primary text-sm py-2">
                  Get Pro
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100">
          <div className="px-4 py-4 space-y-2">
            <div className="text-sm font-medium text-gray-400 px-3 py-2">PDF Tools</div>
            <Link href="/tools/pdf/merge" className="block px-3 py-2 text-gray-700">Merge PDF</Link>
            <Link href="/tools/pdf/compress" className="block px-3 py-2 text-gray-700">Compress PDF</Link>
            <div className="text-sm font-medium text-gray-400 px-3 py-2 pt-4">Image Tools</div>
            <Link href="/tools/image/compress" className="block px-3 py-2 text-gray-700">Compress Image</Link>
            <Link href="/tools/image/resize" className="block px-3 py-2 text-gray-700">Resize Image</Link>
            <div className="border-t border-gray-100 my-4"></div>
            <Link href="/pricing" className="block px-3 py-2 text-gray-700">Pricing</Link>
            {session ? (
              <button onClick={() => signOut()} className="block px-3 py-2 text-gray-700">Sign out</button>
            ) : (
              <button onClick={() => signIn('google')} className="block px-3 py-2 text-primary-600">Sign in</button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
