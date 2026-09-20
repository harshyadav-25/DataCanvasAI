function StateMessage({
  type = 'empty',
  title,
  message,
  actionLabel,
  onAction,
}) {
  const states = {
    loading: {
      icon: (
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      ),
      title: title || 'Loading...',
      container: 'border-white/10 bg-white/5',
      titleColor: 'text-white',
      messageColor: 'text-white',
    },

    empty: {
      icon: (
        <svg
          className="h-7 w-7 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M7 3h8l4 4v14H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
          <path d="M15 3v5h4" />
          <path d="M8 12h8" />
          <path d="M8 16h8" />
        </svg>
      ),
      title: title || 'No data available',
      container: 'border-dashed border-white/20 bg-white/5',
      titleColor: 'text-white',
      messageColor: 'text-white',
    },

    error: {
      icon: (
        <svg
          className="h-7 w-7 text-red-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v5" />
          <path d="M12 16.5v.5" />
        </svg>
      ),
      title: title || 'Something went wrong',
      container: 'border-red-400/30 bg-red-400/10',
      titleColor: 'text-red-300',
      messageColor: 'text-white',
    },

    warning: {
      icon: (
        <svg
          className="h-7 w-7 text-yellow-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 3l9 16H3L12 3z" />
          <path d="M12 9v4" />
          <path d="M12 16v.5" />
        </svg>
      ),
      title: title || 'Warning',
      container: 'border-yellow-400/30 bg-yellow-400/10',
      titleColor: 'text-yellow-300',
      messageColor: 'text-white',
    },

    success: {
      icon: (
        <svg
          className="h-7 w-7 text-green-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M8.5 12l2.2 2.2 4.8-5" />
        </svg>
      ),
      title: title || 'Completed',
      container: 'border-green-400/30 bg-green-400/10',
      titleColor: 'text-green-300',
      messageColor: 'text-white',
    },

    running: {
      icon: (
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-[#8D89FF]" />
      ),
      title: title || 'Running',
      container: 'border-[#756BFF]/30 bg-[#756BFF]/10',
      titleColor: 'text-[#A69CFF]',
      messageColor: 'text-white',
    },
  }

  const currentState = states[type] || states.empty

  return (
    <div
      className={`rounded-2xl border p-8 text-center ${currentState.container}`}
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
        {currentState.icon}
      </div>

      <h2
        className={`text-lg font-semibold ${currentState.titleColor}`}
      >
        {currentState.title}
      </h2>

      {message && (
        <p
          className={`mx-auto mt-2 max-w-xl text-sm leading-6 ${currentState.messageColor}`}
        >
          {message}
        </p>
      )}

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white/90"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default StateMessage