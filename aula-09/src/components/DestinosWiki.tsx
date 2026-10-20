import { useEffect, useState } from 'react'
import { listarDestinos } from '../services/destinos'
import type { Destino } from '../types'

// BLOCO 4 — useEffect: carregar ao abrir, com carregando / erro / vazio / lista
export function DestinosWiki() {
  const [destinos, setDestinos] = useState<Destino[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await listarDestinos()
        setDestinos(dados)
      } catch {
        setErro('Não deu pra carregar. Tenta de novo.')
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [])

  return (
    <section className="secao" id="explorar">
      <header className="secao-topo">
        <div>
          <span className="sobretitulo">Blocos 3 e 4 · Axios GET · useEffect</span>
          <h2>Sobre os destinos</h2>
        </div>
        <span className="fonte">Fonte: Wikipedia REST</span>
      </header>
      {conteudo()}
    </section>
  )

  // Ordem: carregando → erro → lista vazia → lista
  function conteudo() {
    if (loading) {
      return (
        <div className="grade-wiki" aria-busy="true">
          <p className="sr-only">Carregando…</p>
          {[1, 2, 3].map((n) => (
            <div key={n} className="wiki-card esqueleto" />
          ))}
        </div>
      )
    }
    if (erro) return <p role="alert" className="aviso erro">{erro}</p>
    if (destinos.length === 0) return <p className="vazio">Nenhum destino ainda.</p>
    return (
      <ul className="grade-wiki">
        {destinos.map((d) => (
          <li key={d.id} className="wiki-card">
            {d.imagem && <img src={d.imagem} alt={d.nome} loading="lazy" />}
            <div className="wiki-texto">
              {d.descricao && <span className="local">{d.descricao}</span>}
              <h3>{d.nome}</h3>
              <p>{d.resumo}</p>
            </div>
          </li>
        ))}
      </ul>
    )
  }
}
