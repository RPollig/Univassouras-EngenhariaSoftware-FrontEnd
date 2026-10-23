import { useAuth } from '../contexts/AuthContext'

export default function Painel() {
  const { usuario } = useAuth()
  return (
    <main className="pagina">
      <h1>Olá, {usuario?.firstName}</h1>
    </main>
  )
}
