import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import pipelineImage from '../assets/data-pipeline-3d.png'

function Register() {
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [accepted, setAccepted] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault()
        setError('')

        if (!name || !email || !password || !confirmPassword) {
            setError('Please fill in all fields.')
            return
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters.')
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        if (!accepted) {
            setError('Please accept the Terms of Service and Privacy Policy.')
            return
        }

        // Temporary frontend-only flow
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-[#F7F8FC] flex">

            {/* =====================================================
    LEFT SIDE
===================================================== */}
            <div className="hidden lg:flex lg:w-[56%] relative min-h-screen overflow-hidden bg-[#08101D]">

                {/* Background glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_52%,rgba(91,86,232,0.18),transparent_42%)]" />

                {/* 3D MODEL - BACKGROUND */}
                <img
                    src={pipelineImage}
                    alt="DataCanvasAI data pipeline"
                    className="
      absolute
      top-[7%]
      right-[-8%]
      h-[88%]
      w-[78%]
      object-contain
      object-center
      opacity-45
      mix-blend-screen
      pointer-events-none
      select-none
    "
                />

                {/* Dark gradient OVER the image */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#08101D] via-[#08101D]/65 to-transparent" />

                {/* Content */}
                <div className="relative z-20 flex min-h-screen w-full flex-col px-10 py-8 xl:px-14">

                    {/* Logo */}
                    <div className="flex items-center gap-3">

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
                            <p className="text-xl font-bold text-white">
                                DataCanvas<span className="text-[#8D89FF]">AI</span>
                            </p>

                            <p className="text-[10px] text-slate-400">
                                Clean Data. Smarter Models.
                            </p>
                        </div>

                    </div>

                    {/* Main text */}
                    <div className="flex flex-1 items-center">

                        <div className="max-w-[420px]">

                            {/* Small tagline */}
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9C98FF]">
                                AI-Powered Data Intelligence
                            </p>

                            {/* Main heading */}
                            <h1 className="mt-5 text-[42px] font-bold leading-[1.06] tracking-tight text-white xl:text-[50px]">
                                From Raw Dataset
                                <br />
                                to{' '}
                                <span className="text-[#8D89FF]">
                                    ML-Ready Dataset
                                </span>
                            </h1>

                            {/* Short points */}
                            <div className="mt-8 space-y-4">

                                <div className="flex items-center gap-3">
                                    <span className="h-2 w-2 shrink-0 rounded-full bg-[#8D89FF] shadow-[0_0_12px_rgba(141,137,255,0.9)]" />
                                    <span className="text-sm text-white">
                                        Upload your dataset
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="h-2 w-2 shrink-0 rounded-full bg-[#8D89FF] shadow-[0_0_12px_rgba(141,137,255,0.9)]" />
                                    <span className="text-sm text-white">
                                        Explore your data
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="h-2 w-2 shrink-0 rounded-full bg-[#8D89FF] shadow-[0_0_12px_rgba(141,137,255,0.9)]" />
                                    <span className="text-sm text-white">
                                        Fix data quality issues
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="h-2 w-2 shrink-0 rounded-full bg-[#8D89FF] shadow-[0_0_12px_rgba(141,137,255,0.9)]" />
                                    <span className="text-sm text-white">
                                        Get ML-ready data
                                    </span>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </div>

            {/* Right Section */}
            <div className="flex-1 flex items-center justify-center px-6 py-10">

                <div className="w-full max-w-[430px]">

                    {/* Mobile Logo */}
                    <div className="flex lg:hidden items-center justify-center gap-2 mb-8">

                        <div className="w-9 h-9 rounded-lg bg-[#EEF0FF] flex items-center justify-center">
                            <svg
                                className="w-5 h-5 text-[#5B56E8]"
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

                        <span className="text-xl font-bold text-[#5B56E8]">
                            DataCanvasAI
                        </span>

                    </div>

                    {/* Heading */}
                    <div>
                        <p className="text-sm font-semibold text-[#5B56E8]">
                            Get started
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-[#17213A]">
                            Create your account
                        </h2>

                        <p className="mt-2 text-sm text-[#667085]">
                            Create your DataCanvasAI account to begin.
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="mt-7 space-y-5"
                    >

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-[#17213A]">
                                Full Name
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder="Enter your full name"
                                className="mt-2 w-full h-11 rounded-lg border border-[#DDE0EA] bg-white px-4 text-sm outline-none placeholder:text-[#98A2B3] focus:border-[#5B56E8] focus:ring-2 focus:ring-[#EEF0FF]"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-[#17213A]">
                                Email
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="you@example.com"
                                className="mt-2 w-full h-11 rounded-lg border border-[#DDE0EA] bg-white px-4 text-sm outline-none placeholder:text-[#98A2B3] focus:border-[#5B56E8] focus:ring-2 focus:ring-[#EEF0FF]"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-[#17213A]">
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Create a password"
                                className="mt-2 w-full h-11 rounded-lg border border-[#DDE0EA] bg-white px-4 text-sm outline-none placeholder:text-[#98A2B3] focus:border-[#5B56E8] focus:ring-2 focus:ring-[#EEF0FF]"
                            />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-[#17213A]">
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                placeholder="Confirm your password"
                                className="mt-2 w-full h-11 rounded-lg border border-[#DDE0EA] bg-white px-4 text-sm outline-none placeholder:text-[#98A2B3] focus:border-[#5B56E8] focus:ring-2 focus:ring-[#EEF0FF]"
                            />
                        </div>

                        {/* Terms */}
                        <label className="flex items-start gap-3 cursor-pointer">

                            <input
                                type="checkbox"
                                checked={accepted}
                                onChange={(event) => setAccepted(event.target.checked)}
                                className="mt-1 h-4 w-4 accent-[#5B56E8]"
                            />

                            <span className="text-xs leading-5 text-[#667085]">
                                I agree to the{' '}
                                <span className="font-semibold text-[#5B56E8]">
                                    Terms of Service
                                </span>{' '}
                                and{' '}
                                <span className="font-semibold text-[#5B56E8]">
                                    Privacy Policy
                                </span>.
                            </span>

                        </label>

                        {/* Button */}
                        <button
                            type="submit"
                            className="w-full h-11 rounded-lg bg-[#5B56E8] text-sm font-semibold text-white transition hover:bg-[#4D47D5]"
                        >
                            Create Account
                        </button>

                    </form>

                    {/* Login */}
                    <p className="mt-7 text-center text-sm text-[#667085]">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="font-semibold text-[#5B56E8] hover:underline"
                        >
                            Log in
                        </Link>
                    </p>

                </div>
            </div>

        </div>
    )
}

export default Register