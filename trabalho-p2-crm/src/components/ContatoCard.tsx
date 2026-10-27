import { Link } from 'react-router-dom'
import type { Contato } from '../types'

type Props = {
  contato: Contato
  novo?: boolean
}

// Um cartão da lista: recebe o contato por props e leva ao detalhe
export default function ContatoCard({ contato, novo = false }: Props) {
  const nome = `${contato.firstName} ${contato.lastName}`

  return (
    <li>
      <Link to={`/contatos/${contato.id}`} className="contato-card">
        {contato.image ? (
          <img src={contato.image} alt="" className="avatar avatar-g" width={48} height={48} loading="lazy" />
        ) : (
          <span className="avatar avatar-g avatar-letra" aria-hidden="true">
            {contato.firstName.charAt(0)}
          </span>
        )}
        <span className="contato-info">
          <strong>
            {nome} {novo && <span className="selo">novo</span>}
          </strong>
          <span>{contato.email}</span>
          <span className="sutil">
            {contato.phone}
            {contato.company?.name && ` · ${contato.company.name}`}
          </span>
        </span>
      </Link>
    </li>
  )
}
