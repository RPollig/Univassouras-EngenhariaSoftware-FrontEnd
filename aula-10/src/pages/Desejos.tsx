import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { listarDesejos, criarDesejo } from '../services/desejos'
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

  // C — formulário controlado
  const [texto, setTexto] = useState('')
  const [erroForm, setErroForm] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  // Ler (R): carrega os desejos de quem está logado(a)
  useEffect(() => {
    if (userId === undefined) return
    async function carregar(id: number) {
      try {
        setDesejos(await listarDesejos(id))
      } catch (err) {
        setErro(mensagemDeErro(err))
      } finally {
        setLoading(false) // desliga o "Carregando…" nos dois caminhos
      }
    }
    carregar(userId)
  }, [userId])

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
      const novo = await criarDesejo(limpo, userId)
      setDesejos((lista) => [...lista, novo]) // a API não grava: atualiza o estado local
      setTexto('')
    } catch (err) {
      setErroForm(mensagemDeErro(err))
    } finally {
      setEnviando(false)
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
        <p role="alert" className="aviso erro">
          {erro}
        </p>
      ) : desejos.length === 0 ? (
        <p className="vazio">Nenhum desejo ainda. Que tal “Conhecer Lisboa”?</p>
      ) : (
        <ul className="desejos">
          {desejos.map((d) => (
            <li key={d.id} className={d.completed ? 'desejo feito' : 'desejo'}>
              <span>{d.todo}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
