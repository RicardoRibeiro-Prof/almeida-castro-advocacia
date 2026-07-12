import { MessageCircle } from 'lucide-react'
import { getWhatsAppUrl } from '../utils/constants'

const FALLBACK_IMAGE = `${import.meta.env.BASE_URL}images/team-rafael.jpg`

export default function TeamCard({ member, detailed = false }) {
  return (
    <article className={`team-card ${detailed ? 'team-card--detailed' : ''}`}>
      <div className="team-card__image">
        <img
          src={member.image}
          alt={member.imageAlt || `Retrato profissional demonstrativo de ${member.name}`}
          width="900"
          height="1100"
          loading="lazy"
          decoding="async"
          onError={(event) => { event.currentTarget.src = FALLBACK_IMAGE }}
        />
      </div>
      <div className="team-card__body">
        <span className="team-card__role">{member.role}</span>
        <h3>{member.name}</h3>
        <p className="team-card__oab">{member.oab}</p>
        <p>{member.bio}</p>
        {detailed && (
          <>
            <div className="team-card__detail">
              <strong>Formação</strong>
              <span>{member.education}</span>
            </div>
            <div className="team-card__detail">
              <strong>Áreas de atuação</strong>
              <ul className="tag-list">
                {member.areas.map((area) => <li key={area}>{area}</li>)}
              </ul>
            </div>
          </>
        )}
        <a
          className="button button--outline button--small"
          href={getWhatsAppUrl(`Olá! Gostaria de solicitar informações sobre o atendimento de ${member.name}.`)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle size={17} aria-hidden="true" /> Entrar em contato
        </a>
      </div>
    </article>
  )
}
