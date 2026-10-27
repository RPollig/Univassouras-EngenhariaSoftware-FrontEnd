import axios from 'axios'
import { api } from './http'
import type { Tarefa } from '../types'

// POST: cria uma tarefa no DummyJSON (ele simula, não grava de verdade)
export async function criarTarefa(todo: string): Promise<Tarefa> {
  const { data } = await api.post('/todos/add', {
    todo,
    completed: false,
    userId: 1,
  })
  return data
}

// GET de propósito numa rota de erro, para treinar a leitura do status
export async function testarErro(): Promise<string> {
  try {
    await api.get('/404/nao-achei')
    return 'Não deu erro (inesperado).'
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log(err.response?.status, err.response?.data)
      const status = err.response?.status ?? 'sem resposta'
      const corpo = err.response?.data
      // Se a API devolver JSON, mostra; se devolver uma página HTML, só avisa
      const detalhe =
        typeof corpo === 'object' && corpo !== null
          ? JSON.stringify(corpo)
          : corpo
            ? 'a API respondeu com uma página HTML'
            : err.message
      return `Status ${status} — ${detalhe}`
    }
    console.log('erro inesperado', err)
    return 'Erro inesperado (veja o console).'
  }
}
