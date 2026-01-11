import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ToolBox Pro - Free Online PDF & Image Tools',
  description: 'Free online tools to merge, compress, and convert PDF files. Resize, compress, and convert images. No installation required.',
  keywords: 'PDF tools, image tools, merge PDF, compress PDF, resize image, convert image, online tools, free tools',
  openGraph: {
    title: 'ToolBox Pro - Free Online PDF & Image Tools',
    description: 'Free online tools for PDF and image processing. No installation required.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
