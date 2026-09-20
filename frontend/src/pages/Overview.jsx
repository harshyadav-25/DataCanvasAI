import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAnalysis } from '../context/AnalysisContext'

function Overview() {
  const [dataset, setDataset] = useState(null)
  const { targetColumn, problemType, updateAnalysis } = useAnalysis()

  useEffect(() => {
    const storedData = localStorage.getItem('datacanvas_upload_result')

    if (!storedData) {
      setDataset(null)
      return
    }

    try {
      const parsedData = JSON.parse(storedData)
      setDataset(parsedData)
    } catch (error) {
      console.error('Unable to load dataset information:', error)
      setDataset(null)
    }
  }, [])

  // =====================================================
  // DATASET DATA
  // =====================================================

  const filename = dataset?.filename || 'Dataset'
  const fileType = dataset?.file_type || 'Unknown'
  const rows = dataset?.rows
  const columns = dataset?.columns
  const datasetId = dataset?.dataset_id

  const columnNames = Array.isArray(dataset?.column_names)
    ? dataset.column_names
    : []

  const handleTargetChange = (event) => {
    updateAnalysis({ targetColumn: event.target.value })
  }

  const handleProblemTypeChange = (event) => {
    updateAnalysis({ problemType: event.target.value })
  }

  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (!dataset) {
    return (
      <div className="relative min-h-screen overflow-hidden text-white">
        {/* Background glow */}

        <div className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-[#5148D8]/10 blur-[130px]" />

        <div className="pointer-events-none absolute -bottom-32 -left-24 h-[380px] w-[380px] rounded-full bg-[#2563EB]/10 blur-[120px]" />

        <div className="relative z-10 w-full">
          {/* Header */}

          <div className="mx-auto max-w-4xl rounded-2xl border border-white/[0.06] bg-[#050816]/15 px-5 py-4 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#A69CFF]">
              Dataset Workspace
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Dataset{' '}
              <span className="bg-gradient-to-r from-[#A794FF] via-[#8D89FF] to-[#58D7FF] bg-clip-text text-transparent">
                Overview
              </span>
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-7 text-white/70 md:text-base">
              Review your dataset summary, structure and analysis readiness
              after a successful upload.
            </p>
          </div>

          {/* No Dataset Card */}

          <div className="mx-auto mt-6 max-w-5xl rounded-[28px] border border-white/[0.09] bg-[#090E1D]/55 p-6 shadow-[0_0_80px_rgba(37,99,235,0.08)] backdrop-blur-lg md:p-8">
            <div className="flex min-h-[430px] flex-col items-center justify-center rounded-[22px] border border-dashed border-white/[0.10] bg-[#050816]/25 px-6 py-10 text-center">
              {/* Icon */}

              <div className="flex h-[76px] w-[76px] items-center justify-center rounded-2xl border border-[#756BFF]/25 bg-[#5148D8]/10 shadow-[0_0_35px_rgba(81,72,216,0.15)]">
                <svg
                  className="h-10 w-10 text-[#A497FF]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <ellipse cx="12" cy="5" rx="7" ry="3" />
                  <path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
                  <path d="M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7" />
                </svg>
              </div>

              <h2 className="mt-6 text-2xl font-bold text-white md:text-3xl">
                No dataset available
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-white/60 md:text-base">
                Upload a CSV or XLSX dataset to generate its overview,
                inspect its structure and continue with the ML analysis
                workflow.
              </p>

              <Link
                to="/upload"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5148D8] to-[#6D5CFF] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(81,72,216,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_0_42px_rgba(81,72,216,0.4)]"
              >
                Upload Dataset

                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // =====================================================
  // DATASET AVAILABLE
  // =====================================================

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Background Glow */}

      <div className="pointer-events-none absolute -right-32 -top-32 h-[450px] w-[450px] rounded-full bg-[#5148D8]/10 blur-[140px]" />

      <div className="pointer-events-none absolute -bottom-32 -left-24 h-[400px] w-[400px] rounded-full bg-[#2563EB]/10 blur-[130px]" />

      <div className="relative z-10 space-y-6">
        {/* =================================================
            PAGE HEADER
            ================================================= */}

        <div className="mx-auto max-w-5xl rounded-2xl border border-white/[0.06] bg-[#050816]/15 px-5 py-4 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#A69CFF]">
            Dataset Workspace
          </p>

          <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                Dataset{' '}
                <span className="bg-gradient-to-r from-[#A794FF] via-[#8D89FF] to-[#58D7FF] bg-clip-text text-transparent">
                  Overview
                </span>
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-7 text-white/65 md:text-base">
                Understand your dataset before moving into profiling,
                target selection and ML risk analysis.
              </p>
            </div>

            <Link
              to="/upload"
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/[0.10] bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
            >
              Upload New Dataset

              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 19V5" />
                <path d="m6 11 6-6 6 6" />
              </svg>
            </Link>
          </div>
        </div>

        {/* =================================================
            DATASET IDENTITY
            ================================================= */}

        <section className="mx-auto max-w-5xl overflow-hidden rounded-[24px] border border-white/[0.09] bg-[#090E1D]/55 shadow-[0_0_60px_rgba(37,99,235,0.06)] backdrop-blur-lg">
          <div className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Dataset info */}

            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#756BFF]/20 bg-[#5148D8]/10 text-[#A497FF]">
                <svg
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  viewBox="0 0 24 24"
                >
                  <ellipse cx="12" cy="5" rx="7" ry="3" />
                  <path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
                  <path d="M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7" />
                </svg>
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                  Current Dataset
                </p>

                <h2 className="mt-1 truncate text-xl font-bold text-white md:text-2xl">
                  {filename}
                </h2>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-lg border border-[#756BFF]/20 bg-[#5148D8]/10 px-2.5 py-1 text-xs font-semibold text-[#B8B1FF]">
                    {fileType}
                  </span>

                  {datasetId && (
                    <span className="max-w-[360px] truncate text-xs text-white/35">
                      ID: {datasetId}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Status */}

            <div className="flex items-center gap-3 rounded-xl border border-[#22C55E]/20 bg-[#22C55E]/[0.06] px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#22C55E]/10">
                <span className="h-2.5 w-2.5 rounded-full bg-[#5BE58A]" />
              </div>

              <div>
                <p className="text-xs text-white/40">
                  Dataset Status
                </p>

                <p className="mt-0.5 text-sm font-semibold text-[#5BE58A]">
                  Uploaded & Validated
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            QUICK SUMMARY
            ================================================= */}

        <section className="mx-auto max-w-5xl">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A69CFF]">
              Quick Summary
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Dataset Statistics
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {/* ROWS */}

            <div className="rounded-2xl border border-white/[0.08] bg-[#090E1D]/55 p-5 shadow-[0_0_35px_rgba(37,99,235,0.04)] backdrop-blur-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white/55">
                  Total Rows
                </p>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5148D8]/10 text-[#A497FF]">
                  <span className="text-[10px] font-bold">
                    ROW
                  </span>
                </div>
              </div>

              <p className="mt-4 text-3xl font-bold text-white">
                {rows ?? '—'}
              </p>

              <p className="mt-1 text-xs text-white/35">
                Records in dataset
              </p>
            </div>

            {/* COLUMNS */}

            <div className="rounded-2xl border border-white/[0.08] bg-[#090E1D]/55 p-5 shadow-[0_0_35px_rgba(37,99,235,0.04)] backdrop-blur-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white/55">
                  Total Columns
                </p>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#756BFF]/10 text-[#A497FF]">
                  <span className="text-[10px] font-bold">
                    COL
                  </span>
                </div>
              </div>

              <p className="mt-4 text-3xl font-bold text-white">
                {columns ?? '—'}
              </p>

              <p className="mt-1 text-xs text-white/35">
                Features / fields
              </p>
            </div>

            {/* TARGET */}

            <div className="rounded-2xl border border-white/[0.08] bg-[#090E1D]/55 p-5 shadow-[0_0_35px_rgba(37,99,235,0.04)] backdrop-blur-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white/55">
                  Target Column
                </p>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F2B84B]/10 text-[#F2C46B]">
                  <span className="text-xs font-bold">
                    Y
                  </span>
                </div>
              </div>

              <select
                value={targetColumn}
                onChange={handleTargetChange}
                className="mt-3 w-full rounded-lg border border-white/10 bg-[#11172A] px-3 py-2 text-sm text-white"
              >
                <option value="">Select target</option>
                {columnNames.map((column) => (
                  <option key={column} value={column}>{column}</option>
                ))}
              </select>

              <p className="mt-1 text-xs text-white/35">
                Configure during target selection
              </p>
            </div>

            {/* PROBLEM TYPE */}

            <div className="rounded-2xl border border-white/[0.08] bg-[#090E1D]/55 p-5 shadow-[0_0_35px_rgba(37,99,235,0.04)] backdrop-blur-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white/55">
                  Problem Type
                </p>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#22C55E]/10 text-[#5BE58A]">
                  <span className="text-[10px] font-bold">
                    ML
                  </span>
                </div>
              </div>

              <select
                value={problemType}
                onChange={handleProblemTypeChange}
                className="mt-3 w-full rounded-lg border border-white/10 bg-[#11172A] px-3 py-2 text-sm text-white"
              >
                <option value="classification">Classification</option>
                <option value="regression">Regression</option>
              </select>

              <p className="mt-1 text-xs text-white/35">
                Classification / Regression
              </p>
            </div>
          </div>
        </section>

        {/* =================================================
            COLUMN STRUCTURE
            ================================================= */}

        <section className="mx-auto max-w-5xl rounded-[24px] border border-white/[0.08] bg-[#090E1D]/55 p-6 shadow-[0_0_60px_rgba(37,99,235,0.05)] backdrop-blur-lg">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A69CFF]">
                Dataset Structure
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">
                Columns
              </h2>
            </div>

            <span className="w-fit rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-white/50">
              {columnNames.length} available
            </span>
          </div>

          {columnNames.length > 0 ? (
            <div className="mt-6 overflow-hidden rounded-xl border border-white/[0.07]">
              {/* Table Header */}

              <div className="hidden grid-cols-[70px_1fr_180px] border-b border-white/[0.07] bg-white/[0.025] px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white/35 md:grid">
                <span>#</span>
                <span>Column Name</span>
                <span>Status</span>
              </div>

              {/* Rows */}

              <div className="divide-y divide-white/[0.06]">
                {columnNames.map((column, index) => (
                  <div
                    key={`${column}-${index}`}
                    className="grid grid-cols-1 gap-3 px-4 py-4 transition hover:bg-white/[0.025] md:grid-cols-[70px_1fr_180px] md:items-center"
                  >
                    <span className="text-xs font-bold text-white/30">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {column}
                      </p>

                      <p className="mt-1 text-xs text-white/30">
                        Detailed information will be available after profiling.
                      </p>
                    </div>

                    <span className="w-fit rounded-lg border border-[#756BFF]/15 bg-[#5148D8]/[0.06] px-3 py-1.5 text-xs font-medium text-[#AFA9FF]">
                      Ready for profiling
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-white/[0.10] bg-white/[0.02] p-8 text-center">
              <p className="text-sm text-white/45">
                Column names are not available yet.
              </p>
            </div>
          )}
        </section>

        {/* =================================================
            NEXT STEPS
            ================================================= */}

        <section className="mx-auto max-w-5xl rounded-[24px] border border-[#756BFF]/15 bg-gradient-to-r from-[#5148D8]/10 via-[#090E1D]/70 to-[#2563EB]/10 p-6 backdrop-blur-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A69CFF]">
            Analysis Workflow
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            What comes next?
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
            Your dataset has been uploaded successfully. Continue through
            profiling, target selection and ML analysis.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {/* Profiling */}

            <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#5148D8]/10 text-xs font-bold text-[#A497FF]">
                  01
                </span>

                <div>
                  <p className="text-sm font-bold text-white">
                    Profiling
                  </p>

                  <p className="text-xs text-white/35">
                    Data characteristics
                  </p>
                </div>
              </div>
            </div>

            {/* Target */}

            <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F2B84B]/10 text-xs font-bold text-[#F2C46B]">
                  02
                </span>

                <div>
                  <p className="text-sm font-bold text-white">
                    Target Selection
                  </p>

                  <p className="text-xs text-white/35">
                    Select ML target
                  </p>
                </div>
              </div>
            </div>

            {/* Risk */}

            <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#D94F85]/10 text-xs font-bold text-[#F57EA8]">
                  03
                </span>

                <div>
                  <p className="text-sm font-bold text-white">
                    Risk Analysis
                  </p>

                  <p className="text-xs text-white/35">
                    Identify ML risks
                  </p>
                </div>
              </div>
            </div>

            {/* Readiness */}

            <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#22C55E]/10 text-xs font-bold text-[#5BE58A]">
                  04
                </span>

                <div>
                  <p className="text-sm font-bold text-white">
                    ML Readiness
                  </p>

                  <p className="text-xs text-white/35">
                    Evaluate readiness
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Overview