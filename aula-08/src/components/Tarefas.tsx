import { useState, type FormEvent } from 'react'
import axios from 'axios'
import { criarTarefa } from '../services/tarefas'
import type { Tarefa } from '../types'

// A chave local evita keys repetidas: o DummyJSON só simula e
// devolve o mesmo id para toda tarefa criada.
type TarefaLocal = Tarefa & { chave: string }

// BLOCO 3 — Axios: POST + estado novo sem mutar
export function Tarefas() {
  const [tarefas, setTarefas] = useState<TarefaLocal[]>([])
  const [texto, setTexto] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function adicionar(e: FormEvent) {
    e.preventDefault()
    if (!texto.trim()) return
    setSalvando(true)
    setErro(null)
    try {
      const nova = await criarTarefa(texto.trim())
      // Estado novo = array novo (nunca push)
      setTarefas([...tarefas, { ...nova, chave: `${nova.id}-${Date.now()}` }])
      setTexto('')
    } catch (err) {
      const status = axios.isAxiosError(err) ? err.response?.status : undefined
      setErro(`Não deu pra salvar${status ? ` (status ${status})` : ''}.`)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <article className="painel">
      <span className="sobretitulo">Bloco 3 · Axios POST</span>
      <h3>Checklist da viagem</h3>
      <p className="apoio">Cada item é enviado ao DummyJSON com POST /todos/add.</p>

      <form onSubmit={adicionar} className="form-tarefa">
        <input
          placeholder="Ex.: Revisar HOF"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
        <button type="submit" className="botao" disabled={salvando}>
          {salvando ? 'Salvando…' : 'Adicionar (POST)'}
        </button>
      </form>

      {erro && <p role="alert" className="aviso erro">{erro}</p>}

      {tarefas.length === 0 ? (
        <p className="vazio">Nenhuma tarefa ainda.</p>
      ) : (
        <ul className="lista-tarefas">
          {tarefas.map((t) => (
            <li key={t.chave}>
              <span className="check" aria-hidden="true" />
              <span>{t.todo}</span>
              <small>201 · id {t.id}</small>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
