'use client'

import { useState } from 'react'
import { FileUploader } from '@/components/FileUploader'
import { Minimize2, Download, Loader2 } from 'lucide-react'

export default function CompressImagePage() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<Array<{ url: string; name: string; originalSize: number; compressedSize: number }>>([])
  const [error, setError] = useState<string | null>(null)
  const [quality, setQuality] = useState(80)

  const handleCompress = async () => {
    if (files.length === 0) {
      setError('Please select at least one image')
      return
    }

    setIsProcessing(true)
    setError(null)
    setResults([])

    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append('files', file)
      })
      formData.append('quality', quality.toString())

      const response = await fetch('/api/tools/image/compress', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to compress images')
      }

      const data = await response.json()
      setResults(data.results)
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

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Minimize2 className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Compress Images
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Reduce image file sizes without losing quality
          </p>
        </div>

        <div className="card mb-8">
          <FileUploader
            accept={{
              'image/jpeg': ['.jpg', '.jpeg'],
              'image/png': ['.png'],
              'image/webp': ['.webp'],
            }}
            maxFiles={10}
            onFilesChange={setFiles}
            files={files}
          />

          {files.length > 0 && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quality: {quality}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Smaller file</span>
                <span>Better quality</span>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {results.length > 0 && (
          <div className="card mb-8">
            <h3 className="font-medium text-gray-900 mb-4">Results</h3>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{result.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(result.originalSize)} → {formatFileSize(result.compressedSize)}
                      <span className="text-green-600 ml-2">
                        ({Math.round((1 - result.compressedSize / result.originalSize) * 100)}% smaller)
                      </span>
                    </p>
                  </div>
                  <a
                    href={result.url}
                    download={result.name}
                    className="btn-primary text-sm py-2 px-4"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {results.length === 0 ? (
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
                  <span>Compress Images</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => {
                setFiles([])
                setResults([])
              }}
              className="btn-secondary"
            >
              Compress More Images
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
