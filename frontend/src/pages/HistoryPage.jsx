import { useMemo, useState } from 'react'

const filters = [
  { key: 'all', label: 'All' },
  { key: 'Running', label: 'Running' },
  { key: 'Completed', label: 'Completed' },
  { key: 'Failed', label: 'Failed' },
]

function normalizeStatus(status) {
  const value = String(status || '').toLowerCase()

  if (value === 'running') return 'Running'
  if (value === 'failed') return 'Failed'

  return 'Completed'
}

function formatDate(timestamp) {
  if (!timestamp) {
    return 'Not available'
  }

  const date = new Date(timestamp)

  if (Number.isNaN(date.getTime())) {
    return 'Not available'
  }

  return date.toLocaleString()
}

function StatusBadge({ status }) {
  const styles = {
    Running:
      'border-blue-300/30 bg-blue-300/10 text-blue-100',
    Completed:
      'border-emerald-300/30 bg-emerald-300/10 text-emerald-100',
    Failed:
      'border-red-300/30 bg-red-300/10 text-red-100',
  }

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        styles[status] ||
        'border-white/20 bg-white/[0.05] text-white'
      }`}
    >
      {status}
    </span>
  )
}

function EmptyState({ title, description }) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-dashed
        border-white/20
        bg-white/[0.02]
        p-12
        text-center
      "
    >
      <div
        className="
          mx-auto
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-xl
          bg-white/[0.05]
          text-2xl
          text-white
        "
      >
        ◎
      </div>

      <h2 className="mt-5 text-lg font-semibold text-white">
        {title}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white">
        {description}
      </p>
    </div>
  )
}

function HistoryPage() {
  /*
    =========================================================
    REAL DATA STRUCTURE

    Actual history data will come from the API later.

    Expected item structure:

    {
      id: '',
      treatment: '',
      status: 'Running' | 'Completed' | 'Failed',
      createdAt: '',
      source: ''
    }

    No dummy data is used.
    =========================================================
  */

  const [history] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')

  const counts = useMemo(() => {
    return {
      all: history.length,

      Running: history.filter(
        (item) => normalizeStatus(item.status) === 'Running'
      ).length,

      Completed: history.filter(
        (item) => normalizeStatus(item.status) === 'Completed'
      ).length,

      Failed: history.filter(
        (item) => normalizeStatus(item.status) === 'Failed'
      ).length,
    }
  }, [history])

  const filteredHistory = useMemo(() => {
    if (activeFilter === 'all') {
      return history
    }

    return history.filter(
      (item) =>
        normalizeStatus(item.status) === activeFilter
    )
  }, [history, activeFilter])

  const handleRetry = (id) => {
    /*
      Future implementation:

      - Send retry request to backend
      - Update experiment status
      - Refresh history
    */

    console.log('Retry requested for experiment:', id)
  }

  return (
    <div className="min-h-full px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B8B3FF]">
            Experiment Tracking
          </p>

          <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                History
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white sm:text-base">
                Review previous experiment runs and their execution status.
              </p>
            </div>

            <button
              type="button"
              disabled={!history.length}
              className="
                rounded-xl
                border
                border-white/10
                bg-white/[0.05]
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-white/10
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              Clear History
            </button>
          </div>
        </section>

        {/* =====================================================
            SUMMARY
        ===================================================== */}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: 'Total Runs',
              value: counts.all,
            },
            {
              label: 'Running',
              value: counts.Running,
            },
            {
              label: 'Completed',
              value: counts.Completed,
            },
            {
              label: 'Failed',
              value: counts.Failed,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="
                rounded-2xl
                border
                border-white/10
                bg-white/[0.04]
                p-5
              "
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-white">
                {item.label}
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {item.value}
              </p>
            </div>
          ))}
        </section>

        {/* =====================================================
            FILTERS
        ===================================================== */}

        <section
          className="
            mt-8
            rounded-2xl
            border
            border-white/10
            bg-white/[0.04]
            p-4
          "
        >
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              const isActive =
                activeFilter === filter.key

              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() =>
                    setActiveFilter(filter.key)
                  }
                  className={`
                    rounded-xl
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    transition

                    ${
                      isActive
                        ? 'bg-[#5B56E8] text-white shadow-lg'
                        : 'bg-white/[0.04] text-white hover:bg-white/[0.08]'
                    }
                  `}
                >
                  {filter.label}

                  <span className="ml-2 text-white">
                    {counts[filter.key]}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        {/* =====================================================
            HISTORY CONTENT
        ===================================================== */}

        <section className="mt-6">

          {filteredHistory.length === 0 ? (
            <EmptyState
              title="No history available"
              description="Experiment runs will appear here when real history data is available."
            />
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((item) => {
                const status = normalizeStatus(item.status)

                return (
                  <article
                    key={item.id}
                    className="
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/[0.04]
                      p-5
                      transition
                      hover:bg-white/[0.06]
                    "
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                      {/* Experiment Information */}

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-base font-semibold text-white">
                            {item.treatment || 'Experiment'}
                          </h2>

                          <StatusBadge status={status} />
                        </div>

                        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white">
                          <span>
                            Started:{' '}
                            {formatDate(item.createdAt)}
                          </span>

                          <span>
                            Source:{' '}
                            {item.source || 'Not available'}
                          </span>
                        </div>
                      </div>

                      {/* Retry */}

                      {status === 'Failed' && (
                        <button
                          type="button"
                          onClick={() =>
                            handleRetry(item.id)
                          }
                          className="
                            rounded-xl
                            border
                            border-white/10
                            bg-white/[0.05]
                            px-4
                            py-2
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:bg-white/10
                          "
                        >
                          Retry
                        </button>
                      )}

                      {/* Running */}

                      {status === 'Running' && (
                        <div className="flex items-center gap-2 text-sm text-white">
                          <span className="h-2 w-2 animate-pulse rounded-full bg-blue-300" />
                          Running experiment...
                        </div>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          )}

        </section>

      </div>
    </div>
  )
}

export default HistoryPage