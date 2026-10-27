import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { login as loginApi, me } from '../services/auth'
import { CHAVE_TOKEN, registrarAoExpirar } from '../services/http'
import type { Usuario } from '../types'

type AuthValue = {
  usuario: Usuario | null
  token: string | null
  carregando: boolean
  login: (username: string, senha: string) => Promise<void>
  logout: () => void
}

// 1) o canal
const AuthContext = createContext<AuthValue | null>(null)

// 2) o Provider: guarda quem está logado e espalha para o app todo
export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(true)

  async function login(username: string, senha: string) {
    const dados = await loginApi(username, senha)
    localStorage.setItem(CHAVE_TOKEN, dados.accessToken) // só o texto do token
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

  // useCallback: a mesma função entre renders (o interceptor guarda esta referência)
  const logout = useCallback(() => {
    localStorage.removeItem(CHAVE_TOKEN)
    setToken(null)
    setUsuario(null)
  }, [])

  // Ao abrir o app: tem token salvo? Pergunta à API se ainda vale
  useEffect(() => {
    const salvo = localStorage.getItem(CHAVE_TOKEN)
    if (!salvo) {
      setCarregando(false)
      return
    }
    me(salvo)
      .then((u) => {
        setToken(salvo)
        setUsuario(u)
      })
      .catch(() => localStorage.removeItem(CHAVE_TOKEN)) // token vencido ou adulterado
      .finally(() => setCarregando(false))
  }, [])

  // Sessão vencida (401 em qualquer pedido) → o interceptor chama o logout
  useEffect(() => {
    registrarAoExpirar(logout)
    return () => registrarAoExpirar(null)
  }, [logout])

  return (
    <AuthContext.Provider value={{ usuario, token, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// 3) o hook customizado
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth precisa estar dentro de <AuthProvider>')
  }
  return ctx
}
