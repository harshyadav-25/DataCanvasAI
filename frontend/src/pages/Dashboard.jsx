import { Link } from 'react-router-dom'
import { useState } from 'react'

function Dashboard() {
  // =====================================================
  // USER
  // =====================================================

  const [userName] = useState(() => {
    const storedUser = localStorage.getItem('datacanvas_user')

    if (!storedUser) {
      return 'User'
    }

    try {
      const user = JSON.parse(storedUser)
      return user.name || 'User'
    } catch {
      return 'User'
    }
  })

  // =====================================================
  // UPLOADED DATASET
  // =====================================================

  const [dataset] = useState(() => {
    const storedDataset = localStorage.getItem(
      'datacanvas_upload_result'
    )

    if (!storedDataset) {
      return null
    }

    try {
      return JSON.parse(storedDataset)
    } catch {
      return null
    }
  })

  const filename = dataset?.filename || ''
  const fileType = dataset?.file_type || ''
  const rows = dataset?.rows
  const columns = dataset?.columns
  const datasetId = dataset?.dataset_id

  const hasDataset = Boolean(dataset)

  return (
    <div className="min-h-screen bg-[#090E1D] px-4 py-6 text-white sm:px-5 sm:py-7 md:px-8">
      <div className="mx-auto w-full max-w-7xl">

        {/* =================================================
            WELCOME HEADER
            ================================================= */}

        <section className="relative mb-7 overflow-hidden rounded-3xl border border-white/8 bg-linear-to-br from-[#111936] via-[#0C1226] to-[#090E1D] p-5 shadow-[0_25px_80px_rgba(0,0,0,0.2)] sm:p-7 md:p-9">

          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#675CFF]/15 blur-[110px]"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-[#38BDF8]/8 blur-[100px]"
            aria-hidden="true"
          />

          <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">

            <div className="min-w-0">
              <p className="text-sm font-medium text-[#9F96FF]">
                Your Workspace
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                Welcome back,{' '}
                <span className="break-words">
                  {userName}
                </span>{' '}
                👋
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
                Analyze your dataset, discover potential issues and prepare
                better data for your machine-learning workflow.
              </p>
            </div>

            <Link
              to="/upload"
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-linear-to-r from-[#5148D8] to-[#756BFF] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(81,72,216,0.25)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(81,72,216,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A69CFF]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090E1D]"
            >
              Upload Dataset

              <span
                className="text-lg"
                aria-hidden="true"
              >
                →
              </span>
            </Link>

          </div>
        </section>

        {/* =================================================
            KPI CARDS
            ================================================= */}

        <section
          className="mb-7 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
          aria-label="Dataset summary"
        >

          {/* TOTAL ROWS */}

          <div className="rounded-2xl border border-white/8 bg-white/3.5 p-5 shadow-lg">
            <div className="flex items-center justify-between gap-4">

              <span className="text-sm text-slate-400">
                Total Rows
              </span>

              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-300"
                aria-hidden="true"
              >
                #
              </div>

            </div>

            <h2 className="mt-4 text-3xl font-bold">
              {rows ?? '—'}
            </h2>

            <p className="mt-2 text-xs text-slate-500">
              {hasDataset
                ? 'Records in uploaded dataset'
                : 'Upload a dataset to calculate'}
            </p>
          </div>

          {/* TOTAL COLUMNS */}

          <div className="rounded-2xl border border-white/8 bg-white/3.5 p-5 shadow-lg">
            <div className="flex items-center justify-between gap-4">

              <span className="text-sm text-slate-400">
                Total Columns
              </span>

              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-300"
                aria-hidden="true"
              >
                ▦
              </div>

            </div>

            <h2 className="mt-4 text-3xl font-bold">
              {columns ?? '—'}
            </h2>

            <p className="mt-2 text-xs text-slate-500">
              {hasDataset
                ? 'Features / fields'
                : 'Features and target'}
            </p>
          </div>

          {/* ISSUES */}

          <div className="rounded-2xl border border-white/8 bg-white/3.5 p-5 shadow-lg">
            <div className="flex items-center justify-between gap-4">

              <span className="text-sm text-slate-400">
                Issues
              </span>

              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-300"
                aria-hidden="true"
              >
                !
              </div>

            </div>

            <h2 className="mt-4 text-3xl font-bold">
              —
            </h2>

            <p className="mt-2 text-xs text-slate-500">
              Risk analysis pending
            </p>
          </div>

          {/* ML READINESS */}

          <div className="rounded-2xl border border-white/8 bg-white/3.5 p-5 shadow-lg">
            <div className="flex items-center justify-between gap-4">

              <span className="text-sm text-slate-400">
                ML Readiness
              </span>

              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-300"
                aria-hidden="true"
              >
                ✓
              </div>

            </div>

            <h2 className="mt-4 text-3xl font-bold">
              —
            </h2>

            <p className="mt-2 text-xs text-slate-500">
              Not calculated yet
            </p>
          </div>

        </section>

        {/* =================================================
            CURRENT DATASET
            ================================================= */}

        <section className="mb-7 rounded-2xl border border-white/8 bg-white/3.5 p-5 shadow-lg sm:p-6">

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">

            <div className="min-w-0">

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#938AFF]">
                Current Dataset
              </p>

              {hasDataset ? (
                <>
                  <h2 className="mt-3 truncate text-2xl font-semibold">
                    {filename}
                  </h2>

                  <div className="mt-2 flex flex-wrap items-center gap-2">

                    {fileType && (
                      <span className="rounded-lg border border-[#756BFF]/20 bg-[#5148D8]/10 px-2.5 py-1 text-xs font-semibold text-[#B8B1FF]">
                        {fileType}
                      </span>
                    )}

                    {datasetId && (
                      <span
                        className="block max-w-full truncate text-xs text-slate-500 sm:max-w-[420px]"
                        title={datasetId}
                      >
                        ID: {datasetId}
                      </span>
                    )}

                  </div>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                    Your dataset has been uploaded successfully.
                    Continue with overview and profiling to inspect
                    its structure and quality.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="mt-3 text-2xl font-semibold">
                    No dataset uploaded
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                    Upload and validate a CSV or XLSX file to start
                    exploring your dataset.
                  </p>
                </>
              )}

            </div>

            <div className="flex w-full flex-wrap gap-3 lg:w-auto">

              <Link
                to="/upload"
                className="rounded-xl bg-linear-to-r from-[#5148D8] to-[#756BFF] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A69CFF]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090E1D]"
              >
                Upload Dataset
              </Link>

              <Link
                to="/overview"
                className="rounded-xl border border-white/8 bg-white/3.5 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/6 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A69CFF]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090E1D]"
              >
                View Overview
              </Link>

            </div>

          </div>
        </section>

        {/* =================================================
            MAIN GRID
            ================================================= */}

        <section className="mb-7 grid grid-cols-1 gap-6 xl:grid-cols-2">

          {/* ML READINESS */}

          <div className="rounded-2xl border border-white/8 bg-white/3.5 p-5 shadow-lg sm:p-6">

            <div className="flex items-start justify-between gap-4">

              <div className="min-w-0">

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#938AFF]">
                  Dataset Health
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  ML Readiness
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Overall readiness of your dataset for ML workflows.
                </p>

              </div>

              <span className="shrink-0 rounded-full border border-white/8 bg-white/3.5 px-3 py-1 text-xs text-slate-500">
                Pending
              </span>

            </div>

            <div className="mt-8 flex flex-col gap-7 sm:flex-row sm:items-center">

              <div
                className="flex h-32 w-32 shrink-0 self-center items-center justify-center rounded-full border-[10px] border-white/6 sm:self-auto"
                aria-label="ML readiness score not calculated"
              >
                <div className="text-center">

                  <p className="text-3xl font-bold">
                    —
                  </p>

                  <p className="text-[10px] uppercase tracking-wider text-slate-500">
                    / 100
                  </p>

                </div>
              </div>

              <div className="w-full flex-1">

                <div className="space-y-4">

                  {[
                    ['Data Quality', 'Pending'],
                    ['ML Risk', 'Pending'],
                    ['Feature Quality', 'Pending'],
                  ].map(([label, value]) => (
                    <div key={label}>

                      <div className="mb-2 flex items-center justify-between gap-4">

                        <span className="text-sm text-slate-300">
                          {label}
                        </span>

                        <span className="text-xs text-slate-500">
                          {value}
                        </span>

                      </div>

                      <div
                        className="h-2 rounded-full bg-white/6"
                        aria-hidden="true"
                      />

                    </div>
                  ))}

                </div>

              </div>

            </div>

          </div>

          {/* IMPORTANT ISSUES */}

          <div className="rounded-2xl border border-white/8 bg-white/3.5 p-5 shadow-lg sm:p-6">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#938AFF]">
                Analysis
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Important Issues
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                High-priority dataset risks will appear here.
              </p>

            </div>

            <div className="mt-7 space-y-3">

              <div className="rounded-xl border border-dashed border-white/10 bg-[#050816]/40 p-5">

                <div className="flex items-start gap-3">

                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-300"
                    aria-hidden="true"
                  >
                    !
                  </div>

                  <div className="min-w-0">

                    <p className="text-sm font-medium text-slate-300">
                      {hasDataset
                        ? 'Analysis pending'
                        : 'No analysis available'}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {hasDataset
                        ? 'Risk analysis will appear when the backend analysis is available.'
                        : 'Upload a dataset to detect issues.'}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            QUICK ACTIONS
            ================================================= */}

        <section className="mb-7">

          <div className="mb-4">

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#938AFF]">
              Workspace
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Quick Actions
            </h2>

          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {[
              {
                title: 'Upload Dataset',
                description: 'Add your CSV or XLSX dataset.',
                path: '/upload',
                icon: '↑',
              },
              {
                title: 'Data Preview',
                description: 'Review the uploaded dataset.',
                path: '/overview',
                icon: '◫',
              },
              {
                title: 'Profiling',
                description: 'Analyze structure and data quality.',
                path: '/profiling',
                icon: '⌁',
              },
              {
                title: 'Preprocessing',
                description: 'Prepare your data for ML.',
                path: '/canvas',
                icon: '⚙',
              },
            ].map((action) => (

              <Link
                key={action.title}
                to={action.path}
                aria-label={action.title}
                className="group rounded-2xl border border-white/8 bg-white/3.5 p-5 transition duration-300 hover:-translate-y-1 hover:border-[#756BFF]/25 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A69CFF]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090E1D]"
              >

                <div className="flex items-center justify-between gap-4">

                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#756BFF]/10 text-lg text-[#A69CFF]"
                    aria-hidden="true"
                  >
                    {action.icon}
                  </div>

                  <span
                    className="text-lg text-slate-600 transition group-hover:translate-x-1 group-hover:text-[#A69CFF]"
                    aria-hidden="true"
                  >
                    →
                  </span>

                </div>

                <h3 className="mt-5 text-base font-semibold">
                  {action.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {action.description}
                </p>

              </Link>

            ))}

          </div>

        </section>

        {/* =================================================
            WORKFLOW
            ================================================= */}

        <section className="mb-7 rounded-2xl border border-white/8 bg-white/3.5 p-5 shadow-lg sm:p-6">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#938AFF]">
              Workflow
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Dataset Journey
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Follow your dataset from upload to ML readiness.
            </p>

          </div>

          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

            {[
              ['01', 'Upload', '/upload'],
              ['02', 'Overview', '/overview'],
              ['03', 'Profiling', '/profiling'],
              ['04', 'Preprocessing', '/canvas'],
              ['05', 'ML Readiness', '/dashboard'],
            ].map(([number, title, path], index) => (

              <Link
                key={number}
                to={path}
                className="relative rounded-xl border border-white/7 bg-[#050816]/45 p-5 transition hover:border-[#756BFF]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A69CFF]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090E1D]"
              >

                <div className="flex items-center justify-between gap-3">

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#756BFF]/10 text-xs font-bold text-[#A69CFF]">
                    {number}
                  </span>

                  <span className="text-[10px] uppercase tracking-wider text-slate-600">
                    Pending
                  </span>

                </div>

                <h3 className="mt-4 text-sm font-semibold">
                  {title}
                </h3>

                {index < 4 && (
                  <div
                    className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full border border-white/8 bg-[#090E1D] text-xs text-slate-600 xl:flex"
                    aria-hidden="true"
                  >
                    →
                  </div>
                )}

              </Link>

            ))}

          </div>

        </section>

        {/* =================================================
            RECENT ACTIVITY
            ================================================= */}

        <section className="rounded-2xl border border-white/8 bg-white/3.5 p-5 shadow-lg sm:p-6">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#938AFF]">
              Activity
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Recent Activity
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Your latest dataset actions will appear here.
            </p>

          </div>

          {hasDataset ? (
            <div className="mt-6 rounded-xl border border-white/8 bg-[#050816]/40 p-5">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex min-w-0 items-center gap-3">

                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#22C55E]/10 text-[#5BE58A]"
                    aria-hidden="true"
                  >
                    ✓
                  </div>

                  <div className="min-w-0">

                    <p className="text-sm font-semibold text-slate-200">
                      Dataset uploaded
                    </p>

                    <p
                      className="mt-1 max-w-full truncate text-xs text-slate-500 sm:max-w-lg"
                      title={filename}
                    >
                      {filename}
                    </p>

                  </div>

                </div>

                <Link
                  to="/overview"
                  className="w-fit shrink-0 rounded-xl border border-white/8 bg-white/3.5 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/6 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A69CFF]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816]"
                >
                  View Dataset
                </Link>

              </div>

            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-white/10 bg-[#050816]/40 px-6 py-10 text-center">

              <div
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#756BFF]/10 text-xl text-[#A69CFF]"
                aria-hidden="true"
              >
                +
              </div>

              <h3 className="mt-4 text-sm font-semibold">
                No activity yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Your dataset uploads, profiling runs and analysis
                activities will appear here.
              </p>

              <Link
                to="/upload"
                className="mt-5 inline-flex rounded-xl border border-white/8 bg-white/3.5 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/6 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A69CFF]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816]"
              >
                Upload First Dataset
              </Link>

            </div>
          )}

        </section>

      </div>
    </div>
  )
}

export default Dashboard