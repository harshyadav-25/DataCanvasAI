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

export default function ReportPage() {
  const { datasetId, targetColumn } = useAnalysis()
  const [report, setReport] = useState(null)
  const [state, setState] = useState('loading')
  const [error, setError] = useState('')

  const loadReport = async () => {
    if (!datasetId || !targetColumn) {
      setState('empty')
      return
    }
    setState('loading')
    try {
      setReport(await generateReport(datasetId, targetColumn))
      setState('success')
    } catch (requestError) {
      setError(requestError.userMessage || 'Unable to load report.')
      setState('error')
    }
  }

  useEffect(() => { loadReport() }, [datasetId, targetColumn])

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
                {state === 'loading' ? 'Loading' : state === 'success' ? 'Complete' : 'Unavailable'}
              </p>
            </div>

          </div>
        </section>

        {/* =========================================
            REPORT EMPTY STATE
            ========================================= */}

        {state === 'loading' && <StateMessage type="loading" title="Loading report" />}
        {state === 'error' && <StateMessage type="error" title="Unable to load report" message={error} actionLabel="Retry" onAction={loadReport} />}
        {state === 'empty' && <StateMessage type="empty" title="No report data available" message="Select a target column before generating a report." />}
        {state === 'success' && report && (
          <section className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-[#343C53] bg-[#10162A]/80 p-5">
              <p className="text-sm text-[#A7AFC3]">Overall readiness</p>
              <p className="mt-2 text-4xl font-bold">{report.overall_readiness_score.toFixed(1)}</p>
            </div>
            <div className="rounded-2xl border border-[#343C53] bg-[#10162A]/80 p-5">
              <p className="text-sm text-[#A7AFC3]">Dataset</p>
              <p className="mt-2 break-all text-sm">{report.dataset_id}</p>
            </div>
            <div className="rounded-2xl border border-[#343C53] bg-[#10162A]/80 p-5 md:col-span-2">
              <h2 className="text-lg font-semibold">Key findings</h2>
              <div className="mt-4 space-y-3">
                {report.key_findings.map((finding) => (
                  <div key={finding.title} className="rounded-xl border border-white/10 p-4">
                    <p className="font-semibold">{finding.title}</p>
                    <p className="mt-1 text-sm text-[#A7AFC3]">{finding.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-[#343C53] bg-[#10162A]/80 p-5 md:col-span-2">
              <h2 className="text-lg font-semibold">Readiness dimensions</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(report.dimension_scores).map(([name, value]) => (
                  <div key={name} className="rounded-xl border border-white/10 p-3">
                    <p className="text-xs uppercase text-[#8F98AD]">{name.replaceAll('_', ' ')}</p>
                    <p className="mt-1 text-xl font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-[#343C53] bg-[#10162A]/80 p-5 md:col-span-2">
              <h2 className="text-lg font-semibold">Recommendations</h2>
              <div className="mt-4 space-y-3">
                {report.recommendations.length ? report.recommendations.map((recommendation) => (
                  <div key={recommendation.title} className="rounded-xl border border-white/10 p-4">
                    <p className="font-semibold">{recommendation.title}</p>
                    <p className="mt-1 text-sm text-[#A7AFC3]">{recommendation.explanation}</p>
                  </div>
                )) : <p className="text-sm text-[#A7AFC3]">No recommendations returned.</p>}
              </div>
            </div>
          </section>
        )}

        {/* =========================================
            REPORT STRUCTURE
            ========================================= */}

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">
              Report Structure
            </h2>

            <p className="mt-1 text-sm text-[#8F98AD]">
              Sections below reflect what is included in the report response.
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
                  {section.title === 'Validation' || section.title === 'Pipeline'
                    ? 'Not included in report response'
                    : 'Displayed above'}
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
                Validation and pipeline data are not included in the report
                endpoint response and are not represented here.
              </p>
            </div>

          </div>
        </section>

      </div>
    </div>
  )
}
import { useEffect, useState } from 'react'
import { generateReport } from '../services/api'
import { useAnalysis } from '../context/AnalysisContext'
import StateMessage from '../components/common/StateMessage'
