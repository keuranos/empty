'use client'

import { useState } from 'react'
import { FileUploader } from '@/components/FileUploader'
import { Merge, Download, Loader2, ArrowUp, ArrowDown, Trash2 } from 'lucide-react'

export default function MergePDFPage() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...files]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= files.length) return
    ;[newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]]
    setFiles(newFiles)
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge')
      return
    }

    setIsProcessing(true)
    setError(null)
    setResultUrl(null)

    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append('files', file)
      })

      const response = await fetch('/api/tools/pdf/merge', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to merge PDFs')
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

  const handleDownload = () => {
    if (resultUrl) {
      const a = document.createElement('a')
      a.href = resultUrl
      a.download = 'merged.pdf'
      a.click()
    }
  }

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <Merge className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Merge PDF Files
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Combine multiple PDF files into a single document. Free, fast, and secure.
          </p>
        </div>

        {/* Upload Section */}
        <div className="card mb-8">
          <FileUploader
            accept={{ 'application/pdf': ['.pdf'] }}
            maxFiles={20}
            onFilesChange={setFiles}
            files={files}
          />

          {/* File Reorder List */}
          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Drag to reorder (first file will be first in merged PDF)
              </h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-400 w-6">
                        {index + 1}.
                      </span>
                      <span className="text-sm text-gray-700 truncate max-w-xs">
                        {file.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => moveFile(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveFile(index, 'down')}
                        disabled={index === files.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!resultUrl ? (
            <button
              onClick={handleMerge}
              disabled={files.length < 2 || isProcessing}
              className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Merging...</span>
                </>
              ) : (
                <>
                  <Merge className="w-5 h-5" />
                  <span>Merge PDFs</span>
                </>
              )}
            </button>
          ) : (
            <>
              <button
                onClick={handleDownload}
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Download Merged PDF</span>
              </button>
              <button
                onClick={() => {
                  setFiles([])
                  setResultUrl(null)
                }}
                className="btn-secondary"
              >
                Merge More Files
              </button>
            </>
          )}
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Easy to Use</h3>
            <p className="text-gray-600 text-sm">
              Just upload your files and click merge. It's that simple.
            </p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Secure</h3>
            <p className="text-gray-600 text-sm">
              Files are processed securely and deleted immediately after.
            </p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Free</h3>
            <p className="text-gray-600 text-sm">
              5 free merges per day. Upgrade for unlimited access.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
