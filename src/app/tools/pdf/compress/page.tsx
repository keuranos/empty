'use client'

import { useState } from 'react'
import { FileUploader } from '@/components/FileUploader'
import { Minimize2, Download, Loader2 } from 'lucide-react'

export default function CompressPDFPage() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<{ url: string; originalSize: number; compressedSize: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium')

  const handleCompress = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file to compress')
      return
    }

    setIsProcessing(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', files[0])
      formData.append('quality', quality)

      const response = await fetch('/api/tools/pdf/compress', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to compress PDF')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      setResult({
        url,
        originalSize: files[0].size,
        compressedSize: blob.size,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const compressionRate = result
    ? Math.round((1 - result.compressedSize / result.originalSize) * 100)
    : 0

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
            <Minimize2 className="w-8 h-8 text-yellow-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Compress PDF
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Reduce PDF file size while maintaining quality. Perfect for email attachments.
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
                Compression Level
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {(['low', 'medium', 'high'] as const).map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuality(q)}
                    className={`px-4 py-3 rounded-lg border-2 transition-colors ${
                      quality === q
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium capitalize">{q}</div>
                    <div className="text-xs text-gray-500">
                      {q === 'low' && 'Best quality'}
                      {q === 'medium' && 'Balanced'}
                      {q === 'high' && 'Smallest size'}
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

        {result && (
          <div className="card mb-8 text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {compressionRate}% smaller
            </div>
            <p className="text-gray-600">
              {formatFileSize(result.originalSize)} → {formatFileSize(result.compressedSize)}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!result ? (
            <button
              onClick={handleCompress}
              disabled={files.length === 0 || isProcessing}
              className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Compressing...</span>
                </>
              ) : (
                <>
                  <Minimize2 className="w-5 h-5" />
                  <span>Compress PDF</span>
                </>
              )}
            </button>
          ) : (
            <>
              <a
                href={result.url}
                download="compressed.pdf"
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Download Compressed PDF</span>
              </a>
              <button
                onClick={() => {
                  setFiles([])
                  setResult(null)
                }}
                className="btn-secondary"
              >
                Compress Another File
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
