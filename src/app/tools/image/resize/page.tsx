'use client'

import { useState } from 'react'
import { FileUploader } from '@/components/FileUploader'
import { Crop, Download, Loader2, Link2, Link2Off } from 'lucide-react'

export default function ResizeImagePage() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [maintainAspect, setMaintainAspect] = useState(true)
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null)

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles)
    if (newFiles.length > 0) {
      const img = new Image()
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height })
        setWidth(img.width.toString())
        setHeight(img.height.toString())
      }
      img.src = URL.createObjectURL(newFiles[0])
    }
  }

  const handleWidthChange = (value: string) => {
    setWidth(value)
    if (maintainAspect && originalDimensions && value) {
      const ratio = originalDimensions.height / originalDimensions.width
      setHeight(Math.round(Number(value) * ratio).toString())
    }
  }

  const handleHeightChange = (value: string) => {
    setHeight(value)
    if (maintainAspect && originalDimensions && value) {
      const ratio = originalDimensions.width / originalDimensions.height
      setWidth(Math.round(Number(value) * ratio).toString())
    }
  }

  const handleResize = async () => {
    if (files.length === 0) {
      setError('Please select an image')
      return
    }

    if (!width || !height) {
      setError('Please enter dimensions')
      return
    }

    setIsProcessing(true)
    setError(null)
    setResultUrl(null)

    try {
      const formData = new FormData()
      formData.append('file', files[0])
      formData.append('width', width)
      formData.append('height', height)

      const response = await fetch('/api/tools/image/resize', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to resize image')
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <Crop className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Resize Image
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Change your image dimensions to any size
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
            maxFiles={1}
            onFilesChange={handleFileChange}
            files={files}
          />

          {files.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">
                  New Dimensions
                </h3>
                <button
                  onClick={() => setMaintainAspect(!maintainAspect)}
                  className={`flex items-center space-x-2 text-sm ${
                    maintainAspect ? 'text-primary-600' : 'text-gray-400'
                  }`}
                >
                  {maintainAspect ? <Link2 className="w-4 h-4" /> : <Link2Off className="w-4 h-4" />}
                  <span>Lock aspect ratio</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Width (px)</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Height (px)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              {originalDimensions && (
                <p className="text-sm text-gray-500 mt-2">
                  Original: {originalDimensions.width} x {originalDimensions.height} px
                </p>
              )}
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
              onClick={handleResize}
              disabled={files.length === 0 || isProcessing}
              className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Resizing...</span>
                </>
              ) : (
                <>
                  <Crop className="w-5 h-5" />
                  <span>Resize Image</span>
                </>
              )}
            </button>
          ) : (
            <>
              <a
                href={resultUrl}
                download="resized.png"
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Download Resized Image</span>
              </a>
              <button
                onClick={() => {
                  setFiles([])
                  setResultUrl(null)
                  setWidth('')
                  setHeight('')
                  setOriginalDimensions(null)
                }}
                className="btn-secondary"
              >
                Resize Another Image
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
