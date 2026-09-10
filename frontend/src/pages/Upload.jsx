import { useState } from 'react'
import { uploadDataset } from '../services/api'

function Upload() {
  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]

    if (selectedFile) {
      setFile(selectedFile)
      setError('')
      setResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setError('')
    setResult(null)

    try {
      const data = await uploadDataset(file)

      setResult(data)
    } catch (err) {
      if (err.response?.data?.error?.message) {
        setError(err.response.data.error.message)
      } else {
        setError('Unable to upload dataset. Please try again.')
      }
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900">
        Upload Dataset
      </h2>

      <p className="mt-2 text-gray-600">
        Upload a CSV or Excel dataset to start your analysis.
      </p>

      <div className="mt-8 max-w-2xl">
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">

          <div className="text-5xl mb-4">📂</div>

          <h3 className="text-xl font-semibold text-gray-900">
            Upload your dataset
          </h3>

          <p className="mt-2 text-gray-500">
            CSV or XLSX files are supported
          </p>

          <label className="inline-block mt-6 cursor-pointer">
            <span className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
              Choose File
            </span>

            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {file && (
            <>
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="font-medium text-blue-900">
                  Selected file
                </p>

                <p className="mt-1 text-sm text-blue-700">
                  {file.name}
                </p>
              </div>

              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="mt-5 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 transition"
              >
                {isUploading ? 'Uploading...' : 'Upload Dataset'}
              </button>
            </>
          )}

          {error && (
            <div className="mt-5 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">
                {error}
              </p>
            </div>
          )}

          {result && (
            <div className="mt-5 bg-green-50 border border-green-200 rounded-lg p-4 text-left">
              <p className="font-semibold text-green-800">
                Dataset uploaded successfully!
              </p>

              <p className="mt-2 text-sm text-green-700">
                File: {result.filename}
              </p>

              <p className="text-sm text-green-700">
                Rows: {result.rows}
              </p>

              <p className="text-sm text-green-700">
                Columns: {result.columns}
              </p>

              <p className="text-sm text-green-700 break-all">
                Dataset ID: {result.dataset_id}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Upload