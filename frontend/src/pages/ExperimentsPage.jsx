import { useEffect, useState } from 'react'

import { compareExperiments } from '../services/api'
import { useAnalysis } from '../context/AnalysisContext'

const HISTORY_KEY = 'datacanvas_experiment_history'

// ---------------------------------------------------------------------------
// Model definitions (must match backend validation_engine.get_models())
// ---------------------------------------------------------------------------
const REGRESSION_MODELS = [
  { id: 'catboost',               label: 'CatBoost' },
  { id: 'xgboost',                label: 'XGBoost' },
  { id: 'lightgbm',               label: 'LightGBM' },
  { id: 'hist_gradient_boosting', label: 'Hist Gradient Boosting' },
  { id: 'linear_regression',      label: 'Linear Regression' },
  { id: 'ridge',                  label: 'Ridge' },
]

const CLASSIFICATION_MODELS = [
  { id: 'catboost',               label: 'CatBoost' },
  { id: 'xgboost',                label: 'XGBoost' },
  { id: 'lightgbm',               label: 'LightGBM' },
  { id: 'hist_gradient_boosting', label: 'Hist Gradient Boosting' },
  { id: 'logistic_regression',    label: 'Logistic Regression' },
]

function getAvailableModels(problemType) {
  return problemType === 'regression' ? REGRESSION_MODELS : CLASSIFICATION_MODELS
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
function ExperimentsPage() {
  const { datasetId, targetColumn, problemType, identifierColumns } = useAnalysis()

  const availableModels = getAvailableModels(problemType)

  // Model selection: default to all selected
  const [selectedModels, setSelectedModels] = useState(
    () => availableModels.map((m) => m.id)
  )

  const [isRunning, setIsRunning] = useState(false)
  const [comparison, setComparison] = useState(null)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])
  const [selectionError, setSelectionError] = useState('')

  // Previous result banner: stored separately from current comparison
  // so "view previous" and "run fresh" can coexist
  const [previousComparison, setPreviousComparison] = useState(null)

  // Sync available models when problem type changes
  useEffect(() => {
    const next = getAvailableModels(problemType)
    setSelectedModels(next.map((m) => m.id))
    setSelectionError('')
    setComparison(null)
    setPreviousComparison(null)
  }, [problemType])

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_KEY)
      if (!storedHistory) return
      const parsedHistory = JSON.parse(storedHistory)
      if (Array.isArray(parsedHistory)) setHistory(parsedHistory)
    } catch (storageError) {
      console.error('Unable to load experiment history:', storageError)
    }
  }, [])

  const saveHistory = (nextHistory) => {
    setHistory(nextHistory)
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory))
    } catch (storageError) {
      console.error('Unable to save experiment history:', storageError)
    }
  }

  // ---------------------------------------------------------------------------
  // Model selection helpers
  // ---------------------------------------------------------------------------
  const handleModelToggle = (modelId) => {
    setSelectedModels((prev) =>
      prev.includes(modelId)
        ? prev.filter((id) => id !== modelId)
        : [...prev, modelId]
    )
    setSelectionError('')
  }

  const handleSelectAll = () => {
    setSelectedModels(availableModels.map((m) => m.id))
    setSelectionError('')
  }

  const handleClearAll = () => {
    setSelectedModels([])
    setSelectionError('Select at least 2 models to compare.')
  }

  // ---------------------------------------------------------------------------
  // Run helpers
  // ---------------------------------------------------------------------------
  const validateSelection = () => {
    if (selectedModels.length < 2) {
      setSelectionError('Select at least 2 models to compare.')
      return false
    }
    setSelectionError('')
    return true
  }

  const executeRun = async (bypassCache = false) => {
    if (isRunning) return
    if (!validateSelection()) return

    setIsRunning(true)
    setError('')
    if (!bypassCache) {
      // When running fresh, keep showing previous result until new one arrives
      setComparison(null)
    }

    try {
      if (!datasetId || !targetColumn) {
        throw new Error('Select a dataset and target column before comparing models.')
      }

      const response = await compareExperiments({
        datasetId,
        targetColumn,
        problemType,
        modelNames: selectedModels,
        identifierColumns,
        bypassCache,
      })

      // Move current result to "previous" before replacing
      if (comparison) setPreviousComparison(comparison)
      setComparison(response)

      const newHistoryItem = {
        id: `${Date.now()}-${response.primary_metric}`,
        treatmentLabel: `Model comparison: ${selectedModels.join(', ')}`,
        status: 'Completed',
        createdAt: new Date().toLocaleString(),
        source: bypassCache ? 'Fresh run' : 'Backend',
        models: selectedModels,
        primaryMetric: response.primary_metric,
      }

      const nextHistory = [newHistoryItem, ...history].slice(0, 10)
      saveHistory(nextHistory)
    } catch (runError) {
      console.error('Unable to run experiment:', runError)
      setError(
        runError.userMessage ||
          runError.message ||
          'The model comparison could not be generated. Please try again.'
      )
    } finally {
      setIsRunning(false)
    }
  }

  const handleRun = () => executeRun(false)
  const handleRunFresh = () => executeRun(true)
  const handleRetry = () => { if (!isRunning) executeRun(false) }
  const handleViewPrevious = () => {
    if (previousComparison) setComparison(previousComparison)
  }
  const handleClearHistory = () => saveHistory([])

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  const canRun = !isRunning && !!datasetId && !!targetColumn && selectedModels.length >= 2

  return (
    <div className="relative min-h-screen overflow-hidden text-white">

      {/* Background */}
      <div className="pointer-events-none absolute -right-40 -top-32 h-[420px] w-[420px] rounded-full bg-[#5148D8]/10 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 h-[420px] w-[420px] rounded-full bg-[#2563EB]/10 blur-[140px]" />

      <div className="relative z-10 space-y-6">

        {/* ============================================================
            HEADER
        ============================================================= */}
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
                  Select models and compare them using leakage-safe cross-validation.
                </p>
              </div>

              <div className="w-fit rounded-xl border border-[#756BFF]/20 bg-[#5148D8]/[0.06] px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A69CFF]">Status</p>
                <p className="mt-1 text-sm font-semibold text-[#D7DCEF]">Experiment Lab</p>
              </div>
            </div>
          </div>
        </section>


        {/* ============================================================
            BASELINE INFO
        ============================================================= */}
        <section className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-white/[0.08] bg-[#090E1D]/70 p-5 shadow-xl backdrop-blur-xl md:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7E89A2]">BASELINE</span>
                <h2 className="mt-2 text-xl font-bold text-white">Current dataset state</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7E899F]">
                  The backend compares selected models using the target and problem type below.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3">
                  <p className="text-[10px] uppercase tracking-wide text-[#68728A]">State</p>
                  <p className="mt-1 text-sm font-semibold text-white">Unchanged</p>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3">
                  <p className="text-[10px] uppercase tracking-wide text-[#68728A]">Target</p>
                  <p className="mt-1 text-sm font-semibold text-white">{targetColumn || 'Not selected'}</p>
                </div>

                <div className="col-span-2 rounded-xl border border-[#F2B84B]/20 bg-[#F2B84B]/[0.05] px-4 py-3 sm:col-span-1">
                  <p className="text-[10px] uppercase tracking-wide text-[#F2C46B]">Metric</p>
                  <p className="mt-1 text-sm font-semibold text-[#F2C46B]">
                    {comparison?.primary_metric || 'Pending'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ============================================================
            MODEL SELECTION  (STEP 01)
        ============================================================= */}
        <section className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0A1020]/70 p-5 shadow-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A69CFF]">STEP 01</p>
            <h2 className="mt-2 text-xl font-bold text-white">Models to compare</h2>
            <p className="mt-1 text-sm leading-6 text-[#8D98B0]">
              Select at least 2 models. Only selected models will be trained.
            </p>

            {/* Select all / clear all */}
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={handleSelectAll}
                disabled={isRunning}
                className="rounded-lg border border-[#756BFF]/25 bg-[#5148D8]/[0.08] px-3 py-1.5 text-xs font-semibold text-[#A69CFF] transition hover:bg-[#5148D8]/[0.18] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                disabled={isRunning}
                className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-[#8D98B0] transition hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear All
              </button>
            </div>

            {/* Model checkboxes */}
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {availableModels.map((model) => {
                const checked = selectedModels.includes(model.id)
                return (
                  <label
                    key={model.id}
                    className={`
                      flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition
                      ${checked
                        ? 'border-[#756BFF]/40 bg-[#5148D8]/[0.12] text-white'
                        : 'border-white/[0.07] bg-white/[0.02] text-[#8D98B0] hover:border-[#756BFF]/20 hover:bg-[#5148D8]/[0.05]'
                      }
                      ${isRunning ? 'cursor-not-allowed opacity-50' : ''}
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => !isRunning && handleModelToggle(model.id)}
                      disabled={isRunning}
                      className="h-4 w-4 accent-[#756BFF]"
                    />
                    <span className="text-sm font-medium">{model.label}</span>
                  </label>
                )
              })}
            </div>

            {/* Selection validation message */}
            {selectionError && (
              <p className="mt-3 text-sm font-medium text-amber-400">{selectionError}</p>
            )}

            {/* Action buttons */}
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleRun}
                disabled={!canRun || selectedModels.length < 2}
                className="rounded-xl bg-gradient-to-r from-[#5148D8] to-[#756BFF] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(81,72,216,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_0_42px_rgba(81,72,216,0.38)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {isRunning ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Comparing models…
                  </span>
                ) : (
                  'Compare Selected Models'
                )}
              </button>

              <button
                type="button"
                onClick={handleRunFresh}
                disabled={!canRun || selectedModels.length < 2}
                title="Bypass cache and recalculate"
                className="rounded-xl border border-[#756BFF]/25 bg-transparent px-6 py-3 text-sm font-semibold text-[#A69CFF] transition hover:border-[#756BFF]/50 hover:bg-[#5148D8]/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Run Fresh
              </button>
            </div>

            {/* Previous result banner */}
            {previousComparison && !comparison && (
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#756BFF]/20 bg-[#5148D8]/[0.06] px-4 py-3">
                <p className="flex-1 text-sm text-[#A69CFF]">
                  Previous comparison available —{' '}
                  {previousComparison.results.map((r) => r.model_name).join(', ')}
                </p>
                <button
                  type="button"
                  onClick={handleViewPrevious}
                  className="rounded-lg border border-[#756BFF]/30 px-3 py-1.5 text-xs font-semibold text-[#A69CFF] transition hover:bg-[#5148D8]/[0.12]"
                >
                  View Previous
                </button>
              </div>
            )}
          </div>
        </section>


        {/* ============================================================
            ERROR
        ============================================================= */}
        {error && (
          <section className="mx-auto max-w-6xl">
            <div className="rounded-2xl border border-red-400/20 bg-red-500/[0.06] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-red-200">Model comparison failed</p>
                  <p className="mt-1 text-sm leading-6 text-red-200/70">{error}</p>
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


        {/* ============================================================
            RESULTS  (STEP 02)
        ============================================================= */}
        <section className="mx-auto max-w-6xl">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A69CFF]">STEP 02</p>
              <h2 className="mt-2 text-2xl font-bold text-white">Experiment Results</h2>
              <p className="mt-1 text-sm text-[#7F8BA2]">
                Review cross-validation results for selected models only.
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
              <table className="w-full min-w-[900px] text-left">
                <thead className="border-b border-white/[0.07]">
                  <tr>
                    <th className="px-5 py-4 text-xs uppercase text-[#68728A]">
                      Model
                    </th>
                    <th className="px-5 py-4 text-xs uppercase text-[#68728A]">
                      Primary Metric
                    </th>
                    <th className="px-5 py-4 text-xs uppercase text-[#68728A]">
                      Mean
                    </th>
                    <th className="px-5 py-4 text-xs uppercase text-[#68728A]">
                      Std. Dev.
                    </th>
                    <th className="px-5 py-4 text-xs uppercase text-[#68728A]">
                      Fold Results
                    </th>
                    <th className="px-5 py-4 text-xs uppercase text-[#68728A]">
                      Details
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {comparison.results.map((result, idx) => (
                    <tr
                      key={result.model_name}
                      className={`border-b border-white/[0.05] ${
                        idx === 0 ? 'bg-[#5148D8]/[0.04]' : ''
                      }`}
                    >
                      <td className="px-5 py-4 text-sm font-semibold text-white">
                        {result.model_name}

                        {idx === 0 && (
                          <span className="ml-2 rounded-full border border-[#A69CFF]/30 bg-[#5148D8]/[0.1] px-2 py-0.5 text-[10px] font-semibold text-[#A69CFF]">
                            Best
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-[#A7AFC3]">
                        {comparison.primary_metric}
                      </td>

                      <td className="px-5 py-4 text-sm text-white">
                        {Number(
                          result.mean_metrics?.[comparison.primary_metric]
                        ).toFixed(4)}
                      </td>

                      <td className="px-5 py-4 text-sm text-[#A7AFC3]">
                        {Number(
                          result.std_metrics?.[comparison.primary_metric]
                        ).toFixed(4)}
                      </td>

                      <td className="px-5 py-4 text-sm text-[#A7AFC3]">
                        <div className="flex flex-wrap gap-2">
                          {(result.fold_metrics || []).map((fold, foldIdx) => (
                            <span
                              key={foldIdx}
                              className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-xs"
                            >
                              F{foldIdx + 1}:{' '}
                              {Number(
                                fold?.[comparison.primary_metric]
                              ).toFixed(4)}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <details className="group">
                          <summary className="cursor-pointer list-none rounded-lg border border-[#A69CFF]/20 bg-[#A69CFF]/[0.05] px-3 py-2 text-xs font-semibold text-[#A69CFF] transition hover:bg-[#A69CFF]/[0.1]">
                            View metrics
                          </summary>

                          <div className="mt-3 min-w-[520px] rounded-xl border border-white/[0.07] bg-black/20 p-4">
                            <div className="mb-3 flex items-center justify-between">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#A69CFF]">
                                  {result.model_name}
                                </p>
                                <p className="mt-1 text-[11px] text-[#758198]">
                                  Cross-validation metric breakdown
                                </p>
                              </div>

                              <span className="rounded-full border border-white/[0.08] px-2 py-1 text-[10px] text-[#8D97AB]">
                                {Object.keys(result.mean_metrics || {}).length} metrics
                              </span>
                            </div>

                            <div className="overflow-x-auto">
                              <table className="w-full text-left">
                                <thead>
                                  <tr className="border-b border-white/[0.06]">
                                    <th className="px-3 py-2 text-[10px] uppercase tracking-wide text-[#68728A]">
                                      Metric
                                    </th>
                                    <th className="px-3 py-2 text-[10px] uppercase tracking-wide text-[#68728A]">
                                      Mean
                                    </th>
                                    <th className="px-3 py-2 text-[10px] uppercase tracking-wide text-[#68728A]">
                                      Std. Dev.
                                    </th>
                                    <th className="px-3 py-2 text-[10px] uppercase tracking-wide text-[#68728A]">
                                      Fold Results
                                    </th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {Object.keys(result.mean_metrics || {}).map(
                                    (metric) => (
                                      <tr
                                        key={metric}
                                        className="border-b border-white/[0.04]"
                                      >
                                        <td className="px-3 py-3 text-xs font-medium text-white">
                                          <div className="flex items-center gap-2">
                                            {metric}

                                            {metric === comparison.primary_metric && (
                                              <span className="rounded-full border border-[#A69CFF]/20 bg-[#A69CFF]/[0.06] px-1.5 py-0.5 text-[9px] text-[#A69CFF]">
                                                Primary
                                              </span>
                                            )}
                                          </div>
                                        </td>

                                        <td className="px-3 py-3 text-xs text-white">
                                          {Number(
                                            result.mean_metrics?.[metric]
                                          ).toFixed(4)}
                                        </td>

                                        <td className="px-3 py-3 text-xs text-[#A7AFC3]">
                                          {Number(
                                            result.std_metrics?.[metric]
                                          ).toFixed(4)}
                                        </td>

                                        <td className="px-3 py-3">
                                          <div className="flex flex-wrap gap-1.5">
                                            {(result.fold_metrics || []).map(
                                              (fold, foldIdx) => (
                                                <span
                                                  key={foldIdx}
                                                  className="rounded-md border border-white/[0.07] bg-white/[0.02] px-1.5 py-1 text-[10px] text-[#A7AFC3]"
                                                >
                                                  F{foldIdx + 1}:{' '}
                                                  {Number(
                                                    fold?.[metric]
                                                  ).toFixed(4)}
                                                </span>
                                              )
                                            )}
                                          </div>
                                        </td>
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </details>
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


        {/* ============================================================
            COMPARISON SUMMARY  (STEP 03)
        ============================================================= */}
        <section className="mx-auto max-w-6xl">
          <div className="mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A69CFF]">STEP 03</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Experiment Comparison</h2>
            <p className="mt-1 text-sm text-[#7F8BA2]">Compare backend model metrics for the primary metric.</p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#080D1B]/70 p-5 text-sm text-[#A7AFC3]">
            {comparison
              ? `Primary metric: ${comparison.primary_metric}. Results are sorted from best to worst. Mean and standard deviation are shown in the results table.`
              : 'Comparison results will appear after the backend comparison is run.'}
          </div>
        </section>


        {/* ============================================================
            HISTORY
        ============================================================= */}
        <section className="mx-auto max-w-6xl">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A69CFF]">HISTORY</p>
              <h2 className="mt-2 text-2xl font-bold text-white">Recent Experiments</h2>
              <p className="mt-1 text-sm text-[#7F8BA2]">Recent backend comparison runs saved on this device.</p>
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
              <h3 className="mt-4 text-base font-semibold text-white">No experiment history yet</h3>
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
                      <p className="text-sm font-semibold text-white">{item.treatmentLabel}</p>
                      <p className="mt-1 text-xs text-[#69758C]">{item.createdAt}</p>
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


        {/* ============================================================
            DEMO NOTE (preserved)
        ============================================================= */}
        <section className="mx-auto max-w-6xl pb-5">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] px-5 py-4">
            <p className="text-xs leading-5 text-[#657189]" />
          </div>
        </section>

      </div>
    </div>
  )
}

export default ExperimentsPage