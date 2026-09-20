import { useState } from 'react'

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

function MetricStructure({ names }) {
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
            <div className="h-10 w-24 rounded-lg bg-white/[0.05]" />
          </div>

          <p className="mt-4 text-xs leading-5 text-white">
            Value will appear when validation data is available.
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

function ErrorState({ onRetry }) {
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
            Please retry when validation data is available.
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
  const [problemType, setProblemType] = useState('classification')

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

  const validationState = 'empty'

  const metricNames =
    problemType === 'classification'
      ? classificationMetricNames
      : regressionMetricNames

  const handleRetry = () => {
    // Future API retry logic will be added here.
  }

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
                onClick={() => setProblemType('classification')}
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
                onClick={() => setProblemType('regression')}
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
            <ErrorState onRetry={handleRetry} />
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
          ) : (
            <MetricStructure names={metricNames} />
          )}
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
          ) : (
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

                  <tbody />
                </table>
              </div>
            </div>
          )}
        </section>

      </div>
    </div>
  )
}

export default ValidationPage