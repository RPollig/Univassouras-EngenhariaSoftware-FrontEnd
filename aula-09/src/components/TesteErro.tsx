import { useState } from 'react'
import { testarErro } from '../services/tarefas'

// BLOCO 3 — Lendo um erro com err.response?.status
export function TesteErro() {
  const [resultado, setResultado] = useState<string | null>(null)
  const [testando, setTestando] = useState(false)

  async function lerErro() {
    setTestando(true)
    setResultado(await testarErro())
    setTestando(false)
  }

  return (
    <article className="painel painel-escuro">
      <span className="sobretitulo">Bloco 3 · Lendo um erro</span>
      <h3>Teste de erro 404</h3>
      <p className="apoio">GET /404/nao-achei no DummyJSON. O Axios cai no catch.</p>

      <div className="terminal" aria-live="polite">
        <div className="terminal-topo">
          <i /> <i /> <i /> <span>Console</span>
        </div>
        <code>
          <span className="prompt">&gt;</span> await api.get('/404/nao-achei')
          {'\n'}
          {testando && <span className="cinza">aguardando resposta…</span>}
          {!testando && resultado && <span className="status">{resultado}</span>}
          {!testando && !resultado && <span className="cinza">clique em “Testar erro 404”</span>}
        </code>
      </div>

      <button className="botao botao-claro" onClick={lerErro} disabled={testando}>
        Testar erro 404
      </button>
    </article>
  )
}
