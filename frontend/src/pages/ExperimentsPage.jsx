import { useEffect, useState } from 'react'

import ExperimentSelector from '../components/experiment/ExperimentSelector'
import ExperimentTable from '../components/experiment/ExperimentTable'
import ExperimentChart from '../components/experiment/ExperimentChart'

const TREATMENT_OPTIONS = [
  {
    value: 'impute-missing',
    label: 'Impute missing values',
  },
  {
    value: 'remove-duplicates',
    label: 'Remove duplicate rows',
  },
  {
    value: 'scale-numeric',
    label: 'Scale numeric features',
  },
  {
    value: 'encode-categorical',
    label: 'Encode categorical features',
  },
]

const DEMO_RESULTS = {
  'impute-missing': {
    results: [
      {
        metric: 'Missing-value coverage',
        baseline: '12.4%',
        treated: '2.1%',
        change: '-10.3 pp',
      },
      {
        metric: 'Rows retained',
        baseline: '100%',
        treated: '100%',
        change: '0 pp',
      },
      {
        metric: 'Feature coverage',
        baseline: '87.6%',
        treated: '97.9%',
        change: '+10.3 pp',
      },
    ],
  },

  'remove-duplicates': {
    results: [
      {
        metric: 'Duplicate-row share',
        baseline: '4.8%',
        treated: '0.0%',
        change: '-4.8 pp',
      },
      {
        metric: 'Rows retained',
        baseline: '100%',
        treated: '95.2%',
        change: '-4.8 pp',
      },
      {
        metric: 'Unique-row coverage',
        baseline: '95.2%',
        treated: '100%',
        change: '+4.8 pp',
      },
    ],
  },

  'scale-numeric': {
    results: [
      {
        metric: 'Numeric feature coverage',
        baseline: '100%',
        treated: '100%',
        change: '0 pp',
      },
      {
        metric: 'Scale alignment',
        baseline: 'Mixed',
        treated: 'Aligned',
        change: 'Updated',
      },
      {
        metric: 'Rows retained',
        baseline: '100%',
        treated: '100%',
        change: '0 pp',
      },
    ],
  },

  'encode-categorical': {
    results: [
      {
        metric: 'Categorical feature coverage',
        baseline: '100%',
        treated: '100%',
        change: '0 pp',
      },
      {
        metric: 'Encoding readiness',
        baseline: 'Pending',
        treated: 'Prepared',
        change: 'Updated',
      },
      {
        metric: 'Rows retained',
        baseline: '100%',
        treated: '100%',
        change: '0 pp',
      },
    ],
  },
}

const HISTORY_KEY = 'datacanvas_experiment_history'

function ExperimentsPage() {
  const [selectedTreatment, setSelectedTreatment] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState([])
  const [comparisonData, setComparisonData] = useState([])
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

  const getTreatmentLabel = (value) => {
    return (
      TREATMENT_OPTIONS.find(
        (option) => option.value === value
      )?.label || value
    )
  }

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

  const handleRun = () => {
    if (!selectedTreatment || isRunning) {
      return
    }

    setIsRunning(true)
    setError('')
    setResults([])
    setComparisonData([])

    window.setTimeout(() => {
      try {
        const selectedResult = DEMO_RESULTS[selectedTreatment]

        if (!selectedResult) {
          throw new Error(
            'No preview result is available for this treatment.'
          )
        }

        const nextResults = selectedResult.results

        setResults(nextResults)
        setComparisonData(nextResults)

        const newHistoryItem = {
          id: `${Date.now()}-${selectedTreatment}`,
          treatment: selectedTreatment,
          treatmentLabel: getTreatmentLabel(selectedTreatment),
          status: 'Completed',
          createdAt: new Date().toLocaleString(),
          source: 'Demo',
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

        setError(
          'The experiment preview could not be generated. Please try again.'
        )
      } finally {
        setIsRunning(false)
      }
    }, 900)
  }

  const handleRetry = () => {
    if (!selectedTreatment || isRunning) {
      return
    }

    handleRun()
  }

  const handleClearHistory = () => {
    saveHistory([])
  }

  const selectedTreatmentLabel =
    getTreatmentLabel(selectedTreatment)

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
                  What-If{' '}
                  <span className="bg-gradient-to-r from-[#A794FF] via-[#8D89FF] to-[#58D7FF] bg-clip-text text-transparent">
                    Simulator
                  </span>
                </h1>

                <p className="mt-2 max-w-3xl text-sm leading-7 text-[#8D98B0] md:text-base">
                  Test preprocessing treatments and compare their preview
                  results against the current baseline.
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
                  The baseline is the reference state used for this experiment
                  preview.
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
                    Treatment
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white">
                    None
                  </p>
                </div>

                <div className="col-span-2 rounded-xl border border-[#F2B84B]/20 bg-[#F2B84B]/[0.05] px-4 py-3 sm:col-span-1">
                  <p className="text-[10px] uppercase tracking-wide text-[#F2C46B]">
                    Result source
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#F2C46B]">
                    Demo preview
                  </p>
                </div>

              </div>

            </div>
          </div>
        </section>


        {/* =====================================================
            TREATMENT
        ====================================================== */}

        <section className="mx-auto max-w-6xl">
          <ExperimentSelector
            options={TREATMENT_OPTIONS}
            selectedTreatment={selectedTreatment}
            onTreatmentChange={(value) => {
              setSelectedTreatment(value)
              setError('')
            }}
            onRun={handleRun}
            isRunning={isRunning}
          />
        </section>


        {/* =====================================================
            ACTIVE TREATMENT
        ====================================================== */}

        {selectedTreatment && (
          <section className="mx-auto max-w-6xl">
            <div className="rounded-2xl border border-[#756BFF]/15 bg-gradient-to-r from-[#5148D8]/[0.10] via-[#090E1D]/80 to-[#2563EB]/[0.08] p-5">

              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A69CFF]">
                ACTIVE TREATMENT
              </p>

              <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                <h2 className="text-lg font-bold text-white">
                  {selectedTreatmentLabel}
                </h2>

                <span className="w-fit rounded-full border border-[#756BFF]/20 bg-[#756BFF]/[0.06] px-3 py-1.5 text-[11px] font-semibold text-[#B8B1FF]">
                  {isRunning ? 'Running...' : 'Ready to run'}
                </span>

              </div>
            </div>
          </section>
        )}


        {/* =====================================================
            ERROR
        ====================================================== */}

        {error && (
          <section className="mx-auto max-w-6xl">
            <div className="rounded-2xl border border-red-400/20 bg-red-500/[0.06] p-5">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-sm font-semibold text-red-200">
                    Experiment preview failed
                  </p>

                  <p className="mt-1 text-sm leading-6 text-red-200/70">
                    {error}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRetry}
                  disabled={isRunning || !selectedTreatment}
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
                Review the selected treatment against the baseline.
              </p>
            </div>

            {results.length > 0 && (
              <span className="w-fit rounded-full border border-[#22C55E]/20 bg-[#22C55E]/[0.06] px-3 py-1.5 text-[11px] font-semibold text-[#5BE58A]">
                Completed
              </span>
            )}

          </div>

          <ExperimentTable
            results={results}
            isDemo
          />

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
              Compare the baseline and treated preview values.
            </p>
          </div>

          <ExperimentChart
            data={comparisonData}
            isDemo
          />

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
                Recent demo experiment runs saved on this device.
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
                Run a treatment preview and it will appear here.
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
              Demo note: the values displayed here are illustrative frontend
              demo data. They are not calculated from the uploaded dataset or
              presented as real ML results.
            </p>
          </div>
        </section>

      </div>
    </div>
  )
}

export default ExperimentsPage