// Destino vindo da Wikipedia (Bloco 3 e 4)
export type Destino = {
  id: string
  nome: string
  resumo: string
  descricao?: string
  imagem?: string
}

// Destino da minha lista de viagem, com preço (Bloco 2 — HOF)
export type DestinoPreco = {
  id: string
  nome: string
  preco: number
  local: string
  imagem: string
}

// Tarefa criada no DummyJSON (Bloco 3 — POST)
export type Tarefa = {
  id: number
  todo: string
  completed: boolean
  userId: number
}
