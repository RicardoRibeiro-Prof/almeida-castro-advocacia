import { MessageCircle } from 'lucide-react'
import { getWhatsAppUrl } from '../utils/constants'

export default function WhatsAppButton() {
  return (
    <a
      className="whatsapp-float"
      href={getWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Entrar em contato pelo WhatsApp"
      title="Fale conosco pelo WhatsApp"
    >
      <MessageCircle size={25} />
    </a>
  )
}
