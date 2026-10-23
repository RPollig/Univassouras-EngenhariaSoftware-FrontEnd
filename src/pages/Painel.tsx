import { useAuth } from '../contexts/AuthContext'

export default function Painel() {
  const { usuario, logout } = useAuth()
  return (
    <main className="pagina">
      <h1>Olá, {usuario?.firstName}</h1>
      <button type="button" className="botao" onClick={logout}>
        Sair
      </button>
    </main>
  )
}
