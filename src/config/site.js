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

const normalizeSiteUrl = (value) => String(
  value || 'https://ricardoribeiro-prof.github.io/almeida-castro-advocacia',
).replace(/\/+$/, '')

const valueOr = (key, fallback) => {
  const value = env[key]
  return value === undefined || value === null || String(value).trim() === ''
    ? fallback
    : String(value).trim()
}

export const IS_DEMO = asBoolean(env.VITE_IS_DEMO, true)
export const PRODUCTION_DATA_CONFIRMED = asBoolean(env.VITE_PRODUCTION_DATA_CONFIRMED, false)
export const INDEXING_REQUESTED = asBoolean(env.VITE_ALLOW_INDEXING, false)
export const ALLOW_INDEXING = INDEXING_REQUESTED && !IS_DEMO && PRODUCTION_DATA_CONFIRMED
export const BASE_PATH = normalizeBasePath(env.VITE_BASE_PATH || '/almeida-castro-advocacia/')
export const SITE_URL = normalizeSiteUrl(env.VITE_SITE_URL)

export const SITE = Object.freeze({
  name: valueOr('VITE_SITE_NAME', 'Almeida & Castro Advocacia'),
  shortName: valueOr('VITE_SITE_SHORT_NAME', 'Almeida & Castro'),
  description: valueOr(
    'VITE_SITE_DESCRIPTION',
    'Escritório de advocacia demonstrativo com atuação institucional, ética e informativa em São Raimundo Nonato, Piauí.',
  ),
  url: SITE_URL,
  basePath: BASE_PATH,
  locale: valueOr('VITE_SITE_LOCALE', 'pt_BR'),
  language: valueOr('VITE_SITE_LANGUAGE', 'pt-BR'),
  city: valueOr('VITE_SITE_CITY', 'São Raimundo Nonato'),
  state: valueOr('VITE_SITE_STATE', 'PI'),
  stateName: valueOr('VITE_SITE_STATE_NAME', 'Piauí'),
  country: valueOr('VITE_SITE_COUNTRY', 'BR'),
  address: valueOr('VITE_SITE_ADDRESS', 'Av. Professor João Menezes, 250, Centro, São Raimundo Nonato – PI'),
  postalCode: valueOr('VITE_SITE_POSTAL_CODE', ''),
  phone: valueOr('VITE_SITE_PHONE', '(89) 99999-9999'),
  whatsapp: valueOr('VITE_SITE_WHATSAPP', '5589999999999'),
  email: valueOr('VITE_SITE_EMAIL', 'contato@almeidaecastro.adv.br'),
  openingHours: valueOr('VITE_SITE_OPENING_HOURS', 'Segunda a sexta, das 8h às 12h e das 14h às 18h'),
  social: {
    instagram: valueOr('VITE_INSTAGRAM_URL', ''),
    linkedin: valueOr('VITE_LINKEDIN_URL', ''),
  },
  logo: valueOr('VITE_SITE_LOGO', '/favicon.svg'),
  shareImage: valueOr('VITE_SITE_SHARE_IMAGE', '/images/social-share.svg'),
  author: valueOr('VITE_SITE_AUTHOR', 'Almeida & Castro Advocacia'),
  isDemo: IS_DEMO,
  allowIndexing: ALLOW_INDEXING,
  productionDataConfirmed: PRODUCTION_DATA_CONFIRMED,
})

export const normalizeRoutePath = (routePath = '/') => {
  const pathname = String(routePath).split(/[?#]/)[0].trim()
  const clean = `/${pathname.replace(/^\/+|\/+$/g, '')}`
  if (clean === '/') return '/'
  const isFile = /\/[^/]+\.[a-z0-9]{1,12}$/i.test(clean)
  return isFile ? clean : `${clean}/`
}

const removeBasePrefix = (value = '') => {
  const clean = String(value).replace(/^\/+/, '')
  const base = BASE_PATH.replace(/^\/+|\/+$/g, '')
  if (!base) return clean
  if (clean === base) return ''
  return clean.startsWith(`${base}/`) ? clean.slice(base.length + 1) : clean
}

export const buildCanonicalUrl = (routePath = '/') => {
  const route = normalizeRoutePath(routePath)
  const relative = removeBasePrefix(route === '/' ? '' : route)
  return new URL(relative, `${SITE_URL}/`).href
}

export const buildAssetUrl = (assetPath = '') => {
  if (/^https?:\/\//i.test(assetPath)) return assetPath
  const [pathname, suffix = ''] = String(assetPath || '').split(/(?=[?#])/)
  const cleanAsset = removeBasePrefix(pathname)
  return `${new URL(cleanAsset, `${SITE_URL}/`).href}${suffix}`
}

export const robotsContent = (noIndex = false) =>
  noIndex || !ALLOW_INDEXING ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'

export default SITE
