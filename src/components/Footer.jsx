import { Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import Brand from './Brand'
import { practiceAreas } from '../data/practiceAreas'
import { CONTACT_INFO, SITE_NAME } from '../utils/constants'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="footer-brand">
          <Brand footer />
          <p>Atuação jurídica institucional, responsável e orientada por ética, clareza e atenção às particularidades de cada demanda.</p>
          <div className="social-links">
            <a href={CONTACT_INFO.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={19} /></a>
            <a href={CONTACT_INFO.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={19} /></a>
          </div>
        </div>

        <div>
          <h2>Links rápidos</h2>
          <ul className="footer-links">
            <li><Link to="/sobre">O Escritório</Link></li>
            <li><Link to="/equipe">Equipe</Link></li>
            <li><Link to="/artigos">Artigos</Link></li>
            <li><Link to="/contato">Contato</Link></li>
            <li><Link to="/politica-de-privacidade">Política de privacidade</Link></li>
          </ul>
        </div>

        <div>
          <h2>Áreas de atuação</h2>
          <ul className="footer-links">
            {practiceAreas.map((area) => (
              <li key={area.slug}><Link to={`/areas-de-atuacao/${area.slug}`}>{area.title}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h2>Contato</h2>
          <ul className="footer-contact">
            <li><MapPin size={18} /><span>{CONTACT_INFO.address}</span></li>
            <li><Phone size={18} /><span>{CONTACT_INFO.phone}</span></li>
            <li><Mail size={18} /><a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-legal">
        <div className="container">
          <p>Este site possui caráter exclusivamente informativo e não representa promessa de resultado.</p>
          <div>
            <span>© {new Date().getFullYear()} {SITE_NAME}</span>
            <span>Desenvolvido por <strong>Ativa Digital ON</strong></span>
          </div>
        </div>
      </div>
    </footer>
  )
}
