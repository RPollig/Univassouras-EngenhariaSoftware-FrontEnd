import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const classe = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'nav-link ativo' : 'nav-link'

export default function Header() {
  const { usuario, logout } = useAuth()

  return (
    <header className="nav">
      <NavLink to="/" end className="marca">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M2.5 19h19M3 12.5l4.5 1.2L10 10 5 5.5l2-.8 7 3.5 4.5-1.6c1.3-.4 2.6.2 2.9 1.2.3 1-.5 2.1-1.8 2.5L7 14.6 3 12.5Z" />
        </svg>
        FlyNow
      </NavLink>

      <nav className="nav-links">
        <NavLink to="/" end className={classe}>
          Destinos
        </NavLink>
        <NavLink to="/desejos" className={classe}>
          Desejos
        </NavLink>
      </nav>

      <div className="usuario">
        {usuario?.image && <img src={usuario.image} alt="" className="avatar" />}
        <span className="ola">Olá, {usuario?.firstName}</span>
        <button type="button" className="sair" onClick={logout}>
          Sair
        </button>
      </div>
    </header>
  )
}
