import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { login as loginApi, me } from '../services/auth'
import type { Usuario } from '../types'

const CHAVE = 'flynow.token'

type AuthValue = {
  usuario: Usuario | null
  token: string | null
  carregando: boolean
  login: (username: string, senha: string) => Promise<void>
  logout: () => void
}

// 1) o canal (a "rede Wi-Fi")
const AuthContext = createContext<AuthValue | null>(null)

// 2) o Provider (o "roteador" que espalha o sinal para o app todo)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(true)

  async function login(username: string, senha: string) {
    const dados = await loginApi(username, senha)
    localStorage.setItem(CHAVE, dados.accessToken) // guarda só o texto do token
    setToken(dados.accessToken)
    setUsuario({
      id: dados.id,
      username: dados.username,
      email: dados.email,
      firstName: dados.firstName,
      lastName: dados.lastName,
      image: dados.image,
    })
  }

  function logout() {
    localStorage.removeItem(CHAVE)
    setToken(null)
    setUsuario(null)
  }

  // Ao abrir o app: tem token salvo? Pergunta à API se ainda vale
  useEffect(() => {
    const salvo = localStorage.getItem(CHAVE)
    if (!salvo) {
      setCarregando(false)
      return
    }
    me(salvo)
      .then((u) => {
        setToken(salvo)
        setUsuario(u)
      })
      .catch(() => localStorage.removeItem(CHAVE)) // token vencido ou adulterado
      .finally(() => setCarregando(false))
  }, [])

  return (
    <AuthContext.Provider value={{ usuario, token, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// 3) o hook customizado que "conecta no Wi-Fi"
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth precisa estar dentro de <AuthProvider>')
  }
  return ctx
}
