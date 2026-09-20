import { useEffect, useState } from 'react'
import { analyzeRisks, generateRecommendations } from '../services/api'
import { useAnalysis } from '../context/AnalysisContext'
import StateMessage from '../components/common/StateMessage'

function Recommendations() {
  const [selectedRecommendation, setSelectedRecommendation] = useState(null)
  const { datasetId, targetColumn } = useAnalysis()
  const [recommendations, setRecommendations] = useState([])
  const [state, setState] = useState('loading')
  const [error, setError] = useState('')

  const loadRecommendations = async () => {
    if (!datasetId) {
      setState('empty')
      return
    }
    setState('loading')
    try {
      const riskResponse = await analyzeRisks(datasetId, targetColumn || undefined)
      setRecommendations(await generateRecommendations(riskResponse.findings || []))
      setState('success')
    } catch (requestError) {
      setError(requestError.userMessage || 'Unable to load recommendations.')
      setState('error')
    }
  }

  useEffect(() => { loadRecommendations() }, [datasetId, targetColumn])

  return (
    <div className="relative min-h-screen overflow-hidden rounded-3xl bg-[#070B16] px-4 py-6 text-white sm:px-6 lg:px-8">

      {/* Background glow */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#6D5DF6]/20 blur-3xl" />

      <div className="pointer-events-none absolute -right-24 top-28 h-96 w-96 rounded-full bg-[#3A7BFF]/10 blur-3xl" />

      <div className="relative z-10 space-y-6">

        {state === 'loading' && <StateMessage type="loading" title="Loading recommendations" />}
        {state === 'error' && <StateMessage type="error" title="Unable to load recommendations" message={error} actionLabel="Retry" onAction={loadRecommendations} />}
        {state === 'empty' && <StateMessage type="empty" title="No dataset available" message="Upload a dataset before recommendations." />}

        {/* =====================================================
            HEADER
        ====================================================== */}
        <section>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <p className="text-sm font-semibold tracking-wide text-[#8F7CFF]">
                ACTION WORKSPACE
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Recommendations
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#A7AFC3]">
                Review recommended actions for improving dataset quality and
                machine learning readiness.
              </p>
            </div>

            <div className="w-fit rounded-2xl border border-[#6557D8]/30 bg-[#11172A]/80 px-4 py-3 backdrop-blur-xl">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8F7CFF]">
                Recommendation status
              </p>

              <p className="mt-1 text-sm font-semibold text-[#A7AFC3]">
                Waiting for results
              </p>
            </div>

          </div>
        </section>


        {/* =====================================================
            SUMMARY
        ====================================================== */}
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-3">

          <SummaryCard
            label="Recommendations"
            value="—"
            icon="R"
          />

          <SummaryCard
            label="High priority"
            value="—"
            icon="H"
          />

          <SummaryCard
            label="Action status"
            value="Pending"
            icon="!"
          />

        </section>


        {/* =====================================================
            INFORMATION
        ====================================================== */}
        <section className="rounded-2xl border border-[#343C53] bg-[#10162A]/80 p-5 backdrop-blur-xl">

          <div className="flex items-start gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#7C6FFF]/30 bg-[#6D5DF6]/10 text-sm font-bold text-[#9A8EFF]">
              i
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white">
                Recommendation engine
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#A7AFC3]">
                Recommendations will be displayed when the backend analysis
                service provides results for the selected dataset.
              </p>
            </div>

          </div>

        </section>


        {/* =====================================================
            RECOMMENDATIONS
        ====================================================== */}
        <section>

          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <h2 className="text-lg font-semibold text-white">
                Recommended actions
              </h2>

              <p className="mt-1 text-sm text-[#8F98AD]">
                Backend-provided recommendations will appear here.
              </p>
            </div>

            <span className="w-fit rounded-full border border-[#343C53] bg-[#12192B] px-3 py-1.5 text-xs font-medium text-[#A7AFC3]">
              Backend results required
            </span>

          </div>


          {/* Empty state */}
          {state === 'success' && recommendations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#343C53] bg-[#0F1526]/80 px-6 py-16 text-center backdrop-blur-xl">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#6557D8]/30 bg-[#6D5DF6]/10 text-xl font-bold text-[#9A8EFF]">
                +
              </div>

              <h3 className="mt-5 text-base font-semibold text-white">
                No recommendations available
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#7F899F]">
                Recommendations will appear here once the backend analysis
                service returns action-oriented results for the selected
                dataset.
              </p>

              <div className="mx-auto mt-5 w-fit rounded-lg border border-[#252D42] bg-[#11172A] px-4 py-2 text-xs text-[#68728A]">
                No frontend recommendation logic is performed.
              </div>

            </div>
          ) : state === 'success' ? (
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

              {recommendations.map((recommendation) => (
                <RecommendationCard
                  key={`${recommendation.risk_type}-${recommendation.title}`}
                  recommendation={recommendation}
                  onInvestigate={() =>
                    setSelectedRecommendation(recommendation)
                  }
                />
              ))}

            </div>
          ) : null}

        </section>


        {/* =====================================================
            SELECTED RECOMMENDATION
        ====================================================== */}
        {selectedRecommendation && (
          <div className="fixed bottom-5 right-5 z-50 w-[min(380px,calc(100vw-2rem))] rounded-2xl border border-[#6557D8]/40 bg-[#0D1324]/95 p-5 shadow-2xl backdrop-blur-xl">

            <div className="flex items-start justify-between gap-4">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#8F7CFF]">
                  Recommendation
                </p>

                <h3 className="mt-1 text-base font-bold text-white">
                  {selectedRecommendation.title}
                </h3>

                <p className="mt-2 text-sm text-[#A7AFC3]">
                  Related issue:{' '}
                  <span className="font-semibold text-white">
                    {selectedRecommendation.risk_type || 'Not available'}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRecommendation(null)}
                className="text-xl text-[#69738B] transition hover:text-white"
                aria-label="Close"
              >
                ×
              </button>

            </div>

            <p className="mt-4 text-xs leading-5 text-[#727C94]">
              {selectedRecommendation.explanation}
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

function SummaryCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-[#252D42] bg-[#11172A]/85 p-5 shadow-lg shadow-black/10 backdrop-blur-xl">

      <div className="flex items-start justify-between gap-3">

        <div>
          <p className="text-xs font-medium text-[#737D94]">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            {value}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#6557D8]/30 bg-[#6D5DF6]/10 text-sm font-bold text-[#9A8EFF]">
          {icon}
        </div>

      </div>

    </div>
  )
}


/* =========================================================
   RECOMMENDATION CARD
========================================================= */

function RecommendationCard({
  recommendation,
  onInvestigate,
}) {
  return (
    <article className="rounded-2xl border border-[#252D42] bg-[#0F1526]/90 p-5 shadow-xl backdrop-blur-xl">

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

        <div className="min-w-0">

          <span className="inline-flex rounded-full border border-[#6557D8]/30 bg-[#6D5DF6]/10 px-3 py-1 text-xs font-semibold text-[#A596FF]">
            {recommendation.priority || 'Priority unavailable'}
          </span>

          <h3 className="mt-3 text-lg font-bold text-white">
            {recommendation.title || 'Recommendation'}
          </h3>

        </div>

      </div>


      {/* Related issue */}
      <div className="mt-5 rounded-xl border border-[#252D42] bg-[#11172A] p-4">

        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#68728A]">
          Related issue / risk
        </p>

        <p className="mt-1 text-sm font-semibold text-[#D7DBE6]">
          {recommendation.risk_type || 'Not available'}
        </p>

      </div>


      {/* Evidence */}
      <div className="mt-4 rounded-xl border border-[#252D42] bg-[#0A1020]/60 p-4">

        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#68728A]">
          Explanation
        </p>

        <p className="mt-2 text-sm leading-6 text-[#A7AFC3]">
          {recommendation.explanation || 'Not available'}
        </p>

      </div>


      {/* Suggested action */}
      <div className="mt-4 rounded-xl border border-[#6557D8]/20 bg-[#6D5DF6]/5 p-4">

        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9183FF]">
          Suggested action
        </p>

        <p className="mt-2 text-sm leading-6 text-[#A7AFC3]">
          {recommendation.action || 'Not available'}
        </p>

      </div>


      {/* Context */}
      <div className="mt-4 rounded-xl border border-[#252D42] bg-[#0A1020]/60 p-4">

        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#68728A]">
          Action priority
        </p>

        <p className="mt-2 text-sm leading-6 text-[#A7AFC3]">
          {recommendation.priority || 'Not available'}
        </p>

      </div>


      {/* Action */}
      <div className="mt-5">

        <button
          type="button"
          onClick={onInvestigate}
          className="rounded-lg border border-[#6557D8]/40 bg-[#6D5DF6]/10 px-4 py-2.5 text-sm font-semibold text-[#B1A9FF] transition hover:bg-[#6D5DF6]/20"
        >
          View details
        </button>

      </div>

    </article>
  )
}

export default Recommendations