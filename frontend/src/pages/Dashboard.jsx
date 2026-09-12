import { Link } from 'react-router-dom'

function Dashboard() {
  return (
    <div className="space-y-6">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden rounded-2xl border border-[#E5E7F0] bg-gradient-to-br from-[#F3F1FF] via-white to-[#EEF0FF]">

        {/* Soft background shapes */}
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#E5E2FF] opacity-50 blur-3xl" />
        <div className="absolute right-40 bottom-[-100px] h-64 w-64 rounded-full bg-[#EEF0FF] opacity-70 blur-3xl" />

        <div className="relative grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-8 p-7 lg:p-10">

          {/* ---------- LEFT ---------- */}
          <div className="flex flex-col justify-center">

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#DDD9FF] bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#5B56E8] backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#5B56E8]" />
              AI-Powered Data Preparation
            </div>

            <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight text-[#17213A] sm:text-5xl lg:text-[54px]">
              From Raw Data
              <br />
              to{' '}
              <span className="text-[#5B56E8]">
                Real Insights
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-[#667085] lg:text-lg">
              Upload, clean, transform and prepare your dataset for
              machine learning — all in one guided workflow.
            </p>

            {/* CTA */}
            <div className="mt-7 flex flex-wrap gap-3">

              <Link
                to="/upload"
                className="inline-flex items-center gap-2 rounded-lg bg-[#5B56E8] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4D47D5]"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 16V4" />
                  <path d="m7 9 5-5 5 5" />
                  <path d="M5 20h14" />
                </svg>

                Get Started
              </Link>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-[#DDE0EA] bg-white px-5 py-3 text-sm font-semibold text-[#17213A] transition hover:bg-[#F8F8FC]"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="m9 6 9 6-9 6V6Z" />
                </svg>

                Watch Demo
              </button>

            </div>

            {/* Stats */}
            <div className="mt-8 grid max-w-xl grid-cols-2 gap-y-5 sm:grid-cols-4 sm:gap-4">

              <div>
                <p className="text-2xl font-bold text-[#5B56E8]">10+</p>
                <p className="mt-1 text-xs text-[#667085]">
                  Data Tools
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-[#5B56E8]">5K+</p>
                <p className="mt-1 text-xs text-[#667085]">
                  Datasets Processed
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-[#5B56E8]">95%</p>
                <p className="mt-1 text-xs text-[#667085]">
                  User Satisfaction
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-[#5B56E8]">100%</p>
                <p className="mt-1 text-xs text-[#667085]">
                  Open Source
                </p>
              </div>

            </div>

          </div>

          {/* ---------- RIGHT: DATASET PREVIEW ---------- */}
          <div className="flex items-center">

            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-[1fr_150px]">

              {/* Dataset card */}
              <div className="rounded-2xl border border-[#E5E7F0] bg-white/90 p-5 shadow-sm backdrop-blur">

                <div className="flex items-start justify-between">

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF0FF]">
                      <svg
                        className="h-5 w-5 text-[#5B56E8]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <ellipse cx="12" cy="5" rx="7" ry="3" />
                        <path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
                        <path d="M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7" />
                      </svg>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[#17213A]">
                        Dataset Preview
                      </p>
                      <p className="mt-0.5 text-xs text-[#667085]">
                        industry.csv
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-[#EAFBF1] px-2.5 py-1 text-[11px] font-semibold text-[#22A35A]">
                    Loaded
                  </span>

                </div>

                {/* Mini stats */}
                <div className="mt-4 flex gap-7">
                  <div>
                    <p className="text-lg font-bold text-[#17213A]">
                      24,581
                    </p>
                    <p className="text-[11px] text-[#667085]">
                      Rows
                    </p>
                  </div>

                  <div>
                    <p className="text-lg font-bold text-[#17213A]">
                      18
                    </p>
                    <p className="text-[11px] text-[#667085]">
                      Columns
                    </p>
                  </div>
                </div>

                {/* Table preview */}
                <div className="mt-4 overflow-hidden rounded-xl border border-[#E9EBF2]">

                  <div className="grid grid-cols-4 bg-[#F8F9FC] text-[10px] font-semibold text-[#667085]">
                    <div className="px-3 py-2">id</div>
                    <div className="px-3 py-2">industry</div>
                    <div className="px-3 py-2">revenue</div>
                    <div className="px-3 py-2">country</div>
                  </div>

                  {[
                    ['01', 'Manufacturing', '1200000', 'India'],
                    ['02', 'Technology', '850000', 'USA'],
                    ['03', 'Healthcare', '430000', 'UK'],
                    ['04', 'Finance', '620000', 'Germany'],
                    ['05', 'Retail', '310000', 'India'],
                  ].map((row) => (
                    <div
                      key={row[0]}
                      className="grid grid-cols-4 border-t border-[#EEF0F4] bg-white text-[10px] text-[#667085]"
                    >
                      {row.map((value, index) => (
                        <div
                          key={`${row[0]}-${index}`}
                          className="truncate px-3 py-2"
                        >
                          {value}
                        </div>
                      ))}
                    </div>
                  ))}

                </div>

                {/* Slider dots */}
                <div className="mt-4 flex justify-center gap-1.5">
                  <span className="h-1.5 w-5 rounded-full bg-[#5B56E8]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D7D9E4]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D7D9E4]" />
                </div>

              </div>

              {/* Insight cards */}
              <div className="space-y-4">

                <div className="rounded-2xl border border-[#E5E7F0] bg-white p-4 shadow-sm">

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[#667085]">
                        Missing Values
                      </p>
                      <p className="mt-1 text-2xl font-bold text-[#17213A]">
                        3.2%
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0F5] text-[#F36B9B]">
                      <span className="text-lg">◫</span>
                    </div>
                  </div>

                  <div className="mt-3 h-1.5 rounded-full bg-[#F4DDE8]">
                    <div className="h-full w-[32%] rounded-full bg-[#F36B9B]" />
                  </div>

                </div>

                <div className="rounded-2xl border border-[#E5E7F0] bg-white p-4 shadow-sm">

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[#667085]">
                        Duplicate Rows
                      </p>
                      <p className="mt-1 text-2xl font-bold text-[#17213A]">
                        0.5%
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF7E5] text-[#F2B84B]">
                      <span className="text-lg">▥</span>
                    </div>
                  </div>

                  <div className="mt-3 h-1.5 rounded-full bg-[#F7EED5]">
                    <div className="h-full w-[10%] rounded-full bg-[#F2B84B]" />
                  </div>

                </div>

                <div className="rounded-2xl border border-[#E5E7F0] bg-white p-4 shadow-sm">

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[#667085]">
                        Data Readiness
                      </p>
                      <p className="mt-1 text-2xl font-bold text-[#17213A]">
                        78%
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAFBF1] text-[#22C55E]">
                      <span className="text-lg">✦</span>
                    </div>
                  </div>

                  <div className="mt-3 h-1.5 rounded-full bg-[#DDF5E6]">
                    <div className="h-full w-[78%] rounded-full bg-[#22C55E]" />
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ================= QUICK FEATURES ================= */}
      <section>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-xl border border-[#E5E7F0] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAFBF1] text-[#22C55E]">
                ◉
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#17213A]">
                  Easy Upload
                </h3>
                <p className="mt-1 text-xs text-[#667085]">
                  CSV, XLSX and more
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#E5E7F0] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF7E5] text-[#F2B84B]">
                ≋
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#17213A]">
                  Data Cleaning
                </h3>
                <p className="mt-1 text-xs text-[#667085]">
                  Missing values & duplicates
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#E5E7F0] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0F5] text-[#F36B9B]">
                ▥
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#17213A]">
                  Interactive Preview
                </h3>
                <p className="mt-1 text-xs text-[#667085]">
                  Explore your data instantly
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#E5E7F0] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF0FF] text-[#5B56E8]">
                ✦
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#17213A]">
                  ML-Ready
                </h3>
                <p className="mt-1 text-xs text-[#667085]">
                  Prepare structured data
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= UPLOAD BANNER ================= */}
      <section className="rounded-2xl border border-[#DDD9FF] bg-gradient-to-r from-[#F3F1FF] to-[#EEF0FF] p-5 lg:p-6">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <h2 className="text-lg font-bold text-[#17213A]">
              Ready to prepare your dataset?
            </h2>

            <p className="mt-1 text-sm text-[#667085]">
              Start by uploading a CSV or XLSX dataset.
            </p>
          </div>

          <Link
            to="/upload"
            className="w-fit rounded-lg bg-[#5B56E8] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4D47D5]"
          >
            Upload Dataset
          </Link>

        </div>

      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="pt-2 pb-8">

        <div>
          <p className="text-sm font-semibold text-[#5B56E8]">
            WORKFLOW
          </p>

          <h2 className="mt-1 text-2xl font-bold text-[#17213A]">
            How It Works
          </h2>

          <p className="mt-1 text-sm text-[#667085]">
            A simple workflow to go from raw data to ML-ready insights.
          </p>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

          {/* Step 1 */}
          <div className="rounded-xl border border-[#E5E7F0] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF0FF] text-sm font-bold text-[#5B56E8]">
                01
              </div>

              <div>
                <p className="text-base font-bold text-[#17213A]">
                  Upload
                </p>
                <p className="text-xs text-[#667085]">
                  Add your dataset
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-[#667085]">
              Upload a CSV or XLSX file and let DataCanvasAI begin the analysis.
            </p>
          </div>


          {/* Step 2 */}
          <div className="rounded-xl border border-[#E5E7F0] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF0FF] text-sm font-bold text-[#5B56E8]">
                02
              </div>

              <div>
                <p className="text-base font-bold text-[#17213A]">
                  Explore
                </p>
                <p className="text-xs text-[#667085]">
                  Understand your data
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-[#667085]">
              Preview rows, columns, statistics and important dataset patterns.
            </p>
          </div>


          {/* Step 3 */}
          <div className="rounded-xl border border-[#E5E7F0] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF0FF] text-sm font-bold text-[#5B56E8]">
                03
              </div>

              <div>
                <p className="text-base font-bold text-[#17213A]">
                  Improve
                </p>
                <p className="text-xs text-[#667085]">
                  Fix data quality issues
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-[#667085]">
              Detect risks and follow recommendations to improve your dataset.
            </p>
          </div>


          {/* Step 4 */}
          <div className="rounded-xl border border-[#E5E7F0] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF0FF] text-sm font-bold text-[#5B56E8]">
                04
              </div>

              <div>
                <p className="text-base font-bold text-[#17213A]">
                  Build
                </p>
                <p className="text-xs text-[#667085]">
                  Get ML-ready insights
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-[#667085]">
              Evaluate readiness and move your cleaned dataset into the ML workflow.
            </p>
          </div>

        </div>

      </section>

    </div>
  )
}

export default Dashboard