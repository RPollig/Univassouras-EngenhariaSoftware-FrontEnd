import { ListaPrecos } from '../components/ListaPrecos'
import { DestinosWiki } from '../components/DestinosWiki'
import { Tarefas } from '../components/Tarefas'
import { TesteErro } from '../components/TesteErro'
import { destinos } from '../data/destinos'
import { imagens } from '../data/imagens'

// Estado derivado também no topo: menor preço com reduce
const menorPreco = destinos.reduce((menor, d) => Math.min(menor, d.preco), Infinity)

// Aula 9: o conteúdo que era do App.tsx (aula 8) virou a página "/"
export default function Destinos() {
  return (
    <>
      <header className="hero" style={{ backgroundImage: `url(${imagens.hero})` }}>
        <div className="hero-conteudo">
          <span className="sobretitulo claro">Laboratório de Programação Front End · 2026.2</span>
          <h1>FlyNow — Minha Lista de Viagem</h1>
          <p className="hero-texto">
            DOM, funções de alta ordem, Axios e useEffect aplicados a um roteiro de viagem de
            verdade.
          </p>
          <dl className="hero-numeros">
            <div>
              <dt>Destinos</dt>
              <dd>{destinos.length}</dd>
            </div>
            <div>
              <dt>A partir de</dt>
              <dd>R$ {menorPreco}</dd>
            </div>
            <div>
              <dt>APIs</dt>
              <dd>2</dd>
            </div>
          </dl>
        </div>
        <span className="credito">Pão de Açúcar, Rio de Janeiro · Wikimedia Commons</span>
      </header>

      <main className="conteudo">
        <ListaPrecos />
        <DestinosWiki />

        <section className="secao" id="planejar">
          <header className="secao-topo">
            <div>
              <span className="sobretitulo">Bloco 3 · Axios</span>
              <h2>Planejamento</h2>
            </div>
          </header>
          <div className="grade-planejar">
            <Tarefas />
            <TesteErro />
          </div>
        </section>
      </main>
    </>
  )
}
