import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ContatosLocaisProvider } from './contexts/ContatosLocaisContext'
import './index.css'
import App from './App.tsx'

// Ordem importa: BrowserRouter (URL) > AuthProvider (quem está logado) > ContatosLocais (mudanças feitas no app) > App
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ContatosLocaisProvider>
          <App />
        </ContatosLocaisProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
