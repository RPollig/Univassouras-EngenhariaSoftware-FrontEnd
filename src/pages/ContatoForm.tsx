import { Link, useNavigate, useParams } from 'react-router-dom'
import { Carregando, ContatoNaoEncontrado, ErroComTentativa } from '../components/Estados'
import FormularioContato from '../components/FormularioContato'
import { useContatosLocais } from '../contexts/ContatosLocaisContext'
import { useContato } from '../hooks/useContato'
import { atualizarContato, criarContato } from '../services/contatos'
import type { ContatoDados } from '../types'

// Uma página, duas rotas: /contatos/novo (criar) e /contatos/:id/editar (editar)
export default function ContatoForm() {
  const { id: idDaUrl } = useParams() // existe só na rota de edição
  const editando = idDaUrl !== undefined
  const navigate = useNavigate()
  const { ehLocal, registrarCriado, registrarEditado } = useContatosLocais()

  // Na edição, carrega o contato; no "novo", passa null e não carrega nada
  const { contato, loading, erro, naoExiste, tentarDeNovo } = useContato(editando ? Number(idDaUrl) : null)

  // C — criar: 1º a API, depois o estado local, depois volta para a lista
  async function criar(dados: ContatoDados) {
    const resposta = await criarContato(dados)
    const novo = registrarCriado({ ...resposta, ...dados })
    navigate('/contatos', { state: { aviso: `Contato “${novo.firstName} ${novo.lastName}” criado.` } })
  }

  // U — editar: contato criado só no app não vai para a API (ela responderia 404)
  async function editar(dados: ContatoDados) {
    if (!contato) return
    if (!ehLocal(contato.id)) {
      await atualizarContato(contato.id, dados)
    }
    registrarEditado({ ...contato, ...dados })
    navigate(`/contatos/${contato.id}`, { state: { aviso: 'Alterações salvas.' } })
  }

  if (!editando) {
    return (
      <main className="pagina">
        <Link to="/contatos" className="voltar">
          ← Voltar
        </Link>
        <FormularioContato
          titulo="Novo contato"
          textoBotao="Cadastrar contato"
          voltarPara="/contatos"
          aoSalvar={criar}
        />
      </main>
    )
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
      <Link to={`/contatos/${contato.id}`} className="voltar">
        ← Voltar
      </Link>
      {/* key: se trocar de contato, o formulário recomeça com os dados certos */}
      <FormularioContato
        key={contato.id}
        titulo="Editar contato"
        textoBotao="Salvar alterações"
        inicial={contato}
        voltarPara={`/contatos/${contato.id}`}
        aoSalvar={editar}
      />
    </main>
  )
}
