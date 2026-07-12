import SITE, {
  ALLOW_INDEXING,
  BASE_PATH,
  IS_DEMO,
  PRODUCTION_DATA_CONFIRMED,
  SITE_URL,
} from '../src/config/site.js'

const errors = []

if (!/^https:\/\//.test(SITE_URL)) errors.push('VITE_SITE_URL deve usar HTTPS.')
if (SITE_URL.includes('seu-dominio.com.br')) errors.push('VITE_SITE_URL ainda utiliza o domínio fictício.')
if (!BASE_PATH.startsWith('/') || !BASE_PATH.endsWith('/')) errors.push('VITE_BASE_PATH deve começar e terminar com barra.')
if (/\s/.test(SITE_URL)) errors.push('VITE_SITE_URL não pode conter espaços.')

if (!IS_DEMO) {
  if (!PRODUCTION_DATA_CONFIRMED) {
    errors.push('Defina VITE_PRODUCTION_DATA_CONFIRMED=true após substituir e conferir todos os dados fictícios.')
  }
  const demoSignals = [
    SITE.phone.includes('99999'),
    SITE.whatsapp.includes('999999999'),
    SITE.email === 'contato@almeidaecastro.adv.br',
    SITE.address.includes('Professor João Menezes, 250'),
  ]
  if (demoSignals.some(Boolean)) {
    errors.push('O modo produção ainda contém telefone, WhatsApp, e-mail ou endereço demonstrativo.')
  }
}

if (ALLOW_INDEXING && IS_DEMO) {
  errors.push('A indexação não pode ser habilitada enquanto VITE_IS_DEMO=true.')
}

if (errors.length) {
  console.error(`Configuração inválida:\n${errors.map((error) => `- ${error}`).join('\n')}`)
  process.exit(1)
}

console.log(`Configuração validada: ${SITE_URL} | base ${BASE_PATH} | modo ${IS_DEMO ? 'demonstração' : 'produção'}`)
