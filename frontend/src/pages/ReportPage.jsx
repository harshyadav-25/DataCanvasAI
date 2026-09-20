const reportSections = [
  {
    title: 'Overview',
    description:
      'High-level dataset and analysis summary returned by the backend.',
  },
  {
    title: 'Risk Analysis',
    description:
      'Risk findings and supporting evidence returned by the risk analysis service.',
  },
  {
    title: 'Recommendations',
    description:
      'Recommendations generated from the completed analysis.',
  },
  {
    title: 'Validation',
    description:
      'Validation results and model evaluation information.',
  },
  {
    title: 'Readiness',
    description:
      'Dataset readiness information and supporting dimensions.',
  },
  {
    title: 'Pipeline',
    description:
      'Pipeline execution details and generated code information.',
  },
]

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
          <path d="M7 3h8l4 4v14H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
          <path d="M15 3v5h4" />
          <path d="M8 12h8" />
          <path d="M8 16h8" />
        </svg>
      </div>

      <h2 className="mt-5 text-base font-semibold text-white">
        No report data available
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#A7AFC3]">
        A report will appear here when the real analysis results are
        available from the backend.
      </p>
    </div>
  )
}

export default function ReportPage() {
  return (
    <div className="relative min-h-screen overflow-hidden rounded-3xl bg-[#070B16] px-4 py-6 text-white sm:px-6 lg:px-8">

      {/* Background glow */}

      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#6D5DF6]/20 blur-3xl" />

      <div className="pointer-events-none absolute -right-24 top-24 h-96 w-96 rounded-full bg-[#3A7BFF]/10 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#8B5CF6]/10 blur-3xl" />

      <div className="relative z-10 space-y-6">

        {/* =========================================
            HEADER
            ========================================= */}

        <section>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <p className="text-sm font-semibold tracking-wide text-[#8F7CFF]">
                ANALYSIS REPORT
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Report
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#A7AFC3]">
                Review the complete analysis output when real backend
                results become available.
              </p>
            </div>

            <div className="w-fit rounded-2xl border border-[#6557D8]/30 bg-[#11172A]/80 px-4 py-3 backdrop-blur-xl">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8F7CFF]">
                Report status
              </p>

              <p className="mt-1 text-sm font-semibold text-[#A7AFC3]">
                Waiting for results
              </p>
            </div>

          </div>
        </section>

        {/* =========================================
            REPORT EMPTY STATE
            ========================================= */}

        <section>
          <EmptyState />
        </section>

        {/* =========================================
            REPORT STRUCTURE
            ========================================= */}

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">
              Report Structure
            </h2>

            <p className="mt-1 text-sm text-[#8F98AD]">
              These sections are ready for future real backend data.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {reportSections.map((section) => (
              <div
                key={section.title}
                className="rounded-2xl border border-[#343C53] bg-[#10162A]/80 p-5 backdrop-blur-xl"
              >
                <h3 className="text-base font-semibold text-white">
                  {section.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#A7AFC3]">
                  {section.description}
                </p>

                <div className="mt-4 inline-flex rounded-full border border-[#343C53] bg-[#12192B] px-3 py-1 text-[11px] font-semibold text-[#A7AFC3]">
                  Awaiting data
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================
            FUTURE DATA INTEGRATION
            ========================================= */}

        <section className="rounded-2xl border border-[#343C53] bg-[#10162A]/80 p-5 backdrop-blur-xl">
          <div className="flex items-start gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#7C6FFF]/30 bg-[#6D5DF6]/10 text-sm font-bold text-[#9A8EFF]">
              i
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white">
                Data integration
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#A7AFC3]">
                Real report content, generation status, and export
                information will be provided through the future backend
                report API.
              </p>
            </div>

          </div>
        </section>

      </div>
    </div>
  )
}