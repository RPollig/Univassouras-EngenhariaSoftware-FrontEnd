import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import { mensagemDeErro } from '../utils/erros'

// No login, 400/401 significa usuário ou senha errados
function mensagemDeLogin(err: unknown) {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status
    if (status === 400 || status === 401) return 'Usuário ou senha incorretos.'
  }
  return mensagemDeErro(err)
}

export default function Login() {
  const { login, usuario } = useAuth()
  const navigate = useNavigate()

  // Formulário controlado
  const [username, setUsername] = useState('')
  const [senha, setSenha] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault() // sem isso o navegador recarrega a página
    if (!username.trim() || !senha) {
      setErro('Preenche usuário e senha.')
      return
    }
    setErro(null)
    setEnviando(true)
    try {
      await login(username.trim(), senha)
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
    <main className="login">
      <form onSubmit={enviar} className="login-form cartao" noValidate>
        <div className="login-marca" aria-hidden="true">
          <img src="/favicon.svg" alt="" width={40} height={40} />
        </div>
        <h1>Entrar no CRM</h1>
        <p className="apoio">Gestão de contatos · use a conta de treino do DummyJSON.</p>

        <label htmlFor="username">Usuário</label>
        <input
          id="username"
          value={username}
          autoComplete="username"
          disabled={enviando}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="senha">Senha</label>
        <input
          id="senha"
          type="password"
          value={senha}
          autoComplete="current-password"
          disabled={enviando}
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
  )
}
