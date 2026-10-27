import axios from 'axios'

// Fala com a Wikipedia (destinos do FlyNow)
export const wiki = axios.create({
  baseURL: import.meta.env.VITE_WIKI_URL,
  timeout: 10000, // 10 s sem resposta = erro (evita "Carregando…" eterno)
})

// Fala com o DummyJSON (API de treino: cria/edita/apaga "de mentirinha")
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
})

// Interceptor de request (só na api, nunca na wiki): carimba o token em todo pedido
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('flynow.token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config // sem este return o pedido não sai
})

// O AuthContext registra aqui o que fazer quando a sessão vence (logout)
let aoExpirar: (() => void) | null = null
export function registrarAoExpirar(fn: (() => void) | null) {
  aoExpirar = fn
}

// Interceptor de response: 401 fora do login = sessão vencida → logout
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const ehLogin = String(err.config?.url).includes('/auth/login') // senha errada não desloga
    if (axios.isAxiosError(err) && err.response?.status === 401 && !ehLogin) {
      aoExpirar?.()
    }
    return Promise.reject(err) // o erro continua para o catch da tela
  },
)
