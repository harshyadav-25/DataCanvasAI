import { useEffect, useMemo, useState } from 'react'
import { useAnalysis } from '../context/AnalysisContext'
import { analyzeVisualization } from '../services/api'

function EmptyState({ title, message }) {
  return (
    <section className="rounded-2xl border border-dashed border-white/10 bg-[#0A1020]/70 p-10 text-center">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#9AA5BA]">
        {message}
      </p>
    </section>
  )
}

const chartColors = ['#756BFF', '#42C8F5', '#41D69A', '#F2B84B', '#F27A9B', '#A78BFA']

function BarChart({ chart }) {
  const maxValue = Math.max(...chart.values, 1)
  const chartWidth = 640
  const chartHeight = 250
  const left = 46
  const right = 14
  const top = 18
  const bottom = 48
  const innerWidth = chartWidth - left - right
  const innerHeight = chartHeight - top - bottom
  const slotWidth = chart.values.length ? innerWidth / chart.values.length : innerWidth
  const barWidth = Math.min(44, slotWidth * 0.68)

  return (
    <div>
      {chart.values.length ? (
        <div className="overflow-x-auto">
          <svg
            className="min-w-[520px] w-full"
            role="img"
            aria-label={`${chart.title}; horizontal axis ${chart.x_axis_label}; vertical axis ${chart.y_axis_label}`}
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          >
            <line
              x1={left}
              y1={top + innerHeight}
              x2={chartWidth - right}
              y2={top + innerHeight}
              stroke="#59627A"
            />
            <line
              x1={left}
              y1={top}
              x2={left}
              y2={top + innerHeight}
              stroke="#59627A"
            />
            {chart.values.map((value, index) => {
              const height = (value / maxValue) * innerHeight
              const x = left + slotWidth * index + (slotWidth - barWidth) / 2
              const y = top + innerHeight - height

              return (
                <g key={`${chart.column}-${chart.labels[index]}`}>
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={height}
                    rx="4"
                    fill={chartColors[index % chartColors.length]}
                  >
                    <title>{`${chart.labels[index]}: ${value}`}</title>
                  </rect>
                  <text
                    x={x + barWidth / 2}
                    y={top + innerHeight + 18}
                    fill="#A7AFC3"
                    fontSize="10"
                    textAnchor="middle"
                  >
                    {chart.labels[index].length > 12
                      ? `${chart.labels[index].slice(0, 11)}…`
                      : chart.labels[index]}
                  </text>
                  <text
                    x={x + barWidth / 2}
                    y={Math.max(top + 12, y - 5)}
                    fill="#FFFFFF"
                    fontSize="10"
                    textAnchor="middle"
                  >
                    {value}
                  </text>
                </g>
              )
            })}
            <text
              x={left + innerWidth / 2}
              y={chartHeight - 4}
              fill="#A7AFC3"
              fontSize="11"
              textAnchor="middle"
            >
              {chart.x_axis_label}
            </text>
            <text
              x="13"
              y={top + innerHeight / 2}
              fill="#A7AFC3"
              fontSize="11"
              textAnchor="middle"
              transform={`rotate(-90 13 ${top + innerHeight / 2})`}
            >
              {chart.y_axis_label}
            </text>
          </svg>
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-[#8D98B0]">
          No values available to chart.
        </p>
      )}
      <div className="mt-3 flex items-center justify-between text-xs text-[#8D98B0]">
        <span>{chart.chart_type === 'histogram' ? 'Histogram · equal-width bins' : 'Category frequency'}</span>
        <span>{chart.values.reduce((total, value) => total + value, 0)} rows charted</span>
      </div>
    </div>
  )
}

function BoxPlot({ chart }) {
  const summary = chart.numeric_summary
  if (!summary) {
    return <p className="py-8 text-center text-sm text-[#8D98B0]">No numeric values available.</p>
  }

  const width = 640
  const height = 180
  const left = 50
  const right = width - 24
  const range = summary.maximum - summary.minimum || 1
  const scale = (value) => left + ((value - summary.minimum) / range) * (right - left)
  const y = 76

  return (
    <div>
      <div className="overflow-x-auto">
        <svg
          className="min-w-[520px] w-full"
          role="img"
          aria-label={`Box plot of ${chart.column} from minimum to maximum`}
          viewBox={`0 0 ${width} ${height}`}
        >
          {[summary.minimum, summary.first_quartile, summary.median, summary.third_quartile, summary.maximum].map((value, index) => (
            <g key={`${value}-${index}`}>
              <line
                x1={scale(value)}
                y1={index === 0 || index === 4 ? y - 12 : y - 25}
                x2={scale(value)}
                y2={index === 0 || index === 4 ? y + 12 : y + 25}
                stroke={index === 2 ? '#42C8F5' : '#A7AFC3'}
                strokeWidth={index === 2 ? 2 : 1.5}
              />
              <text
                x={scale(value)}
                y={y + 48}
                fill="#A7AFC3"
                fontSize="10"
                textAnchor="middle"
              >
                {Number(value).toPrecision(4)}
              </text>
            </g>
          ))}
          <line x1={scale(summary.minimum)} y1={y} x2={scale(summary.first_quartile)} y2={y} stroke="#A7AFC3" />
          <line x1={scale(summary.third_quartile)} y1={y} x2={scale(summary.maximum)} y2={y} stroke="#A7AFC3" />
          <rect
            x={scale(summary.first_quartile)}
            y={y - 24}
            width={Math.max(1, scale(summary.third_quartile) - scale(summary.first_quartile))}
            height="48"
            rx="6"
            fill="#756BFF"
            fillOpacity="0.45"
            stroke="#9B91FF"
          />
          <line x1={scale(summary.median)} y1={y - 24} x2={scale(summary.median)} y2={y + 24} stroke="#42C8F5" strokeWidth="3" />
          <text x={left} y="20" fill="#A7AFC3" fontSize="11">Min</text>
          <text x={scale(summary.first_quartile)} y="20" fill="#A7AFC3" fontSize="11" textAnchor="middle">Q1</text>
          <text x={scale(summary.median)} y="20" fill="#42C8F5" fontSize="11" textAnchor="middle">Median</text>
          <text x={scale(summary.third_quartile)} y="20" fill="#A7AFC3" fontSize="11" textAnchor="middle">Q3</text>
          <text x={right} y="20" fill="#A7AFC3" fontSize="11" textAnchor="end">Max</text>
        </svg>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {[
          ['Mean', summary.mean],
          ['Median', summary.median],
          ['Range', `${Number(summary.minimum).toPrecision(4)} – ${Number(summary.maximum).toPrecision(4)}`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-[#8D98B0]">{label}</p>
            <p className="mt-1 text-sm font-semibold text-white">
              {typeof value === 'number' ? value.toPrecision(5) : value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function DonutChart({ chart }) {
  const total = chart.values.reduce((sum, value) => sum + value, 0)
  const radius = 62
  const circumference = 2 * Math.PI * radius
  let offset = 0

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <svg
        className="h-48 w-48 shrink-0"
        role="img"
        aria-label={`Donut chart showing ${chart.column} category frequencies`}
        viewBox="0 0 160 160"
      >
        <circle cx="80" cy="80" r={radius} fill="none" stroke="#20283A" strokeWidth="24" />
        {chart.values.map((value, index) => {
          const segment = total ? (value / total) * circumference : 0
          const currentOffset = offset
          offset += segment
          return (
            <circle
              key={`${chart.labels[index]}-${index}`}
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={chartColors[index % chartColors.length]}
              strokeWidth="24"
              strokeDasharray={`${segment} ${circumference - segment}`}
              strokeDashoffset={-currentOffset}
              transform="rotate(-90 80 80)"
            >
              <title>{`${chart.labels[index]}: ${value} (${total ? ((value / total) * 100).toFixed(1) : 0}%)`}</title>
            </circle>
          )
        })}
        <text x="80" y="76" fill="#A7AFC3" fontSize="11" textAnchor="middle">TOTAL</text>
        <text x="80" y="96" fill="#FFFFFF" fontSize="18" fontWeight="700" textAnchor="middle">{total}</text>
      </svg>
      <div className="w-full space-y-2">
        {chart.labels.map((label, index) => (
          <div key={`${label}-${index}`} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-center gap-2 text-[#C4CBD8]">
              <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: chartColors[index % chartColors.length] }} />
              <span className="truncate">{label}</span>
            </span>
            <span className="shrink-0 font-medium text-white">
              {chart.values[index]} <span className="text-xs text-[#8D98B0]">{total ? `${((chart.values[index] / total) * 100).toFixed(1)}%` : '0%'}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function VisualizationChart({ chart, targetColumn, view, onViewChange }) {
  const numeric = chart.chart_type === 'histogram'
  const total = chart.values.reduce((sum, value) => sum + value, 0)
  const chartViews = numeric
    ? [['histogram', 'Histogram'], ['box', 'Box plot']]
    : [['bar', 'Bars'], ['donut', 'Donut']]

  return (
    <article className={`rounded-2xl border bg-[#0A1020]/75 p-5 ${chart.column === targetColumn ? 'border-[#42C8F5]/40 shadow-[0_0_28px_rgba(66,200,245,0.08)]' : 'border-white/[0.08]'}`}>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-white">{chart.title}</h2>
            {chart.column === targetColumn && (
              <span className="rounded-full border border-[#42C8F5]/25 bg-[#42C8F5]/[0.08] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#75DFFF]">
                Target
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-[#8D98B0]">
            {chart.series_name} · {chart.missing_count} missing · {total} charted
          </p>
        </div>
        <div className="inline-flex w-fit rounded-lg border border-white/[0.08] bg-black/20 p-1" aria-label={`Chart type for ${chart.column}`}>
          {chartViews.map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={view === value}
              onClick={() => onViewChange(value)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${view === value ? 'bg-[#5148D8]/50 text-white' : 'text-[#8D98B0] hover:text-white'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {view === 'box' ? (
        <BoxPlot chart={chart} />
      ) : view === 'donut' ? (
        <DonutChart chart={chart} />
      ) : (
        <BarChart chart={chart} />
      )}
      <p className="mt-3 text-xs text-[#8D98B0]">
        {view === 'histogram' || view === 'box'
          ? `Horizontal axis: ${chart.x_axis_label} · Vertical axis: ${chart.y_axis_label}`
          : `Category: ${chart.x_axis_label} · ${chart.y_axis_label}`}
      </p>
    </article>
  )
}

export default function VisualizationPage() {
  const { datasetId, targetColumn } = useAnalysis()
  const [data, setData] = useState(null)
  const [state, setState] = useState('loading')
  const [error, setError] = useState('')
  const [columnFilter, setColumnFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState('source')
  const [chartViews, setChartViews] = useState({})

  const loadVisualizations = async () => {
    if (!datasetId) {
      setData(null)
      setError('')
      setState('empty')
      return
    }

    setState('loading')
    setError('')
    try {
      const response = await analyzeVisualization(datasetId, targetColumn)
      setData(response)
      setState('success')
    } catch (requestError) {
      setData(null)
      setError(requestError.userMessage || 'Unable to load visualizations.')
      setState('error')
    }
  }

  useEffect(() => {
    loadVisualizations()
  }, [datasetId, targetColumn])

  const visibleCharts = useMemo(() => {
    const charts = data?.charts || []
    const filtered = charts.filter((chart) => {
      const matchesType = columnFilter === 'all'
        || (columnFilter === 'numeric' && chart.chart_type === 'histogram')
        || (columnFilter === 'categorical' && chart.chart_type === 'bar')
      return matchesType && chart.column.toLowerCase().includes(search.trim().toLowerCase())
    })

    if (sortOrder === 'alphabetical') {
      return [...filtered].sort((first, second) => first.column.localeCompare(second.column))
    }
    if (sortOrder === 'missing') {
      return [...filtered].sort((first, second) => second.missing_count - first.missing_count)
    }
    return filtered
  }, [columnFilter, data, search, sortOrder])

  return (
    <div className="min-h-full px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A69CFF]">
              Dataset exploration
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              Visualization
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#A7AFC3]">
              Compare numeric distributions and category frequencies from the selected dataset.
            </p>
          </div>
          <button
            type="button"
            onClick={loadVisualizations}
            disabled={state === 'loading' || !datasetId}
            className="w-fit rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {state === 'loading' ? 'Loading…' : 'Refresh charts'}
          </button>
        </header>

        {state === 'loading' && (
          <section
            role="status"
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center text-sm text-[#A7AFC3]"
          >
            Loading visualizations…
          </section>
        )}
        {state === 'empty' && (
          <EmptyState
            title="No dataset selected"
            message="Upload or select a dataset to generate real visualizations."
          />
        )}
        {state === 'error' && (
          <section
            role="alert"
            className="rounded-2xl border border-red-400/20 bg-red-500/[0.06] p-6"
          >
            <h2 className="font-semibold text-red-200">
              Unable to load visualizations
            </h2>
            <p className="mt-2 text-sm text-red-100/80">{error}</p>
            <button
              type="button"
              onClick={loadVisualizations}
              className="mt-4 rounded-lg border border-red-300/20 px-4 py-2 text-sm font-semibold text-red-100"
            >
              Retry
            </button>
          </section>
        )}
        {state === 'success' && data && (
          <>
            <section className="grid gap-4 sm:grid-cols-3">
              {[
                ['Dataset', data.dataset_id],
                ['Rows', data.rows],
                ['Columns', data.columns],
                ['Target', data.target_column || 'Not selected'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/[0.08] bg-[#0A1020]/75 p-4"
                >
                  <p className="text-xs uppercase tracking-wide text-[#8D98B0]">
                    {label}
                  </p>
                  <p className="mt-2 break-all text-lg font-semibold text-white">
                    {value}
                  </p>
                </div>
              ))}
            </section>
            {data.charts.length ? (
              <>
                <section className="rounded-2xl border border-white/[0.08] bg-[#0A1020]/75 p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">Explore columns</p>
                      <p className="mt-1 text-xs text-[#8D98B0]">
                        {visibleCharts.length} of {data.charts.length} visualizations
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <label className="sr-only" htmlFor="visualization-search">Search columns</label>
                      <input
                        id="visualization-search"
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search columns"
                        className="rounded-lg border border-white/10 bg-[#11172A] px-3 py-2 text-sm text-white placeholder:text-[#758198]"
                      />
                      <label className="sr-only" htmlFor="visualization-sort">Sort visualizations</label>
                      <select
                        id="visualization-sort"
                        value={sortOrder}
                        onChange={(event) => setSortOrder(event.target.value)}
                        className="rounded-lg border border-white/10 bg-[#11172A] px-3 py-2 text-sm text-white"
                      >
                        <option value="source">Dataset order</option>
                        <option value="alphabetical">Column name</option>
                        <option value="missing">Most missing</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[
                      ['all', 'All columns'],
                      ['numeric', 'Numeric'],
                      ['categorical', 'Categorical'],
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={columnFilter === value}
                        onClick={() => setColumnFilter(value)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${columnFilter === value ? 'border-[#756BFF]/40 bg-[#5148D8]/20 text-white' : 'border-white/[0.08] bg-white/[0.02] text-[#9AA5BA] hover:text-white'}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </section>
                {visibleCharts.length ? (
                  <section className="grid gap-5 xl:grid-cols-2">
                    {visibleCharts.map((chart) => (
                      <VisualizationChart
                        key={chart.column}
                        chart={chart}
                        targetColumn={data.target_column}
                        view={chartViews[chart.column] || chart.chart_type}
                        onViewChange={(view) => {
                          setChartViews((current) => ({
                            ...current,
                            [chart.column]: view,
                          }))
                        }}
                      />
                    ))}
                  </section>
                ) : (
                  <EmptyState
                    title="No matching columns"
                    message="Change the search or column filter to see visualizations."
                  />
                )}
              </>
            ) : (
              <EmptyState
                title="No chartable columns"
                message="The backend returned no columns to visualize for this dataset."
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
