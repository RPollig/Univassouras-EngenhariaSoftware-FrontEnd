import { useAuth } from '../contexts/AuthContext'

export default function Desejos() {
  const { usuario } = useAuth()

  return (
    <main className="conteudo pagina">
      <span className="sobretitulo">Rota protegida · /desejos</span>
      <h1>Meus desejos de viagem</h1>
      <p className="apoio grande">
        {usuario?.firstName}, esta sala está em construção. Na aula 10 ela ganha o CRUD com
        /todos do DummyJSON: listar, criar, marcar como feito e excluir.
      </p>
      <div className="em-breve">
        <span>Em construção · aula 10</span>
      </div>
    </main>
  )
}
