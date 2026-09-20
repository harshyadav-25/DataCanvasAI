function ExperimentTable({ results = [], isDemo = false }) {
  if (!results.length) {
    return (
      <section className="rounded-2xl border border-dashed border-white/[0.1] bg-[#080D1B]/60 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#756BFF]/20 bg-[#5148D8]/10 text-[#A497FF]">
          ↔
        </div>

        <h2 className="mt-4 text-base font-semibold text-white">
          No experiment results yet
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#758198]">
          Select a treatment and run the experiment to compare the baseline
          with the treated preview.
        </p>
      </section>
    )
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080D1B]/70 shadow-xl backdrop-blur-xl">
      <div className="flex flex-col gap-3 border-b border-white/[0.07] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A69CFF]">
            RESULTS
          </span>

          <h2 className="mt-2 text-xl font-bold text-white">
            Baseline vs Treated
          </h2>
        </div>

        {isDemo && (
          <span className="w-fit rounded-full border border-[#F2B84B]/20 bg-[#F2B84B]/[0.06] px-3 py-1.5 text-[11px] font-semibold text-[#F2C46B]">
            Illustrative demo values
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] border-collapse">
          <thead>
            <tr className="border-b border-white/[0.07] bg-white/[0.02]">
              <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-[#68728A]">
                Metric
              </th>

              <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-[#68728A]">
                Baseline
              </th>

              <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-[#68728A]">
                Treated
              </th>

              <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-[#68728A]">
                Change
              </th>
            </tr>
          </thead>

          <tbody>
            {results.map((result) => (
              <tr
                key={result.metric}
                className="border-b border-white/[0.05] transition hover:bg-white/[0.02]"
              >
                <td className="px-5 py-4 text-sm font-semibold text-white">
                  {result.metric}
                </td>

                <td className="px-5 py-4 text-sm text-[#A7AFC3]">
                  {result.baseline}
                </td>

                <td className="px-5 py-4 text-sm font-semibold text-[#D9D6FF]">
                  {result.treated}
                </td>

                <td className="px-5 py-4">
                  <span className="inline-flex rounded-lg border border-[#756BFF]/20 bg-[#756BFF]/[0.06] px-2.5 py-1 text-xs font-semibold text-[#A69CFF]">
                    {result.change}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default ExperimentTable