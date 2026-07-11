import { Clock3, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { CONTACT_INFO, getWhatsAppUrl } from '../utils/constants'
import SectionHeading from './SectionHeading'

export default function ContactSection({ compact = false }) {
  return (
    <section className={`section contact-section ${compact ? 'contact-section--compact' : ''}`}>
      <div className="container">
        <SectionHeading
          eyebrow="Atendimento"
          title="Localização e contato"
          description="Entre em contato para solicitar informações sobre o atendimento e os documentos iniciais necessários."
        />
        <div className="contact-grid">
          <div className="contact-details">
            <div className="contact-item"><MapPin /><div><strong>Endereço</strong><span>{CONTACT_INFO.address}</span></div></div>
            <div className="contact-item"><Phone /><div><strong>Telefone</strong><span>{CONTACT_INFO.phone}</span></div></div>
            <div className="contact-item"><Mail /><div><strong>E-mail</strong><a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a></div></div>
            <div className="contact-item"><Clock3 /><div><strong>Horário</strong><span>{CONTACT_INFO.hours}</span></div></div>
            <a className="button button--primary" href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={18} /> Falar pelo WhatsApp
            </a>
          </div>
          <div className="map-frame">
            <iframe
              title="Mapa de São Raimundo Nonato, Piauí"
              src="https://www.google.com/maps?q=S%C3%A3o%20Raimundo%20Nonato%20PI&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
