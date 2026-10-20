import axios from 'axios'

// Fala com a Wikipedia (destinos do FlyNow)
export const wiki = axios.create({
  baseURL: import.meta.env.VITE_WIKI_URL,
})

// Fala com o DummyJSON (API de treino: cria/edita/apaga "de mentirinha")
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})
