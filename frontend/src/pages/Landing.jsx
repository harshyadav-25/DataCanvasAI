import { Link } from 'react-router-dom'

function Landing() {
  return (
    <div className="min-h-screen bg-[#050816] text-white">

      {/* =========================
          PUBLIC HEADER
          ========================= */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#050816]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 md:px-8">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5B56E8] shadow-[0_0_25px_rgba(91,86,232,0.35)]">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <ellipse cx="12" cy="5" rx="7" ry="3" />
                <path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
                <path d="M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7" />
              </svg>
            </div>

            <div>
              <p className="text-lg font-bold">
                DataCanvas<span className="text-[#8D89FF]">AI</span>
              </p>

              <p className="text-[8px] text-slate-400">
                Clean Data. Smarter Models.
              </p>
            </div>

          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#about"
              className="text-sm text-slate-300 transition hover:text-white"
            >
              About
            </a>

            <a
              href="#features"
              className="text-sm text-slate-300 transition hover:text-white"
            >
              Features
            </a>

            <a
              href="#workflow"
              className="text-sm text-slate-300 transition hover:text-white"
            >
              How It Works
            </a>
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-gradient-to-r from-[#5148D8] to-[#756BFF] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_25px_rgba(81,72,216,0.25)] transition hover:-translate-y-0.5"
            >
              Sign Up
            </Link>
          </div>

        </div>
      </header>

      {/* =========================
          HERO
          ========================= */}
      <main>

        <section className="relative overflow-hidden">
          {/* Background glows */}
          <div className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-[#5148D8]/20 blur-[150px]" />
          <div className="pointer-events-none absolute -left-40 bottom-0 h-[500px] w-[500px] rounded-full bg-[#2563EB]/10 blur-[140px]" />

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: `
                linear-gradient(
                  rgba(255,255,255,0.5) 1px,
                  transparent 1px
                ),
                linear-gradient(
                  90deg,
                  rgba(255,255,255,0.5) 1px,
                  transparent 1px
                )
              `,
              backgroundSize: '60px 60px',
            }}
          />

          <div className="relative mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">

            <div className="max-w-4xl">

              <div className="inline-flex items-center gap-2 rounded-full border border-[#756BFF]/30 bg-[#151634]/60 px-4 py-2 text-xs font-semibold text-[#C8C3FF]">
                <span className="h-2 w-2 rounded-full bg-[#8B7CFF] shadow-[0_0_10px_#8B7CFF]" />
                AI-Powered Dataset Intelligence
              </div>

              <h1 className="mt-7 text-5xl font-bold leading-[1.02] tracking-[-0.05em] md:text-6xl lg:text-7xl">
                Turn raw data into
                <span className="block bg-gradient-to-r from-[#A794FF] via-[#7C8CFF] to-[#55D8FF] bg-clip-text text-transparent">
                  ML-ready data
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
                DataCanvasAI helps you inspect your dataset, understand its
                quality, identify risks and prepare it for machine-learning
                workflows.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">

                <Link
                  to="/register"
                  className="rounded-xl bg-gradient-to-r from-[#5148D8] to-[#756BFF] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_35px_rgba(81,72,216,0.3)] transition hover:-translate-y-1"
                >
                  Get Started
                </Link>

                <a
                  href="#workflow"
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-white/[0.06]"
                >
                  Explore Platform
                </a>

              </div>

              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-xs text-slate-400">

                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  Dataset Inspection
                </span>

                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                  Risk Detection
                </span>

                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  ML Readiness
                </span>

              </div>

            </div>

          </div>
        </section>

        {/* =========================
            ABOUT
            ========================= */}
        <section id="about" className="mx-auto max-w-7xl px-5 py-20 md:px-8">

          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-8 md:p-12">

            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#A69CFF]">
              About DataCanvasAI
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Understand your data before
              <span className="bg-gradient-to-r from-[#A794FF] to-[#58D7FF] bg-clip-text text-transparent">
                {' '}building your model
              </span>
            </h2>

            <p className="mt-6 max-w-4xl text-base leading-8 text-slate-300">
              Instead of manually checking every column, DataCanvasAI
              organizes the information, highlights potential data-quality
              problems and helps you understand whether your dataset is
              suitable for machine-learning workflows.
            </p>

          </div>

        </section>

        {/* =========================
            FEATURES
            ========================= */}
        <section id="features" className="mx-auto max-w-7xl px-5 py-20 md:px-8">

          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#A69CFF]">
              Platform
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Everything in one workspace
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            {[
              {
                title: 'Dataset Profiling',
                text: 'Explore data types, missing values, statistics, distributions and correlations.',
              },
              {
                title: 'Risk Detection',
                text: 'Identify potential quality issues and machine-learning risks.',
              },
              {
                title: 'Recommendations',
                text: 'Get actionable suggestions for improving your dataset.',
              },
              {
                title: 'ML Readiness',
                text: 'Understand the overall readiness of your dataset for ML workflows.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.04]"
              >
                <h3 className="text-xl font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {feature.text}
                </p>
              </div>
            ))}

          </div>

        </section>

        {/* =========================
            WORKFLOW
            ========================= */}
        <section id="workflow" className="mx-auto max-w-7xl px-5 py-20 md:px-8">

          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-8 md:p-12">

            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#A69CFF]">
              Workflow
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              From dataset to ML readiness
            </h2>

            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

              {[
                ['01', 'Upload', 'Upload your dataset into the workspace.'],
                ['02', 'Inspect', 'Understand structure, quality and patterns.'],
                ['03', 'Improve', 'Review risks and recommendations.'],
                ['04', 'Validate', 'Check ML readiness before modelling.'],
              ].map(([number, title, text]) => (
                <div
                  key={number}
                  className="rounded-2xl border border-white/[0.08] bg-[#090E1D]/70 p-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#5148D8]/15 text-sm font-bold text-[#A69CFF]">
                    {number}
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {text}
                  </p>
                </div>
              ))}

            </div>

          </div>

        </section>

        {/* =========================
            FINAL CTA
            ========================= */}
        <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">

          <div className="relative overflow-hidden rounded-3xl border border-[#5148D8]/30 bg-gradient-to-br from-[#17133A] to-[#080D1B] p-8 md:p-12">

            <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#756BFF]/15 blur-[100px]" />

            <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#AFA5FF]">
                  Ready to start?
                </p>

                <h2 className="mt-4 text-3xl font-bold md:text-4xl">
                  Analyze your dataset today.
                </h2>

                <p className="mt-4 max-w-xl text-slate-400">
                  Create your account and start exploring your dataset with
                  DataCanvasAI.
                </p>
              </div>

              <Link
                to="/register"
                className="shrink-0 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-[#171B35] transition hover:-translate-y-1"
              >
                Create Account
              </Link>

            </div>

          </div>

        </section>

      </main>

      {/* =========================
          FOOTER
          ========================= */}
      <footer className="border-t border-white/[0.08] px-5 py-8 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-sm text-slate-500 md:flex-row">
          <span>
            © 2026 DataCanvasAI
          </span>

          <span>
            Clean Data. Smarter Models.
          </span>
        </div>
      </footer>

    </div>
  )
}

export default Landing