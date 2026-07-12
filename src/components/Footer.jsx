import { Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import Brand from './Brand'
import SITE from '../config/site'
import { practiceAreas } from '../data/practiceAreas'
import { CONTACT_INFO, SITE_NAME } from '../utils/constants'

const socialItems = [
  { key: 'instagram', label: 'Instagram', url: CONTACT_INFO.instagram, icon: Instagram },
  { key: 'linkedin', label: 'LinkedIn', url: CONTACT_INFO.linkedin, icon: Linkedin },
].filter((item) => /^https?:\/\//i.test(item.url || ''))

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="footer-brand">
          <Brand footer />
          <p>Atuação jurídica institucional, responsável e orientada por ética, clareza e atenção às particularidades de cada demanda.</p>
          {socialItems.length > 0 && (
            <div className="social-links" aria-label="Redes sociais">
              {socialItems.map(({ key, label, url, icon: Icon }) => (
                <a key={key} href={url} target="_blank" rel="noopener noreferrer" aria-label={label}>
                  <Icon size={19} aria-hidden="true" />
                </a>
              ))}
            </div>
          )}
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
          <address>
            <ul className="footer-contact">
              <li><MapPin size={18} aria-hidden="true" /><span>{CONTACT_INFO.address}</span></li>
              <li><Phone size={18} aria-hidden="true" /><a href={`tel:${SITE.phone.replace(/\D/g, '')}`}>{CONTACT_INFO.phone}</a></li>
              <li><Mail size={18} aria-hidden="true" /><a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a></li>
            </ul>
          </address>
        </div>
      </div>

      <div className="footer-legal">
        <div className="container">
          <p>Este site possui caráter exclusivamente informativo e não representa promessa de resultado.</p>
          {SITE.isDemo && <p><strong>Projeto demonstrativo:</strong> os nomes, registros profissionais e dados de contato são fictícios.</p>}
          <div>
            <span>© {new Date().getFullYear()} {SITE_NAME}</span>
            <span>Desenvolvido por <strong>Ativa Digital ON</strong></span>
          </div>
        </div>
      </div>
    </footer>
  )
}
