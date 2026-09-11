import { Link } from 'react-router-dom'

function Dashboard() {
  return (
    <div className="space-y-8 bg-[#F7F8FC] pb-10">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <section className="relative overflow-hidden rounded-3xl border border-[#E5E7F0] bg-gradient-to-br from-[#F1EFFF] via-white to-[#EEF0FF]">

        {/* Background decoration */}
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#D9D5FF] opacity-50 blur-3xl" />
        <div className="absolute -bottom-24 right-1/4 h-64 w-64 rounded-full bg-[#E8E6FF] opacity-60 blur-3xl" />

        <div className="relative grid min-h-[500px] grid-cols-1 items-center gap-10 px-8 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 xl:px-14">

          {/* =================================================
              HERO CONTENT
          ================================================= */}
          <div>

            <div className="inline-flex items-center gap-2 rounded-full border border-[#D8D4FF] bg-white px-3 py-1.5 text-xs font-semibold text-[#5148D8] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#5148D8]" />
              AI-Powered Dataset Intelligence
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-[#17213A] md:text-5xl lg:text-[56px]">
              From Raw Dataset
              <br />
              to{' '}
              <span className="text-[#5148D8]">
                ML-Ready Dataset
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-[#344054]">
              DataCanvasAI helps you inspect, understand and improve your
              dataset before using it for machine learning.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap gap-3">

              <Link
                to="/upload"
                className="inline-flex items-center gap-2 rounded-lg bg-[#5148D8] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4338CA]"
              >
                Analyze Your Dataset

                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </Link>

              <a
                href="#about"
                className="inline-flex items-center gap-2 rounded-lg border border-[#D0D5DD] bg-white px-6 py-3 text-sm font-semibold text-[#17213A] transition hover:bg-[#F2F4F7]"
              >
                Learn More

                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 5v14" />
                  <path d="m6 13 6 6 6-6" />
                </svg>
              </a>

            </div>

            {/* Small trust line */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-[#667085]">
              <span>Dataset Inspection</span>
              <span className="h-1 w-1 rounded-full bg-[#B6BAC8]" />
              <span>Risk Detection</span>
              <span className="h-1 w-1 rounded-full bg-[#B6BAC8]" />
              <span>ML Readiness</span>
            </div>

          </div>

          {/* =================================================
              HERO 3D VISUAL
          ================================================= */}
          <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden">

            {/* Soft glow */}
            <div className="absolute right-0 h-80 w-80 rounded-full bg-[#CFC9FF] opacity-50 blur-3xl" />
            <div className="absolute left-10 top-10 h-52 w-52 rounded-full bg-[#E7E4FF] opacity-40 blur-3xl" />

            {/* 3D Data Model */}
            <div className="relative z-10 w-full max-w-[560px]">
              <img
                src="/data-pipeline-3d.png"
                alt="DataCanvasAI 3D data pipeline"
                className="w-full object-contain drop-shadow-[0_25px_45px_rgba(81,72,216,0.18)]"
              />
            </div>

            {/* Floating card - top */}
            <div className="absolute left-2 top-10 z-20 hidden rounded-xl border border-[#E5E7F0] bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm sm:block">
              <p className="text-xs font-semibold text-[#667085]">
                Dataset
              </p>

              <p className="mt-1 text-sm font-bold text-[#17213A]">
                Structured Data
              </p>
            </div>

            {/* Floating card - bottom */}
            <div className="absolute bottom-10 right-2 z-20 hidden rounded-xl border border-[#E5E7F0] bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm sm:block">
              <p className="text-xs font-semibold text-[#667085]">
                ML Readiness
              </p>

              <p className="mt-1 text-sm font-bold text-[#19934F]">
                Ready to Analyze
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          ABOUT PROJECT
      ===================================================== */}
      <section
        id="about"
        className="rounded-2xl border border-[#E5E7F0] bg-white p-7 lg:p-10"
      >

        <div className="max-w-4xl">

          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#5148D8]">
            About DataCanvasAI
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#17213A] lg:text-[34px]">
            A smarter way to understand your dataset
          </h2>

          <p className="mt-5 text-base leading-8 text-[#344054]">
            DataCanvasAI is an AI-powered dataset inspection and ML
            readiness platform designed to help users understand their
            data, identify quality risks and prepare datasets before
            they are used for machine learning.
          </p>

          <p className="mt-4 text-base leading-8 text-[#475467]">
            Instead of working blindly with raw data, DataCanvasAI
            guides users through dataset exploration, risk detection,
            recommendations and readiness evaluation.
          </p>

        </div>

        {/* About highlights */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="rounded-xl border border-[#E5E7F0] bg-[#FAFAFD] p-5">

            <p className="text-sm font-bold text-[#5148D8]">
              Understand
            </p>

            <h3 className="mt-2 font-bold text-[#17213A]">
              Know your data
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#475467]">
              Explore the structure, columns, types and important
              characteristics of your dataset.
            </p>

          </div>

          <div className="rounded-xl border border-[#E5E7F0] bg-[#FAFAFD] p-5">

            <p className="text-sm font-bold text-[#5148D8]">
              Identify
            </p>

            <h3 className="mt-2 font-bold text-[#17213A]">
              Find potential risks
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#475467]">
              Detect data-quality and machine-learning risks before
              they affect your workflow.
            </p>

          </div>

          <div className="rounded-xl border border-[#E5E7F0] bg-[#FAFAFD] p-5">

            <p className="text-sm font-bold text-[#5148D8]">
              Prepare
            </p>

            <h3 className="mt-2 font-bold text-[#17213A]">
              Move toward ML readiness
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#475467]">
              Use recommendations and readiness insights to prepare
              your dataset for ML workflows.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}
      <section className="rounded-2xl border border-[#E5E7F0] bg-white p-7 lg:p-10">

        <div>

          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#5148D8]">
            Workflow
          </p>

          <h2 className="mt-3 text-3xl font-bold text-[#17213A]">
            How DataCanvasAI Works
          </h2>

          <p className="mt-2 text-sm text-[#475467]">
            A guided journey from a raw dataset to ML-ready insights.
          </p>

        </div>

        <div className="mt-9 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-xl border border-[#E5E7F0] bg-[#FAFAFD] p-6">

            <span className="text-4xl font-bold text-[#DDD9FF]">
              01
            </span>

            <h3 className="mt-3 text-lg font-bold text-[#17213A]">
              Upload
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#475467]">
              Upload your CSV or XLSX dataset and start your analysis.
            </p>

          </div>

          <div className="rounded-xl border border-[#E5E7F0] bg-[#FAFAFD] p-6">

            <span className="text-4xl font-bold text-[#DDD9FF]">
              02
            </span>

            <h3 className="mt-3 text-lg font-bold text-[#17213A]">
              Explore
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#475467]">
              Understand rows, columns, data types, missing values
              and dataset patterns.
            </p>

          </div>

          <div className="rounded-xl border border-[#E5E7F0] bg-[#FAFAFD] p-6">

            <span className="text-4xl font-bold text-[#DDD9FF]">
              03
            </span>

            <h3 className="mt-3 text-lg font-bold text-[#17213A]">
              Detect & Improve
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#475467]">
              Identify potential risks and get recommendations for
              improving your dataset.
            </p>

          </div>

          <div className="rounded-xl border border-[#E5E7F0] bg-[#FAFAFD] p-6">

            <span className="text-4xl font-bold text-[#DDD9FF]">
              04
            </span>

            <h3 className="mt-3 text-lg font-bold text-[#17213A]">
              Check Readiness
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#475467]">
              Evaluate how prepared your dataset is for a machine
              learning workflow.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          CORE CAPABILITIES
      ===================================================== */}
      <section>

        <div className="mb-5">

          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#5148D8]">
            Core Capabilities
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#17213A]">
            What DataCanvasAI Helps You Do
          </h2>

        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-xl border border-[#E5E7F0] bg-white p-6 shadow-sm">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF0FF] text-[#5148D8]">
              01
            </div>

            <h3 className="mt-5 text-base font-bold text-[#17213A]">
              Dataset Profiling
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#475467]">
              Get a clear view of dataset structure, data types,
              missing values and patterns.
            </p>

          </div>

          <div className="rounded-xl border border-[#E5E7F0] bg-white p-6 shadow-sm">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0F5] text-[#D94F85]">
              02
            </div>

            <h3 className="mt-5 text-base font-bold text-[#17213A]">
              Risk Detection
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#475467]">
              Surface potential data-quality and ML risks that
              deserve attention.
            </p>

          </div>

          <div className="rounded-xl border border-[#E5E7F0] bg-white p-6 shadow-sm">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF7E5] text-[#C98A17]">
              03
            </div>

            <h3 className="mt-5 text-base font-bold text-[#17213A]">
              Recommendations
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#475467]">
              Get actionable suggestions for improving data quality
              and ML suitability.
            </p>

          </div>

          <div className="rounded-xl border border-[#E5E7F0] bg-white p-6 shadow-sm">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAFBF1] text-[#19934F]">
              04
            </div>

            <h3 className="mt-5 text-base font-bold text-[#17213A]">
              ML Readiness
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#475467]">
              Understand how ready your dataset is for machine
              learning workflows.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}
      <section className="rounded-2xl bg-[#17213A] px-7 py-8 lg:px-10">

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>

            <p className="text-xl font-bold text-white">
              Ready to analyze your dataset?
            </p>

            <p className="mt-2 text-sm text-[#D0D5DD]">
              Start with your data and explore the DataCanvasAI workflow.
            </p>

          </div>

          <Link
            to="/upload"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#5148D8] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#4338CA]"
          >
            Start Analysis

            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </Link>

        </div>

      </section>

    </div>
  )
}

export default Dashboard