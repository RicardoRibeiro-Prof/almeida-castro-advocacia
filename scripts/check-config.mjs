import { BASE_PATH, SITE_URL } from '../src/config/site.js'

const errors = []

if (!/^https:\/\//.test(SITE_URL)) errors.push('VITE_SITE_URL deve usar HTTPS.')
if (SITE_URL.includes('seu-dominio.com.br')) errors.push('VITE_SITE_URL ainda utiliza o domínio fictício.')
if (!BASE_PATH.startsWith('/') || !BASE_PATH.endsWith('/')) errors.push('VITE_BASE_PATH deve começar e terminar com barra.')
if (/\s/.test(SITE_URL)) errors.push('VITE_SITE_URL não pode conter espaços.')

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'))
  process.exit(1)
}

console.log(`Configuração validada: ${SITE_URL} | base ${BASE_PATH}`)
