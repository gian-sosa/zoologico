import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { AuthProvider } from './features/auth/auth.context'

/** Deshabilita la descarga de imágenes mediante drag and drop en toda la web. */
document.addEventListener('dragstart', (event) => {
  if ((event.target as HTMLElement | null)?.tagName === 'IMG') {
    event.preventDefault()
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
