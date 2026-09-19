import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadDataset } from '../services/api'

function Upload() {
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')

  const MAX_FILE_SIZE = 25 * 1024 * 1024

  // =====================================================
  // VALIDATE FILE
  // =====================================================
  const validateFile = (selectedFile) => {
    if (!selectedFile) {
      return 'Please select a file.'
    }

    const fileName = selectedFile.name.toLowerCase()

    const isValidType =
      fileName.endsWith('.csv') ||
      fileName.endsWith('.xlsx')

    if (!isValidType) {
      return 'Only CSV and XLSX files are supported.'
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      return 'File size must be less than 25 MB.'
    }

    return ''
  }

  // =====================================================
  // SELECT FILE
  // =====================================================
  const selectFile = (selectedFile) => {
    const validationError = validateFile(selectedFile)

    if (validationError) {
      setFile(null)
      setError(validationError)
      return
    }

    setFile(selectedFile)
    setError('')
  }

  // =====================================================
  // FILE INPUT
  // =====================================================
  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0]
    selectFile(selectedFile)
  }

  // =====================================================
  // DRAG & DROP
  // =====================================================
  const handleDragOver = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)

    const droppedFile = event.dataTransfer.files?.[0]
    selectFile(droppedFile)
  }

  // =====================================================
  // OPEN FILE PICKER
  // =====================================================
  const handleChooseFile = () => {
    fileInputRef.current?.click()
  }

  // =====================================================
  // REMOVE FILE
  // =====================================================
  const handleRemoveFile = () => {
    setFile(null)
    setError('')

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // =====================================================
  // UPLOAD DATASET
  // =====================================================
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a CSV or XLSX file first.')
      return
    }

    const validationError = validateFile(file)

    if (validationError) {
      setError(validationError)
      return
    }

    setIsUploading(true)
    setError('')

    try {
      const data = await uploadDataset(file)

      // Save backend response
      localStorage.setItem(
        'datacanvas_upload_result',
        JSON.stringify(data)
      )

      // Open Dataset Overview after successful upload
      navigate('/overview')
    } catch (err) {
      if (err.response?.data?.error?.message) {
        setError(err.response.data.error.message)
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Unable to upload dataset. Please try again.')
      }
    } finally {
      setIsUploading(false)
    }
  }

  // =====================================================
  // RETRY
  // =====================================================
  const handleRetry = () => {
    setError('')
  }

  // =====================================================
  // FILE SIZE
  // =====================================================
  const formatFileSize = (size) => {
    if (size < 1024) {
      return `${size} B`
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`
    }

    return `${(size / (1024 * 1024)).toFixed(2)} MB`
  }

  // =====================================================
  // FILE TYPE
  // =====================================================
  const getFileType = (fileName) => {
    const extension = fileName
      .split('.')
      .pop()
      ?.toLowerCase()

    if (extension === 'csv') {
      return 'CSV'
    }

    if (extension === 'xlsx') {
      return 'XLSX'
    }

    return 'Unknown'
  }

  return (
    <div className="relative min-h-screen text-white">
      {/* =====================================================
          PAGE HEADER
          ===================================================== */}
      <div className="relative z-10 max-w-4xl rounded-2xl border border-white/6 bg-[#050816]/15 px-5 py-4 backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#A69CFF]">
          Dataset Workspace
        </p>

        <h2 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
          Upload{' '}
          <span className="bg-linear-to-r from-[#A794FF] via-[#8D89FF] to-[#58D7FF] bg-clip-text text-transparent">
            Dataset
          </span>
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-7 text-white md:text-base">
          Upload a CSV or Excel dataset to start your analysis,
          inspect its structure and prepare it for machine learning.
        </p>
      </div>

      {/* =====================================================
          UPLOAD CARD
          ===================================================== */}
      <div className="relative z-10 mt-6 max-w-5xl">
        <div className="relative overflow-hidden rounded-[28px] border border-white/9 bg-[#090E1D]/55 p-6 shadow-[0_0_80px_rgba(37,99,235,0.08)] backdrop-blur-lg md:p-8">
          {/* Background Glows */}
          <div className="pointer-events-none absolute -top-32 -right-32 h-[360px] w-[360px] rounded-full bg-[#5148D8]/12 blur-[120px]" />

          <div className="pointer-events-none absolute -bottom-32 -left-24 h-[320px] w-[320px] rounded-full bg-[#2563EB]/8 blur-[120px]" />

          {/* =================================================
              OUTER DROPZONE
              ================================================= */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleChooseFile}
            className={`
              relative z-10
              flex min-h-[400px]
              cursor-pointer
              flex-col items-center justify-center
              rounded-[24px]
              border-2 border-dashed
              px-6 py-10
              text-center
              transition-all duration-300
              md:min-h-[450px]
              ${
                isDragging
                  ? 'scale-[1.01] border-[#8B82FF] bg-[#5148D8]/15 shadow-[0_0_40px_rgba(81,72,216,0.2)]'
                  : 'border-[#59617A]/70 bg-[#050816]/20 hover:border-[#756BFF]/60 hover:bg-[#5148D8]/5'
              }
            `}
          >
            {/* =================================================
                INNER CUTOUT
                ================================================= */}
            <div
              className={`
                flex w-full max-w-2xl
                flex-col items-center justify-center
                rounded-2xl
                border-2 border-dashed
                px-8 py-14
                transition-all duration-300
                ${
                  isDragging
                    ? 'border-[#A497FF] bg-[#5148D8]/10 shadow-[inset_0_0_35px_rgba(81,72,216,0.08)]'
                    : 'border-[#3D4660] bg-[#080D1B]/50'
                }
              `}
            >
              {/* Upload Icon */}
              <div
                className={`
                  flex h-[76px] w-[76px]
                  items-center justify-center
                  rounded-2xl
                  border border-[#756BFF]/30
                  bg-[#5148D8]/10
                  shadow-[0_0_35px_rgba(81,72,216,0.15)]
                  transition-transform duration-300
                  ${isDragging ? 'scale-110' : ''}
                `}
              >
                <svg
                  className="h-10 w-10 text-[#A497FF]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 16V4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M7 9l5-5 5 5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M5 20h14"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Title */}
              <h3 className="mt-6 text-2xl font-bold text-white md:text-3xl">
                {isDragging
                  ? 'Drop your dataset here'
                  : 'Drag & Drop your dataset here'}
              </h3>

              {/* Or */}
              <p className="mt-3 text-sm font-medium text-[#7F8AA4]">
                or
              </p>

              {/* Choose File Button */}
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  handleChooseFile()
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-[#5148D8] to-[#6D5CFF] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(81,72,216,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_42px_rgba(81,72,216,0.4)]"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 16V4" />
                  <path d="M7 9l5-5 5 5" />
                  <path d="M5 20h14" />
                </svg>

                Choose File
              </button>

              {/* Supported Files */}
              <p className="mt-4 text-xs text-white/50">
                CSV or XLSX • Maximum 25 MB
              </p>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* =================================================
              SELECTED FILE
              ================================================= */}
          {file && (
            <div className="relative z-10 mt-7 w-full">
              <div className="rounded-2xl border border-[#4F8CFF]/20 bg-[#3158FF]/7 p-4 backdrop-blur-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    {/* File Icon */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#3158FF]/10 text-[#73A4FF]">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 4h9l5 5v11H5z" />
                        <path d="M14 4v5h5" />
                      </svg>
                    </div>

                    {/* File Details */}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">
                        Selected file
                      </p>

                      <p className="mt-1 truncate text-sm text-white/80">
                        {file.name}
                      </p>

                      <p className="mt-1 text-xs text-white/50">
                        {getFileType(file.name)} • {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="w-fit rounded-lg border border-white/8 px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/5 hover:text-white"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Upload Button */}
              <button
                type="button"
                onClick={handleUpload}
                disabled={isUploading}
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#22C55E]/25 bg-[#22C55E]/10 px-7 py-3.5 text-sm font-semibold text-[#5BE58A] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#22C55E]/15 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-30"
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="3"
                      />

                      <path
                        d="M21 12a9 9 0 0 0-9-9"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                    </svg>

                    Uploading...
                  </>
                ) : (
                  <>
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 16V4" />
                      <path d="M7 9l5-5 5 5" />
                      <path d="M5 20h14" />
                    </svg>

                    Upload Dataset
                  </>
                )}
              </button>
            </div>
          )}

          {/* =================================================
              ERROR STATE
              ================================================= */}
          {error && (
            <div className="relative z-10 mt-5 w-full rounded-2xl border border-red-400/20 bg-red-500/8 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-300">
                  !
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-red-200">
                    Upload failed
                  </p>

                  <p className="mt-1 text-sm leading-6 text-red-200/80">
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={handleRetry}
                    className="mt-3 text-xs font-semibold text-red-200 underline underline-offset-4 transition hover:text-white"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Upload