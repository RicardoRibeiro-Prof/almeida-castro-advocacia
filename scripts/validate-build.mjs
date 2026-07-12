import fs from 'node:fs/promises'
import path from 'node:path'
import { load } from 'js-yaml'
import { ALLOW_INDEXING, IS_DEMO, SITE_URL } from '../src/config/site.js'
import { allStaticRoutes } from './site-routes.mjs'

const rootDir = process.cwd()
const distDir = path.join(rootDir, 'dist')
const contentDir = path.join(rootDir, 'src', 'content', 'articles')
const failures = []
const now = new Date()

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

function validateHtml(routePath, html, { article = false } = {}) {
  const checks = [
    ['título', /<title>[^<]+<\/title>/i],
    ['description', /<meta\s+name="description"\s+content="[^"]+"/i],
    ['canonical', /<link\s+rel="canonical"\s+href="https:\/\/[^"]+"/i],
    ['Open Graph', /<meta\s+property="og:title"/i],
    ['Twitter Card', /<meta\s+name="twitter:card"/i],
    ['H1 rastreável', /<h1[^>]*>[^<]+/i],
    ['conteúdo pré-renderizado', /data-prerendered="true"/i],
    ['conteúdo principal', /id="main-content"/i],
  ]
  if (article) {
    checks.push(['Open Graph de artigo', /<meta\s+property="og:type"\s+content="article"/i])
    checks.push(['data de publicação', /article:published_time/i])
    checks.push(['elemento time', /<time\s+datetime=/i])
  }

  for (const [label, pattern] of checks) {
    if (!pattern.test(html)) failures.push(`${routePath}: ${label} ausente.`)
  }
  if (html.includes('seu-dominio.com.br')) failures.push(`${routePath}: domínio fictício encontrado.`)
  if (html.includes('default.svg') || html.includes('team-rafael.svg') || html.includes('team-marina.svg') || html.includes('hero-office.svg')) {
    failures.push(`${routePath}: referência a imagem antiga ou corrompida encontrada.`)
  }
  if (!html.includes(SITE_URL)) failures.push(`${routePath}: URL oficial não encontrada nos metadados.`)
  if (!IS_DEMO && ALLOW_INDEXING && !/application\/ld\+json/i.test(html)) failures.push(`${routePath}: JSON-LD ausente em produção.`)
  if (IS_DEMO && !/noindex, nofollow/i.test(html)) failures.push(`${routePath}: noindex ausente no modo demonstração.`)
}

const essential = ['index.html', '404.html', 'sitemap.xml', 'robots.txt', 'manifest.webmanifest']
for (const file of essential) {
  if (!(await exists(path.join(distDir, file)))) failures.push(`Arquivo essencial ausente: ${file}`)
}

const essentialImages = [
  'images/hero-office.jpg',
  'images/about-office.jpg',
  'images/team-rafael.jpg',
  'images/team-marina.jpg',
  'images/articles/previdenciario.jpg',
  'images/articles/familia.jpg',
  'images/articles/trabalhista.jpg',
  'images/articles/consumidor.jpg',
  'images/articles/civil.jpg',
  'images/articles/empresarial.jpg',
  'images/articles/general.jpg',
]

for (const image of essentialImages) {
  const filePath = path.join(distDir, image)
  if (!(await exists(filePath))) {
    failures.push(`Fotografia ausente no build: ${image}`)
    continue
  }
  const stat = await fs.stat(filePath)
  if (stat.size < 25_000) failures.push(`Fotografia inválida ou pequena demais: ${image} (${stat.size} bytes)`)
}

for (const route of allStaticRoutes) {
  const relative = route.path === '/' ? '' : route.path.replace(/^\/+|\/+$/g, '')
  const filePath = path.join(distDir, relative, 'index.html')
  if (!(await exists(filePath))) {
    failures.push(`Rota não exportada: ${route.path}`)
    continue
  }
  validateHtml(route.path, await read(filePath))
}

let articleCount = 0
try {
  const articleFiles = (await fs.readdir(contentDir)).filter((file) => file.endsWith('.md'))
  for (const file of articleFiles) {
    const raw = await read(path.join(contentDir, file))
    const match = raw.match(/^---\s*\n([\s\S]*?)\n---/)
    const data = match ? load(match[1]) || {} : {}
    const publishedAt = data.date || data.published_at
    const publishedDate = publishedAt ? new Date(publishedAt) : null
    const isFuture = publishedDate && !Number.isNaN(publishedDate.getTime()) && publishedDate > now
    if (data.published === false || isFuture) continue

    const slug = data.slug || file.replace(/\.md$/, '')
    const routePath = `/artigos/${slug}`
    const htmlPath = path.join(distDir, 'artigos', slug, 'index.html')
    if (!(await exists(htmlPath))) {
      failures.push(`Artigo não exportado: ${routePath}`)
      continue
    }
    articleCount += 1
    validateHtml(routePath, await read(htmlPath), { article: true })
  }
} catch (error) {
  failures.push(`Não foi possível validar os artigos: ${error.message}`)
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
  if (robots.includes('seu-dominio.com.br')) failures.push('robots.txt contém domínio fictício.')
}

if (failures.length) {
  console.error(`Build inválido (${failures.length} problema(s)):\n${failures.map((item) => `- ${item}`).join('\n')}`)
  process.exit(1)
}

console.log(`Build validado: ${allStaticRoutes.length} rotas estáticas, ${articleCount} artigos e ${essentialImages.length} fotografias conferidos.`)
