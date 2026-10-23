import axios from 'axios'

export const CHAVE_TOKEN = 'crm.token'

// Única instância que conversa com a API (baseURL vem do .env)
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000, // 10 s sem resposta = erro (evita "Carregando…" eterno)
})

// Interceptor de request: carimba o token em todo pedido
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(CHAVE_TOKEN)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config // sem este return o pedido não sai
})

// O Context registra aqui o que fazer quando a sessão vence (logout)
let aoExpirar: (() => void) | null = null
export function registrarAoExpirar(fn: (() => void) | null) {
  aoExpirar = fn
}

// Interceptor de response: 401 fora do login = sessão vencida → logout
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const ehLogin = String(err.config?.url).includes('/auth/login')
    if (axios.isAxiosError(err) && err.response?.status === 401 && !ehLogin) {
      aoExpirar?.()
    }
    return Promise.reject(err) // o erro continua para o catch da tela
  },
)
