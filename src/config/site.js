const browserEnv = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {}
const nodeEnv = typeof process !== 'undefined' && process.env ? process.env : {}
const env = { ...nodeEnv, ...browserEnv }

const asBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === '') return fallback
  return String(value).toLowerCase() === 'true'
}

const normalizeBasePath = (value = '/') => {
  const path = `/${String(value).trim().replace(/^\/+|\/+$/g, '')}/`
  return path === '//' ? '/' : path
}

const normalizeSiteUrl = (value) => String(value || 'https://ricardoribeiro-prof.github.io/almeida-castro-advocacia').replace(/\/+$/, '')

export const IS_DEMO = asBoolean(env.VITE_IS_DEMO, true)
export const ALLOW_INDEXING = asBoolean(env.VITE_ALLOW_INDEXING, false) && !IS_DEMO
export const BASE_PATH = normalizeBasePath(env.VITE_BASE_PATH || '/almeida-castro-advocacia/')
export const SITE_URL = normalizeSiteUrl(env.VITE_SITE_URL)

export const SITE = Object.freeze({
  name: 'Almeida & Castro Advocacia',
  shortName: 'Almeida & Castro',
  description: 'Escritório de advocacia demonstrativo com atuação institucional, ética e informativa em São Raimundo Nonato, Piauí.',
  url: SITE_URL,
  basePath: BASE_PATH,
  locale: 'pt_BR',
  language: 'pt-BR',
  city: 'São Raimundo Nonato',
  state: 'PI',
  stateName: 'Piauí',
  country: 'BR',
  address: 'Av. Professor João Menezes, 250, Centro, São Raimundo Nonato – PI',
  postalCode: '',
  phone: '(89) 99999-9999',
  whatsapp: '5589999999999',
  email: 'contato@almeidaecastro.adv.br',
  openingHours: 'Segunda a sexta, das 8h às 12h e das 14h às 18h',
  social: {
    instagram: env.VITE_INSTAGRAM_URL || '',
    linkedin: env.VITE_LINKEDIN_URL || '',
  },
  logo: '/favicon.svg',
  shareImage: '/images/social-share.svg',
  author: 'Almeida & Castro Advocacia',
  isDemo: IS_DEMO,
  allowIndexing: ALLOW_INDEXING,
})

export const normalizeRoutePath = (routePath = '/') => {
  const clean = `/${String(routePath).split(/[?#]/)[0].replace(/^\/+|\/+$/g, '')}`
  return clean === '/' ? '/' : `${clean}/`
}

export const buildCanonicalUrl = (routePath = '/') => {
  const route = normalizeRoutePath(routePath)
  const baseUrl = `${SITE_URL}/`
  return new URL(route === '/' ? '' : route.replace(/^\//, ''), baseUrl).href
}

export const buildAssetUrl = (assetPath = '') => {
  if (/^https?:\/\//i.test(assetPath)) return assetPath
  const cleanAsset = String(assetPath || '').replace(/^\/+/, '')
  return new URL(cleanAsset, `${SITE_URL}/`).href
}

export const robotsContent = (noIndex = false) =>
  noIndex || !ALLOW_INDEXING ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'

export default SITE
