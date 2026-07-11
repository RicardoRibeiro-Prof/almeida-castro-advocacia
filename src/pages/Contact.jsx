import { Mail, MessageCircle, Phone } from 'lucide-react'
import { useState } from 'react'
import ContactSection from '../components/ContactSection'
import PageHero from '../components/PageHero'
import Seo from '../components/Seo'
import { CONTACT_INFO, getWhatsAppUrl } from '../utils/constants'

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', subject: '', message: '' })

  function submit(event) {
    event.preventDefault()
    const text = `Olá! Meu nome é ${form.name}. Telefone: ${form.phone}. Assunto: ${form.subject}. Mensagem: ${form.message}`
    window.open(getWhatsAppUrl(text), '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <Seo title="Contato" description="Entre em contato com a Almeida & Castro Advocacia em São Raimundo Nonato, Piauí." />
      <PageHero eyebrow="Fale conosco" title="Contato" description="Utilize os canais abaixo para solicitar informações sobre atendimento, agendamento e documentos iniciais." breadcrumbs={[{ label: 'Contato' }]} />
      <section className="section">
        <div className="container contact-page-grid">
          <form className="contact-form card-panel" onSubmit={submit}>
            <span className="eyebrow">Mensagem inicial</span><h2>Conte resumidamente o tema do contato</h2><p>O formulário abrirá uma conversa no WhatsApp. Não envie dados sensíveis ou documentos por este campo.</p>
            <div className="form-grid">
              <label><span>Nome</span><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
              <label><span>Telefone</span><input required inputMode="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label>
              <label className="form-field--full"><span>Assunto</span><input required value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} /></label>
              <label className="form-field--full"><span>Mensagem</span><textarea required rows="6" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} /></label>
            </div>
            <button className="button button--primary" type="submit"><MessageCircle size={18} /> Enviar pelo WhatsApp</button>
          </form>
          <aside className="contact-direct card-panel card-panel--navy">
            <span className="eyebrow eyebrow--light">Canais diretos</span><h2>Informações de atendimento</h2><p>O contato inicial não constitui contratação e não substitui uma consulta jurídica.</p>
            <a href={`tel:${CONTACT_INFO.phone.replace(/\D/g, '')}`}><Phone size={20} /><div><strong>Telefone</strong><span>{CONTACT_INFO.phone}</span></div></a>
            <a href={`mailto:${CONTACT_INFO.email}`}><Mail size={20} /><div><strong>E-mail</strong><span>{CONTACT_INFO.email}</span></div></a>
            <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer"><MessageCircle size={20} /><div><strong>WhatsApp</strong><span>Iniciar conversa</span></div></a>
          </aside>
        </div>
      </section>
      <ContactSection compact />
    </>
  )
}
