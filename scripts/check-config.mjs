import SITE, {
  ALLOW_INDEXING,
  BASE_PATH,
  INDEXING_REQUESTED,
  IS_DEMO,
  PRODUCTION_DATA_CONFIRMED,
  SITE_URL,
  buildCanonicalUrl,
} from '../src/config/site.js'

const errors = []

if (!/^https:\/\//.test(SITE_URL)) errors.push('VITE_SITE_URL deve usar HTTPS.')
if (SITE_URL.includes('seu-dominio.com.br')) errors.push('VITE_SITE_URL ainda utiliza o domínio fictício.')
if (!BASE_PATH.startsWith('/') || !BASE_PATH.endsWith('/')) errors.push('VITE_BASE_PATH deve começar e terminar com barra.')
if (/\s/.test(SITE_URL)) errors.push('VITE_SITE_URL não pode conter espaços.')

try {
  const parsedSiteUrl = new URL(SITE_URL)
  const expectedPath = BASE_PATH === '/' ? '/' : BASE_PATH.replace(/\/$/, '')
  const actualPath = parsedSiteUrl.pathname.replace(/\/$/, '') || '/'
  if (expectedPath !== '/' && actualPath !== expectedPath) {
    errors.push(`VITE_SITE_URL deve terminar com ${expectedPath} quando VITE_BASE_PATH=${BASE_PATH}.`)
  }
} catch {
  errors.push('VITE_SITE_URL não é uma URL válida.')
}

if (INDEXING_REQUESTED && IS_DEMO) {
  errors.push('A indexação não pode ser solicitada enquanto VITE_IS_DEMO=true.')
}

if (INDEXING_REQUESTED && !PRODUCTION_DATA_CONFIRMED) {
  errors.push('A indexação exige VITE_PRODUCTION_DATA_CONFIRMED=true.')
}

if (!IS_DEMO && PRODUCTION_DATA_CONFIRMED) {
  const demoSignals = [
    SITE.phone.includes('99999'),
    SITE.whatsapp.includes('999999999'),
    SITE.email === 'contato@almeidaecastro.adv.br',
    SITE.address.includes('Professor João Menezes, 250'),
  ]
  if (demoSignals.some(Boolean)) {
    errors.push('O modo produção confirmado ainda contém telefone, WhatsApp, e-mail ou endereço demonstrativo.')
  }
}

if (ALLOW_INDEXING !== (INDEXING_REQUESTED && !IS_DEMO && PRODUCTION_DATA_CONFIRMED)) {
  errors.push('A proteção central de indexação está inconsistente.')
}

const homeCanonical = buildCanonicalUrl('/')
const aboutCanonical = buildCanonicalUrl('/sobre')
const cleanBase = BASE_PATH.replace(/^\/+|\/+$/g, '')
if (!homeCanonical.startsWith(`${SITE_URL}/`)) errors.push('Canonical da página inicial não utiliza VITE_SITE_URL.')
if (!aboutCanonical.startsWith(`${SITE_URL}/`)) errors.push('Canonical de página interna não utiliza VITE_SITE_URL.')
if (cleanBase && aboutCanonical.includes(`${cleanBase}/${cleanBase}`)) {
  errors.push('Canonical contém o caminho-base duplicado.')
}

if (errors.length) {
  console.error(`Configuração inválida:\n${errors.map((error) => `- ${error}`).join('\n')}`)
  process.exit(1)
}

console.log(`Configuração validada: ${SITE_URL} | base ${BASE_PATH} | modo ${IS_DEMO ? 'demonstração' : 'produção'} | indexação ${ALLOW_INDEXING ? 'ativa' : 'bloqueada'}`)
