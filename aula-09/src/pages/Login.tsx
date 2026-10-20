import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import { imagens } from '../data/imagens'

// Traduz o erro técnico em texto humano, por status
function mensagemDeLogin(err: unknown) {
  if (axios.isAxiosError(err)) {
    if (!err.response) return 'Sem conexão. Confere a internet e tenta de novo.'
    const status = err.response.status
    if (status === 400 || status === 401) return 'Usuário ou senha incorretos.'
    if (status >= 500) return 'O servidor está com problema. Tenta daqui a pouco.'
  }
  return 'Não foi possível entrar. Tenta de novo.'
}

export default function Login() {
  const { login, usuario } = useAuth()
  const navigate = useNavigate()

  // Formulário controlado: o estado é a fonte da verdade do que está digitado
  const [username, setUsername] = useState('')
  const [senha, setSenha] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault() // sem isso o navegador recarrega a página
    setErro(null)
    setEnviando(true)
    try {
      await login(username, senha)
      navigate('/', { replace: true }) // "voltar" não retorna ao login
    } catch (err) {
      setErro(mensagemDeLogin(err))
    } finally {
      setEnviando(false)
    }
  }

  // Já logado? Não precisa ver o formulário (vem depois de todos os hooks)
  if (usuario) return <Navigate to="/" replace />

  return (
    <div className="login">
      <aside className="login-foto" style={{ backgroundImage: `url(${imagens.aviao})` }}>
        <div className="login-marca">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2.5 19h19M3 12.5l4.5 1.2L10 10 5 5.5l2-.8 7 3.5 4.5-1.6c1.3-.4 2.6.2 2.9 1.2.3 1-.5 2.1-1.8 2.5L7 14.6 3 12.5Z" />
          </svg>
          FlyNow
        </div>
        <blockquote>
          Sua lista de viagem, protegida por login com token.
          <small>Aula 9 · Router · Context · JWT</small>
        </blockquote>
      </aside>

      <main className="login-lado">
        <form onSubmit={enviar} className="login-form">
          <span className="sobretitulo">Área restrita</span>
          <h1>Entrar no FlyNow</h1>
          <p className="apoio">Use a conta de treino do DummyJSON para acessar.</p>

          <label htmlFor="username">Usuário</label>
          <input
            id="username"
            value={username}
            autoComplete="username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            value={senha}
            autoComplete="current-password"
            onChange={(e) => setSenha(e.target.value)}
          />

          {erro && (
            <p role="alert" className="aviso erro">
              {erro}
            </p>
          )}

          <button type="submit" className="botao botao-largo" disabled={enviando}>
            {enviando ? 'Entrando…' : 'Entrar'}
          </button>

          <p className="dica">
            Conta de treino: <code>emilys</code> / <code>emilyspass</code>
          </p>
        </form>
      </main>
    </div>
  )
}
