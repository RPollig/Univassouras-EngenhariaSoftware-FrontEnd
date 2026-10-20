import { ListaPrecos } from './components/ListaPrecos'
import { DestinosWiki } from './components/DestinosWiki'
import { Tarefas } from './components/Tarefas'
import { TesteErro } from './components/TesteErro'
import { destinos } from './data/destinos'
import { imagens } from './data/imagens'

// Estado derivado também no topo: menor preço com reduce
const menorPreco = destinos.reduce((menor, d) => Math.min(menor, d.preco), Infinity)

export default function App() {
  return (
    <>
      <nav className="nav">
        <a href="#topo" className="marca">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2.5 19h19M3 12.5l4.5 1.2L10 10 5 5.5l2-.8 7 3.5 4.5-1.6c1.3-.4 2.6.2 2.9 1.2.3 1-.5 2.1-1.8 2.5L7 14.6 3 12.5Z" />
          </svg>
          FlyNow
        </a>
        <div className="nav-links">
          <a href="#destinos">Destinos</a>
          <a href="#explorar">Explorar</a>
          <a href="#planejar">Planejar</a>
        </div>
        <span className="tag">Aula 8</span>
      </nav>

      <header className="hero" id="topo" style={{ backgroundImage: `url(${imagens.hero})` }}>
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

      <footer className="rodape">
        <div>
          <strong>FlyNow</strong> · Aula 8 · DOM · HOF · Axios · useEffect
        </div>
        <div>
          Renan Pollig · Profa. Laís Cristine Bordallo Pinheiro · Engenharia de Software ·
          Universidade de Vassouras
        </div>
        <small>Fotos: Wikimedia Commons · Dados: Wikipedia REST e DummyJSON</small>
      </footer>
    </>
  )
}
