function ExperimentSelector({
  options = [],
  selectedTreatment = '',
  onTreatmentChange,
  onRun,
  isRunning = false,
}) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#0A1020]/70 p-5 shadow-xl backdrop-blur-xl">
      <div className="flex flex-col gap-5">

        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A69CFF]">
            STEP 01
          </span>

          <h2 className="mt-2 text-xl font-bold text-white">
            Select a Treatment
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#8D98B0]">
            Choose a preprocessing treatment to preview how the dataset could
            change compared with the current baseline.
          </p>
        </div>

        <div className="rounded-xl border border-[#F2B84B]/20 bg-[#F2B84B]/[0.06] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#F2C46B]">
            Demo mode
          </p>

          <p className="mt-1 text-xs leading-5 text-[#D2D7E3]/70">
            The preview results are illustrative frontend demo values and are
            not real model or dataset measurements.
          </p>
        </div>

        <div>
          <label
            htmlFor="treatment"
            className="block text-sm font-medium text-[#D7DCEF]"
          >
            Treatment
          </label>

          <select
            id="treatment"
            value={selectedTreatment}
            onChange={(event) =>
              onTreatmentChange?.(event.target.value)
            }
            disabled={isRunning}
            className="
              mt-2
              h-11
              w-full
              rounded-xl
              border
              border-white/[0.1]
              bg-[#11172A]
              px-4
              text-sm
              text-white
              outline-none
              transition
              focus:border-[#756BFF]/60
              focus:ring-2
              focus:ring-[#756BFF]/10
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <option value="">Select treatment</option>

            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#68728A]">
            Select a treatment before running the experiment.
          </p>

          <button
            type="button"
            onClick={onRun}
            disabled={!selectedTreatment || isRunning}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-gradient-to-r
              from-[#5148D8]
              to-[#756BFF]
              px-6
              py-3
              text-sm
              font-semibold
              text-white
              shadow-[0_0_30px_rgba(81,72,216,0.22)]
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:shadow-[0_0_42px_rgba(81,72,216,0.38)]
              disabled:cursor-not-allowed
              disabled:opacity-50
              disabled:hover:translate-y-0
            "
          >
            {isRunning ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Running...
              </>
            ) : (
              <>
                <span className="text-base">▶</span>
                Run Experiment
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  )
}

export default ExperimentSelector