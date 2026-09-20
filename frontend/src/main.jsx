import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AnalysisProvider } from './context/AnalysisContext.jsx'

createRoot(document.getElementById('root')).render(
  <AnalysisProvider>
    <App />
  </AnalysisProvider>,
)