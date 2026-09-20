import { useState } from 'react'

const filters = [
  'All',
  'Running',
  'Completed',
  'Failed',
]

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-[#343C53] bg-[#0F1526]/80 px-6 py-14 text-center backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#6557D8]/30 bg-[#6D5DF6]/10 text-[#9A8EFF]">
        <svg
          className="h-7 w-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M3 12a9 9 0 1 0 3-6.7" />
          <path d="M3 5v5h5" />
          <path d="M12 7v5l3 2" />
        </svg>
      </div>

      <h2 className="mt-5 text-base font-semibold text-white">
        No history available
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#A7AFC3]">
        Experiment and analysis history will appear here when real
        backend results become available.
      </p>
    </div>
  )
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#343C53] bg-[#10162A]/80 p-5 backdrop-blur-xl">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8F7CFF]">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-white">
        {value}
      </p>
    </div>
  )
}

function HistoryItem({ item }) {
  return (
    <div className="rounded-2xl border border-[#343C53] bg-[#10162A]/80 p-5 backdrop-blur-xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8F7CFF]">
            Experiment
          </p>

          <h3 className="mt-1 text-base font-semibold text-white">
            {item.treatment || 'Not available'}
          </h3>

          <p className="mt-2 text-sm text-[#A7AFC3]">
            {item.source || 'Source not available'}
          </p>
        </div>

        <span className="w-fit rounded-full border border-[#343C53] bg-[#12192B] px-3 py-1 text-[11px] font-semibold text-[#A7AFC3]">
          {item.status || 'Not available'}
        </span>
      </div>

      <div className="mt-5 rounded-xl border border-[#252D42] bg-[#0A1020]/60 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8F7CFF]">
          Created
        </p>

        <p className="mt-2 text-sm text-[#A7AFC3]">
          {item.createdAt || 'Not available'}
        </p>
      </div>
    </div>
  )
}

export default function HistoryPage() {
  const [activeFilter, setActiveFilter] = useState('All')

  // Real backend history data will be connected later.
  // No demo or dummy history entries are used.
  const history = []

  const filteredHistory =
    activeFilter === 'All'
      ? history
      : history.filter((item) => item.status === activeFilter)

  const summary = {
    all: history.length,
    running: history.filter((item) => item.status === 'Running').length,
    completed: history.filter((item) => item.status === 'Completed').length,
    failed: history.filter((item) => item.status === 'Failed').length,
  }

  const handleRetry = () => {
    console.log('Retry history request')
  }

  return (
    <div className="relative min-h-screen overflow-hidden rounded-3xl bg-[#070B16] px-4 py-6 text-white sm:px-6 lg:px-8">

      {/* Background glow */}

      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#6D5DF6]/20 blur-3xl" />

      <div className="pointer-events-none absolute -right-24 top-24 h-96 w-96 rounded-full bg-[#3A7BFF]/10 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#8B5CF6]/10 blur-3xl" />

      <div className="relative z-10 space-y-6">

        {/* =========================================
            HEADER
            ========================================= */}

        <section>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <p className="text-sm font-semibold tracking-wide text-[#8F7CFF]">
                ACTIVITY
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                History
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#A7AFC3]">
                Review previous experiments and analysis runs when real
                history data is available.
              </p>
            </div>

            <div className="w-fit rounded-2xl border border-[#6557D8]/30 bg-[#11172A]/80 px-4 py-3 backdrop-blur-xl">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8F7CFF]">
                History status
              </p>

              <p className="mt-1 text-sm font-semibold text-[#A7AFC3]">
                Waiting for results
              </p>
            </div>

          </div>
        </section>

        {/* =========================================
            SUMMARY
            ========================================= */}

        <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <SummaryCard
            label="Total"
            value={summary.all}
          />

          <SummaryCard
            label="Running"
            value={summary.running}
          />

          <SummaryCard
            label="Completed"
            value={summary.completed}
          />

          <SummaryCard
            label="Failed"
            value={summary.failed}
          />
        </section>

        {/* =========================================
            FILTERS
            ========================================= */}

        <section className="rounded-2xl border border-[#343C53] bg-[#10162A]/80 p-2 backdrop-blur-xl">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  activeFilter === filter
                    ? 'bg-[#5148D8]/30 text-white shadow-[0_0_20px_rgba(81,72,216,0.12)]'
                    : 'text-[#A7AFC3] hover:bg-white/5 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        {/* =========================================
            HISTORY CONTENT
            ========================================= */}

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">
              Activity history
            </h2>

            <p className="mt-1 text-sm text-[#8F98AD]">
              Previous runs will be listed here when history data is
              returned by the backend.
            </p>
          </div>

          {filteredHistory.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-5 xl:grid-cols-2">
              {filteredHistory.map((item) => (
                <HistoryItem
                  key={item.id}
                  item={item}
                />
              ))}
            </div>
          )}
        </section>

        {/* =========================================
            DATA INTEGRATION
            ========================================= */}

        <section className="rounded-2xl border border-[#343C53] bg-[#10162A]/80 p-5 backdrop-blur-xl">
          <div className="flex items-start gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#7C6FFF]/30 bg-[#6D5DF6]/10 text-sm font-bold text-[#9A8EFF]">
              i
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white">
                Data integration
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#A7AFC3]">
                History records will be populated through the future
                backend history response. The frontend does not create
                sample or fabricated records.
              </p>
            </div>

          </div>
        </section>

      </div>
    </div>
  )
}