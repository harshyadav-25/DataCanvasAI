const readinessDimensions = [
  {
    key: 'dataQuality',
    title: 'Data Quality',
    description:
      'Overall quality of the dataset based on backend analysis.',
  },
  {
    key: 'featureQuality',
    title: 'Feature Quality',
    description:
      'Quality and suitability of the dataset features.',
  },
  {
    key: 'targetQuality',
    title: 'Target Quality',
    description:
      'Target-related checks returned by the analysis service.',
  },
  {
    key: 'leakageRisk',
    title: 'Leakage Risk',
    description:
      'Potential data leakage information returned by the backend.',
  },
  {
    key: 'distributionBalance',
    title: 'Distribution & Balance',
    description:
      'Distribution and class-balance information.',
  },
  {
    key: 'modelCompatibility',
    title: 'Model Compatibility',
    description:
      'Compatibility information for future machine learning use.',
  },
]

function LoadingState() {
  return (
    <div className="rounded-2xl border border-[#343C53] bg-[#10162A]/80 p-6 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-[#8F7CFF]" />

        <p className="text-sm text-white">
          Loading readiness data...
        </p>
      </div>
    </div>
  )
}

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
          <path d="M12 3l7 4v5c0 4.5-2.8 7.5-7 9-4.2-1.5-7-4.5-7-9V7l7-4z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      </div>

      <h2 className="mt-5 text-base font-semibold text-white">
        No readiness data available
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#A7AFC3]">
        Readiness information will appear here when the real analysis
        results are returned by the backend.
      </p>
    </div>
  )
}

function WarningState() {
  return (
    <div className="rounded-2xl border border-yellow-400/20 bg-[#11172A]/80 p-6 backdrop-blur-xl">
      <h3 className="font-semibold text-yellow-300">
        Readiness warning
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#A7AFC3]">
        The readiness service returned a warning. Review the available
        information before using it.
      </p>
    </div>
  )
}

function ErrorState({ onRetry, message }) {
  return (
    <div className="rounded-2xl border border-red-400/20 bg-[#11172A]/80 p-6 backdrop-blur-xl">
      <h3 className="font-semibold text-red-300">
        Unable to load readiness data
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#A7AFC3]">
        {message || 'Something went wrong while retrieving the readiness information.'}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 rounded-lg bg-linear-to-r from-[#5B4BE8] to-[#735DFF] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#5B4BE8]/20 transition hover:-translate-y-0.5"
      >
        Retry
      </button>
    </div>
  )
}

function DimensionCard({ dimension, data }) {
  const dimensionData = data?.dimensions?.[dimension.key]

  return (
    <div className="rounded-2xl border border-[#343C53] bg-[#10162A]/80 p-5 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white">
            {dimension.title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#A7AFC3]">
            {dimension.description}
          </p>
        </div>

        <span className="shrink-0 rounded-full border border-[#343C53] bg-[#12192B] px-3 py-1 text-[11px] font-semibold text-[#A7AFC3]">
          {dimensionData?.status ||
            (typeof dimensionData?.value === 'number'
              ? 'Available'
              : 'Not available')}
        </span>
      </div>

      <div className="mt-5 rounded-xl border border-[#252D42] bg-[#0A1020]/60 p-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-[#8F7CFF]">
          Readiness value
        </p>

        <p className="mt-2 text-2xl font-bold text-white">
          {dimensionData?.value ?? '—'}
        </p>
      </div>
    </div>
  )
}

export default function ReadinessPage() {
  const { datasetId, targetColumn } = useAnalysis()
  const [readinessData, setReadinessData] = useState(null)
  const [pageState, setPageState] = useState('loading')
  const [error, setError] = useState('')

  const loadReadiness = async () => {
    if (!datasetId || !targetColumn) {
      setPageState('empty')
      return
    }
    setPageState('loading')
    try {
      const response = await analyzeReadiness(datasetId, targetColumn)
      setReadinessData({
        ...response,
        score: response.overall_score,
        dimensions: {
          dataQuality: { value: response.dimensions.data_quality },
          featureQuality: { value: response.dimensions.feature_quality },
          targetQuality: { value: response.dimensions.target_quality },
          leakageRisk: { value: response.dimensions.leakage_risk },
          distributionBalance: { value: response.dimensions.distribution_balance },
          modelCompatibility: { value: response.dimensions.model_compatibility },
        },
      })
      setPageState('success')
    } catch (requestError) {
      setError(requestError.userMessage || 'Unable to load readiness data.')
      setPageState('error')
    }
  }

  useEffect(() => { loadReadiness() }, [datasetId, targetColumn])

  return (
    <div className="relative min-h-screen overflow-hidden rounded-3xl bg-[#070B16] px-4 py-6 text-white sm:px-6 lg:px-8">

      {/* Background glow */}

      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#6D5DF6]/20 blur-3xl" />

      <div className="pointer-events-none absolute -right-24 top-24 h-96 w-96 rounded-full bg-[#3A7BFF]/10 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#8B5CF6]/10 blur-3xl" />

      <div className="relative z-10 space-y-6">

        {/* Header */}

        <section>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <p className="text-sm font-semibold tracking-wide text-[#8F7CFF]">
                MODEL READINESS
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                ML Readiness
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#A7AFC3]">
                Review how prepared the dataset is for machine learning
                based on the analysis provided by the backend.
              </p>
            </div>

            <div className="w-fit rounded-2xl border border-[#6557D8]/30 bg-[#11172A]/80 px-4 py-3 backdrop-blur-xl">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8F7CFF]">
                Analysis status
              </p>

              <p className="mt-1 text-sm font-semibold text-[#A7AFC3]">
                {pageState === 'loading' ? 'Loading' : pageState === 'success' ? 'Complete' : 'Unavailable'}
              </p>
            </div>

          </div>
        </section>

        {/* Overall Readiness */}

        <section className="rounded-2xl border border-[#343C53] bg-[#10162A]/80 p-6 backdrop-blur-xl">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8F7CFF]">
                Overall score
              </p>

              <h2 className="mt-2 text-xl font-semibold text-white">
                ML Readiness Score
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#A7AFC3]">
                This score is returned by the backend readiness analysis.
              </p>
            </div>

            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border border-[#6557D8]/30 bg-[#0A1020]/80 shadow-[0_0_30px_rgba(81,72,216,0.15)]">
              <span className="text-3xl font-bold text-white">
                {readinessData?.score ?? '—'}
              </span>
            </div>

          </div>

        </section>

        {/* State */}

        {pageState === 'loading' && <LoadingState />}

        {pageState === 'warning' && <WarningState />}

        {pageState === 'error' && (
          <ErrorState onRetry={loadReadiness} message={error} />
        )}

        {pageState === 'empty' && <EmptyState />}

        {/* Dimensions */}

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">
              Readiness Dimensions
            </h2>

            <p className="mt-1 text-sm text-[#8F98AD]">
              Backend-provided dimension scores.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {readinessDimensions.map((dimension) => (
              <DimensionCard
                key={dimension.key}
                dimension={dimension}
                data={readinessData}
              />
            ))}
          </div>
        </section>

        {/* Analysis Details */}

        <section className="rounded-2xl border border-[#343C53] bg-[#10162A]/80 p-5 backdrop-blur-xl">

          <h2 className="text-lg font-semibold text-white">
            Analysis Details
          </h2>

          <p className="mt-1 text-sm leading-6 text-[#A7AFC3]">
            The backend provides six readiness dimensions for this dataset.
          </p>

          <div className="mt-4 rounded-xl border border-dashed border-[#343C53] bg-[#0F1526]/70 p-5">
            <p className="text-sm text-[#A7AFC3]">
              {readinessData
                ? 'All available readiness dimensions are shown above.'
                : 'Readiness analysis is not available yet.'}
            </p>
          </div>

        </section>

        {/* Data Integration */}

        <section className="rounded-2xl border border-[#343C53] bg-[#10162A]/80 p-5 backdrop-blur-xl">

          <h2 className="text-base font-semibold text-white">
            Data Integration
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#A7AFC3]">
            Values shown on this page come directly from the readiness API;
            the frontend does not calculate or estimate them.
          </p>

        </section>

      </div>
    </div>
  )
}
import { useEffect, useState } from 'react'
import { analyzeReadiness } from '../services/api'
import { useAnalysis } from '../context/AnalysisContext'