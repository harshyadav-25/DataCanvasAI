import { Link } from 'react-router-dom'

function Dashboard() {
  let userName = 'User'

  const storedUser = localStorage.getItem('datacanvas_user')

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser)
      userName = user.name || 'User'
    } catch {
      userName = 'User'
    }
  }

  return (
    <div className="min-h-screen bg-[#090E1D] px-5 py-7 text-white md:px-8">
      <div className="mx-auto max-w-7xl">

        {/* =========================
            WELCOME HEADER
            ========================= */}
        <section className="relative mb-7 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#111936] via-[#0C1226] to-[#090E1D] p-7 shadow-[0_25px_80px_rgba(0,0,0,0.2)] md:p-9">

          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#675CFF]/15 blur-[110px]" />

          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-[#38BDF8]/8 blur-[100px]" />

          <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">

            <div>
              <p className="text-sm font-medium text-[#9F96FF]">
                Your Workspace
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                Welcome back, {userName} 👋
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
                Analyze your dataset, discover potential issues and prepare
                better data for your machine-learning workflow.
              </p>
            </div>

            <Link
              to="/upload"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-[#5148D8] to-[#756BFF] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(81,72,216,0.25)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(81,72,216,0.35)]"
            >
              Upload Dataset
              <span className="text-lg">→</span>
            </Link>

          </div>
        </section>

        {/* =========================
            KPI CARDS
            ========================= */}
        <section className="mb-7 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {/* Rows */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">
                Total Rows
              </span>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-300">
                #
              </div>
            </div>

            <h2 className="mt-4 text-3xl font-bold">
              —
            </h2>

            <p className="mt-2 text-xs text-slate-500">
              Upload a dataset to calculate
            </p>
          </div>

          {/* Columns */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">
                Total Columns
              </span>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-300">
                ▦
              </div>
            </div>

            <h2 className="mt-4 text-3xl font-bold">
              —
            </h2>

            <p className="mt-2 text-xs text-slate-500">
              Features and target
            </p>
          </div>

          {/* Issues */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">
                Issues
              </span>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-300">
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

          {/* Readiness */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">
                ML Readiness
              </span>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10 text-green-300">
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

        {/* =========================
            CURRENT DATASET
            ========================= */}
        <section className="mb-7 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-6 shadow-lg">

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#938AFF]">
                Current Dataset
              </p>

              <h2 className="mt-3 text-2xl font-semibold">
                No dataset uploaded
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Upload and validate a CSV or XLSX file to start exploring
                your dataset.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">

              <Link
                to="/upload"
                className="rounded-xl bg-gradient-to-r from-[#5148D8] to-[#756BFF] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              >
                Upload Dataset
              </Link>

              <Link
                to="/overview"
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
              >
                View Overview
              </Link>

            </div>

          </div>
        </section>

        {/* =========================
            MAIN GRID
            ========================= */}
        <section className="mb-7 grid grid-cols-1 gap-6 xl:grid-cols-2">

          {/* ML READINESS */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-6 shadow-lg">

            <div className="flex items-start justify-between">

              <div>
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

              <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs text-slate-500">
                Pending
              </span>

            </div>

            <div className="mt-8 flex items-center gap-7">

              <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full border-[10px] border-white/[0.06]">
                <div className="text-center">
                  <p className="text-3xl font-bold">
                    —
                  </p>

                  <p className="text-[10px] uppercase tracking-wider text-slate-500">
                    / 100
                  </p>
                </div>
              </div>

              <div className="flex-1">
                <div className="space-y-4">

                  {[
                    ['Data Quality', 'Pending'],
                    ['ML Risk', 'Pending'],
                    ['Feature Quality', 'Pending'],
                  ].map(([label, value]) => (
                    <div key={label}>

                      <div className="mb-2 flex justify-between">
                        <span className="text-sm text-slate-300">
                          {label}
                        </span>

                        <span className="text-xs text-slate-500">
                          {value}
                        </span>
                      </div>

                      <div className="h-2 rounded-full bg-white/[0.06]" />

                    </div>
                  ))}

                </div>
              </div>

            </div>

          </div>

          {/* IMPORTANT ISSUES */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-6 shadow-lg">

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

              <div className="rounded-xl border border-dashed border-white/[0.1] bg-[#050816]/40 p-5">
                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-300">
                    !
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-300">
                      No analysis available
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Upload a dataset to detect issues.
                    </p>
                  </div>

                </div>
              </div>

            </div>

          </div>

        </section>

        {/* =========================
            QUICK ACTIONS
            ========================= */}
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
                className="group rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#756BFF]/25 hover:bg-white/[0.05]"
              >
                <div className="flex items-center justify-between">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#756BFF]/10 text-lg text-[#A69CFF]">
                    {action.icon}
                  </div>

                  <span className="text-lg text-slate-600 transition group-hover:translate-x-1 group-hover:text-[#A69CFF]">
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

        {/* =========================
            WORKFLOW
            ========================= */}
        <section className="mb-7 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-6 shadow-lg">

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

          <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">

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
                className="relative rounded-xl border border-white/[0.07] bg-[#050816]/45 p-5 transition hover:border-[#756BFF]/25"
              >

                <div className="flex items-center justify-between">

                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#756BFF]/10 text-xs font-bold text-[#A69CFF]">
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
                  <div className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full border border-white/[0.08] bg-[#090E1D] text-xs text-slate-600 xl:flex">
                    →
                  </div>
                )}

              </Link>
            ))}

          </div>

        </section>

        {/* =========================
            RECENT ACTIVITY
            ========================= */}
        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-6 shadow-lg">

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

          <div className="mt-6 rounded-xl border border-dashed border-white/[0.1] bg-[#050816]/40 px-6 py-10 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#756BFF]/10 text-xl text-[#A69CFF]">
              +
            </div>

            <h3 className="mt-4 text-sm font-semibold">
              No activity yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Your dataset uploads, profiling runs and analysis activities
              will appear here.
            </p>

            <Link
              to="/upload"
              className="mt-5 inline-flex rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
            >
              Upload First Dataset
            </Link>

          </div>

        </section>

      </div>
    </div>
  )
}

export default Dashboard