'use client'

import { useState } from 'react'
import { FileUploader } from '@/components/FileUploader'
import { Scissors, Download, Loader2 } from 'lucide-react'

export default function SplitPDFPage() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pages, setPages] = useState('')

  const handleSplit = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file')
      return
    }

    if (!pages.trim()) {
      setError('Please enter page numbers (e.g., 1-3, 5, 7-10)')
      return
    }

    setIsProcessing(true)
    setError(null)
    setResultUrl(null)

    try {
      const formData = new FormData()
      formData.append('file', files[0])
      formData.append('pages', pages)

      const response = await fetch('/api/tools/pdf/split', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to split PDF')
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <Scissors className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Split PDF
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Extract specific pages from your PDF file
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pages to extract
              </label>
              <input
                type="text"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                placeholder="e.g., 1-3, 5, 7-10"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="mt-2 text-sm text-gray-500">
                Enter page numbers or ranges separated by commas
              </p>
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
              onClick={handleSplit}
              disabled={files.length === 0 || isProcessing}
              className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Splitting...</span>
                </>
              ) : (
                <>
                  <Scissors className="w-5 h-5" />
                  <span>Split PDF</span>
                </>
              )}
            </button>
          ) : (
            <>
              <a
                href={resultUrl}
                download="split.pdf"
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Download Split PDF</span>
              </a>
              <button
                onClick={() => {
                  setFiles([])
                  setResultUrl(null)
                  setPages('')
                }}
                className="btn-secondary"
              >
                Split Another File
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
