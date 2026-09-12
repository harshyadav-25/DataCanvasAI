import React from 'react'

function Profiling() {
  return (
    <div className="min-h-screen bg-[#090E1D] px-6 py-8 text-white md:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-purple-400">
            Dataset Analysis
          </p>

          <h1 className="text-3xl font-bold md:text-4xl">
            Dataset Profiling
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400 md:text-base">
            Explore the structure, quality, statistics and patterns of your
            uploaded dataset before moving to preprocessing and modelling.
          </p>
        </div>

        {/* Empty State */}
        <div className="flex min-h-[520px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">

          <div className="max-w-lg text-center">

            {/* Icon */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-500/10 shadow-[0_0_35px_rgba(139,92,246,0.12)]">
              <svg
                className="h-10 w-10 text-purple-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                viewBox="0 0 24 24"
              >
                <path d="M4 19V5" />
                <path d="M4 19h16" />
                <path d="M7 15l4-5 3 3 5-7" />
              </svg>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white">
              No Dataset Available
            </h2>

            {/* Description */}
            <p className="mt-3 text-sm leading-7 text-slate-400 md:text-base">
              Upload and validate a dataset first to view detailed profiling
              information such as data types, missing values, statistics,
              distributions and correlations.
            </p>

            {/* Action */}
            <button
              type="button"
              onClick={() => {
                window.location.href = '/upload'
              }}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5B56E8] to-[#756BFF] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(91,86,232,0.25)] transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(91,86,232,0.35)]"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M12 16V4" />
                <path d="M7 9l5-5 5 5" />
                <path d="M5 20h14" />
              </svg>

              Upload Dataset
            </button>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Profiling