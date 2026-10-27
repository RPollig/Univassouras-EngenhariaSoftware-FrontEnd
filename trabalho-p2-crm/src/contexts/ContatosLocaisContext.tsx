import { createContext, useContext, useRef, useState, type ReactNode } from 'react'
import type { Contato } from '../types'

/*
  O DummyJSON só SIMULA criar, editar e excluir: responde "deu certo", mas não grava.
  Este Context guarda as mudanças feitas no app (o "estado local") e as aplica
  por cima do que a API devolve. Assim a lista atualiza depois de salvar,
  mesmo trocando de tela. (No F5 as mudanças somem: é o limite da API de treino.)
*/

type ContatosLocaisValue = {
  criados: Contato[]
  aplicar: (lista: Contato[]) => Contato[]
  buscarLocal: (id: number) => Contato | undefined
  foiExcluido: (id: number) => boolean
  ehLocal: (id: number) => boolean
  registrarCriado: (contato: Contato) => Contato
  registrarEditado: (contato: Contato) => void
  registrarExcluido: (id: number) => void
}

const ContatosLocaisContext = createContext<ContatosLocaisValue | null>(null)

export function ContatosLocaisProvider({ children }: { children: ReactNode }) {
  const [criados, setCriados] = useState<Contato[]>([])
  const [editados, setEditados] = useState<Record<number, Contato>>({})
  const [excluidos, setExcluidos] = useState<number[]>([])

  // O DummyJSON devolve o MESMO id para todo contato novo; geramos um id local único
  const proximoId = useRef(100000)

  function ehLocal(id: number) {
    return criados.some((c) => c.id === id)
  }

  function foiExcluido(id: number) {
    return excluidos.includes(id)
  }

  // Lista da API → tira os excluídos e troca os editados (sem mutar: filter + map)
  function aplicar(lista: Contato[]) {
    return lista.filter((c) => !excluidos.includes(c.id)).map((c) => editados[c.id] ?? c)
  }

  function buscarLocal(id: number) {
    return criados.find((c) => c.id === id) ?? editados[id]
  }

  function registrarCriado(contato: Contato) {
    proximoId.current += 1
    const novo = { ...contato, id: proximoId.current }
    setCriados((lista) => [novo, ...lista])
    return novo
  }

  function registrarEditado(contato: Contato) {
    if (ehLocal(contato.id)) {
      setCriados((lista) => lista.map((c) => (c.id === contato.id ? contato : c)))
    } else {
      setEditados((atual) => ({ ...atual, [contato.id]: contato }))
    }
  }

  function registrarExcluido(id: number) {
    if (ehLocal(id)) {
      setCriados((lista) => lista.filter((c) => c.id !== id))
    } else {
      setExcluidos((lista) => [...lista, id])
    }
  }

  return (
    <ContatosLocaisContext.Provider
      value={{
        criados,
        aplicar,
        buscarLocal,
        foiExcluido,
        ehLocal,
        registrarCriado,
        registrarEditado,
        registrarExcluido,
      }}
    >
      {children}
    </ContatosLocaisContext.Provider>
  )
}

export function useContatosLocais() {
  const ctx = useContext(ContatosLocaisContext)
  if (!ctx) {
    throw new Error('useContatosLocais precisa estar dentro de <ContatosLocaisProvider>')
  }
  return ctx
}
