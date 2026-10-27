import { Link } from 'react-router-dom'

// Peças de tela reaproveitadas pelos estados "carregando", "erro" e "não encontrado"

export function Carregando({ texto }: { texto: string }) {
  return (
    <div className="estado" aria-live="polite">
      <span className="girando" aria-hidden="true" />
      <p>{texto}</p>
    </div>
  )
}

export function ErroComTentativa({ mensagem, aoTentar }: { mensagem: string; aoTentar: () => void }) {
  return (
    <div className="estado">
      <p role="alert" className="aviso erro">
        {mensagem}
      </p>
      <button type="button" className="botao" onClick={aoTentar}>
        Tentar de novo
      </button>
    </div>
  )
}

export function ContatoNaoEncontrado() {
  return (
    <div className="estado">
      <h1>Contato não encontrado</h1>
      <p className="apoio">Ele não existe ou foi removido.</p>
      <Link to="/contatos" className="botao">
        Voltar para a lista
      </Link>
    </div>
  )
}
