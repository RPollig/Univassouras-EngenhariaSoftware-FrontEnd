import { useState } from 'react'
import './App.css'

function App() {
  const [mensagem, setMensagem] = useState(
    'Clique no botão para testar o evento.'
  )

  function mudarMensagem() {
    setMensagem('O botão foi clicado!')
  }

  return (
    <main>
      <h1>Aula 04 - Fundamentos de Front-End</h1>

      <section>
        <h2>Eventos e estado no React</h2>

        <p>{mensagem}</p>

        <button onClick={mudarMensagem}>
          Clique aqui
        </button>
      </section>

      <section>
        <h2>Mídia</h2>

        <p>
          Nesta aula também estamos trabalhando com diferentes tipos de mídia
          dentro de uma aplicação web.
        </p>

        <img
          src="/vite.svg"
          alt="Imagem utilizada na atividade de mídia"
          className="imagem-aula"
        />
      </section>
    </main>
  )
}

export default App