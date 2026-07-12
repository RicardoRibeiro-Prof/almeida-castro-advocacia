import { Mail, MessageCircle, Phone } from 'lucide-react'
import { useState } from 'react'
import ContactSection from '../components/ContactSection'
import PageHero from '../components/PageHero'
import Seo from '../components/Seo'
import SITE from '../config/site'
import { CONTACT_INFO, getWhatsAppUrl } from '../utils/constants'

const initialForm = { name: '', phone: '', subject: '', message: '' }

function normalizePhone(value = '') {
  return value.replace(/[^\d()+\-\s]/g, '').replace(/\s{2,}/g, ' ').slice(0, 20)
}

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [feedback, setFeedback] = useState('')

  function updateField(field, value) {
    setFeedback('')
    setForm((current) => ({
      ...current,
      [field]: field === 'phone' ? normalizePhone(value) : value,
    }))
  }

  function submit(event) {
    event.preventDefault()
    const normalized = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    }

    if (normalized.name.length < 2 || normalized.subject.length < 3 || normalized.message.length < 10) {
      setFeedback('Revise os campos. A mensagem deve explicar o assunto com pelo menos 10 caracteres.')
      return
    }

    if (normalized.phone.replace(/\D/g, '').length < 8) {
      setFeedback('Informe um telefone válido, incluindo o DDD quando aplicável.')
      return
    }

    const text = [
      'Olá! Acessei o site e gostaria de solicitar informações.',
      `Nome: ${normalized.name}`,
      `Telefone: ${normalized.phone}`,
      `Assunto: ${normalized.subject}`,
      `Mensagem: ${normalized.message}`,
    ].join('\n')

    setFeedback('Tudo certo. A conversa será aberta no WhatsApp; confira a mensagem antes de enviá-la.')
    window.setTimeout(() => {
      window.open(getWhatsAppUrl(text), '_blank', 'noopener,noreferrer')
    }, 250)
  }

  return (
    <>
      <Seo
        title="Contato | Almeida & Castro Advocacia"
        description="Consulte os canais demonstrativos de contato e conheça como funciona o atendimento jurídico do escritório fictício."
        path="/contato"
      />
      <PageHero
        eyebrow="Fale conosco"
        title="Contato"
        description="Utilize os canais abaixo para solicitar informações sobre atendimento, agendamento e documentos iniciais."
        breadcrumbs={[{ label: 'Contato' }]}
      />
      <section className="section">
        <div className="container contact-page-grid">
          <form className="contact-form card-panel" onSubmit={submit} noValidate>
            <span className="eyebrow">Mensagem inicial</span>
            <h2>Conte resumidamente o tema do contato</h2>
            <p id="whatsapp-form-help">O formulário apenas prepara uma mensagem e abre o WhatsApp. Os dados não são armazenados neste site. Não envie informações sensíveis ou documentos.</p>
            {SITE.isDemo && <p className="informative-box" role="note">Este é um projeto demonstrativo. O número e os demais canais apresentados são fictícios.</p>}
            <div className="form-grid">
              <label htmlFor="contact-name"><span>Nome</span><input id="contact-name" name="name" type="text" required minLength="2" maxLength="80" autoComplete="name" aria-describedby="whatsapp-form-help" value={form.name} onChange={(event) => updateField('name', event.target.value)} /></label>
              <label htmlFor="contact-phone"><span>Telefone</span><input id="contact-phone" name="phone" type="tel" required inputMode="tel" autoComplete="tel" maxLength="20" aria-describedby="whatsapp-form-help" value={form.phone} onChange={(event) => updateField('phone', event.target.value)} /></label>
              <label className="form-field--full" htmlFor="contact-subject"><span>Assunto</span><input id="contact-subject" name="subject" type="text" required minLength="3" maxLength="100" autoComplete="off" value={form.subject} onChange={(event) => updateField('subject', event.target.value)} /></label>
              <label className="form-field--full" htmlFor="contact-message"><span>Mensagem</span><textarea id="contact-message" name="message" required minLength="10" maxLength="800" rows="6" aria-describedby="contact-message-help" value={form.message} onChange={(event) => updateField('message', event.target.value)} /><small id="contact-message-help">Descreva apenas o tema geral. Limite de 800 caracteres.</small></label>
            </div>
            {feedback && <p className="status-message" role="status" aria-live="polite">{feedback}</p>}
            <button className="button button--primary" type="submit"><MessageCircle size={18} aria-hidden="true" /> Preparar mensagem no WhatsApp</button>
          </form>
          <aside className="contact-direct card-panel card-panel--navy" aria-label="Canais diretos de contato">
            <span className="eyebrow eyebrow--light">Canais diretos</span><h2>Informações de atendimento</h2><p>O contato inicial não constitui contratação e não substitui uma consulta jurídica.</p>
            <a href={`tel:${CONTACT_INFO.phone.replace(/\D/g, '')}`}><Phone size={20} aria-hidden="true" /><div><strong>Telefone</strong><span>{CONTACT_INFO.phone}</span></div></a>
            <a href={`mailto:${CONTACT_INFO.email}`}><Mail size={20} aria-hidden="true" /><div><strong>E-mail</strong><span>{CONTACT_INFO.email}</span></div></a>
            <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer"><MessageCircle size={20} aria-hidden="true" /><div><strong>WhatsApp</strong><span>Iniciar conversa</span></div></a>
          </aside>
        </div>
      </section>
      <ContactSection compact />
    </>
  )
}
