import SITE from '../config/site'

export const SITE_NAME = SITE.name
export const SITE_SHORT_NAME = SITE.shortName
export const SITE_CITY = `${SITE.city} – ${SITE.stateName}`

export const CONTACT_INFO = {
  phone: SITE.phone,
  whatsappNumber: SITE.whatsapp,
  email: SITE.email,
  address: SITE.address,
  hours: SITE.openingHours,
  instagram: SITE.social.instagram,
  linkedin: SITE.social.linkedin,
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
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
