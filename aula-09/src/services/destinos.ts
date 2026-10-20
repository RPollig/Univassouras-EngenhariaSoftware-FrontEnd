import { wiki } from './http'
import type { Destino } from '../types'

const TITULOS = ['Rio_de_Janeiro', 'Lisbon', 'Tokyo']

// A Wikipedia manda a miniatura com 330px; pedimos a versão de 960px
function fotoMaior(url?: string) {
  return url?.split('?')[0].replace(/\/\d+px-/, '/960px-')
}

// GET: busca o resumo de cada destino na Wikipedia, todos ao mesmo tempo
export async function listarDestinos(): Promise<Destino[]> {
  const respostas = await Promise.all(
    TITULOS.map((t) => wiki.get(`/page/summary/${t}`)),
  )

  return respostas.map(({ data }) => ({
    id: data.title,
    nome: data.title,
    resumo: data.extract,
    descricao: data.description,
    imagem: fotoMaior(data.thumbnail?.source),
  }))
}
