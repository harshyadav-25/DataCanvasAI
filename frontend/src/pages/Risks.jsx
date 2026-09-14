import { useState } from 'react'

function Risks() {
  const [selectedRisk, setSelectedRisk] = useState(null)

  /*
   * Backend integration is intentionally not added yet.
   * Risk values will eventually come from the backend/API.
   */
  const risks = []

  const summary = {
    high: 0,
    medium: 0,
    low: 0,
    total: 0,
  }

  const handleInvestigate = (risk) => {
    setSelectedRisk(risk)
  }

  return (
    <div className="relative min-h-screen overflow-hidden rounded-3xl bg-[#070B16] px-4 py-6 text-white sm:px-6 lg:px-8">

      {/* Background glow */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#6D5DF6]/20 blur-3xl" />

      <div className="pointer-events-none absolute -right-24 top-24 h-96 w-96 rounded-full bg-[#3A7BFF]/10 blur-3xl" />

      <div className="relative z-10 space-y-6">

        {/* =====================================================
            HEADER
        ====================================================== */}
        <section>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <p className="text-sm font-semibold tracking-wide text-[#8F7CFF]">
                MODEL ANALYSIS
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                ML Risk Auditor
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#A7AFC3]">
                Review risks identified in your dataset before moving further
                into the machine learning workflow.
              </p>
            </div>

            <div className="w-fit rounded-2xl border border-[#6557D8]/30 bg-[#11172A]/80 px-4 py-3 backdrop-blur-xl">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8F7CFF]">
                Analysis status
              </p>

              <p className="mt-1 text-sm font-semibold text-[#A7AFC3]">
                Waiting for results
              </p>
            </div>

          </div>
        </section>


        {/* =====================================================
            RISK SUMMARY
        ====================================================== */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">
              Risk summary
            </h2>

            <p className="mt-1 text-sm text-[#8F98AD]">
              Severity counts will be shown when risk analysis is available.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

            <SummaryCard
              label="Total risks"
              value={summary.total}
              icon="!"
            />

            <SummaryCard
              label="High"
              value={summary.high}
              icon="H"
            />

            <SummaryCard
              label="Medium"
              value={summary.medium}
              icon="M"
            />

            <SummaryCard
              label="Low"
              value={summary.low}
              icon="L"
            />

          </div>
        </section>


        {/* =====================================================
            RISK MATRIX
        ====================================================== */}
        <section>

          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <h2 className="text-lg font-semibold text-white">
                Risk analysis
              </h2>

              <p className="mt-1 text-sm text-[#8F98AD]">
                Backend-provided risk findings will appear here.
              </p>
            </div>

            <span className="w-fit rounded-full border border-[#343C53] bg-[#12192B] px-3 py-1.5 text-xs font-medium text-[#A7AFC3]">
              Backend results required
            </span>

          </div>


          {/* Empty state */}
          {risks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#343C53] bg-[#0F1526]/80 px-6 py-16 text-center backdrop-blur-xl">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#6557D8]/30 bg-[#6D5DF6]/10 text-xl font-bold text-[#9A8EFF]">
                !
              </div>

              <h3 className="mt-5 text-base font-semibold text-white">
                No risk analysis available
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#7F899F]">
                Risk findings will be displayed here once the analysis service
                provides results for the selected dataset.
              </p>

              <div className="mx-auto mt-5 w-fit rounded-lg border border-[#252D42] bg-[#11172A] px-4 py-2 text-xs text-[#68728A]">
                No frontend risk calculation is performed.
              </div>

            </div>
          ) : (
            <div className="space-y-4">

              {risks.map((risk) => (
                <RiskCard
                  key={risk.id}
                  risk={risk}
                  onInvestigate={() => handleInvestigate(risk)}
                />
              ))}

            </div>
          )}

        </section>


        {/* =====================================================
            SELECTED RISK
        ====================================================== */}
        {selectedRisk && (
          <div className="fixed bottom-5 right-5 z-50 w-[min(380px,calc(100vw-2rem))] rounded-2xl border border-[#6557D8]/40 bg-[#0D1324]/95 p-5 shadow-2xl backdrop-blur-xl">

            <div className="flex items-start justify-between gap-4">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#8F7CFF]">
                  Investigation
                </p>

                <h3 className="mt-1 text-base font-bold text-white">
                  {selectedRisk.category}
                </h3>

                <p className="mt-1 text-sm text-[#A7AFC3]">
                  Affected:{' '}
                  <span className="font-semibold text-white">
                    {selectedRisk.affectedColumn || 'Not available'}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRisk(null)}
                className="text-xl text-[#69738B] transition hover:text-white"
                aria-label="Close"
              >
                ×
              </button>

            </div>

            <p className="mt-4 text-xs leading-5 text-[#727C94]">
              This is currently a frontend interaction. Detailed risk
              information will come from the backend response.
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
   RISK CARD
========================================================= */

function RiskCard({ risk, onInvestigate }) {
  const severityStyles = {
    High: 'border-[#FF6B6B]/30 bg-[#FF5C5C]/10 text-[#FF8585]',
    Medium: 'border-[#F6C453]/30 bg-[#F6C453]/10 text-[#F6D477]',
    Low: 'border-[#55D68A]/30 bg-[#55D68A]/10 text-[#73E5A2]',
  }

  const severityStyle =
    severityStyles[risk.severity] ||
    'border-[#343C53] bg-[#12192B] text-[#A7AFC3]'

  return (
    <article className="rounded-2xl border border-[#252D42] bg-[#0F1526]/90 p-5 shadow-xl backdrop-blur-xl">

      {/* Top */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

        <div className="min-w-0">

          <div className="flex flex-wrap items-center gap-2">

            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${severityStyle}`}
            >
              {risk.severity || 'Not available'}
            </span>

            <span className="rounded-md border border-[#30384E] bg-[#11172A] px-2 py-1 text-[11px] font-medium text-[#9DA6B9]">
              {risk.category || 'Category unavailable'}
            </span>

          </div>

          <h3 className="mt-3 text-lg font-bold text-white">
            {risk.title || 'Risk finding'}
          </h3>

        </div>

      </div>


      {/* Affected column */}
      <div className="mt-5 rounded-xl border border-[#252D42] bg-[#11172A] p-4">

        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#68728A]">
          Affected column / target
        </p>

        <p className="mt-1 text-sm font-semibold text-[#D7DBE6]">
          {risk.affectedColumn || 'Not available'}
        </p>

      </div>


      {/* Evidence */}
      <div className="mt-4 rounded-xl border border-[#252D42] bg-[#0A1020]/60 p-4">

        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#68728A]">
          Evidence
        </p>

        <p className="mt-2 text-sm leading-6 text-[#A7AFC3]">
          {risk.evidence || 'Not available'}
        </p>

      </div>


      {/* Why it matters */}
      <div className="mt-4 rounded-xl border border-[#252D42] bg-[#0A1020]/60 p-4">

        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#68728A]">
          Why it matters
        </p>

        <p className="mt-2 text-sm leading-6 text-[#A7AFC3]">
          {risk.whyItMatters || 'Not available'}
        </p>

      </div>


      {/* Recommended action */}
      <div className="mt-4 rounded-xl border border-[#6557D8]/20 bg-[#6D5DF6]/5 p-4">

        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9183FF]">
          Recommended action
        </p>

        <p className="mt-2 text-sm leading-6 text-[#A7AFC3]">
          {risk.recommendedAction || 'Not available'}
        </p>

      </div>


      {/* Action */}
      <div className="mt-5">

        <button
          type="button"
          onClick={onInvestigate}
          className="rounded-lg border border-[#6557D8]/40 bg-[#6D5DF6]/10 px-4 py-2.5 text-sm font-semibold text-[#B1A9FF] transition hover:bg-[#6D5DF6]/20"
        >
          Investigate
        </button>

      </div>

    </article>
  )
}

export default Risks