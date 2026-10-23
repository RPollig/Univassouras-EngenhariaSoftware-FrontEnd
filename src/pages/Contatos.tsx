import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import ContatoCard from '../components/ContatoCard'
import { useContatosLocais } from '../contexts/ContatosLocaisContext'
import { listarContatos, POR_PAGINA } from '../services/contatos'
import { mensagemDeErro } from '../utils/erros'
import type { Contato } from '../types'

export default function Contatos() {
  const { criados, aplicar } = useContatosLocais()
  const location = useLocation()
  const aviso = (location.state as { aviso?: string } | null)?.aviso // ex.: "Contato excluído"

  const [busca, setBusca] = useState('') // o que está digitado (muda a cada tecla)
  const [termo, setTermo] = useState('') // o que foi buscado (depois da pausa)
  const [pagina, setPagina] = useState(0)
  const [contatos, setContatos] = useState<Contato[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [tentativa, setTentativa] = useState(0) // muda no "Tentar de novo"

  // Debounce: só busca 400 ms depois que a pessoa para de digitar
  useEffect(() => {
    const timer = setTimeout(() => {
      setTermo(busca.trim())
      setPagina(0)
    }, 400)
    return () => clearTimeout(timer) // cada tecla cancela o timer anterior
  }, [busca])

  // Carrega a página atual (roda ao abrir e quando termo, página ou tentativa mudam)
  useEffect(() => {
    const controller = new AbortController()
    async function carregar() {
      setLoading(true)
      setErro(null)
      try {
        const resultado = await listarContatos(termo, pagina, controller.signal)
        setContatos(resultado.contatos)
        setTotal(resultado.total)
      } catch (err) {
        if (axios.isCancel(err)) return // pedido antigo cancelado de propósito
        setErro(mensagemDeErro(err))
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    carregar()
    return () => controller.abort() // resposta velha não sobrescreve a nova
  }, [termo, pagina, tentativa])

  // Contatos criados no app aparecem no topo da 1ª página (filtrados pela busca)
  const t = termo.toLowerCase()
  const novos =
    pagina === 0
      ? criados.filter((c) =>
          `${c.firstName} ${c.lastName} ${c.email}`.toLowerCase().includes(t),
        )
      : []
  const visiveis = aplicar(contatos) // estado derivado: tira excluídos, troca editados
  const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA))

  return (
    <main className="pagina">
      <div className="cabecalho-pagina">
        <h1>Contatos</h1>
        <Link to="/contatos/novo" className="botao">
          + Novo contato
        </Link>
      </div>

      {aviso && (
        <p role="status" className="aviso sucesso">
          {aviso}
        </p>
      )}

      <div className="busca">
        <label htmlFor="busca">Buscar por nome ou e-mail</label>
        <input
          id="busca"
          type="search"
          value={busca}
          placeholder="Ex.: Emily"
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="estado" aria-live="polite">
          <span className="girando" aria-hidden="true" />
          <p>Carregando contatos…</p>
        </div>
      ) : erro ? (
        <div className="estado">
          <p role="alert" className="aviso erro">
            {erro}
          </p>
          <button type="button" className="botao" onClick={() => setTentativa((n) => n + 1)}>
            Tentar de novo
          </button>
        </div>
      ) : novos.length === 0 && visiveis.length === 0 ? (
        <div className="estado">
          <p>
            {termo ? `Nenhum contato encontrado para “${termo}”.` : 'Nenhum contato cadastrado ainda.'}
          </p>
          <Link to="/contatos/novo" className="botao botao-sec">
            Cadastrar contato
          </Link>
        </div>
      ) : (
        <>
          <p className="sutil">
            {total} contato(s) na API{termo && ` para “${termo}”`}
            {novos.length > 0 && ` · ${novos.length} criado(s) agora`}
          </p>
          <ul className="lista-contatos">
            {novos.map((c) => (
              <ContatoCard key={c.id} contato={c} novo />
            ))}
            {visiveis.map((c) => (
              <ContatoCard key={c.id} contato={c} />
            ))}
          </ul>
          {totalPaginas > 1 && (
            <nav className="paginacao" aria-label="Páginas">
              <button
                type="button"
                className="botao botao-sec"
                disabled={pagina === 0}
                onClick={() => setPagina((p) => p - 1)}
              >
                Anterior
              </button>
              <span>
                Página {pagina + 1} de {totalPaginas}
              </span>
              <button
                type="button"
                className="botao botao-sec"
                disabled={pagina + 1 >= totalPaginas}
                onClick={() => setPagina((p) => p + 1)}
              >
                Próxima
              </button>
            </nav>
          )}
        </>
      )}
    </main>
  )
}
