import { api } from './http'
import type { Contato, ContatoDados, ListaContatos } from '../types'

// Só os campos que a tela usa (deixa a resposta mais leve)
const CAMPOS = 'firstName,lastName,email,phone,image,company,address'

export const POR_PAGINA = 10

// R — listar (com busca e paginação). Com texto usa /users/search?q=
export async function listarContatos(busca: string, pagina: number) {
  const termo = busca.trim()
  const rota = termo ? '/users/search' : '/users'
  const { data } = await api.get<ListaContatos>(rota, {
    params: {
      q: termo || undefined,
      limit: POR_PAGINA,
      skip: pagina * POR_PAGINA,
      select: CAMPOS,
    },
  })
  return { contatos: data.users, total: data.total } // a lista vem dentro de data.users
}

// R — total de contatos (para o painel)
export async function contarContatos() {
  const { data } = await api.get<ListaContatos>('/users', {
    params: { limit: 1, select: 'id' },
  })
  return data.total
}

// R — detalhe de um contato
export async function buscarContato(id: number) {
  const { data } = await api.get<Contato>(`/users/${id}`, { params: { select: CAMPOS } })
  return data
}

// C — criar (o DummyJSON só simula: responde com um id novo, mas não grava)
export async function criarContato(dados: ContatoDados) {
  const { data } = await api.post<Contato>('/users/add', dados)
  return data
}

// U — editar só os campos enviados
export async function atualizarContato(id: number, dados: ContatoDados) {
  const { data } = await api.patch<Contato>(`/users/${id}`, dados)
  return data
}

// D — excluir
export async function excluirContato(id: number): Promise<void> {
  await api.delete(`/users/${id}`)
}
