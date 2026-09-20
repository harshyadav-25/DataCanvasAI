import { useEffect, useState } from 'react'
import { analyzeProfiling } from '../services/api'
import { useAnalysis } from '../context/AnalysisContext'
import StateMessage from '../components/common/StateMessage'

function Profiling() {
  const { datasetId } = useAnalysis()
  const [profile, setProfile] = useState(null)
  const [state, setState] = useState('loading')
  const [error, setError] = useState('')

  const loadProfile = async () => {
    if (!datasetId) {
      setState('empty')
      return
    }
    setState('loading')
    try {
      setProfile(await analyzeProfiling(datasetId))
      setState('success')
    } catch (requestError) {
      setError(requestError.userMessage || 'Unable to load profiling data.')
      setState('error')
    }
  }

  useEffect(() => {
    loadProfile()
  }, [datasetId])

  return (
    <div className="min-h-screen bg-[#090E1D] px-6 py-8 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-purple-400">
            Dataset Analysis
          </p>
          <h1 className="text-3xl font-bold md:text-4xl">Dataset Profiling</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400 md:text-base">
            Explore the structure and quality of your uploaded dataset.
          </p>
        </div>

        {state === 'loading' && <StateMessage type="loading" title="Loading profile" />}
        {state === 'error' && (
          <StateMessage type="error" title="Unable to load profile" message={error} actionLabel="Retry" onAction={loadProfile} />
        )}
        {state === 'empty' && (
          <StateMessage type="empty" title="No dataset available" message="Upload a dataset before profiling." />
        )}
        {state === 'success' && profile && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[
                ['Rows', profile.rows],
                ['Columns', profile.columns],
                ['Duplicate rows', profile.duplicate_rows],
                ['Missing values', profile.total_missing_values],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-sm text-slate-400">{label}</p>
                  <p className="mt-2 text-2xl font-bold">{value}</p>
                </div>
              ))}
            </div>
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.04]">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-white/10 text-slate-400">
                  <tr>
                    <th className="px-5 py-4">Column</th>
                    <th className="px-5 py-4">Type</th>
                    <th className="px-5 py-4">Missing</th>
                    <th className="px-5 py-4">Unique</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.columns_profile.map((column) => (
                    <tr key={column.name} className="border-b border-white/5">
                      <td className="px-5 py-4">{column.name}</td>
                      <td className="px-5 py-4 text-slate-400">{column.dtype}</td>
                      <td className="px-5 py-4">
                        {column.missing_count} ({column.missing_percentage.toFixed(1)}%)
                      </td>
                      <td className="px-5 py-4">{column.unique_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profiling
