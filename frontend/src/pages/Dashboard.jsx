import { Link } from 'react-router-dom'

function Dashboard() {
  return (
    <div className="relative min-h-screen bg-transparent text-white">
      <div className="relative z-10 space-y-8 px-4 py-6 md:px-6 lg:px-8">

        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="relative min-h-[620px] overflow-hidden rounded-[32px] border border-white/[0.10] bg-[#090E1D]/35 shadow-[0_0_100px_rgba(37,99,235,0.08)] backdrop-blur-md">

          <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#5148D8]/12 blur-[130px]" />
          <div className="pointer-events-none absolute -bottom-40 left-[20%] h-[450px] w-[450px] rounded-full bg-[#2563EB]/8 blur-[130px]" />

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
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
              backgroundSize: '55px 55px',
            }}
          />

          <div className="relative flex min-h-[620px] items-center px-7 py-14 md:px-10 lg:px-14">
            <div className="max-w-2xl">

              <div className="inline-flex items-center gap-2 rounded-full border border-[#756BFF]/30 bg-[#151634]/50 px-4 py-2 text-xs font-semibold text-[#C8C3FF] backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#756BFF] opacity-75" />
                  <span className="relative h-2 w-2 rounded-full bg-[#8B7CFF]" />
                </span>
                AI-Powered Dataset Intelligence
              </div>

              <h1 className="mt-7 text-4xl font-bold leading-[1.02] tracking-[-0.04em] text-white md:text-5xl lg:text-[60px]">
                From Raw Dataset
                <br />
                to{' '}
                <span className="bg-gradient-to-r from-[#9B8CFF] via-[#7C8CFF] to-[#55D8FF] bg-clip-text text-transparent">
                  ML-Ready Dataset
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-white md:text-lg">
                DataCanvasAI helps you inspect, understand, clean and
                prepare your dataset before using it for machine learning.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">

                <Link
                  to="/upload"
                  className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#5148D8] to-[#6D5CFF] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_35px_rgba(81,72,216,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_50px_rgba(81,72,216,0.5)]"
                >
                  Analyze Your Dataset
                  <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <a
                  href="#about"
                  className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.07]"
                >
                  Learn More
                  <span className="text-white/80">↓</span>
                </a>

              </div>

              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-white">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4F8CFF] shadow-[0_0_8px_#4F8CFF]" />
                  Dataset Inspection
                </span>

                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#9B5CFF] shadow-[0_0_8px_#9B5CFF]" />
                  Risk Detection
                </span>

                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]" />
                  ML Readiness
                </span>
              </div>

            </div>
          </div>
        </section>


        {/* =====================================================
            ABOUT
        ====================================================== */}

        <section
          id="about"
          className="relative overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#090E1D]/32 p-7 shadow-[0_0_60px_rgba(37,99,235,0.04)] backdrop-blur-md lg:p-10"
        >

          <div className="pointer-events-none absolute -right-32 -top-32 h-[400px] w-[400px] rounded-full bg-[#5148D8]/9 blur-[120px]" />

          <div className="relative">

            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#A69CFF]">
              About DataCanvasAI
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
              What does{' '}
              <span className="bg-gradient-to-r from-[#A794FF] to-[#58D7FF] bg-clip-text text-transparent">
                DataCanvasAI
              </span>{' '}
              actually do?
            </h2>

            <p className="mt-5 max-w-4xl text-base leading-8 text-white md:text-lg">
              DataCanvasAI is an AI-powered dataset inspection and
              machine-learning readiness platform. It helps you understand
              what is inside your dataset, detect data-quality problems,
              identify potential risks and prepare your data before training
              a machine-learning model.
            </p>

            <p className="mt-4 max-w-4xl text-base leading-8 text-white">
              Instead of manually checking every column and searching for
              missing values, duplicates, inconsistent values or unusual
              observations, DataCanvasAI organizes the information and
              highlights the areas that need attention.
            </p>

            <div className="mt-10 grid gap-5 md:grid-cols-3">

              <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.018] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#4F7CFF]/40 hover:bg-[#10172D]/65">

                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#3158FF]/10 blur-2xl transition group-hover:bg-[#3158FF]/20" />

                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-[#3158FF]/20 bg-[#3158FF]/10 text-xl text-[#6EA0FF]">
                  ◉
                </div>

                <h3 className="relative mt-6 text-lg font-semibold text-white">
                  Understand Your Data
                </h3>

                <p className="relative mt-3 text-sm leading-6 text-white">
                  See rows, columns, data types, distributions,
                  statistics and important dataset information.
                </p>

              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.018] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#8B5CF6]/40 hover:bg-[#17132D]/65">

                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#8B5CF6]/10 blur-2xl transition group-hover:bg-[#8B5CF6]/20" />

                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-[#8B5CF6]/20 bg-[#8B5CF6]/10 text-xl text-[#B39BFF]">
                  ⚡
                </div>

                <h3 className="relative mt-6 text-lg font-semibold text-white">
                  Find Data Problems
                </h3>

                <p className="relative mt-3 text-sm leading-6 text-white">
                  Detect missing values, duplicates, outliers,
                  inconsistent values and other quality risks.
                </p>

              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.018] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#06B6D4]/40 hover:bg-[#0B2029]/65">

                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#06B6D4]/10 blur-2xl transition group-hover:bg-[#06B6D4]/20" />

                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-[#06B6D4]/20 bg-[#06B6D4]/10 text-xl text-[#67E8F9]">
                  ✓
                </div>

                <h3 className="relative mt-6 text-lg font-semibold text-white">
                  Prepare for ML
                </h3>

                <p className="relative mt-3 text-sm leading-6 text-white">
                  Get useful recommendations that help make your
                  dataset cleaner and more suitable for ML workflows.
                </p>

              </div>

            </div>
          </div>
        </section>


        {/* =====================================================
            HOW IT WORKS
        ====================================================== */}

        <section
          className="relative overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#090E1D]/32 p-7 shadow-[0_0_60px_rgba(37,99,235,0.04)] backdrop-blur-md lg:p-10"
        >

          <div className="pointer-events-none absolute -left-32 -top-32 h-[380px] w-[380px] rounded-full bg-[#3158FF]/8 blur-[120px]" />

          <div className="relative">

            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#A69CFF]">
              Working Process
            </p>

            <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
              How{' '}
              <span className="bg-gradient-to-r from-[#A794FF] to-[#58D7FF] bg-clip-text text-transparent">
                DataCanvasAI
              </span>{' '}
              Works
            </h2>

            <p className="mt-4 max-w-3xl text-base leading-7 text-white">
              DataCanvasAI follows a simple pipeline. You upload your
              dataset, the platform analyzes it, identifies important
              issues and provides insights before you move towards
              machine-learning modeling.
            </p>

            <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

              <div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#3158FF]/40 bg-[#101936]/70 text-lg font-bold text-[#6EA0FF] shadow-[0_0_25px_rgba(49,88,255,0.12)]">
                  01
                </div>

                <h3 className="mt-5 text-lg font-semibold text-white">
                  Upload Dataset
                </h3>

                <p className="mt-3 text-sm leading-6 text-white">
                  Upload your CSV, XLS, JSON or supported dataset
                  into the DataCanvasAI workspace.
                </p>
              </div>

              <div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#7C3AED]/40 bg-[#17122D]/70 text-lg font-bold text-[#B39BFF] shadow-[0_0_25px_rgba(124,58,237,0.12)]">
                  02
                </div>

                <h3 className="mt-5 text-lg font-semibold text-white">
                  Inspect & Explore
                </h3>

                <p className="mt-3 text-sm leading-6 text-white">
                  Analyze columns, data types, distributions,
                  statistics and the overall structure of the dataset.
                </p>
              </div>

              <div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#06B6D4]/40 bg-[#0B2029]/70 text-lg font-bold text-[#67E8F9] shadow-[0_0_25px_rgba(6,182,212,0.12)]">
                  03
                </div>

                <h3 className="mt-5 text-lg font-semibold text-white">
                  Detect & Improve
                </h3>

                <p className="mt-3 text-sm leading-6 text-white">
                  Find missing values, duplicates, outliers and
                  other quality problems and review recommendations.
                </p>
              </div>

              <div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#22C55E]/40 bg-[#0D2118]/70 text-lg font-bold text-[#5BE58A] shadow-[0_0_25px_rgba(34,197,94,0.12)]">
                  04
                </div>

                <h3 className="mt-5 text-lg font-semibold text-white">
                  Check ML Readiness
                </h3>

                <p className="mt-3 text-sm leading-6 text-white">
                  Review the health of your dataset and determine
                  whether it is ready for machine-learning workflows.
                </p>
              </div>

            </div>
          </div>
        </section>


        {/* =====================================================
            HOW TO USE A MODEL
        ====================================================== */}

        <section
          className="relative overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#090E1D]/32 p-7 shadow-[0_0_60px_rgba(81,72,216,0.05)] backdrop-blur-md lg:p-10"
        >

          <div className="pointer-events-none absolute -right-32 -bottom-32 h-[420px] w-[420px] rounded-full bg-[#7C3AED]/8 blur-[125px]" />

          <div className="relative">

            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#A69CFF]">
              Machine Learning
            </p>

            <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
              How to{' '}
              <span className="bg-gradient-to-r from-[#A794FF] to-[#58D7FF] bg-clip-text text-transparent">
                Use a Model
              </span>
            </h2>

            <p className="mt-4 max-w-3xl text-base leading-7 text-white">
              Once your dataset is clean and prepared, the next step is
              to build and evaluate a machine-learning model. A good
              workflow starts by understanding the problem and ends by
              measuring model performance.
            </p>

            {/* Model Steps */}

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

              {/* 01 */}

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.018] p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.035]">

                <div className="flex items-center justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3158FF]/10 font-bold text-[#6EA0FF]">
                    01
                  </div>

                  <span className="text-[10px] font-semibold tracking-wider text-white">
                    PROBLEM
                  </span>

                </div>

                <h3 className="mt-5 text-lg font-semibold text-white">
                  Define the Problem
                </h3>

                <p className="mt-3 text-sm leading-6 text-white">
                  Decide what you want the model to predict. For example,
                  classification predicts categories while regression
                  predicts continuous values.
                </p>

              </div>

              {/* 02 */}

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.018] p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.035]">

                <div className="flex items-center justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#7C3AED]/10 font-bold text-[#B39BFF]">
                    02
                  </div>

                  <span className="text-[10px] font-semibold tracking-wider text-white">
                    FEATURES
                  </span>

                </div>

                <h3 className="mt-5 text-lg font-semibold text-white">
                  Select Useful Features
                </h3>

                <p className="mt-3 text-sm leading-6 text-white">
                  Choose the input columns that contain useful information
                  for predicting the target variable.
                </p>

              </div>

              {/* 03 */}

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.018] p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.035]">

                <div className="flex items-center justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#06B6D4]/10 font-bold text-[#67E8F9]">
                    03
                  </div>

                  <span className="text-[10px] font-semibold tracking-wider text-white">
                    SPLIT
                  </span>

                </div>

                <h3 className="mt-5 text-lg font-semibold text-white">
                  Split the Dataset
                </h3>

                <p className="mt-3 text-sm leading-6 text-white">
                  Separate the data into training and testing portions so
                  the model can be trained and then evaluated on unseen data.
                </p>

              </div>

              {/* 04 */}

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.018] p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.035]">

                <div className="flex items-center justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F59E0B]/10 font-bold text-[#FBBF24]">
                    04
                  </div>

                  <span className="text-[10px] font-semibold tracking-wider text-white">
                    MODEL
                  </span>

                </div>

                <h3 className="mt-5 text-lg font-semibold text-white">
                  Choose a Model
                </h3>

                <p className="mt-3 text-sm leading-6 text-white">
                  Select a suitable algorithm based on your task, dataset
                  size, features and expected type of output.
                </p>

              </div>

              {/* 05 */}

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.018] p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.035]">

                <div className="flex items-center justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EC4899]/10 font-bold text-[#F472B6]">
                    05
                  </div>

                  <span className="text-[10px] font-semibold tracking-wider text-white">
                    TRAIN
                  </span>

                </div>

                <h3 className="mt-5 text-lg font-semibold text-white">
                  Train the Model
                </h3>

                <p className="mt-3 text-sm leading-6 text-white">
                  Feed the training data into the selected algorithm so
                  it can learn useful patterns from your dataset.
                </p>

              </div>

              {/* 06 */}

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.018] p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.035]">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#22C55E]/10 font-bold text-[#5BE58A]">
                  06
                </div>

                <h3 className="mt-5 text-lg font-semibold text-white">
                  Evaluate & Compare
                </h3>

                <p className="mt-3 text-sm leading-6 text-white">
                  Evaluate predictions using suitable metrics and compare
                  different models to identify the better-performing approach.
                </p>

              </div>

            </div>

            {/* Important Points */}

            <div className="mt-8 grid gap-5 md:grid-cols-3">

              <div className="rounded-2xl border border-[#3158FF]/20 bg-[#3158FF]/[0.035] p-5">
                <h3 className="text-base font-semibold text-white">
                  Data Quality First
                </h3>

                <p className="mt-2 text-sm leading-6 text-white">
                  Better quality data usually gives the model a stronger
                  foundation for learning useful patterns.
                </p>
              </div>

              <div className="rounded-2xl border border-[#8B5CF6]/20 bg-[#8B5CF6]/[0.035] p-5">
                <h3 className="text-base font-semibold text-white">
                  Avoid Overfitting
                </h3>

                <p className="mt-2 text-sm leading-6 text-white">
                  A model should perform well not only on training data
                  but also on new, unseen data.
                </p>
              </div>

              <div className="rounded-2xl border border-[#06B6D4]/20 bg-[#06B6D4]/[0.035] p-5">
                <h3 className="text-base font-semibold text-white">
                  Compare Results
                </h3>

                <p className="mt-2 text-sm leading-6 text-white">
                  Testing multiple models and comparing appropriate metrics
                  can help you choose a better solution.
                </p>
              </div>

            </div>

          </div>
        </section>


        {/* =====================================================
            CORE CAPABILITIES
        ====================================================== */}

        <section
          className="relative overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#090E1D]/32 p-7 shadow-[0_0_60px_rgba(37,99,235,0.04)] backdrop-blur-md lg:p-10"
        >

          <div className="relative">

            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#A69CFF]">
                  Capabilities
                </p>

                <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
                  Core{' '}
                  <span className="bg-gradient-to-r from-[#A794FF] to-[#58D7FF] bg-clip-text text-transparent">
                    Capabilities
                  </span>
                </h2>

              </div>

              <p className="max-w-md text-sm leading-6 text-white">
                Everything you need to understand the health and
                machine-learning readiness of your dataset.
              </p>

            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2">

              <div className="group rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#101A38]/55 to-[#0A1020]/45 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#3158FF]/40">

                <div className="flex items-center justify-between">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#3158FF]/10 text-xl text-[#6EA0FF]">
                    ◈
                  </div>

                  <span className="text-xs text-white">
                    01
                  </span>

                </div>

                <h3 className="mt-6 text-xl font-semibold text-white">
                  Dataset Profiling
                </h3>

                <p className="mt-3 text-sm leading-6 text-white">
                  Get a complete overview of columns, data types,
                  distributions, missing values and statistics.
                </p>

              </div>

              <div className="group rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#17132F]/55 to-[#0A1020]/45 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#8B5CF6]/40">

                <div className="flex items-center justify-between">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#8B5CF6]/10 text-xl text-[#B39BFF]">
                    ⚠
                  </div>

                  <span className="text-xs text-white">
                    02
                  </span>

                </div>

                <h3 className="mt-6 text-xl font-semibold text-white">
                  Risk Detection
                </h3>

                <p className="mt-3 text-sm leading-6 text-white">
                  Detect missing data, duplicates, outliers and
                  potential data-quality problems.
                </p>

              </div>

              <div className="group rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#0B202A]/55 to-[#0A1020]/45 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#06B6D4]/40">

                <div className="flex items-center justify-between">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#06B6D4]/10 text-xl text-[#67E8F9]">
                    ✦
                  </div>

                  <span className="text-xs text-white">
                    03
                  </span>

                </div>

                <h3 className="mt-6 text-xl font-semibold text-white">
                  Recommendations
                </h3>

                <p className="mt-3 text-sm leading-6 text-white">
                  Receive useful suggestions for improving the
                  quality and usability of your dataset.
                </p>

              </div>

              <div className="group rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#10261E]/55 to-[#0A1020]/45 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#22C55E]/40">

                <div className="flex items-center justify-between">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#22C55E]/10 text-xl text-[#5BE58A]">
                    ✓
                  </div>

                  <span className="text-xs text-white">
                    04
                  </span>

                </div>

                <h3 className="mt-6 text-xl font-semibold text-white">
                  ML Readiness
                </h3>

                <p className="mt-3 text-sm leading-6 text-white">
                  Understand whether your dataset is suitable
                  for machine-learning workflows.
                </p>

              </div>

            </div>

          </div>
        </section>


        {/* =====================================================
            FINAL CTA
        ====================================================== */}

        <section
          className="relative overflow-hidden rounded-[30px] border border-[#5148D8]/30 bg-[#090E1D]/35 p-8 shadow-[0_0_90px_rgba(81,72,216,0.10)] backdrop-blur-md lg:p-12"
        >

          <div className="pointer-events-none absolute -right-32 -top-32 h-[450px] w-[450px] rounded-full bg-[#6D5CFF]/10 blur-[130px]" />

          <div className="pointer-events-none absolute -bottom-32 left-[20%] h-[350px] w-[350px] rounded-full bg-[#2563EB]/8 blur-[120px]" />

          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#AFA5FF]">
                Ready to Begin?
              </p>

              <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
                Ready to analyze your dataset?
              </h2>

              <p className="mt-4 max-w-xl text-white">
                Upload your dataset and discover what is hiding
                inside your data before training your next ML model.
              </p>

            </div>

            <Link
              to="/upload"
              className="group inline-flex shrink-0 items-center gap-3 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#171B35] shadow-[0_0_35px_rgba(255,255,255,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_50px_rgba(255,255,255,0.2)]"
            >
              Analyze Dataset

              <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>

          </div>
        </section>

      </div>
    </div>
  )
}

export default Dashboard