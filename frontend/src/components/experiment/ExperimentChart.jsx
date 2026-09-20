function ExperimentChart({ data = [], isDemo = false }) {
  if (!data.length) {
    return (
      <section className="rounded-2xl border border-dashed border-white/[0.1] bg-[#080D1B]/60 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#756BFF]/20 bg-[#5148D8]/10 text-[#A497FF]">
          ↔
        </div>

        <h2 className="mt-4 text-base font-semibold text-white">
          No comparison available
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#758198]">
          Comparison results will appear after an experiment is run.
        </p>
      </section>
    )
  }

  const getNumber = (value) => {
    const parsed = Number(
      String(value).replace(/[^0-9.-]/g, '')
    )

    return Number.isFinite(parsed) ? Math.abs(parsed) : 0
  }

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#080D1B]/70 p-5 shadow-xl backdrop-blur-xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A69CFF]">
            COMPARISON
          </span>

          <h2 className="mt-2 text-xl font-bold text-white">
            Treatment Impact Preview
          </h2>
        </div>

        {isDemo && (
          <span className="w-fit rounded-full border border-[#F2B84B]/20 bg-[#F2B84B]/[0.06] px-3 py-1.5 text-[11px] font-semibold text-[#F2C46B]">
            Demo
          </span>
        )}
      </div>

      <div className="mt-6 space-y-5">
        {data.map((item) => {
          const baselineValue = getNumber(item.baseline)
          const treatedValue = getNumber(item.treated)
          const maxValue = Math.max(
            baselineValue,
            treatedValue,
            1
          )

          const baselineWidth = Math.min(
            100,
            (baselineValue / maxValue) * 100
          )

          const treatedWidth = Math.min(
            100,
            (treatedValue / maxValue) * 100
          )

          return (
            <div
              key={item.metric}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-sm font-semibold text-white">
                  {item.metric}
                </h3>

                <span className="text-xs text-[#748098]">
                  Baseline vs Treated
                </span>
              </div>

              <div className="mt-4 space-y-3">

                {/* Baseline */}
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                    <span className="text-[#818CA4]">
                      Baseline
                    </span>

                    <strong className="text-[#D7DCEF]">
                      {item.baseline}
                    </strong>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-[#535B73] transition-all duration-500"
                      style={{ width: `${baselineWidth}%` }}
                    />
                  </div>
                </div>

                {/* Treated */}
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                    <span className="text-[#A69CFF]">
                      Treated
                    </span>

                    <strong className="text-white">
                      {item.treated}
                    </strong>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#5148D8] to-[#58D7FF] transition-all duration-500"
                      style={{ width: `${treatedWidth}%` }}
                    />
                  </div>
                </div>

              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default ExperimentChart
