import './App.css'

function App() {
  return (
    <>
      <header className="cabecalho">
        <nav className="menu">
          <span className="logo">Portfólio Profissional</span>

          <div className="links-menu">
            <a href="#inicio">Início</a>
            <a href="#sobre">Sobre</a>
            <a href="#projetos">Projetos</a>
            <a href="#conteudo">Conteúdo</a>
            <a href="#contato">Contato</a>
          </div>
        </nav>
      </header>

      <main>
        <section id="inicio" className="inicio">
          <div className="inicio-conteudo">
            <p className="apresentacao">Olá, eu sou</p>

            <h1>Renan Pollig Ferreira</h1>

            <h2>
              Bacharel em Administração • Graduando em Engenharia de Software
            </h2>

            <p className="resumo">
              Tecnologia, desenvolvimento e experiência profissional na área financeira.
            </p>

            <a className="botao" href="#projetos">
              Ver projetos
            </a>
          </div>
        </section>

        <section id="sobre" className="secao sobre">
          <p className="titulo-menor">Minha trajetória</p>
          <h2>Sobre mim</h2>

          <div className="sobre-texto">
            <p>
              Sou bacharel em Administração e atualmente curso Engenharia de
              Software. Minha trajetória profissional foi construída
              principalmente na área financeira, incluindo experiência no
              setor bancário, onde trabalhei no Bradesco.
            </p>

            <p>
              Atualmente trabalho no setor financeiro da RX Lagos Imagem.
              Minha experiência em Administração e Finanças, somada aos
              conhecimentos que venho adquirindo em Engenharia de Software,
              me permite utilizar a tecnologia como apoio para diferentes
              atividades do dia a dia profissional.
            </p>

            <p>
              Entre essas atividades está a criação de dashboards, relatórios
              interativos e pequenas ferramentas a partir de informações
              extraídas dos sistemas utilizados no trabalho. Essas soluções
              ajudam na organização, visualização e análise dos dados.
            </p>

            <p>
              Busco continuar unindo minha experiência na área financeira aos
              conhecimentos de programação, desenvolvimento de software e
              análise de dados, aplicando tecnologia na solução de problemas
              reais.
            </p>
          </div>

          <div className="sobre-informacoes">
            <div className="informacao">
              <span>Formação</span>
              <strong>Bacharel em Administração</strong>
            </div>

            <div className="informacao">
              <span>Graduação atual</span>
              <strong>Engenharia de Software</strong>
            </div>

            <div className="informacao">
              <span>Experiência</span>
              <strong>Setor Bancário e Área Financeira</strong>
            </div>

            <div className="informacao">
              <span>Áreas de interesse</span>
              <strong>Finanças, Desenvolvimento e Dados</strong>
            </div>
          </div>
        </section>

        <section id="projetos" className="secao projetos">
          <p className="titulo-menor">Na prática</p>
          <h2>Projetos e experiências</h2>

          <div className="cards">
            <article className="card">
              <span className="numero-card">01</span>
              <p className="tipo-card">Projeto acadêmico</p>

              <h3>Viva Mulher</h3>

              <p>
                Projeto desenvolvido durante a graduação, envolvendo
                planejamento, organização e aplicação prática dos
                conhecimentos adquiridos no curso de Engenharia de Software.
              </p>
            </article>

            <article className="card">
              <span className="numero-card">02</span>
              <p className="tipo-card">Front-End</p>

              <h3>Laboratório de Front-End</h3>

              <p>
                Atividades desenvolvidas com React, TypeScript, Vite, Git e
                GitHub durante a disciplina de Laboratório de Programação
                Front-End.
              </p>
            </article>

            <article className="card">
              <span className="numero-card">03</span>
              <p className="tipo-card">Tecnologia aplicada</p>

              <h3>Dashboards e Relatórios</h3>

              <p>
                Aplicação de tecnologia para transformar informações e
                relatórios em dashboards e ferramentas interativas,
                facilitando a visualização e análise de dados.
              </p>
            </article>
          </div>
        </section>

        <section id="conteudo" className="secao midia">
          <p className="titulo-menor">Conteúdo</p>
          <h2>Um pouco sobre mim e meu aprendizado</h2>

          <p className="texto-midia">
            Um espaço para complementar minha apresentação e compartilhar um
            pouco da minha trajetória acadêmica e profissional.
          </p>

          <div className="midia-conteudo">
            <div className="midia-item">
              <img
                src="/foto-renan.jpg"
                alt="Foto de Renan Pollig Ferreira"
              />

              <p>Renan Pollig Ferreira</p>
            </div>

            <div className="midia-item video">
              <video controls>
                <source src="/video-portfolio.mp4" type="video/mp4" />
                Seu navegador não suporta vídeo.
              </video>

              <p>Apresentação em vídeo do portfólio.</p>
            </div>
          </div>
        </section>

        <section id="contato" className="secao contato">
          <p className="titulo-menor">Vamos conversar</p>
          <h2>Contato</h2>

          <p className="texto-contato">
            Estes são meus principais canais de contato e perfis profissionais.
          </p>

          <div className="contatos">
            <a href="mailto:renanpolligferreira@gmail.com">
              <span>E-mail</span>
              renanpolligferreira@gmail.com
            </a>

            <a href="tel:+5521981917742">
              <span>Telefone</span>
              (21) 98191-7742
            </a>

            <a
              href="https://github.com/RPollig"
              target="_blank"
              rel="noreferrer"
            >
              <span>GitHub</span>
              @RPollig
            </a>

            <a
              href="https://www.linkedin.com/in/renan-pollig-1011585b"
              target="_blank"
              rel="noreferrer"
            >
              <span>LinkedIn</span>
              Perfil profissional
            </a>
          </div>
        </section>
      </main>

      <footer>
        <p>Renan Pollig Ferreira</p>
        <span>
          Engenharia de Software • Laboratório de Programação Front-End • 2026
        </span>
      </footer>
    </>
  )
}

export default App