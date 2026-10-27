import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Carregando, ContatoNaoEncontrado, ErroComTentativa } from '../components/Estados'
import { useContatosLocais } from '../contexts/ContatosLocaisContext'
import { useContato } from '../hooks/useContato'
import { excluirContato } from '../services/contatos'
import { mensagemDeErro } from '../utils/erros'

export default function ContatoDetalhe() {
  const { id: idDaUrl } = useParams() // /contatos/7 → "7" (sempre texto)
  const navigate = useNavigate()
  const location = useLocation()
  const avisoSucesso = (location.state as { aviso?: string } | null)?.aviso // ex.: "Alterações salvas."
  const { ehLocal, registrarExcluido } = useContatosLocais()

  // Carregar o contato (carregando / erro / 404) fica no hook useContato
  const { contato, loading, erro, naoExiste, tentarDeNovo } = useContato(Number(idDaUrl))

  const [excluindo, setExcluindo] = useState(false)
  const [aviso, setAviso] = useState<string | null>(null)

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
      <main className="pagina">
        <Carregando texto="Carregando contato…" />
      </main>
    )
  }

  if (naoExiste) {
    return (
      <main className="pagina">
        <ContatoNaoEncontrado />
      </main>
    )
  }

  if (erro || !contato) {
    return (
      <main className="pagina">
        <ErroComTentativa mensagem={erro ?? 'Não foi possível carregar o contato.'} aoTentar={tentarDeNovo} />
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
