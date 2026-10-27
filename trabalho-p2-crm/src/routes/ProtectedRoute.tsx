import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// A portaria: só deixa entrar quem está logado
export default function ProtectedRoute() {
  const { usuario, carregando } = useAuth()

  if (carregando) {
    return (
      <div className="tela-cheia">
        <span className="girando" aria-hidden="true" />
        <p>Verificando sessão…</p>
      </div>
    )
  }
  if (!usuario) return <Navigate to="/login" replace />
  return <Outlet />
}
