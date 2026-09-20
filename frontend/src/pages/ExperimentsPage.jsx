import { useEffect, useState } from 'react'

import { compareExperiments } from '../services/api'
import { useAnalysis } from '../context/AnalysisContext'

const HISTORY_KEY = 'datacanvas_experiment_history'

function ExperimentsPage() {
  const { datasetId, targetColumn, problemType, identifierColumns } = useAnalysis()
  const [isRunning, setIsRunning] = useState(false)
  const [comparison, setComparison] = useState(null)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_KEY)

      if (!storedHistory) {
        return
      }

      const parsedHistory = JSON.parse(storedHistory)

      if (Array.isArray(parsedHistory)) {
        setHistory(parsedHistory)
      }
    } catch (storageError) {
      console.error(
        'Unable to load experiment history:',
        storageError
      )
    }
  }, [])

  const saveHistory = (nextHistory) => {
    setHistory(nextHistory)

    try {
      localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(nextHistory)
      )
    } catch (storageError) {
      console.error(
        'Unable to save experiment history:',
        storageError
      )
    }
  }

  const handleRun = async () => {
    if (isRunning) {
      return
    }

    setIsRunning(true)
    setError('')
    setComparison(null)

    try {
        if (!datasetId || !targetColumn) {
          throw new Error('Select a dataset and target column before comparing models.')
        }

        const response = await compareExperiments({
          datasetId,
          targetColumn,
          problemType,
          identifierColumns,
        })
        setComparison(response)

        const newHistoryItem = {
          id: `${Date.now()}-${response.primary_metric}`,
          treatmentLabel: 'Backend model comparison',
          status: 'Completed',
          createdAt: new Date().toLocaleString(),
          source: 'Backend',
        }

        const nextHistory = [
          newHistoryItem,
          ...history,
        ].slice(0, 10)

        saveHistory(nextHistory)
      } catch (runError) {
        console.error(
          'Unable to run experiment:',
          runError
        )

        setError(runError.userMessage || runError.message || 'The model comparison could not be generated. Please try again.')
    } finally {
      setIsRunning(false)
    }
  }

  const handleRetry = () => {
    if (isRunning) {
      return
    }

    handleRun()
  }

  const handleClearHistory = () => {
    saveHistory([])
  }

  return (
    <div className="relative min-h-screen overflow-hidden text-white">

      {/* Background */}
      <div className="pointer-events-none absolute -right-40 -top-32 h-[420px] w-[420px] rounded-full bg-[#5148D8]/10 blur-[140px]" />

      <div className="pointer-events-none absolute -bottom-40 -left-32 h-[420px] w-[420px] rounded-full bg-[#2563EB]/10 blur-[140px]" />

      <div className="relative z-10 space-y-6">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <section className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-white/[0.07] bg-[#050816]/25 px-5 py-5 backdrop-blur-md md:px-6">

            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#A69CFF]">
                  Dataset Intelligence
                </span>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
                  Model{' '}
                  <span className="bg-gradient-to-r from-[#A794FF] via-[#8D89FF] to-[#58D7FF] bg-clip-text text-transparent">
                    Comparison
                  </span>
                </h1>

                <p className="mt-2 max-w-3xl text-sm leading-7 text-[#8D98B0] md:text-base">
                  Compare backend-evaluated models using cross-validation
                  metrics for the selected dataset.
                </p>
              </div>

              <div className="w-fit rounded-xl border border-[#756BFF]/20 bg-[#5148D8]/[0.06] px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A69CFF]">
                  Status
                </p>

                <p className="mt-1 text-sm font-semibold text-[#D7DCEF]">
                  Experiment Lab
                </p>
              </div>

            </div>
          </div>
        </section>


        {/* =====================================================
            BASELINE
        ====================================================== */}

        <section className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-white/[0.08] bg-[#090E1D]/70 p-5 shadow-xl backdrop-blur-xl md:p-6">

            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7E89A2]">
                  BASELINE
                </span>

                <h2 className="mt-2 text-xl font-bold text-white">
                  Current dataset state
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7E899F]">
                  The backend compares supported models using the selected
                  target and problem type.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3">
                  <p className="text-[10px] uppercase tracking-wide text-[#68728A]">
                    State
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white">
                    Unchanged
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3">
                  <p className="text-[10px] uppercase tracking-wide text-[#68728A]">
                    Target
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white">
                    {targetColumn || 'Not selected'}
                  </p>
                </div>

                <div className="col-span-2 rounded-xl border border-[#F2B84B]/20 bg-[#F2B84B]/[0.05] px-4 py-3 sm:col-span-1">
                  <p className="text-[10px] uppercase tracking-wide text-[#F2C46B]">
                    Metric
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#F2C46B]">
                    {comparison?.primary_metric || 'Pending'}
                  </p>
                </div>

              </div>

            </div>
          </div>
        </section>


        <section className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0A1020]/70 p-5 shadow-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A69CFF]">
              MODEL COMPARISON
            </p>
            <h2 className="mt-2 text-xl font-bold text-white">
              Compare available models
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#8D98B0]">
              Run the existing backend experiment comparison engine for this
              dataset.
            </p>
            <button
              type="button"
              onClick={handleRun}
              disabled={isRunning || !datasetId || !targetColumn}
              className="mt-5 rounded-xl bg-gradient-to-r from-[#5148D8] to-[#756BFF] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isRunning ? 'Comparing models...' : 'Run model comparison'}
            </button>
          </div>
        </section>


        {/* =====================================================
            ERROR
        ====================================================== */}

        {error && (
          <section className="mx-auto max-w-6xl">
            <div className="rounded-2xl border border-red-400/20 bg-red-500/[0.06] p-5">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-sm font-semibold text-red-200">
                    Model comparison failed
                  </p>

                  <p className="mt-1 text-sm leading-6 text-red-200/70">
                    {error}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRetry}
                  disabled={isRunning || !datasetId || !targetColumn}
                  className="w-fit rounded-lg border border-red-300/20 bg-red-400/[0.06] px-4 py-2.5 text-sm font-semibold text-red-200 transition hover:bg-red-400/[0.10] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Retry
                </button>

              </div>
            </div>
          </section>
        )}


        {/* =====================================================
            RESULTS
        ====================================================== */}

        <section className="mx-auto max-w-6xl">

          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A69CFF]">
                STEP 02
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">
                Experiment Results
              </h2>

              <p className="mt-1 text-sm text-[#7F8BA2]">
                Review the backend model comparison results.
              </p>
            </div>

            {comparison?.results?.length > 0 && (
              <span className="w-fit rounded-full border border-[#22C55E]/20 bg-[#22C55E]/[0.06] px-3 py-1.5 text-[11px] font-semibold text-[#5BE58A]">
                Completed
              </span>
            )}

          </div>

          {comparison?.results?.length ? (
            <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#080D1B]/70">
              <table className="w-full min-w-[650px] text-left">
                <thead className="border-b border-white/[0.07]">
                  <tr>
                    <th className="px-5 py-4 text-xs uppercase text-[#68728A]">Model</th>
                    <th className="px-5 py-4 text-xs uppercase text-[#68728A]">Metric</th>
                    <th className="px-5 py-4 text-xs uppercase text-[#68728A]">Mean</th>
                    <th className="px-5 py-4 text-xs uppercase text-[#68728A]">Std. dev.</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.results.map((result) => (
                    <tr key={result.model_name} className="border-b border-white/[0.05]">
                      <td className="px-5 py-4 text-sm font-semibold text-white">{result.model_name}</td>
                      <td className="px-5 py-4 text-sm text-[#A7AFC3]">{comparison.primary_metric}</td>
                      <td className="px-5 py-4 text-sm text-white">
                        {Number(result.mean_metrics?.[comparison.primary_metric]).toFixed(4)}
                      </td>
                      <td className="px-5 py-4 text-sm text-[#A7AFC3]">
                        {Number(result.std_metrics?.[comparison.primary_metric]).toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/[0.1] p-8 text-center text-sm text-[#758198]">
              Run the comparison to display backend model results.
            </div>
          )}

        </section>


        {/* =====================================================
            COMPARISON
        ====================================================== */}

        <section className="mx-auto max-w-6xl">

          <div className="mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A69CFF]">
              STEP 03
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Experiment Comparison
            </h2>

            <p className="mt-1 text-sm text-[#7F8BA2]">
              Compare backend model metrics for the primary metric.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#080D1B]/70 p-5 text-sm text-[#A7AFC3]">
            {comparison
              ? `Primary metric: ${comparison.primary_metric}. Mean and standard deviation are shown in the results table.`
              : 'Comparison results will appear after the backend comparison is run.'}
          </div>

        </section>


        {/* =====================================================
            HISTORY
        ====================================================== */}

        <section className="mx-auto max-w-6xl">

          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A69CFF]">
                HISTORY
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">
                Recent Experiments
              </h2>

              <p className="mt-1 text-sm text-[#7F8BA2]">
                Recent backend comparison runs saved on this device.
              </p>
            </div>

            {history.length > 0 && (
              <button
                type="button"
                onClick={handleClearHistory}
                className="w-fit rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-2 text-xs font-semibold text-[#8D98B0] transition hover:bg-white/[0.05] hover:text-white"
              >
                Clear history
              </button>
            )}

          </div>

          {history.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/[0.1] bg-[#080D1B]/60 p-8 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#756BFF]/20 bg-[#5148D8]/10 text-[#A497FF]">
                ↺
              </div>

              <h3 className="mt-4 text-base font-semibold text-white">
                No experiment history yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#758198]">
                Run a model comparison and it will appear here.
              </p>

            </div>
          ) : (
            <div className="space-y-3">

              {history.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-white/[0.07] bg-[#090E1D]/70 p-4 shadow-lg"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    <div>
                      <p className="text-sm font-semibold text-white">
                        {item.treatmentLabel}
                      </p>

                      <p className="mt-1 text-xs text-[#69758C]">
                        {item.createdAt}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">

                      <span className="rounded-full border border-[#22C55E]/20 bg-[#22C55E]/[0.06] px-3 py-1.5 text-[11px] font-semibold text-[#5BE58A]">
                        {item.status}
                      </span>

                      <span className="rounded-full border border-[#F2B84B]/20 bg-[#F2B84B]/[0.05] px-3 py-1.5 text-[11px] font-semibold text-[#F2C46B]">
                        {item.source}
                      </span>

                    </div>

                  </div>
                </article>
              ))}

            </div>
          )}

        </section>


        {/* =====================================================
            DEMO NOTE
        ====================================================== */}

        <section className="mx-auto max-w-6xl pb-5">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] px-5 py-4">
            <p className="text-xs leading-5 text-[#657189]">
            </p>
          </div>
        </section>

      </div>
    </div>
  )
}

export default ExperimentsPage