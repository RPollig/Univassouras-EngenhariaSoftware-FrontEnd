import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { listarDesejos, criarDesejo, atualizarDesejo, excluirDesejo } from '../services/desejos'
import DesejoItem from '../components/DesejoItem'
import { mensagemDeErro } from '../utils/erros'
import type { Desejo } from '../types'

// Validação fora do componente: fácil de ler e de testar
function validar(valor: string): string | null {
  if (valor.length < 3) return 'Escreve pelo menos 3 letras.'
  if (valor.length > 80) return 'Máximo de 80 letras.'
  return null
}

export default function Desejos() {
  const { usuario } = useAuth()
  const userId = usuario?.id // vem do Context (aula 9)

  // R — os três estados de sempre
  const [desejos, setDesejos] = useState<Desejo[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [tentativa, setTentativa] = useState(0) // muda no botão "Tentar de novo"

  // C — formulário controlado
  const [texto, setTexto] = useState('')
  const [erroForm, setErroForm] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  // U e D — qual item está esperando a API (só ele fica desabilitado) e aviso da lista
  const [ocupado, setOcupado] = useState<number | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)

  // Ids que só existem no app (a API de treino não gravou): PATCH/DELETE neles dariam 404
  const idsLocais = useRef(new Set<number>())
  // O DummyJSON devolve o MESMO id para todo desejo novo; damos um id local único
  const proximoIdLocal = useRef(100000)

  // Ler (R): carrega os desejos de quem está logado(a)
  useEffect(() => {
    if (userId === undefined) return
    async function carregar(id: number) {
      setLoading(true)
      setErro(null)
      try {
        setDesejos(await listarDesejos(id))
      } catch (err) {
        setErro(mensagemDeErro(err))
      } finally {
        setLoading(false) // desliga o "Carregando…" nos dois caminhos
      }
    }
    carregar(userId)
  }, [userId, tentativa])

  // Criar (C): valida, faz o POST e entrega uma lista NOVA ao estado
  async function aoEnviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault() // sem isso a página recarrega
    const limpo = texto.trim()
    const aviso = validar(limpo)
    if (aviso) {
      setErroForm(aviso)
      return // nenhum pedido é feito
    }
    if (userId === undefined) return
    setErroForm(null)
    setEnviando(true) // botão desabilitado: sem clique duplo
    try {
      const criado = await criarDesejo(limpo, userId)
      proximoIdLocal.current += 1
      const novo = { ...criado, id: proximoIdLocal.current }
      idsLocais.current.add(novo.id) // anota: este só existe no app
      setDesejos((lista) => [...lista, novo]) // a API não grava: atualiza o estado local
      setTexto('')
    } catch (err) {
      setErroForm(mensagemDeErro(err))
    } finally {
      setEnviando(false)
    }
  }

  // Atualizar (U): marcar como feito — 1º a API, depois a tela
  async function alternar(d: Desejo) {
    setAviso(null)
    setOcupado(d.id)
    try {
      if (!idsLocais.current.has(d.id)) {
        await atualizarDesejo(d.id, { completed: !d.completed })
      }
      setDesejos((lista) =>
        lista.map((x) => (x.id === d.id ? { ...x, completed: !x.completed } : x)),
      )
    } catch (err) {
      setAviso(mensagemDeErro(err)) // a tela não muda e mostra o motivo
    } finally {
      setOcupado(null)
    }
  }

  // Excluir (D): confirma, chama a API e só depois tira da tela
  async function excluir(d: Desejo) {
    if (!window.confirm(`Excluir “${d.todo}”?`)) return
    setAviso(null)
    setOcupado(d.id)
    try {
      if (!idsLocais.current.has(d.id)) {
        await excluirDesejo(d.id)
      }
      setDesejos((lista) => lista.filter((x) => x.id !== d.id))
    } catch (err) {
      setAviso(mensagemDeErro(err))
    } finally {
      setOcupado(null)
    }
  }

  return (
    <main className="conteudo pagina desejos-pagina">
      <span className="sobretitulo">Rota protegida · /desejos · Aula 10</span>
      <h1>Meus desejos de viagem</h1>
      <p className="apoio grande">
        {usuario?.firstName}, anota aqui os lugares que tu quer conhecer.
      </p>

      <form onSubmit={aoEnviar} noValidate className="form-desejo">
        <label htmlFor="desejo">Novo desejo</label>
        <div className="form-desejo-linha">
          <input
            id="desejo"
            value={texto}
            placeholder="Ex.: Conhecer Lisboa"
            onChange={(e) => setTexto(e.target.value)}
            disabled={enviando}
            aria-invalid={erroForm !== null}
          />
          <button type="submit" className="botao" disabled={enviando}>
            {enviando ? 'Salvando…' : 'Adicionar'}
          </button>
        </div>
        {erroForm && (
          <p role="alert" className="aviso erro">
            {erroForm}
          </p>
        )}
      </form>

      {/* Ordem dos if: carregando → erro → vazio → lista */}
      {loading ? (
        <p className="estado">Carregando…</p>
      ) : erro ? (
        <div className="estado">
          <p role="alert" className="aviso erro">
            {erro}
          </p>
          <button type="button" className="botao" onClick={() => setTentativa((n) => n + 1)}>
            Tentar de novo
          </button>
        </div>
      ) : desejos.length === 0 ? (
        <p className="vazio">Nenhum desejo ainda. Que tal “Conhecer Lisboa”?</p>
      ) : (
        <>
          {aviso && (
            <p role="alert" className="aviso erro">
              {aviso}
            </p>
          )}
          <ul className="desejos">
            {desejos.map((d) => (
              <DesejoItem
                key={d.id}
                desejo={d}
                ocupado={ocupado === d.id}
                aoAlternar={alternar}
                aoExcluir={excluir}
              />
            ))}
          </ul>
        </>
      )}
    </main>
  )
}
