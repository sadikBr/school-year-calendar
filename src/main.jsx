import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Callendar from './Callendar.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Callendar />
  </StrictMode>,
)
