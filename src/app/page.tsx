import Link from 'next/link'
import {
  FileText,
  Image,
  Zap,
  Shield,
  Clock,
  Download,
  Merge,
  Scissors,
  Minimize2,
  FileImage,
  ImagePlus,
  Crop
} from 'lucide-react'

const pdfTools = [
  {
    name: 'Merge PDF',
    description: 'Combine multiple PDF files into one',
    icon: Merge,
    href: '/tools/pdf/merge',
    color: 'bg-red-500',
  },
  {
    name: 'Split PDF',
    description: 'Extract pages from your PDF',
    icon: Scissors,
    href: '/tools/pdf/split',
    color: 'bg-orange-500',
  },
  {
    name: 'Compress PDF',
    description: 'Reduce PDF file size',
    icon: Minimize2,
    href: '/tools/pdf/compress',
    color: 'bg-yellow-500',
  },
  {
    name: 'PDF to Image',
    description: 'Convert PDF pages to images',
    icon: FileImage,
    href: '/tools/pdf/to-image',
    color: 'bg-green-500',
  },
]

const imageTools = [
  {
    name: 'Compress Image',
    description: 'Reduce image file size',
    icon: Minimize2,
    href: '/tools/image/compress',
    color: 'bg-blue-500',
  },
  {
    name: 'Resize Image',
    description: 'Change image dimensions',
    icon: Crop,
    href: '/tools/image/resize',
    color: 'bg-indigo-500',
  },
  {
    name: 'Convert Image',
    description: 'Convert between formats',
    icon: ImagePlus,
    href: '/tools/image/convert',
    color: 'bg-purple-500',
  },
  {
    name: 'Image to PDF',
    description: 'Create PDF from images',
    icon: FileText,
    href: '/tools/image/to-pdf',
    color: 'bg-pink-500',
  },
]

const features = [
  {
    name: 'Lightning Fast',
    description: 'Process files in seconds with our optimized tools',
    icon: Zap,
  },
  {
    name: 'Secure & Private',
    description: 'Files are automatically deleted after processing',
    icon: Shield,
  },
  {
    name: 'No Installation',
    description: 'Works directly in your browser',
    icon: Download,
  },
  {
    name: 'Available 24/7',
    description: 'Access your tools anytime, anywhere',
    icon: Clock,
  },
]

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Free Online Tools for
            <span className="block text-primary-200">PDF & Images</span>
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Merge, compress, convert, and edit your files instantly.
            No installation required. 100% free to use.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#pdf-tools" className="btn-primary bg-white text-primary-700 hover:bg-gray-100">
              PDF Tools
            </Link>
            <Link href="#image-tools" className="btn-secondary bg-primary-700 text-white hover:bg-primary-600 border border-primary-500">
              Image Tools
            </Link>
          </div>
        </div>
      </section>

      {/* PDF Tools Section */}
      <section id="pdf-tools" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <FileText className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              PDF Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to work with PDF files
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pdfTools.map((tool) => (
              <Link key={tool.name} href={tool.href} className="tool-card group">
                <div className={`inline-flex items-center justify-center w-12 h-12 ${tool.color} rounded-lg mb-4 group-hover:scale-110 transition-transform`}>
                  <tool.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {tool.name}
                </h3>
                <p className="text-gray-600">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Image Tools Section */}
      <section id="image-tools" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Image className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Image Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful tools for all your image needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {imageTools.map((tool) => (
              <Link key={tool.name} href={tool.href} className="tool-card group">
                <div className={`inline-flex items-center justify-center w-12 h-12 ${tool.color} rounded-lg mb-4 group-hover:scale-110 transition-transform`}>
                  <tool.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {tool.name}
                </h3>
                <p className="text-gray-600">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose ToolBox Pro?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Trusted by thousands of users every day
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.name} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.name}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Need Unlimited Access?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Upgrade to Pro for unlimited conversions, priority processing, and no ads.
          </p>
          <Link href="/pricing" className="btn-primary bg-white text-primary-700 hover:bg-gray-100 inline-block">
            View Pricing - From 9.99/month
          </Link>
        </div>
      </section>
    </div>
  )
}
