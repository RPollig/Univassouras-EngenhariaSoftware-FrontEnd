import type { Desejo } from '../types'

type Props = {
  desejo: Desejo
  ocupado: boolean
  aoAlternar: (d: Desejo) => void
  aoExcluir: (d: Desejo) => void
}

// Uma linha da lista: recebe dados e funções por props, sem estado próprio
export default function DesejoItem({ desejo, ocupado, aoAlternar, aoExcluir }: Props) {
  return (
    <li className={desejo.completed ? 'desejo feito' : 'desejo'}>
      <label>
        <input
          type="checkbox"
          checked={desejo.completed}
          disabled={ocupado}
          onChange={() => aoAlternar(desejo)}
        />
        <span>{desejo.todo}</span>
      </label>
      <button
        type="button"
        className="botao-excluir"
        disabled={ocupado}
        onClick={() => aoExcluir(desejo)}
        aria-label={`Excluir ${desejo.todo}`}
      >
        Excluir
      </button>
    </li>
  )
}
