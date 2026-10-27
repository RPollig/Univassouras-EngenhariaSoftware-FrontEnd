import { api } from './http'
import type { Usuario } from '../types'

// A resposta do login é o usuário + os tokens
export type LoginResposta = Usuario & {
  accessToken: string
  refreshToken: string
}

// POST /auth/login — não trata erro aqui: quem chamou decide a mensagem
export async function login(username: string, password: string) {
  const { data } = await api.post<LoginResposta>('/auth/login', {
    username,
    password,
    expiresInMins: 60,
  })
  return data
}

// GET /auth/me — "de quem é este token?"
export async function me(token: string) {
  const { data } = await api.get<Usuario>('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return data
}
