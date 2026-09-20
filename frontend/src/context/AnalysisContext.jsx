import { createContext, useContext, useMemo, useState } from 'react'

const STORAGE_KEY = 'datacanvas_analysis_context'
const AnalysisContext = createContext(null)

const readContext = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored
      ? JSON.parse(stored)
      : {
          datasetId: '',
          targetColumn: '',
          problemType: 'classification',
          identifierColumns: [],
        }
  } catch {
    return {
      datasetId: '',
      targetColumn: '',
      problemType: 'classification',
      identifierColumns: [],
    }
  }
}

export function AnalysisProvider({ children }) {
  const [analysis, setAnalysis] = useState(readContext)

  const updateAnalysis = (updates) => {
    setAnalysis((current) => {
      const next = { ...current, ...updates }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const clearAnalysis = () => {
    const next = {
      datasetId: '',
      targetColumn: '',
      problemType: 'classification',
      identifierColumns: [],
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setAnalysis(next)
  }

  const value = useMemo(
    () => ({ ...analysis, updateAnalysis, clearAnalysis }),
    [analysis],
  )

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAnalysis() {
  const context = useContext(AnalysisContext)

  if (!context) {
    throw new Error('useAnalysis must be used within AnalysisProvider')
  }

  return context
}
