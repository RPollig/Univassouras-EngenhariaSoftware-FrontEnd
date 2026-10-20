import { useEffect, useState } from 'react'
import { destinos } from '../data/destinos'

const formatar = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

// BLOCO 2 — HOF: filter, reduce e map com estado derivado
export function ListaPrecos() {
  // Único estado obrigatório do bloco: o interruptor
  const [soBaratos, setSoBaratos] = useState(false)

  // Desafios A e B (opcionais no material)
  const [ordenar, setOrdenar] = useState(false)
  const [busca, setBusca] = useState('')

  // Estado derivado: calculado a cada render, nada disso fica no estado
  const filtrados = soBaratos
    ? destinos.filter((d) => d.preco <= 650)
    : destinos

  const termo = busca.trim().toLowerCase()
  const buscados = filtrados.filter((d) => d.nome.toLowerCase().includes(termo))

  // Ordena uma CÓPIA, nunca o array original
  const visiveis = ordenar
    ? [...buscados].sort((a, b) => a.preco - b.preco)
    : buscados

  // reduce sempre com valor inicial 0
  const total = visiveis.reduce((soma, d) => soma + d.preco, 0)

  // Ponte com o Bloco 1: o título da aba é DOM, quem mexe nele é o efeito
  useEffect(() => {
    document.title = `${visiveis.length} destinos`
  }, [visiveis.length])

  return (
    <section className="secao" id="destinos">
      <header className="secao-topo">
        <div>
          <span className="sobretitulo">Bloco 2 · filter · map · reduce</span>
          <h2>Minha lista de destinos</h2>
        </div>
        <div className="resumo" aria-live="polite">
          <strong>{visiveis.length}</strong> {visiveis.length === 1 ? 'destino' : 'destinos'}
          <span className="ponto" />
          total <strong>{formatar(total)}</strong>
        </div>
      </header>

      <div className="barra">
        <div className="chips">
          <button
            className={soBaratos ? 'chip ativo' : 'chip'}
            onClick={() => setSoBaratos(!soBaratos)}
          >
            {soBaratos ? 'Mostrar todos' : 'Só até R$ 650'}
          </button>
          <button
            className={ordenar ? 'chip ativo' : 'chip'}
            onClick={() => setOrdenar(!ordenar)}
          >
            {ordenar ? 'Ordem original' : 'Ordenar por preço'}
          </button>
        </div>
        <label className="busca">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            placeholder="Buscar por nome…"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </label>
      </div>

      {visiveis.length === 0 ? (
        <p className="vazio">Nenhum destino combina com essa busca.</p>
      ) : (
        <ul className="grade-destinos">
          {visiveis.map((d) => (
            <li key={d.id} className="destino">
              <img src={d.imagem} alt={`Vista de ${d.nome}`} loading="lazy" />
              {d.preco <= 650 && <span className="selo">Até R$ 650</span>}
              <div className="destino-info">
                <span className="local">{d.local}</span>
                <h3>{d.nome}</h3>
                <span className="preco">
                  <small>passagem</small> {formatar(d.preco)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
