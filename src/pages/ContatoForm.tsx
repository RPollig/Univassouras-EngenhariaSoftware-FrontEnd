import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useContatosLocais } from '../contexts/ContatosLocaisContext'
import { atualizarContato, buscarContato, criarContato } from '../services/contatos'
import { ehNaoEncontrado, mensagemDeErro } from '../utils/erros'
import type { Contato, ContatoDados } from '../types'

// Os campos do formulário (tudo texto, como vem dos inputs)
type Campos = {
  firstName: string
  lastName: string
  email: string
  phone: string
  empresa: string
  cargo: string
}
type Erros = Partial<Record<keyof Campos, string>>

const VAZIO: Campos = { firstName: '', lastName: '', email: '', phone: '', empresa: '', cargo: '' }

// Validação fora do componente: fácil de ler e de testar
function validar(c: Campos): Erros {
  const erros: Erros = {}
  if (c.firstName.trim().length < 2) erros.firstName = 'Escreve o nome (pelo menos 2 letras).'
  if (c.lastName.trim().length < 2) erros.lastName = 'Escreve o sobrenome (pelo menos 2 letras).'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email.trim())) erros.email = 'E-mail inválido. Ex.: ana@email.com'
  const digitos = c.phone.replace(/\D/g, '')
  if (c.phone.trim() && digitos.length < 8) erros.phone = 'Telefone com pelo menos 8 números.'
  return erros
}

function paraCampos(c: Contato): Campos {
  return {
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.email,
    phone: c.phone ?? '',
    empresa: c.company?.name ?? '',
    cargo: c.company?.title ?? '',
  }
}

function paraDados(c: Campos): ContatoDados {
  return {
    firstName: c.firstName.trim(),
    lastName: c.lastName.trim(),
    email: c.email.trim(),
    phone: c.phone.trim(),
    company: { name: c.empresa.trim(), title: c.cargo.trim() },
  }
}

export default function ContatoForm() {
  const { id: idDaUrl } = useParams() // existe só na rota /contatos/:id/editar
  const editando = idDaUrl !== undefined
  const id = Number(idDaUrl)
  const navigate = useNavigate()
  const { buscarLocal, foiExcluido, ehLocal, registrarCriado, registrarEditado } = useContatosLocais()

  const [campos, setCampos] = useState<Campos>(VAZIO)
  const [original, setOriginal] = useState<Contato | null>(null)
  const [erros, setErros] = useState<Erros>({})
  const [erroEnvio, setErroEnvio] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [loading, setLoading] = useState(editando)
  const [erroCarga, setErroCarga] = useState<string | null>(null)
  const [naoExiste, setNaoExiste] = useState(false)

  const local = editando ? buscarLocal(id) : undefined
  const excluido = editando && foiExcluido(id)

  // Modo edição: carrega o contato para preencher os campos
  useEffect(() => {
    if (!editando) return
    async function carregar() {
      setLoading(true)
      setErroCarga(null)
      if (!Number.isInteger(id) || id <= 0 || excluido) {
        setNaoExiste(true)
        setLoading(false)
        return
      }
      if (local) {
        setOriginal(local)
        setCampos(paraCampos(local))
        setLoading(false)
        return
      }
      try {
        const contato = await buscarContato(id)
        setOriginal(contato)
        setCampos(paraCampos(contato))
      } catch (err) {
        if (ehNaoEncontrado(err)) setNaoExiste(true)
        else setErroCarga(mensagemDeErro(err))
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [editando, id, local, excluido])

  // Um onChange só para todos os campos: usa o "name" do input
  function mudar(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setCampos((atual) => ({ ...atual, [name]: value }))
  }

  async function aoEnviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault() // sem isso a página recarrega
    const encontrados = validar(campos)
    setErros(encontrados)
    if (Object.keys(encontrados).length > 0) return // não envia nada

    const dados = paraDados(campos)
    setErroEnvio(null)
    setEnviando(true) // botão desabilitado: sem clique duplo
    try {
      if (editando && original) {
        // contato criado só no app: a API não o conhece (daria 404), então não chama
        if (!ehLocal(original.id)) {
          await atualizarContato(original.id, dados) // 1º a API…
        }
        registrarEditado({ ...original, ...dados }) // …depois o estado local
        navigate(`/contatos/${original.id}`, { state: { aviso: 'Alterações salvas.' } })
      } else {
        const resposta = await criarContato(dados)
        const novo = registrarCriado({ ...resposta, ...dados })
        navigate('/contatos', { state: { aviso: `Contato “${novo.firstName} ${novo.lastName}” criado.` } })
      }
    } catch (err) {
      setErroEnvio(mensagemDeErro(err)) // o que foi digitado continua no formulário
    } finally {
      setEnviando(false)
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
        <p className="apoio">Não dá para editar um contato que não existe.</p>
        <Link to="/contatos" className="botao">
          Voltar para a lista
        </Link>
      </main>
    )
  }

  if (erroCarga) {
    return (
      <main className="pagina estado">
        <p role="alert" className="aviso erro">
          {erroCarga}
        </p>
        <Link to="/contatos" className="botao botao-sec">
          Voltar para a lista
        </Link>
      </main>
    )
  }

  // Monta cada campo com label, input e mensagem de erro (evita repetir o mesmo JSX 6 vezes)
  function campo(nome: keyof Campos, rotulo: string, tipo = 'text', autoComplete = 'off') {
    const erro = erros[nome]
    return (
      <div className="campo">
        <label htmlFor={nome}>{rotulo}</label>
        <input
          id={nome}
          name={nome}
          type={tipo}
          value={campos[nome]}
          onChange={mudar}
          disabled={enviando}
          autoComplete={autoComplete}
          aria-invalid={erro !== undefined}
          aria-describedby={erro ? `${nome}-erro` : undefined}
        />
        {erro && (
          <span id={`${nome}-erro`} className="erro-campo">
            {erro}
          </span>
        )}
      </div>
    )
  }

  return (
    <main className="pagina">
      <Link to={editando ? `/contatos/${id}` : '/contatos'} className="voltar">
        ← Voltar
      </Link>

      <form onSubmit={aoEnviar} className="cartao formulario" noValidate>
        <h1>{editando ? 'Editar contato' : 'Novo contato'}</h1>

        <div className="grade-campos">
          {campo('firstName', 'Nome *', 'text', 'given-name')}
          {campo('lastName', 'Sobrenome *', 'text', 'family-name')}
          {campo('email', 'E-mail *', 'email', 'email')}
          {campo('phone', 'Telefone', 'tel', 'tel')}
          {campo('empresa', 'Empresa', 'text', 'organization')}
          {campo('cargo', 'Cargo', 'text', 'organization-title')}
        </div>

        <p className="sutil">* obrigatório</p>

        {erroEnvio && (
          <p role="alert" className="aviso erro">
            {erroEnvio}
          </p>
        )}

        <div className="acoes">
          <button type="submit" className="botao" disabled={enviando}>
            {enviando ? 'Salvando…' : editando ? 'Salvar alterações' : 'Cadastrar contato'}
          </button>
          <Link to={editando ? `/contatos/${id}` : '/contatos'} className="botao botao-sec">
            Cancelar
          </Link>
        </div>
      </form>
    </main>
  )
}
