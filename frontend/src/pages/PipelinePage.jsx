import { useState } from 'react'

function LoadingState() {
  return (
    <div className="rounded-2xl border border-[#343C53] bg-[#10162A]/80 p-6 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-[#8F7CFF]" />

        <p className="text-sm text-white">
          Loading pipeline data...
        </p>
      </div>
    </div>
  )
}

function EmptyState({ type }) {
  const isCode = type === 'code'

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
          {isCode ? (
            <>
              <path d="M8 9l-3 3 3 3" />
              <path d="M16 9l3 3-3 3" />
              <path d="M14 5l-4 14" />
            </>
          ) : (
            <>
              <rect x="3" y="4" width="18" height="6" rx="1.5" />
              <rect x="3" y="14" width="18" height="6" rx="1.5" />
              <path d="M8 10v4" />
              <path d="M16 10v4" />
            </>
          )}
        </svg>
      </div>

      <h2 className="mt-5 text-base font-semibold text-white">
        {isCode
          ? 'No generated code available'
          : 'No pipeline data available'}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#A7AFC3]">
        {isCode
          ? 'Generated pipeline code will appear here when the backend provides it.'
          : 'Pipeline steps will appear here when the backend provides real pipeline data.'}
      </p>
    </div>
  )
}

function WarningState() {
  return (
    <div className="rounded-2xl border border-yellow-400/20 bg-[#11172A]/80 p-6 backdrop-blur-xl">
      <h3 className="font-semibold text-yellow-300">
        Pipeline warning
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#A7AFC3]">
        The pipeline service returned a warning. Review the available
        information before using the result.
      </p>
    </div>
  )
}

function ErrorState({ onRetry }) {
  return (
    <div className="rounded-2xl border border-red-400/20 bg-[#11172A]/80 p-6 backdrop-blur-xl">
      <h3 className="font-semibold text-red-300">
        Unable to load pipeline
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#A7AFC3]">
        Something went wrong while retrieving the pipeline information.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 rounded-lg bg-gradient-to-r from-[#5B4BE8] to-[#735DFF] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#5B4BE8]/20 transition hover:-translate-y-0.5"
      >
        Retry
      </button>
    </div>
  )
}

function PipelineSteps({ data }) {
  if (!data?.steps?.length) {
    return <EmptyState type="pipeline" />
  }

  return (
    <div className="space-y-4">
      {data.steps.map((step, index) => (
        <div
          key={step.id || index}
          className="rounded-2xl border border-[#343C53] bg-[#10162A]/80 p-5 backdrop-blur-xl"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8F7CFF]">
                Step {index + 1}
              </p>

              <h3 className="mt-1 text-base font-semibold text-white">
                {step.name || 'Unnamed step'}
              </h3>
            </div>

            <span className="w-fit rounded-full border border-[#343C53] bg-[#12192B] px-3 py-1 text-[11px] font-semibold text-[#A7AFC3]">
              {step.status || 'Not available'}
            </span>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[#252D42] bg-[#0A1020]/60 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#8F7CFF]">
                Operation
              </p>

              <p className="mt-2 text-sm text-[#A7AFC3]">
                {step.operation || 'Not available'}
              </p>
            </div>

            <div className="rounded-xl border border-[#252D42] bg-[#0A1020]/60 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#8F7CFF]">
                Description
              </p>

              <p className="mt-2 text-sm leading-6 text-[#A7AFC3]">
                {step.description || 'Not available'}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function CodePanel({ code }) {
  if (!code?.content) {
    return <EmptyState type="code" />
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#343C53] bg-[#0A1020]/80 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-[#343C53] px-4 py-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8F7CFF]">
            Generated code
          </p>

          <p className="mt-1 text-sm font-semibold text-white">
            {code.language || 'Code'}
          </p>
        </div>
      </div>

      <pre className="max-h-[600px] overflow-auto p-5 text-sm leading-6 text-[#A7AFC3]">
        <code>{code.content}</code>
      </pre>
    </div>
  )
}

export default function PipelinePage() {
  const [activeTab, setActiveTab] = useState('pipeline')

  // Real backend data will be connected later.
  // No dummy pipeline steps or generated code are used.
  const pipelineData = null

  // Future states:
  // loading | empty | warning | error | success
  const pageState = 'empty'

  const handleRetry = () => {
    console.log('Retry pipeline request')
  }

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
                ML WORKFLOW
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Pipeline / Code
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#A7AFC3]">
                Review the processing pipeline and generated code returned
                by the backend.
              </p>
            </div>

            <div className="w-fit rounded-2xl border border-[#6557D8]/30 bg-[#11172A]/80 px-4 py-3 backdrop-blur-xl">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8F7CFF]">
                Pipeline status
              </p>

              <p className="mt-1 text-sm font-semibold text-[#A7AFC3]">
                Waiting for results
              </p>
            </div>

          </div>
        </section>

        {/* =========================================
            TABS
            ========================================= */}

        <section className="rounded-2xl border border-[#343C53] bg-[#10162A]/80 p-2 backdrop-blur-xl">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('pipeline')}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                activeTab === 'pipeline'
                  ? 'bg-[#5148D8]/30 text-white shadow-[0_0_20px_rgba(81,72,216,0.12)]'
                  : 'text-[#A7AFC3] hover:bg-white/5 hover:text-white'
              }`}
            >
              Pipeline
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                activeTab === 'code'
                  ? 'bg-[#5148D8]/30 text-white shadow-[0_0_20px_rgba(81,72,216,0.12)]'
                  : 'text-[#A7AFC3] hover:bg-white/5 hover:text-white'
              }`}
            >
              Code
            </button>
          </div>
        </section>

        {/* =========================================
            STATUS STATES
            ========================================= */}

        {pageState === 'loading' && <LoadingState />}

        {pageState === 'warning' && <WarningState />}

        {pageState === 'error' && (
          <ErrorState onRetry={handleRetry} />
        )}

        {/* =========================================
            PIPELINE TAB
            ========================================= */}

        {activeTab === 'pipeline' &&
          pageState === 'empty' && (
            <section>
              <PipelineSteps data={pipelineData} />
            </section>
          )}

        {activeTab === 'pipeline' &&
          pageState === 'success' && (
            <section>
              <PipelineSteps data={pipelineData} />
            </section>
          )}

        {/* =========================================
            CODE TAB
            ========================================= */}

        {activeTab === 'code' &&
          pageState === 'empty' && (
            <section>
              <CodePanel code={pipelineData?.code} />
            </section>
          )}

        {activeTab === 'code' &&
          pageState === 'success' && (
            <section>
              <CodePanel code={pipelineData?.code} />
            </section>
          )}

        {/* =========================================
            DATA INTEGRATION
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
                Real pipeline steps and generated code will be displayed
                when the backend pipeline response is available.
              </p>
            </div>

          </div>
        </section>

      </div>
    </div>
  )
}