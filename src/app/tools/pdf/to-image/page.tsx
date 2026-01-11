'use client'

import { useState } from 'react'
import { FileUploader } from '@/components/FileUploader'
import { FileImage, Download, Loader2 } from 'lucide-react'

export default function PDFToImagePage() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [format, setFormat] = useState<'png' | 'jpg'>('png')

  const handleConvert = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file')
      return
    }

    setIsProcessing(true)
    setError(null)
    setResultUrl(null)

    try {
      const formData = new FormData()
      formData.append('file', files[0])
      formData.append('format', format)

      const response = await fetch('/api/tools/pdf/to-image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to convert PDF')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setResultUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <FileImage className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            PDF to Image
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Convert PDF pages to high-quality images
          </p>
        </div>

        <div className="card mb-8">
          <FileUploader
            accept={{ 'application/pdf': ['.pdf'] }}
            maxFiles={1}
            onFilesChange={setFiles}
            files={files}
          />

          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Output Format
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {(['png', 'jpg'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`px-4 py-3 rounded-lg border-2 transition-colors ${
                      format === f
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium uppercase">{f}</div>
                    <div className="text-xs text-gray-500">
                      {f === 'png' && 'Lossless quality'}
                      {f === 'jpg' && 'Smaller file size'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!resultUrl ? (
            <button
              onClick={handleConvert}
              disabled={files.length === 0 || isProcessing}
              className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Converting...</span>
                </>
              ) : (
                <>
                  <FileImage className="w-5 h-5" />
                  <span>Convert to {format.toUpperCase()}</span>
                </>
              )}
            </button>
          ) : (
            <>
              <a
                href={resultUrl}
                download={`converted.zip`}
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Download Images (ZIP)</span>
              </a>
              <button
                onClick={() => {
                  setFiles([])
                  setResultUrl(null)
                }}
                className="btn-secondary"
              >
                Convert Another File
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
