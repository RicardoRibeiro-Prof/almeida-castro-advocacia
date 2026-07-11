import { MessageCircle } from 'lucide-react'
import { getWhatsAppUrl } from '../utils/constants'

export default function TeamCard({ member, detailed = false }) {
  return (
    <article className={`team-card ${detailed ? 'team-card--detailed' : ''}`}>
      <div className="team-card__image">
        <img src={member.image} alt={`Retrato profissional de ${member.name}`} loading="lazy" />
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
          <MessageCircle size={17} /> Entrar em contato
        </a>
      </div>
    </article>
  )
}
