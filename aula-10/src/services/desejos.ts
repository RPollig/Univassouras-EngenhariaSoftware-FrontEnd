import { api } from './http'
import type { Desejo } from '../types'

// O DummyJSON devolve a lista DENTRO de "todos", com números de paginação
type ListaDesejos = { todos: Desejo[]; total: number; skip: number; limit: number }

// R — ler: os desejos de quem está logado(a)
export async function listarDesejos(userId: number): Promise<Desejo[]> {
  const { data } = await api.get<ListaDesejos>(`/todos/user/${userId}`)
  return data.todos
}

// C — criar (a API só simula: responde 201, mas não grava)
export async function criarDesejo(todo: string, userId: number): Promise<Desejo> {
  const { data } = await api.post<Desejo>('/todos/add', {
    todo,
    completed: false,
    userId,
  })
  return data
}
