import { useEffect, useRef, useState } from 'react'
import { analyzeValidation } from '../services/api'
import { useAnalysis } from '../context/AnalysisContext'

const classificationModels = [
  { id: 'catboost', label: 'CatBoost' },
  { id: 'xgboost', label: 'XGBoost' },
  { id: 'lightgbm', label: 'LightGBM' },
  { id: 'hist_gradient_boosting', label: 'Hist Gradient Boosting' },
  { id: 'logistic_regression', label: 'Logistic Regression' },
]

const regressionModels = [
  { id: 'catboost', label: 'CatBoost' },
  { id: 'xgboost', label: 'XGBoost' },
  { id: 'lightgbm', label: 'LightGBM' },
  { id: 'hist_gradient_boosting', label: 'Hist Gradient Boosting' },
  { id: 'linear_regression', label: 'Linear Regression' },
  { id: 'ridge', label: 'Ridge Regression' },
]

const classificationMetricNames = [
  'Accuracy',
  'Precision',
  'Recall',
  'F1 Score',
  'ROC-AUC',
  'PR-AUC',
  'Balanced Accuracy',
]

const regressionMetricNames = [
  'MAE',
  'RMSE',
  'R²',
]

const metricKeyByLabel = {
  Accuracy: 'accuracy',
  Precision: 'precision',
  Recall: 'recall',
  'F1 Score': 'f1',
  'ROC-AUC': 'roc_auc',
  'PR-AUC': 'pr_auc',
  'Balanced Accuracy': 'balanced_accuracy',
  MAE: 'mae',
  RMSE: 'rmse',
  'R²': 'r2',
}

function MetricStructure({ names, result }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {names.map((name) => (
        <article
          key={name}
          className="
            rounded-2xl
            border
            border-white/10
            bg-white/[0.04]
            p-5
          "
        >
          <p className="text-sm font-semibold text-white">
            {name}
          </p>

          <div className="mt-5">
            <p className="text-3xl font-bold text-white">
              {result?.mean_metrics?.[metricKeyByLabel[name]] !== undefined
                ? result.mean_metrics[metricKeyByLabel[name]].toFixed(4)
                : '—'}
            </p>
          </div>

          <p className="mt-4 text-xs leading-5 text-white">
            {result
              ? `Mean score for ${result.model_name}; standard deviation: ${
                result.std_metrics?.[metricKeyByLabel[name]]?.toFixed(4) ?? '—'
              }`
              : 'Value will appear when validation data is available.'}
          </p>
        </article>
      ))}
    </div>
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

      <h3 className="mt-5 text-lg font-semibold text-white">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white">
        {description}
      </p>
    </div>
  )
}

function LoadingState() {
  return (
    <div
      className="
        rounded-2xl
        border
        border-white/10
        bg-white/[0.04]
        p-10
        text-center
      "
    >
      <div
        className="
          mx-auto
          h-8
          w-8
          animate-spin
          rounded-full
          border-2
          border-white/20
          border-t-[#8D89FF]
        "
      />

      <h3 className="mt-4 text-lg font-semibold text-white">
        Loading validation results
      </h3>

      <p className="mt-2 text-sm text-white">
        Validation results will appear here when they are available.
      </p>
    </div>
  )
}

function WarningState() {
  return (
    <div
      className="
        rounded-2xl
        border
        border-white/15
        bg-white/[0.04]
        p-6
      "
    >
      <h3 className="font-semibold text-white">
        Validation needs attention
      </h3>

      <p className="mt-2 text-sm leading-6 text-white">
        Some validation information may be incomplete and requires review.
      </p>
    </div>
  )
}

function ErrorState({ onRetry, message }) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-white/15
        bg-white/[0.04]
        p-6
      "
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold text-white">
            Validation results could not be loaded
          </h3>

          <p className="mt-2 text-sm text-white">
            {message || 'Please retry when validation data is available.'}
          </p>
        </div>

        <button
          type="button"
          onClick={onRetry}
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
      </div>
    </div>
  )
}

function ValidationPage() {
  const { datasetId, targetColumn, problemType, identifierColumns, updateAnalysis } = useAnalysis()
  const [validationData, setValidationData] = useState(null)
  const [validationState, setValidationState] = useState('empty') // 'empty', 'loading', 'success', 'warning', 'error'
  const [error, setError] = useState('')
  const requestIdRef = useRef(0)
  const availableModels =
  problemType === 'classification'
    ? classificationModels
    : regressionModels

  const [selectedModels, setSelectedModels] = useState([])
  useEffect(() => {
    setSelectedModels([])
  }, [problemType])

  /*
    =========================================================
    DATA-READY STRUCTURE

    Real validation data will be assigned here later.

    Future structure:

    {
      metrics: [
        {
          name: '',
          value: ''
        }
      ],

      models: [
        {
          name: '',
          type: '',
          validation: '',
          status: ''
        }
      ]
    }

    No dummy values are used.
    =========================================================
  */

  const metricNames =
    problemType === 'classification'
      ? classificationMetricNames
      : regressionMetricNames

  const loadValidation = async () => {
    const requestId = ++requestIdRef.current
    if (!datasetId || !targetColumn) {
      setValidationData(null)
      setValidationState('empty')
      return
    }
    setValidationState('loading')
    setError('')
    try {
      const response = await analyzeValidation({
        datasetId,
        targetColumn,
        problemType,
        identifierColumns,
        modelNames: selectedModels,
      })
      if (!response || !Array.isArray(response.results)) {
        throw new Error('The validation response did not contain model results.')
      }
      if (requestId !== requestIdRef.current) return
      setValidationData(response)
      setValidationState('success')
    } catch (requestError) {
      if (requestId !== requestIdRef.current) return
      setError(requestError.userMessage || 'Unable to load validation results.')
      setValidationState('error')
    }
  }
  useEffect(() => {
    if (!datasetId || !targetColumn) {
      setValidationData(null)
      setValidationState('empty')
    }
  }, [datasetId, targetColumn])
  return (
    <div className="min-h-full px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B8B3FF]">
            Model Evaluation
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Validation
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white sm:text-base">
            Review model validation results and evaluation metrics when
            validation data becomes available.
          </p>
        </section>

        {/* =====================================================
            PROBLEM TYPE
        ===================================================== */}

        <section
          className="
            mt-8
            rounded-2xl
            border
            border-white/10
            bg-white/[0.04]
            p-5
            sm:p-6
          "
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#B8B3FF]">
                Evaluation metrics
              </p>

              <h2 className="mt-1 text-xl font-semibold text-white">
                Problem type
              </h2>

              <p className="mt-1 text-sm text-white">
                Select the type of validation metrics to display.
              </p>
            </div>

            <div className="flex rounded-xl border border-white/10 bg-black/10 p-1">
              <button
                type="button"
                onClick={() => {
                  updateAnalysis({ problemType: 'classification' })
                  setValidationData(null)
                }}
                className={`
                  rounded-lg
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  transition

                  ${
                    problemType === 'classification'
                      ? 'bg-[#5B56E8] text-white shadow-lg'
                      : 'text-white hover:bg-white/[0.08]'
                  }
                `}
              >
                Classification
              </button>

              <button
                type="button"
                onClick={() => {
                  updateAnalysis({ problemType: 'regression' })
                  setValidationData(null)
                }}
                className={`
                  rounded-lg
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  transition

                  ${
                    problemType === 'regression'
                      ? 'bg-[#5B56E8] text-white shadow-lg'
                      : 'text-white hover:bg-white/[0.08]'
                  }
                `}
              >
                Regression
              </button>
            </div>
          </div>
        </section>
        {/* =====================================================
            MODEL SELECTION
        ===================================================== */}
        <section
          className="
            mt-6
            rounded-2xl
            border
            border-white/10
            bg-white/[0.04]
            p-5
            sm:p-6
          "
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#B8B3FF]">
              Model selection
            </p>

            <h2 className="mt-1 text-xl font-semibold text-white">
              Models to validate
            </h2>

            <p className="mt-1 text-sm text-white">
              Select the models you want to validate. Only selected models will be trained.
            </p>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setSelectedModels(availableModels.map((model) => model.id))}
              className="
                rounded-lg
                border border-[#756BFF]/25
                bg-[#5148D8]/[0.08]
                px-3 py-1.5
                text-xs font-semibold
                text-[#A69CFF]
                transition
                hover:bg-[#5148D8]/[0.18]
              "
            >
              Select All
            </button>

            <button
              type="button"
              onClick={() => setSelectedModels([])}
              className="
                rounded-lg
                border border-white/[0.08]
                bg-white/[0.03]
                px-3 py-1.5
                text-xs font-semibold
                text-white
                transition
                hover:bg-white/[0.07]
              "
            >
              Clear All
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {availableModels.map((model) => {
              const checked = selectedModels.includes(model.id)

              return (
                <label
                  key={model.id}
                  className={`
                    flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition
                    ${
                      checked
                        ? 'border-[#756BFF]/40 bg-[#5148D8]/[0.12] text-white'
                        : 'border-white/[0.07] bg-white/[0.02] text-white hover:border-[#756BFF]/20 hover:bg-[#5148D8]/[0.05]'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      setSelectedModels((current) =>
                        current.includes(model.id)
                          ? current.filter((id) => id !== model.id)
                          : [...current, model.id]
                      )
                    }}
                  />

                  <span className="text-sm font-semibold">
                    {model.label}
                  </span>
                </label>
              )
            })}
          </div>
          <div className="mt-5 flex items-center justify-between gap-4">
            <p className="text-sm text-white">
              {selectedModels.length === 0
                ? 'Select at least one model to continue.'
                : `${selectedModels.length} model${selectedModels.length === 1 ? '' : 's'} selected.`}
            </p>

            <button
              type="button"
              onClick={loadValidation}
              disabled={selectedModels.length === 0 || validationState === 'loading'}
              className="
                rounded-xl
                bg-[#5B56E8]
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                shadow-lg
                transition
                hover:bg-[#6863F0]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {validationState === 'loading' ? 'Running Validation...' : 'Run Validation'}
            </button>
          </div>
                  </section>

                  {/* =====================================================
                      VALIDATION STATE
                  ===================================================== */}

                  <section className="mt-6">
                    {validationState === 'loading' && (
                      <LoadingState />
                    )}

                    {validationState === 'warning' && (
                      <WarningState />
                    )}

                    {validationState === 'error' && (
                      <ErrorState onRetry={loadValidation} message={error} />
                    )}
        </section>

        {/* =====================================================
            METRICS STRUCTURE
        ===================================================== */}

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-white">
              {problemType === 'classification'
                ? 'Classification metrics'
                : 'Regression metrics'}
            </h2>

            <p className="mt-1 text-sm text-white">
              Validation metric values will be displayed here when data is
              available.
            </p>
          </div>

          {validationState === 'empty' ? (
            <EmptyState
              title="No validation data available"
              description="Validation metrics will appear here after real validation results are returned."
            />
          ) : validationState === 'success' && validationData?.results?.length ? (
            <MetricStructure
              names={metricNames}
              result={validationData.results[0]}
            />
          ) : validationState === 'success' ? (
            <EmptyState
              title="No validation results returned"
              description="The validation API completed without model results."
            />
          ) : null}
        </section>

        {/* =====================================================
            MODEL RESULTS STRUCTURE
        ===================================================== */}

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-white">
              Model validation results
            </h2>

            <p className="mt-1 text-sm text-white">
              Model-level validation information will appear here when
              available.
            </p>
          </div>

          {validationState === 'empty' ? (
            <EmptyState
              title="No model validation results"
              description="Model validation results will appear here when the application receives real validation data."
            />
          ) : validationState === 'success' && validationData?.results?.length ? (
            <div
              className="
                overflow-hidden
                rounded-2xl
                border
                border-white/10
                bg-white/[0.04]
              "
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left">
                  <thead className="border-b border-white/10">
                    <tr>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-white">
                        Model
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-white">
                        Type
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-white">
                        Validation
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-white">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {validationData?.results?.map((result) => (
                      <tr key={result.model_name} className="border-b border-white/10">
                        <td className="px-5 py-4">{result.model_name}</td>
                        <td className="px-5 py-4">{validationData.problem_type}</td>
                        <td className="px-5 py-4">
                          {Object.entries(result.mean_metrics).map(([name, value]) => {
                            const stdValue = result.std_metrics?.[name]

                            return (
                              <div key={name}>
                                {name}: {Number(value).toFixed(4)} ±{' '}
                                {Number.isFinite(stdValue) ? stdValue.toFixed(4) : '—'}
                              </div>
                            )
                          })}
                        </td>
                        <td className="px-5 py-4">Complete</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : validationState === 'success' ? (
            <EmptyState
              title="No model validation results"
              description="The validation API completed without model results."
            />
          ) : null}
        </section>

      </div>
    </div>
  )
}

export default ValidationPage