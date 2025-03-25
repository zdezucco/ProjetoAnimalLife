import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import Color from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Color />
  </StrictMode>,
)
