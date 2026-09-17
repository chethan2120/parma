import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

// The inline boot layer in index.html covers the gap between first paint and
// React mounting. PageCurtain renders above it and outlives it, so dropping it on
// the next frame is seamless.
requestAnimationFrame(() => {
  document.getElementById('boot-curtain')?.remove()
})
