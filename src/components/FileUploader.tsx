'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, X, AlertCircle } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface FileUploaderProps {
  accept: Record<string, string[]>
  maxFiles?: number
  maxSize?: number
  onFilesChange: (files: File[]) => void
  files: File[]
}

export function FileUploader({
  accept,
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024, // 50MB
  onFilesChange,
  files
}: FileUploaderProps) {
  const { data: session } = useSession()
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null)

    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0]
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError(`File too large. Maximum size is ${maxSize / 1024 / 1024}MB`)
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError('Invalid file type')
      } else {
        setError(rejection.errors[0]?.message || 'Error uploading file')
      }
      return
    }

    const freeLimit = 5
    const isPro = session?.user?.isPro

    if (!isPro && files.length + acceptedFiles.length > freeLimit) {
      setError(`Free users can only upload ${freeLimit} files. Upgrade to Pro for unlimited uploads.`)
      return
    }

    if (files.length + acceptedFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`)
      return
    }

    onFilesChange([...files, ...acceptedFiles])
  }, [files, maxFiles, maxSize, onFilesChange, session])

  const removeFile = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    onFilesChange(newFiles)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: maxFiles - files.length,
    maxSize,
  })

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-lg text-primary-600">Drop files here...</p>
        ) : (
          <>
            <p className="text-lg text-gray-600 mb-2">
              Drag & drop files here, or click to select
            </p>
            <p className="text-sm text-gray-400">
              Max file size: {maxSize / 1024 / 1024}MB
            </p>
          </>
        )}
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <File className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
