import { useState } from 'react'

import { trainModel } from '../services/api'
import { useAnalysis } from '../context/AnalysisContext'

const modelOptions = {
  classification: [
    ['logistic_regression', 'Logistic Regression'],
    ['catboost', 'CatBoost'],
    ['xgboost', 'XGBoost'],
    ['lightgbm', 'LightGBM'],
    ['hist_gradient_boosting', 'Histogram Gradient Boosting'],
  ],
  regression: [
    ['linear_regression', 'Linear Regression'],
    ['ridge', 'Ridge Regression'],
    ['catboost', 'CatBoost'],
    ['xgboost', 'XGBoost'],
    ['lightgbm', 'LightGBM'],
    ['hist_gradient_boosting', 'Histogram Gradient Boosting'],
  ],
}

const defaultModel = {
  classification: 'logistic_regression',
  regression: 'linear_regression',
}

function formatMetricName(name) {
  return name
    .split('_')
    .map((part) => part.toUpperCase())
    .join(' ')
}

function ModelingPage() {
  const {
    datasetId,
    targetColumn,
    problemType,
    identifierColumns,
    updateAnalysis,
  } = useAnalysis()
  const [modelName, setModelName] = useState(defaultModel[problemType] || defaultModel.classification)
  const [nSplits, setNSplits] = useState(2)
  const [trainingState, setTrainingState] = useState('idle')
  const [trainingData, setTrainingData] = useState(null)
  const [error, setError] = useState('')

  const handleTrain = async () => {
    if (!datasetId || !targetColumn || trainingState === 'loading') return

    setTrainingState('loading')
    setTrainingData(null)
    setError('')

    try {
      const response = await trainModel({
        datasetId,
        targetColumn,
        problemType,
        modelName,
        identifierColumns,
        nSplits: Number(nSplits),
      })
      if (!Array.isArray(response?.results) || response.results.length === 0) {
        throw new Error('The modeling API returned no model results.')
      }
      setTrainingData(response)
      setTrainingState('success')
    } catch (requestError) {
      setError(
        requestError.userMessage
        || requestError.response?.data?.detail
        || requestError.message
        || 'Model training could not be completed.',
      )
      setTrainingState('error')
    }
  }

  const selectedResult = trainingData?.results?.[0]
  const modelLabel = modelOptions[problemType]?.find(([value]) => value === modelName)?.[1] || modelName

  return (
    <div className="min-h-full px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B8B3FF]">
            Model training
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Modeling
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#A7AFC3]">
            Train a selected estimator and evaluate it with leakage-safe cross-validation on the current dataset.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-[#090E1D]/70 p-5 shadow-xl sm:p-6">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <label className="space-y-2 text-sm">
              <span className="font-medium text-[#A7AFC3]">Target column</span>
              <input
                value={targetColumn}
                onChange={(event) => {
                  updateAnalysis({ targetColumn: event.target.value })
                  setTrainingData(null)
                  setTrainingState('idle')
                }}
                placeholder="Select target in analysis context"
                className="w-full rounded-lg border border-white/10 bg-[#050816] px-3 py-2.5 text-white outline-none focus:border-[#756BFF]"
              />
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-medium text-[#A7AFC3]">Problem type</span>
              <select
                value={problemType}
                onChange={(event) => {
                  updateAnalysis({ problemType: event.target.value })
                  setModelName(defaultModel[event.target.value])
                  setTrainingData(null)
                  setTrainingState('idle')
                }}
                className="w-full rounded-lg border border-white/10 bg-[#050816] px-3 py-2.5 text-white outline-none focus:border-[#756BFF]"
              >
                <option value="classification">Classification</option>
                <option value="regression">Regression</option>
              </select>
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-medium text-[#A7AFC3]">Model</span>
              <select
                value={modelName}
                onChange={(event) => {
                  setModelName(event.target.value)
                  setTrainingData(null)
                  setTrainingState('idle')
                }}
                className="w-full rounded-lg border border-white/10 bg-[#050816] px-3 py-2.5 text-white outline-none focus:border-[#756BFF]"
              >
                {(modelOptions[problemType] || modelOptions.classification).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-medium text-[#A7AFC3]">Cross-validation folds</span>
              <select
                value={nSplits}
                onChange={(event) => {
                  setNSplits(Number(event.target.value))
                  setTrainingData(null)
                  setTrainingState('idle')
                }}
                className="w-full rounded-lg border border-white/10 bg-[#050816] px-3 py-2.5 text-white outline-none focus:border-[#756BFF]"
              >
                {[2, 3, 5].map((folds) => (
                  <option key={folds} value={folds}>{folds} folds</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 text-sm text-[#8D98B0]">
              <p>Dataset: <span className="break-all text-white">{datasetId || 'No dataset selected'}</span></p>
              {identifierColumns?.length > 0 && (
                <p className="mt-1">Excluded identifier columns: {identifierColumns.join(', ')}</p>
              )}
            </div>
            <button
              type="button"
              onClick={handleTrain}
              disabled={!datasetId || !targetColumn.trim() || trainingState === 'loading'}
              className="shrink-0 rounded-xl bg-gradient-to-r from-[#5148D8] to-[#756BFF] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {trainingState === 'loading'
                ? 'Training model…'
                : trainingState === 'success'
                  ? 'Train again'
                  : 'Train model'}
            </button>
          </div>
        </section>

        {trainingState === 'idle' && (!datasetId || !targetColumn.trim()) && (
          <section className="rounded-2xl border border-dashed border-white/15 bg-white/[0.025] p-8 text-center">
            <h2 className="font-semibold text-white">Dataset and target required</h2>
            <p className="mt-2 text-sm text-[#8D98B0]">
              Select or upload a dataset and provide its original target column to run modeling.
            </p>
          </section>
        )}

        {trainingState === 'idle' && datasetId && targetColumn.trim() && (
          <section className="rounded-2xl border border-dashed border-white/15 bg-white/[0.025] p-8 text-center">
            <h2 className="font-semibold text-white">No modeling results yet</h2>
            <p className="mt-2 text-sm text-[#8D98B0]">
              Train the selected model to retrieve fresh cross-validation results from the backend.
            </p>
          </section>
        )}

        {trainingState === 'loading' && (
          <section role="status" className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#8D89FF]" />
            <h2 className="mt-4 font-semibold">Training {modelLabel}</h2>
            <p className="mt-2 text-sm text-[#8D98B0]">Evaluating the selected model across the requested folds.</p>
          </section>
        )}

        {trainingState === 'error' && (
          <section role="alert" className="rounded-2xl border border-red-400/20 bg-red-500/[0.06] p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-red-200">Model training failed</h2>
                <p className="mt-2 text-sm text-red-200/80">{error}</p>
              </div>
              <button
                type="button"
                onClick={handleTrain}
                disabled={!datasetId || !targetColumn.trim()}
                className="rounded-lg border border-red-300/20 px-4 py-2 text-sm font-semibold text-red-100 disabled:opacity-50"
              >
                Retry
              </button>
            </div>
          </section>
        )}

        {trainingState === 'success' && selectedResult && (
          <section className="space-y-5" aria-live="polite">
            <div className="rounded-2xl border border-[#22C55E]/20 bg-[#090E1D]/70 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5BE58A]">Training complete</p>
                  <h2 className="mt-2 text-xl font-bold">{modelLabel}</h2>
                  <p className="mt-2 text-sm text-[#A7AFC3]">
                    {trainingData.problem_type} · target {trainingData.target_column} · {trainingData.n_splits} folds · {trainingData.evaluation_method.replaceAll('_', ' ')}
                  </p>
                </div>
                <span className="rounded-full border border-[#22C55E]/20 bg-[#22C55E]/[0.06] px-3 py-1.5 text-xs font-semibold text-[#5BE58A]">
                  Backend results
                </span>
              </div>
              <p className="mt-3 break-all text-xs text-[#758198]">Dataset ID: {trainingData.dataset_id}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Object.entries(selectedResult.mean_metrics).map(([metric, mean]) => (
                <article key={metric} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#A7AFC3]">{formatMetricName(metric)}</p>
                  <p className="mt-3 text-3xl font-bold text-white">{Number(mean).toFixed(4)}</p>
                  <p className="mt-2 text-xs text-[#8D98B0]">
                    Mean ± SD: {Number(mean).toFixed(4)} ± {Number(selectedResult.std_metrics[metric]).toFixed(4)}
                  </p>
                </article>
              ))}
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#090E1D]/70">
              <div className="border-b border-white/10 px-5 py-4">
                <h3 className="font-semibold">Per-fold metrics</h3>
                <p className="mt-1 text-xs text-[#8D98B0]">Values returned by the backend for each cross-validation fold.</p>
              </div>
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="text-xs uppercase text-[#8D98B0]">
                  <tr>
                    <th className="px-5 py-3">Fold</th>
                    {Object.keys(selectedResult.mean_metrics).map((metric) => (
                      <th key={metric} className="px-5 py-3">{formatMetricName(metric)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedResult.fold_metrics.map((fold, index) => (
                    <tr key={`fold-${index + 1}`} className="border-t border-white/[0.06]">
                      <td className="px-5 py-3 font-medium">Fold {index + 1}</td>
                      {Object.keys(selectedResult.mean_metrics).map((metric) => (
                        <td key={metric} className="px-5 py-3 text-[#C8CEE0]">
                          {Number.isFinite(fold[metric]) ? fold[metric].toFixed(4) : '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default ModelingPage
