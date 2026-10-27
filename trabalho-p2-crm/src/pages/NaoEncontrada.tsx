import { Link } from 'react-router-dom'

export default function NaoEncontrada() {
  return (
    <main className="tela-cheia">
      <span className="codigo">404</span>
      <h1>Página não encontrada</h1>
      <p className="apoio">O endereço digitado não existe no CRM.</p>
      <Link to="/" className="botao">
        Voltar ao painel
      </Link>
    </main>
  )
}
