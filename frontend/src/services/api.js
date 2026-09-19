import axios from 'axios'

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    'http://127.0.0.1:8000',

  timeout: 30000,
})

// =====================================================
// NORMALIZE API ERROR
// =====================================================

export const getApiErrorMessage = (error) => {
  // Backend returned structured error
  if (error?.response?.data?.error?.message) {
    return error.response.data.error.message
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

  try {
    const response = await API.post('/upload', formData)

    return response.data
  } catch (error) {
    // Keep original Axios error so existing Upload.jsx
    // error handling continues to work.

    error.userMessage = getApiErrorMessage(error)

    throw error
  }
}

export default API