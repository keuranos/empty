import Link from 'next/link'
import { FileText, Twitter, Github } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">ToolBox Pro</span>
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              Free online tools for all your PDF and image needs. Fast, secure, and easy to use.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">PDF Tools</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/tools/pdf/merge" className="hover:text-white">Merge PDF</Link></li>
              <li><Link href="/tools/pdf/split" className="hover:text-white">Split PDF</Link></li>
              <li><Link href="/tools/pdf/compress" className="hover:text-white">Compress PDF</Link></li>
              <li><Link href="/tools/pdf/to-image" className="hover:text-white">PDF to Image</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Image Tools</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/tools/image/compress" className="hover:text-white">Compress Image</Link></li>
              <li><Link href="/tools/image/resize" className="hover:text-white">Resize Image</Link></li>
              <li><Link href="/tools/image/convert" className="hover:text-white">Convert Image</Link></li>
              <li><Link href="/tools/image/to-pdf" className="hover:text-white">Image to PDF</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} ToolBox Pro. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
