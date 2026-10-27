import { useEffect, useState } from 'react'
import { useContatosLocais } from '../contexts/ContatosLocaisContext'
import { buscarContato } from '../services/contatos'
import { ehNaoEncontrado, mensagemDeErro } from '../utils/erros'
import type { Contato } from '../types'

/*
  Hook customizado (como o useAuth da Aula 9): junta num lugar só a lógica de
  "carregar UM contato" que o Detalhe e o Formulário de edição usam.
  - id inválido ou excluído no app → naoExiste
  - criado/editado no app → usa a versão local (a API não conhece)
  - senão → GET /users/{id}; 404 vira naoExiste, outros erros viram mensagem
  Passe null quando não há nada para carregar (ex.: formulário de "novo").
*/
export function useContato(id: number | null) {
  const { buscarLocal, foiExcluido } = useContatosLocais()

  const [contato, setContato] = useState<Contato | null>(null)
  const [loading, setLoading] = useState(id !== null)
  const [erro, setErro] = useState<string | null>(null)
  const [naoExiste, setNaoExiste] = useState(false)
  const [tentativa, setTentativa] = useState(0)

  // Calculados fora do efeito e usados como dependência (as funções do Context
  // mudam a cada render; usá-las direto no array faria o efeito rodar em loop)
  const local = id !== null ? buscarLocal(id) : undefined
  const excluido = id !== null && foiExcluido(id)

  useEffect(() => {
    if (id === null) return
    const idValido = id
    async function carregar() {
      setLoading(true)
      setErro(null)
      setNaoExiste(false)
      if (!Number.isInteger(idValido) || idValido <= 0 || excluido) {
        setNaoExiste(true)
        setLoading(false)
        return
      }
      if (local) {
        setContato(local)
        setLoading(false)
        return
      }
      try {
        setContato(await buscarContato(idValido))
      } catch (err) {
        if (ehNaoEncontrado(err)) setNaoExiste(true)
        else setErro(mensagemDeErro(err))
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [id, tentativa, local, excluido])

  function tentarDeNovo() {
    setTentativa((n) => n + 1)
  }

  return { contato, loading, erro, naoExiste, tentarDeNovo }
}
