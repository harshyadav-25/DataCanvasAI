import { useEffect, useState } from 'react'
import { analyzePreprocessing, runSimulation } from '../services/api'
import { useAnalysis } from '../context/AnalysisContext'
import StateMessage from '../components/common/StateMessage'

function DataCanvas() {
  const [selectedAction, setSelectedAction] = useState(null)
  const { datasetId, targetColumn } = useAnalysis()
  const [preprocessing, setPreprocessing] = useState(null)
  const [state, setState] = useState('loading')
  const [error, setError] = useState('')

  const loadPreprocessing = async () => {
    if (!datasetId || !targetColumn) {
      setState('empty')
      return
    }
    setState('loading')
    try {
      setPreprocessing(await analyzePreprocessing(datasetId, targetColumn))
      setState('success')
    } catch (requestError) {
      setError(requestError.userMessage || 'Unable to load preprocessing analysis.')
      setState('error')
    }
  }

  useEffect(() => { loadPreprocessing() }, [datasetId, targetColumn])

  const columns = preprocessing?.feature_names?.map((name) => ({
    id: name,
    name,
    dataType: preprocessing.feature_groups?.numeric?.includes(name)
      ? 'numeric'
      : 'categorical',
  })) || []

  const handleAction = async (action, column) => {
    if (action === 'simulate' && datasetId && column) {
      try {
        const result = await runSimulation(datasetId, {
          column,
          transformation: 'MEDIAN_IMPUTATION',
        })
        setSelectedAction(
          `${column}: ${result.missing_values_before} missing values before, ${result.missing_values_after} after`,
        )
      } catch (requestError) {
        setError(requestError.userMessage || 'Unable to run simulation.')
      }
      return
    }
    setSelectedAction(action)
  }

  return (
    <div className="relative min-h-screen overflow-hidden rounded-3xl bg-[#070B16] px-4 py-6 text-white sm:px-6 lg:px-8">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#6D5DF6]/20 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-24 h-96 w-96 rounded-full bg-[#3A7BFF]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#8B5CF6]/10 blur-3xl" />

      <div className="relative z-10 space-y-6">
        {/* Page Header */}
        <section>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-wide text-[#8F7CFF]">
                ANALYSIS WORKSPACE
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Dataset Canvas
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#A7AFC3]">
                Review your dataset column by column before moving into
                preprocessing and machine learning.
              </p>
            </div>

            <div className="w-fit rounded-2xl border border-[#6557D8]/30 bg-[#11172A]/80 px-4 py-3 backdrop-blur-md">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8F7CFF]">
                Data source
              </p>

              <p className="mt-1 text-sm font-semibold text-[#A7AFC3]">
                {state === 'success' ? 'Connected' : 'Backend analysis'}
              </p>
            </div>
          </div>
        </section>

        {state === 'loading' && <StateMessage type="loading" title="Loading preprocessing analysis" />}
        {state === 'error' && <StateMessage type="error" title="Unable to load preprocessing" message={error} actionLabel="Retry" onAction={loadPreprocessing} />}
        {state === 'empty' && <StateMessage type="empty" title="Target configuration required" message="Select a target column in Overview before preprocessing." />}

        {/* Dataset Summary */}
        <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <SummaryCard
            label="Dataset"
            value={preprocessing?.dataset_id || 'Not available'}
          />

          <SummaryCard
            label="Features"
            value={preprocessing?.feature_names?.length ?? '—'}
          />

          <SummaryCard
            label="Numeric features"
            value={preprocessing?.feature_groups?.numeric?.length ?? '—'}
          />

          <SummaryCard
            label="Target"
            value={preprocessing?.target_column || 'Not available'}
          />
        </section>

        {/* Information */}
        <section className="rounded-2xl border border-[#343C53] bg-[#10162A]/80 p-5 backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#7C6FFF]/30 bg-[#6D5DF6]/10 text-sm font-bold text-[#9A8EFF]">
              i
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white">
                Dataset analysis
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#A7AFC3]">
                Dataset analysis results will appear here when data is
                available from the backend.
              </p>
            </div>
          </div>
        </section>

        {/* Column Analysis */}
        <section>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Column analysis
              </h2>

              <p className="mt-1 text-sm text-[#8F98AD]">
                Column-level analysis and recommendations will be displayed
                here when available.
              </p>
            </div>
          </div>

          {/* Empty State */}
          {state === 'success' && columns.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#343C53] bg-[#0F1526]/80 px-6 py-14 text-center backdrop-blur-xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#6557D8]/30 bg-[#6D5DF6]/10 text-xl text-[#9A8EFF]">
                +
              </div>

              <h3 className="mt-5 text-base font-semibold text-white">
                No column analysis available
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7F899F]">
                Upload a dataset and wait for the analysis service to provide
                column-level results.
              </p>
            </div>
          ) : state === 'success' ? (
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              {columns.map((column) => (
                <ColumnCard
                  key={column.id}
                  column={column}
                  onInvestigate={() =>
                    handleAction(`Investigate: ${column.name}`)
                  }
                  onSimulate={() =>
                    handleAction('simulate', column.name)
                  }
                />
              ))}
            </div>
          ) : null}
        </section>

        {/* Temporary UI interaction */}
        {selectedAction && (
          <div className="fixed right-5 bottom-5 z-50 w-[min(370px,calc(100vw-2rem))] rounded-2xl border border-[#6557D8]/40 bg-[#0D1324]/95 p-5 shadow-2xl backdrop-blur-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#8F7CFF]">
                  UI interaction
                </p>

                <h3 className="mt-1 text-base font-bold text-white">
                  {selectedAction}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAction(null)}
                className="text-xl text-[#69738B] transition hover:text-white"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <p className="mt-4 text-xs leading-5 text-[#727C94]">
              This action is currently UI-only and will be connected to the
              backend after the API contract is finalized.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#252D42] bg-[#11172A]/85 p-5 shadow-lg shadow-black/10 backdrop-blur-xl">
      <p className="text-xs font-medium text-[#737D94]">
        {label}
      </p>

      <p className="mt-2 truncate text-lg font-bold text-white sm:text-xl">
        {value}
      </p>
    </div>
  )
}

/* =========================================================
   COLUMN CARD
========================================================= */

function ColumnCard({
  column,
  onInvestigate,
  onSimulate,
}) {
  return (
    <article className="rounded-2xl border border-[#252D42] bg-[#0F1526]/90 p-5 shadow-xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="break-all text-base font-bold text-white">
              {column.name}
            </h3>

            <span className="rounded-md border border-[#6155D9]/30 bg-[#6D5DF6]/10 px-2 py-1 text-[11px] font-semibold text-[#9A8EFF]">
              {column.dataType}
            </span>
          </div>
        </div>

        <span className="w-fit shrink-0 rounded-full border border-[#343C53] bg-[#12192B] px-3 py-1 text-xs font-semibold text-[#A7AFC3]">
          {column.riskSeverity || 'Not available'}
        </span>
      </div>

      <div className="mt-4 rounded-xl border border-[#343C53] bg-[#11172A]/70 p-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-[#8993A9]">
          Backend preprocessing group
        </p>

        <p className="mt-2 text-sm leading-6 text-[#A7AFC3]">
          {column.dataType === 'numeric'
            ? 'This feature is handled by the backend numeric preprocessing pipeline.'
            : 'This feature is handled by the backend categorical preprocessing pipeline.'}
        </p>
      </div>

      <div className="mt-4 rounded-xl border border-[#6557D8]/20 bg-[#6D5DF6]/5 p-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-[#9183FF]">
          Generated feature
        </p>

        <p className="mt-2 text-sm leading-6 text-[#A7AFC3]">
          {column.name}
        </p>
      </div>

      <div className="mt-4 rounded-xl border border-[#252D42] bg-[#0A1020]/60 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[#68728A]">
              Source
            </p>

            <p className="mt-1 text-sm font-bold text-white">
              Existing preprocessing engine
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onInvestigate}
          className="rounded-lg bg-linear-to-r from-[#5B4BE8] to-[#735DFF] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#5B4BE8]/20 transition hover:-translate-y-0.5"
        >
          Investigate
        </button>

        <button
          type="button"
          onClick={onSimulate}
          className="rounded-lg border border-[#30384E] bg-[#11172A] px-4 py-2.5 text-sm font-semibold text-[#D7DBE6] transition hover:border-[#5A50C8] hover:bg-[#171E34]"
        >
          Simulate
        </button>
      </div>
    </article>
  )
}

export default DataCanvas