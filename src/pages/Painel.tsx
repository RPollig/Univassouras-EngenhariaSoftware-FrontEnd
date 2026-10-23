import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ContatoCard from '../components/ContatoCard'
import { useAuth } from '../contexts/AuthContext'
import { useContatosLocais } from '../contexts/ContatosLocaisContext'
import { contarContatos, listarContatos } from '../services/contatos'
import { mensagemDeErro } from '../utils/erros'
import type { Contato } from '../types'

// Tela inicial depois do login: resumo + atalhos
export default function Painel() {
  const { usuario } = useAuth()
  const { criados, aplicar } = useContatosLocais()

  const [total, setTotal] = useState(0)
  const [recentes, setRecentes] = useState<Contato[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    async function carregar() {
      setLoading(true)
      setErro(null)
      try {
        // dois pedidos ao mesmo tempo
        const [quantos, primeira] = await Promise.all([contarContatos(), listarContatos('', 0)])
        setTotal(quantos)
        setRecentes(primeira.contatos)
      } catch (err) {
        setErro(mensagemDeErro(err))
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [tentativa])

  // Estado derivado: criados no app primeiro, depois os da API (sem excluídos/editados)
  const destaque = [...criados, ...aplicar(recentes)].slice(0, 4)
  const empresas = new Set(recentes.map((c) => c.company?.name).filter(Boolean)).size

  return (
    <main className="pagina">
      <div className="cabecalho-pagina">
        <div>
          <h1>Olá, {usuario?.firstName}!</h1>
          <p className="apoio">Este é o resumo da tua carteira de contatos.</p>
        </div>
        <Link to="/contatos/novo" className="botao">
          + Novo contato
        </Link>
      </div>

      {loading ? (
        <div className="estado" aria-live="polite">
          <span className="girando" aria-hidden="true" />
          <p>Carregando painel…</p>
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
      ) : (
        <>
          <section className="numeros" aria-label="Resumo">
            <div className="cartao numero">
              <span className="numero-valor">{total}</span>
              <span>contatos na API</span>
            </div>
            <div className="cartao numero">
              <span className="numero-valor">{criados.length}</span>
              <span>criados nesta sessão</span>
            </div>
            <div className="cartao numero">
              <span className="numero-valor">{empresas}</span>
              <span>empresas nos primeiros contatos</span>
            </div>
          </section>

          <section>
            <div className="cabecalho-pagina">
              <h2>Contatos em destaque</h2>
              <Link to="/contatos" className="link">
                Ver todos →
              </Link>
            </div>
            {destaque.length === 0 ? (
              <p className="estado">Nenhum contato ainda.</p>
            ) : (
              <ul className="lista-contatos">
                {destaque.map((c) => (
                  <ContatoCard key={c.id} contato={c} novo={criados.includes(c)} />
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  )
}
