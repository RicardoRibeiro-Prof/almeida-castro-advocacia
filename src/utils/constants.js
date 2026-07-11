export const SITE_NAME = 'Almeida & Castro Advocacia'
export const SITE_SHORT_NAME = 'Almeida & Castro'
export const SITE_CITY = 'São Raimundo Nonato – Piauí'

export const CONTACT_INFO = {
  phone: '(89) 99999-9999',
  whatsappNumber: '5589999999999',
  email: 'contato@almeidaecastro.adv.br',
  address: 'Av. Professor João Menezes, 250, Centro, São Raimundo Nonato – PI',
  hours: 'Segunda a sexta, das 8h às 12h e das 14h às 18h',
  instagram: 'https://www.instagram.com/',
  linkedin: 'https://www.linkedin.com/',
}

export const WHATSAPP_MESSAGE =
  'Olá! Acessei o site do escritório e gostaria de solicitar mais informações.'

export const getWhatsAppUrl = (message = WHATSAPP_MESSAGE) =>
  `https://wa.me/${CONTACT_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`

export const ARTICLE_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
}

export const ARTICLE_STATUS_LABELS = {
  draft: 'Rascunho',
  published: 'Publicado',
}

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
