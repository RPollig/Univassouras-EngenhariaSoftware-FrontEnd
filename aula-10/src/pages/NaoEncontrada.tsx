import { Link } from 'react-router-dom'

export default function NaoEncontrada() {
  return (
    <main className="tela-cheia nao-encontrada">
      <span className="codigo">404</span>
      <h1>404 — essa sala não existe</h1>
      <p className="apoio">O endereço digitado não combina com nenhuma rota do FlyNow.</p>
      <Link to="/" className="botao">
        Voltar ao início
      </Link>
    </main>
  )
}
