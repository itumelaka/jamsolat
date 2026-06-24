import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import WaktuSolat from './WaktuSolat.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WaktuSolat />
  </StrictMode>,
)
