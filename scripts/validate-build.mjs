import fs from 'node:fs/promises'
import path from 'node:path'
import { ALLOW_INDEXING, IS_DEMO, SITE_URL } from '../src/config/site.js'
import { allStaticRoutes } from './site-routes.mjs'

const distDir = path.join(process.cwd(), 'dist')
const failures = []

async function exists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function read(filePath) {
  return fs.readFile(filePath, 'utf8')
}

const essential = ['index.html', '404.html', 'sitemap.xml', 'robots.txt', 'manifest.webmanifest']
for (const file of essential) {
  if (!(await exists(path.join(distDir, file)))) failures.push(`Arquivo essencial ausente: ${file}`)
}

for (const route of allStaticRoutes) {
  const relative = route.path === '/' ? '' : route.path.replace(/^\/+|\/+$/g, '')
  const filePath = path.join(distDir, relative, 'index.html')
  if (!(await exists(filePath))) {
    failures.push(`Rota não exportada: ${route.path}`)
    continue
  }
  const html = await read(filePath)
  const checks = [
    ['título', /<title>[^<]+<\/title>/i],
    ['description', /<meta\s+name="description"\s+content="[^"]+"/i],
    ['canonical', /<link\s+rel="canonical"\s+href="https:\/\/[^"]+"/i],
    ['Open Graph', /<meta\s+property="og:title"/i],
    ['Twitter Card', /<meta\s+name="twitter:card"/i],
    ['H1 rastreável', /<h1[^>]*>[^<]+/i],
    ['conteúdo pré-renderizado', /data-prerendered="true"/i],
  ]
  for (const [label, pattern] of checks) {
    if (!pattern.test(html)) failures.push(`${route.path}: ${label} ausente.`)
  }
  if (html.includes('seu-dominio.com.br')) failures.push(`${route.path}: domínio fictício encontrado.`)
  if (!html.includes(SITE_URL)) failures.push(`${route.path}: URL oficial não encontrada nos metadados.`)
  if (!IS_DEMO && ALLOW_INDEXING && !/application\/ld\+json/i.test(html)) failures.push(`${route.path}: JSON-LD ausente em produção.`)
  if (IS_DEMO && !/noindex, nofollow/i.test(html)) failures.push(`${route.path}: noindex ausente no modo demonstração.`)
}

if (await exists(path.join(distDir, 'sitemap.xml'))) {
  const sitemap = await read(path.join(distDir, 'sitemap.xml'))
  if (!/<urlset[\s>]/.test(sitemap)) failures.push('sitemap.xml inválido.')
  if (sitemap.includes('seu-dominio.com.br')) failures.push('sitemap.xml contém domínio fictício.')
  if (!IS_DEMO && ALLOW_INDEXING && !/<url>/.test(sitemap)) failures.push('sitemap.xml vazio em produção.')
}

if (await exists(path.join(distDir, 'robots.txt'))) {
  const robots = await read(path.join(distDir, 'robots.txt'))
  if (IS_DEMO && !/Disallow:\s*\//i.test(robots)) failures.push('robots.txt não bloqueia o modo demonstração.')
  if (!IS_DEMO && ALLOW_INDEXING && !/Allow:\s*\//i.test(robots)) failures.push('robots.txt não permite rastreamento em produção.')
}

if (failures.length) {
  console.error(`Build inválido (${failures.length} problema(s)):\n${failures.map((item) => `- ${item}`).join('\n')}`)
  process.exit(1)
}

console.log(`Build validado: ${allStaticRoutes.length} rotas estáticas, SEO e arquivos essenciais conferidos.`)
