import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const classe = ({ isActive }: { isActive: boolean }) => (isActive ? 'menu-link ativo' : 'menu-link')

// Menu do CRM: navegação + quem está logado + Sair
export default function Header() {
  const { usuario, logout } = useAuth()

  return (
    <header className="topo">
      <NavLink to="/" end className="marca">
        <img src="/favicon.svg" alt="" width={28} height={28} />
        CRM
      </NavLink>

      <nav className="menu" aria-label="Principal">
        <NavLink to="/" end className={classe}>
          Painel
        </NavLink>
        <NavLink to="/contatos" end className={classe}>
          Contatos
        </NavLink>
        <NavLink to="/contatos/novo" className={classe}>
          Novo contato
        </NavLink>
      </nav>

      <div className="usuario">
        {usuario?.image && <img src={usuario.image} alt="" className="avatar" width={32} height={32} />}
        <span className="ola">Olá, {usuario?.firstName}</span>
        <button type="button" className="botao botao-sec" onClick={logout}>
          Sair
        </button>
      </div>
    </header>
  )
}
