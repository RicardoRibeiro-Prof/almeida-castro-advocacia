import { Clock3, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import SITE from '../config/site'
import { CONTACT_INFO, getWhatsAppUrl } from '../utils/constants'
import SectionHeading from './SectionHeading'

export default function ContactSection({ compact = false }) {
  return (
    <section className={`section contact-section ${compact ? 'contact-section--compact' : ''}`} aria-labelledby="contact-section-title">
      <div className="container">
        <SectionHeading
          eyebrow="Atendimento"
          title="Localização e contato"
          description="Entre em contato para solicitar informações sobre o atendimento e os documentos iniciais necessários."
          titleId="contact-section-title"
        />
        <div className="contact-grid">
          <address className="contact-details">
            <div className="contact-item"><MapPin aria-hidden="true" /><div><strong>Endereço</strong><span>{CONTACT_INFO.address}</span></div></div>
            <div className="contact-item"><Phone aria-hidden="true" /><div><strong>Telefone</strong><a href={`tel:${CONTACT_INFO.phone.replace(/\D/g, '')}`}>{CONTACT_INFO.phone}</a></div></div>
            <div className="contact-item"><Mail aria-hidden="true" /><div><strong>E-mail</strong><a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a></div></div>
            <div className="contact-item"><Clock3 aria-hidden="true" /><div><strong>Horário</strong><span>{CONTACT_INFO.hours}</span></div></div>
            {SITE.isDemo && <p className="team-image-note" role="note">Endereço, telefone, e-mail e horário utilizados apenas para demonstração.</p>}
            <a className="button button--primary" href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={18} aria-hidden="true" /> Falar pelo WhatsApp
            </a>
          </address>
          <div className="map-frame">
            <iframe
              title="Mapa demonstrativo de São Raimundo Nonato, Piauí"
              src="https://www.google.com/maps?q=S%C3%A3o%20Raimundo%20Nonato%20PI&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  )
}
