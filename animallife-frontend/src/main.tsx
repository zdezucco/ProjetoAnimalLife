import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import './styles/color.css'
import Color from './Color'
import List from './list'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Color />
    <List />
  </StrictMode>,
)
