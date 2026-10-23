import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useContatosLocais } from '../contexts/ContatosLocaisContext'
import { buscarContato, excluirContato } from '../services/contatos'
import { ehNaoEncontrado, mensagemDeErro } from '../utils/erros'
import type { Contato } from '../types'

export default function ContatoDetalhe() {
  const { id: idDaUrl } = useParams() // /contatos/7 → "7" (sempre texto)
  const id = Number(idDaUrl)
  const navigate = useNavigate()
  const location = useLocation()
  const avisoSucesso = (location.state as { aviso?: string } | null)?.aviso // ex.: "Alterações salvas."
  const { buscarLocal, foiExcluido, ehLocal, registrarExcluido } = useContatosLocais()

  const [contato, setContato] = useState<Contato | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [naoExiste, setNaoExiste] = useState(false)
  const [tentativa, setTentativa] = useState(0)
  const [excluindo, setExcluindo] = useState(false)
  const [aviso, setAviso] = useState<string | null>(null)

  // Valores locais calculados fora do efeito (entram nas dependências)
  const local = buscarLocal(id) // criado/editado neste app (a API não conhece a versão nova)
  const excluido = foiExcluido(id) // excluído neste app

  useEffect(() => {
    async function carregar() {
      setLoading(true)
      setErro(null)
      setNaoExiste(false)
      // id inválido ou já excluído: "não encontrado"
      if (!Number.isInteger(id) || id <= 0 || excluido) {
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
        setContato(await buscarContato(id))
      } catch (err) {
        if (ehNaoEncontrado(err)) setNaoExiste(true)
        else setErro(mensagemDeErro(err))
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [id, tentativa, local, excluido])

  async function excluir() {
    if (!contato) return
    const nome = `${contato.firstName} ${contato.lastName}`
    if (!window.confirm(`Excluir o contato “${nome}”? Essa ação não pode ser desfeita.`)) return

    setAviso(null)
    setExcluindo(true)
    try {
      // contato criado só no app: a API não o conhece (daria 404), então não chama
      if (!ehLocal(contato.id)) {
        await excluirContato(contato.id) // 1º a API…
      }
      registrarExcluido(contato.id) // …depois o estado local
      navigate('/contatos', { replace: true, state: { aviso: `Contato “${nome}” excluído.` } })
    } catch (err) {
      setAviso(mensagemDeErro(err)) // deu erro: a tela não muda e mostra o motivo
    } finally {
      setExcluindo(false)
    }
  }

  if (loading) {
    return (
      <main className="pagina estado" aria-live="polite">
        <span className="girando" aria-hidden="true" />
        <p>Carregando contato…</p>
      </main>
    )
  }

  if (naoExiste) {
    return (
      <main className="pagina estado">
        <h1>Contato não encontrado</h1>
        <p className="apoio">Ele não existe ou foi removido.</p>
        <Link to="/contatos" className="botao">
          Voltar para a lista
        </Link>
      </main>
    )
  }

  if (erro || !contato) {
    return (
      <main className="pagina estado">
        <p role="alert" className="aviso erro">
          {erro ?? 'Não foi possível carregar o contato.'}
        </p>
        <button type="button" className="botao" onClick={() => setTentativa((n) => n + 1)}>
          Tentar de novo
        </button>
      </main>
    )
  }

  return (
    <main className="pagina">
      <Link to="/contatos" className="voltar">
        ← Contatos
      </Link>

      {avisoSucesso && (
        <p role="status" className="aviso sucesso">
          {avisoSucesso}
        </p>
      )}

      <article className="cartao detalhe">
        <div className="detalhe-topo">
          {contato.image ? (
            <img src={contato.image} alt="" className="avatar avatar-xg" width={88} height={88} />
          ) : (
            <span className="avatar avatar-xg avatar-letra" aria-hidden="true">
              {contato.firstName.charAt(0)}
            </span>
          )}
          <div>
            <h1>
              {contato.firstName} {contato.lastName}
            </h1>
            {contato.company?.title && <p className="sutil">{contato.company.title}</p>}
          </div>
        </div>

        <dl className="dados">
          <dt>E-mail</dt>
          <dd>
            <a href={`mailto:${contato.email}`}>{contato.email}</a>
          </dd>
          <dt>Telefone</dt>
          <dd>{contato.phone || '—'}</dd>
          <dt>Empresa</dt>
          <dd>{contato.company?.name || '—'}</dd>
          <dt>Cidade</dt>
          <dd>
            {contato.address?.city
              ? `${contato.address.city}${contato.address.state ? ` · ${contato.address.state}` : ''}`
              : '—'}
          </dd>
        </dl>

        {aviso && (
          <p role="alert" className="aviso erro">
            {aviso}
          </p>
        )}

        <div className="acoes">
          <Link to={`/contatos/${contato.id}/editar`} className="botao">
            Editar
          </Link>
          <button type="button" className="botao botao-perigo" onClick={excluir} disabled={excluindo}>
            {excluindo ? 'Excluindo…' : 'Excluir'}
          </button>
        </div>
      </article>
    </main>
  )
}
