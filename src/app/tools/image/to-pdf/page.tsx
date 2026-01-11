'use client'

import { useState } from 'react'
import { FileUploader } from '@/components/FileUploader'
import { FileText, Download, Loader2, ArrowUp, ArrowDown, Trash2 } from 'lucide-react'

export default function ImageToPDFPage() {
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

  const handleConvert = async () => {
    if (files.length === 0) {
      setError('Please select at least one image')
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

      const response = await fetch('/api/tools/image/to-pdf', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create PDF')
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
            <FileText className="w-8 h-8 text-pink-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Image to PDF
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create a PDF document from your images
          </p>
        </div>

        <div className="card mb-8">
          <FileUploader
            accept={{
              'image/jpeg': ['.jpg', '.jpeg'],
              'image/png': ['.png'],
              'image/webp': ['.webp'],
              'image/gif': ['.gif'],
            }}
            maxFiles={20}
            onFilesChange={setFiles}
            files={files}
          />

          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Page order (drag to reorder)
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
                  <span>Creating PDF...</span>
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  <span>Create PDF</span>
                </>
              )}
            </button>
          ) : (
            <>
              <a
                href={resultUrl}
                download="images.pdf"
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Download PDF</span>
              </a>
              <button
                onClick={() => {
                  setFiles([])
                  setResultUrl(null)
                }}
                className="btn-secondary"
              >
                Create Another PDF
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
