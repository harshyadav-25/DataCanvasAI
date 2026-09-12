import { useState } from 'react'
import { uploadDataset } from '../services/api'

function Upload() {
  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]

    if (selectedFile) {
      setFile(selectedFile)
      setError('')
      setResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setError('')
    setResult(null)

    try {
      const data = await uploadDataset(file)

      setResult(data)
    } catch (err) {
      if (err.response?.data?.error?.message) {
        setError(err.response.data.error.message)
      } else {
        setError('Unable to upload dataset. Please try again.')
      }
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="relative min-h-screen text-white">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div
        className="
          relative
          z-10
          max-w-4xl
          rounded-2xl
          border
          border-white/[0.06]
          bg-[#050816]/15
          px-5
          py-4
          backdrop-blur-sm
        "
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#A69CFF]">
          Dataset Workspace
        </p>

        <h2 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
          Upload{' '}
          <span className="bg-gradient-to-r from-[#A794FF] via-[#8D89FF] to-[#58D7FF] bg-clip-text text-transparent">
            Dataset
          </span>
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-7 text-white md:text-base">
          Upload a CSV or Excel dataset to start your analysis,
          inspect its structure and prepare it for machine learning.
        </p>
      </div>


      {/* =====================================================
          UPLOAD SECTION
      ====================================================== */}

      <div className="relative z-10 mt-6 max-w-5xl">

        <div
          className="
            relative
            overflow-hidden
            rounded-[28px]
            border
            border-white/[0.09]
            bg-[#090E1D]/55
            p-6
            shadow-[0_0_80px_rgba(37,99,235,0.08)]
            backdrop-blur-lg
            md:p-8
          "
        >

          {/* Background Glow */}

          <div className="pointer-events-none absolute -right-32 -top-32 h-[360px] w-[360px] rounded-full bg-[#5148D8]/12 blur-[120px]" />

          <div className="pointer-events-none absolute -bottom-32 -left-24 h-[320px] w-[320px] rounded-full bg-[#2563EB]/8 blur-[120px]" />


          {/* =================================================
              INNER UPLOAD AREA
          ================================================= */}

          <div
            className="
              relative
              z-10
              flex
              min-h-[400px]
              flex-col
              items-center
              justify-center
              rounded-[22px]
              border
              border-dashed
              border-white/[0.11]
              bg-[#050816]/25
              px-6
              py-10
              text-center
              backdrop-blur-sm
              md:min-h-[430px]
            "
          >

            {/* Folder Icon */}

            <div
              className="
                flex
                h-[76px]
                w-[76px]
                items-center
                justify-center
                rounded-2xl
                border
                border-[#756BFF]/25
                bg-[#5148D8]/10
                shadow-[0_0_35px_rgba(81,72,216,0.15)]
              "
            >
              <svg
                className="h-10 w-10 text-[#A497FF]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  d="M3 6.5A1.5 1.5 0 0 1 4.5 5h5l2 2H19.5A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-11Z"
                  fill="currentColor"
                  opacity="0.12"
                />

                <path d="M3 8h18" />

                <path
                  d="M3 6.5A1.5 1.5 0 0 1 4.5 5h5l2 2H19.5A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-11Z"
                />
              </svg>
            </div>


            {/* Title */}

            <h3 className="mt-6 text-2xl font-bold text-white md:text-3xl">
              Upload your dataset
            </h3>

            <p className="mt-3 text-base text-white">
              CSV or XLSX files are supported
            </p>

            <p className="mt-2 text-sm text-white/65">
              Choose a file from your computer to begin analysis
            </p>


            {/* Choose File */}

            <label className="mt-7 cursor-pointer">

              <span
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-gradient-to-r
                  from-[#5148D8]
                  to-[#6D5CFF]
                  px-7
                  py-3.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-[0_0_30px_rgba(81,72,216,0.25)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:shadow-[0_0_42px_rgba(81,72,216,0.4)]
                "
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

              </span>

              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileChange}
                className="hidden"
              />

            </label>


            {/* =================================================
                SELECTED FILE
            ================================================== */}

            {file && (
              <div className="mt-7 w-full max-w-xl">

                <div
                  className="
                    rounded-2xl
                    border
                    border-[#4F8CFF]/20
                    bg-[#3158FF]/[0.07]
                    p-4
                    text-left
                    backdrop-blur-sm
                  "
                >

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3158FF]/10 text-[#73A4FF]">

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

                    <div className="min-w-0">

                      <p className="text-sm font-semibold text-white">
                        Selected file
                      </p>

                      <p className="mt-1 truncate text-sm text-white/75">
                        {file.name}
                      </p>

                    </div>

                  </div>

                </div>


                {/* Upload Button */}

                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="
                    mt-4
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-[#22C55E]/25
                    bg-[#22C55E]/10
                    px-7
                    py-3.5
                    text-sm
                    font-semibold
                    text-[#5BE58A]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-[#22C55E]/15
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
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
                ERROR
            ================================================== */}

            {error && (
              <div
                className="
                  mt-5
                  w-full
                  max-w-xl
                  rounded-2xl
                  border
                  border-red-400/20
                  bg-red-500/[0.08]
                  p-4
                  text-left
                "
              >

                <div className="flex items-start gap-3">

                  <span className="mt-0.5 text-red-300">
                    ⚠
                  </span>

                  <p className="text-sm leading-6 text-red-200">
                    {error}
                  </p>

                </div>

              </div>
            )}


            {/* =================================================
                SUCCESS
            ================================================== */}

            {result && (
              <div
                className="
                  mt-5
                  w-full
                  max-w-xl
                  rounded-2xl
                  border
                  border-[#22C55E]/20
                  bg-[#22C55E]/[0.07]
                  p-5
                  text-left
                "
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#22C55E]/10 text-[#5BE58A]">
                    ✓
                  </div>

                  <p className="font-semibold text-white">
                    Dataset uploaded successfully!
                  </p>

                </div>

                <div className="mt-4 space-y-2 text-sm">

                  <p className="text-white">
                    <span className="font-semibold text-white">
                      File:
                    </span>{' '}
                    <span className="text-white/75">
                      {result.filename}
                    </span>
                  </p>

                  <p className="text-white">
                    <span className="font-semibold text-white">
                      Rows:
                    </span>{' '}
                    <span className="text-white/75">
                      {result.rows}
                    </span>
                  </p>

                  <p className="text-white">
                    <span className="font-semibold text-white">
                      Columns:
                    </span>{' '}
                    <span className="text-white/75">
                      {result.columns}
                    </span>
                  </p>

                  <p className="break-all text-white">
                    <span className="font-semibold text-white">
                      Dataset ID:
                    </span>{' '}
                    <span className="text-white/75">
                      {result.dataset_id}
                    </span>
                  </p>

                </div>

              </div>
            )}

          </div>
        </div>
      </div>

    </div>
  )
}

export default Upload