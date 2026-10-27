import { Outlet } from 'react-router-dom'
import Header from './Header'

// Moldura das telas protegidas: menu em cima, página no meio (Outlet), rodapé embaixo
export default function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <footer className="rodape">
        CRM · Renan Pollig · Laboratório de Programação Front End · Univassouras 2026.2 · Dados:
        DummyJSON
      </footer>
    </>
  )
}
