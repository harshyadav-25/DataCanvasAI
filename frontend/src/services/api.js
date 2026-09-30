import axios from 'axios'
import { getHistoryStorageKey, recordApiActivity } from './history'

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    'http://127.0.0.1:8000',

  timeout: 30000,
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('datacanvas_access_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('datacanvas_access_token')
      localStorage.removeItem('datacanvas_auth')
    }

    return Promise.reject(error)
  },
)

// =====================================================
// NORMALIZE API ERROR
// =====================================================

export const getApiErrorMessage = (error) => {
  // Backend returned structured error
  if (error?.response?.data?.error?.message) {
    return error.response.data.error.message
  }
  if (typeof error?.response?.data?.detail === 'string') {
    return error.response.data.detail
  }

  // Backend returned simple message
  if (error?.response?.data?.message) {
    return error.response.data.message
  }

  // Request timed out
  if (error?.code === 'ECONNABORTED') {
    return 'The request took too long. Please try again.'
  }

  // Backend/server is not reachable
  if (!error?.response) {
    return 'Unable to connect to the backend server. Please make sure the server is running.'
  }

  // Generic fallback
  return 'Unable to complete the request. Please try again.'
}

// =====================================================
// UPLOAD DATASET
// =====================================================

export const uploadDataset = async (file) => {
  const formData = new FormData()

  formData.append('file', file)
  const historyStorageKey = getHistoryStorageKey()

  try {
    const response = await API.post('/upload', formData)

    recordApiActivity({
      storageKey: historyStorageKey,
      url: '/upload',
      response: response.data,
      status: 'Completed',
    })
    return response.data
  } catch (error) {
    // Keep original Axios error so existing Upload.jsx
    // error handling continues to work.

    error.userMessage = getApiErrorMessage(error)
    recordApiActivity({
      storageKey: historyStorageKey,
      url: '/upload',
      response: { filename: file.name },
      status: 'Failed',
      errorMessage: error.userMessage,
    })

    throw error
  }
}

  export const signup = async (payload) => {
    try {
      const response = await API.post('/auth/signup', payload)
      return response.data
    } catch (error) {
      error.userMessage = getApiErrorMessage(error)
      throw error
    }
  }

  export const login = async ({ email, password }) => {
    const formData = new URLSearchParams()
    formData.append('username', email)
    formData.append('password', password)

    try {
      const response = await API.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      return response.data
    } catch (error) {
      error.userMessage = getApiErrorMessage(error)
      throw error
    }
  }

  export const getCurrentUser = async () => {
    try {
      const response = await API.get('/auth/me')
      return response.data
    } catch (error) {
      error.userMessage = getApiErrorMessage(error)
      throw error
    }
  }

  const request = async (method, url, options = {}) => {
    const historyStorageKey = getHistoryStorageKey()
    try {
      const response = await API.request({ method, url, ...options })
      recordApiActivity({
        storageKey: historyStorageKey,
        url,
        options,
        response: response.data,
        status: 'Completed',
      })
      return response.data
    } catch (error) {
      error.userMessage = getApiErrorMessage(error)
      recordApiActivity({
        storageKey: historyStorageKey,
        url,
        options,
        status: 'Failed',
        errorMessage: error.userMessage,
      })
      throw error
    }
  }

  export const analyzeProfiling = (datasetId) =>
    request('post', `/profiling/analyze/${datasetId}`)

  export const analyzeRisks = (datasetId, targetColumn) =>
    request('post', `/risks/analyze/${datasetId}`, {
      params: { target_column: targetColumn },
    })

  export const generateRecommendations = (risks) =>
    request('post', '/recommendations/generate', { data: risks })

  export const analyzePreprocessing = (datasetId, targetColumn) =>
    request('post', `/preprocessing/analyze/${datasetId}`, {
      params: { target_column: targetColumn },
    })

  export const runSimulation = (datasetId, payload) =>
    request('post', `/simulation/run/${datasetId}`, { data: payload })

  export const analyzeReadiness = (datasetId, targetColumn) =>
    request('post', `/readiness/analyze/${datasetId}`, {
      params: { target_column: targetColumn },
    })

  export const compareExperiments = ({
    datasetId,
    targetColumn,
    problemType,
    modelNames = [],
    identifierColumns = [],
    nSplits = 3,
    bypassCache = false,
  }) => {
    // Axios serialises repeated params correctly when value is an array
    const params = {
      target_column: targetColumn,
      problem_type: problemType,
      n_splits: nSplits,
      bypass_cache: bypassCache,
    }

    // Only append array params when they are non-empty, so FastAPI
    // receives no param at all (and falls back to defaults) vs []
    if (modelNames.length > 0) {
      params.model_names = modelNames
    }
    if (identifierColumns.length > 0) {
      params.identifier_columns = identifierColumns
    }

    return request('post', `/experiments/compare/${datasetId}`, {
      params,
      paramsSerializer: {
        indexes: null,
      },
      timeout: 120000, // 2 minutes — do NOT increase global timeout
    })
  }

  export const generatePipeline = (payload) =>
    request('post', '/pipeline/generate', { data: payload })

  export const generateReport = (datasetId, targetColumn) =>
    request('post', `/reports/generate/${datasetId}`, {
      params: { target_column: targetColumn },
    })

  export const analyzeVisualization = (datasetId, targetColumn) =>
    request('post', `/visualization/analyze/${datasetId}`, {
      params: targetColumn ? { target_column: targetColumn } : {},
    })

  export const trainModel = ({
    datasetId,
    targetColumn,
    problemType,
    modelName,
    identifierColumns = [],
    nSplits = 2,
  }) =>
    request('post', `/modeling/train/${datasetId}`, {
      params: {
        target_column: targetColumn,
        problem_type: problemType,
        model_name: modelName,
        identifier_columns: identifierColumns,
        n_splits: nSplits,
      },
    })
export default API

// =====================================================
// VALIDATION
// =====================================================

export const analyzeValidation = async ({
  datasetId,
  targetColumn,
  problemType,
  identifierColumns = [],
  modelNames = [],
  nSplits = 3,
}) => {
  const url = `/validation/analyze/${datasetId}`
  const options = {
    params: {
      target_column: targetColumn,
      problem_type: problemType,
      identifier_columns: identifierColumns,
      model_names: modelNames,
      n_splits: nSplits,
    },
    paramsSerializer: { indexes: null },
    timeout: 120000,
  }
  const historyStorageKey = getHistoryStorageKey()
  try {
    const response = await API.post(
      url,
      null,
      options,
    )

    recordApiActivity({
      storageKey: historyStorageKey,
      url,
      options,
      response: response.data,
      status: 'Completed',
    })
    return response.data
  } catch (error) {
    error.userMessage = getApiErrorMessage(error)
    recordApiActivity({
      storageKey: historyStorageKey,
      url,
      options,
      status: 'Failed',
      errorMessage: error.userMessage,
    })
    throw error
  }
}