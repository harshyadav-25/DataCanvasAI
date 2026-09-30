const HISTORY_KEY_PREFIX = 'datacanvas_activity_history'

const operationLabels = [
  ['/upload', 'Dataset upload'],
  ['/profiling/analyze/', 'Profiling'],
  ['/risks/analyze/', 'Risk analysis'],
  ['/recommendations/generate', 'Recommendations'],
  ['/preprocessing/analyze/', 'Preprocessing analysis'],
  ['/simulation/run/', 'Simulation'],
  ['/readiness/analyze/', 'Readiness analysis'],
  ['/experiments/compare/', 'Experiment comparison'],
  ['/pipeline/generate', 'Pipeline generation'],
  ['/reports/generate/', 'Report generation'],
  ['/visualization/analyze/', 'Visualization'],
  ['/modeling/train/', 'Model training'],
  ['/validation/analyze/', 'Model validation'],
]

export function getHistoryStorageKey() {
  const token = localStorage.getItem('datacanvas_access_token')
  const tokenPayload = token?.split('.')[1]

  if (!tokenPayload) {
    return `${HISTORY_KEY_PREFIX}_local`
  }

  try {
    const base64 = tokenPayload.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(base64))
    const userId = typeof payload.sub === 'string' ? payload.sub : 'local'
    return `${HISTORY_KEY_PREFIX}_${userId}`
  } catch (error) {
    console.error('Unable to identify the history owner from the access token:', error)
    return `${HISTORY_KEY_PREFIX}_local`
  }
}

function parseStoredObject(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '{}')
  } catch (error) {
    console.error(`Unable to read ${key}:`, error)
    return {}
  }
}

export function loadActivityHistory(storageKey = getHistoryStorageKey()) {
  const stored = localStorage.getItem(storageKey)
  if (!stored) return []

  const history = JSON.parse(stored)
  if (!Array.isArray(history)) {
    throw new Error('Saved activity history is not a list.')
  }
  const normalizedHistory = history.map((item) => {
    if (item.operation !== 'Dataset upload') {
      if (item.source !== 'Backend response; recorded in this browser') return item
      return {
        ...item,
        source: 'Backend request/response; supplemental context from this browser',
      }
    }

    return {
      ...item,
      datasetId: item.status === 'Failed' ? '' : item.datasetId,
      targetColumn: '',
      problemType: '',
      source: 'Backend request/response; supplemental context from this browser',
    }
  })
  if (JSON.stringify(history) !== JSON.stringify(normalizedHistory)) {
    localStorage.setItem(storageKey, JSON.stringify(normalizedHistory))
  }
  return normalizedHistory
}

export function recordApiActivity({
  storageKey,
  url,
  options = {},
  response,
  status,
  errorMessage,
}) {
  const path = url.split('?')[0]
  const operation = operationLabels.find(([prefix]) => path.startsWith(prefix))?.[1]
  if (!operation) return

  const params = options.params || {}
  const body = options.data || {}
  const context = parseStoredObject('datacanvas_analysis_context')
  const isUpload = operation === 'Dataset upload'
  const datasetIdFromPath = path.match(/\/(?:analyze|compare|run|train)\/([^/]+)$/)?.[1]
  const datasetId = response?.dataset_id
    || (isUpload ? '' : datasetIdFromPath)
    || (isUpload ? '' : body.dataset_id)
    || (isUpload ? '' : context.datasetId)
    || ''
  const upload = parseStoredObject('datacanvas_upload_result')
  const filename = response?.filename
    || (upload.dataset_id === datasetId ? upload.filename : '')

  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    operation,
    operationType: path,
    datasetId,
    filename,
    targetColumn: isUpload
      ? ''
      : params.target_column || body.target_column || context.targetColumn || '',
    problemType: isUpload
      ? ''
      : params.problem_type || body.problem_type || context.problemType || '',
    modelName: params.model_name || body.model_name || response?.model_name || '',
    status,
    completedAt: new Date().toISOString(),
    source: 'Backend request/response; supplemental context from this browser',
    errorMessage: errorMessage || '',
  }

  try {
    const history = loadActivityHistory(storageKey)
    localStorage.setItem(storageKey, JSON.stringify([entry, ...history].slice(0, 100))
    )
  } catch (storageError) {
    console.error('Unable to save backend activity history:', storageError)
  }
}
