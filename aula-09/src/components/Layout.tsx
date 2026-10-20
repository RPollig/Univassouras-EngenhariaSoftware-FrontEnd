import { Outlet } from 'react-router-dom'
import Header from './Header'

// Moldura das telas protegidas: menu em cima, página no meio, rodapé embaixo
export default function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <footer className="rodape">
        <div>
          <strong>FlyNow</strong> · Aulas 8 e 9 · DOM · HOF · Axios · useEffect · Router · Context ·
          Login
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
