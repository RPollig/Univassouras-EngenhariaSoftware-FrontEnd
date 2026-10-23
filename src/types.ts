// Usuário logado (vem do DummyJSON em /auth/login e /auth/me)
export type Usuario = {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  image: string
}

// Contato do CRM (recurso /users do DummyJSON)
export type Contato = {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  image?: string
  company?: { name?: string; title?: string }
  address?: { city?: string; state?: string }
}

// O que o formulário envia para criar ou editar um contato
export type ContatoDados = Pick<Contato, 'firstName' | 'lastName' | 'email' | 'phone'> & {
  company: { name: string; title: string }
}

// Formato da lista que o DummyJSON devolve (a lista vem dentro de "users")
export type ListaContatos = {
  users: Contato[]
  total: number
  skip: number
  limit: number
}
