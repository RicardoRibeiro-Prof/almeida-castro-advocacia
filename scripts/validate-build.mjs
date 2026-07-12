import fs from 'node:fs/promises'
import path from 'node:path'
import { load } from 'js-yaml'
import { ALLOW_INDEXING, IS_DEMO, SITE_URL, buildCanonicalUrl } from '../src/config/site.js'
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

function stripHtml(value = '') {
  return String(value).replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function validateHtml(routePath, html, { article = false, notFound = false } = {}) {
  const checks = [
    ['título', /<title>[^<]+<\/title>/i],
    ['description', /<meta\s+name=["']description["']\s+content=["'][^"']+/i],
    ['robots', /<meta\s+name=["']robots["']\s+content=["'][^"']+/i],
    ['googlebot', /<meta\s+name=["']googlebot["']\s+content=["'][^"']+/i],
    ['canonical', /<link\s+rel=["']canonical["']\s+href=["']https:\/\/[^"']+/i],
    ['Open Graph', /<meta\s+property=["']og:title["']/i],
    ['Twitter Card', /<meta\s+name=["']twitter:card["']/i],
    ['conteúdo pré-renderizado', /data-prerendered=["']true["']/i],
    ['conteúdo principal', /id=["']main-content["']/i],
    ['JavaScript principal', /<script[^>]+type=["']module["'][^>]+src=["'][^"']+\.js/i],
    ['CSS principal', /<link[^>]+rel=["']stylesheet["'][^>]+href=["'][^"']+\.css/i],
    ['link interno', /<a\s+[^>]*href=["']\//i],
  ]

  for (const [label, pattern] of checks) {
    if (!pattern.test(html)) failures.push(`${routePath}: ${label} ausente.`)
  }

  const h1Count = (html.match(/<h1\b/gi) || []).length
  if (h1Count !== 1) failures.push(`${routePath}: esperado exatamente um H1, encontrado ${h1Count}.`)

  const rootStart = html.search(/<div\s+id=["']root["'][^>]*>/i)
  const bodyEnd = html.search(/<\/body>/i)
  const prerenderedStart = html.search(/data-prerendered=["']true["']/i)
  if (rootStart < 0 || bodyEnd < 0 || prerenderedStart < rootStart || prerenderedStart > bodyEnd) {
    failures.push(`${routePath}: conteúdo pré-renderizado não está dentro de #root.`)
  }

  if (/<div\s+id=["']root["'][^>]*>\s*<\/div>/i.test(html)) {
    failures.push(`${routePath}: #root está vazio.`)
  }

  const visibleText = stripHtml(rootStart >= 0 && bodyEnd > rootStart ? html.slice(rootStart, bodyEnd) : '')
  if (visibleText.length < 180) failures.push(`${routePath}: conteúdo textual pré-renderizado insuficiente.`)

  const expectedCanonical = buildCanonicalUrl(routePath)
  if (!html.includes(`href="${expectedCanonical}"`) && !html.includes(`href='${expectedCanonical}'`)) {
    failures.push(`${routePath}: canonical diferente de ${expectedCanonical}.`)
  }

  if (article) {
    if (!/<meta\s+property=["']og:type["']\s+content=["']article["']/i.test(html)) failures.push(`${routePath}: Open Graph de artigo ausente.`)
    if (!/article:published_time/i.test(html)) failures.push(`${routePath}: data de publicação ausente.`)
    if (!/<time\s+datetime=/i.test(html)) failures.push(`${routePath}: elemento time ausente.`)
  }

  if ((IS_DEMO || notFound) && !/noindex, nofollow/i.test(html)) failures.push(`${routePath}: noindex ausente.`)
  if (html.includes('seu-dominio.com.br')) failures.push(`${routePath}: domínio fictício encontrado.`)
  if (!html.includes(SITE_URL)) failures.push(`${routePath}: URL configurada não encontrada nos metadados.`)
  if (!IS_DEMO && ALLOW_INDEXING && !/application\/ld\+json/i.test(html) && !notFound) failures.push(`${routePath}: JSON-LD ausente em produção.`)
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
    const slug = data.slug || file.replace(/\.md$/, '')
    const routePath = `/artigos/${slug}`
    const htmlPath = path.join(distDir, 'artigos', slug, 'index.html')

    if (data.published === false || isFuture) {
      if (await exists(htmlPath)) failures.push(`Artigo oculto ou futuro foi exportado: ${routePath}`)
      continue
    }

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

if (await exists(path.join(distDir, '404.html'))) {
  validateHtml('/404', await read(path.join(distDir, '404.html')), { notFound: true })
}

if (await exists(path.join(distDir, 'sitemap.xml'))) {
  const sitemap = await read(path.join(distDir, 'sitemap.xml'))
  if (!/<urlset[\s>]/.test(sitemap)) failures.push('sitemap.xml inválido.')
  if (sitemap.includes('seu-dominio.com.br')) failures.push('sitemap.xml contém domínio fictício.')
  if (IS_DEMO && /<url>/.test(sitemap)) failures.push('sitemap.xml demonstrativo contém URLs indexáveis.')
  if (!IS_DEMO && ALLOW_INDEXING && !/<url>/.test(sitemap)) failures.push('sitemap.xml vazio em produção indexável.')
}

if (await exists(path.join(distDir, 'robots.txt'))) {
  const robots = await read(path.join(distDir, 'robots.txt'))
  if (!/User-agent:\s*\*/i.test(robots) || !/Allow:\s*\//i.test(robots)) failures.push('robots.txt não permite rastreamento.')
  if (/Disallow:\s*\//i.test(robots)) failures.push('robots.txt contém bloqueio total indevido.')
  if (IS_DEMO && /Sitemap:/i.test(robots)) failures.push('robots.txt demonstrativo referencia sitemap.')
  if (!IS_DEMO && ALLOW_INDEXING && !/Sitemap:\s*https:\/\//i.test(robots)) failures.push('robots.txt de produção não referencia sitemap.')
}

if (failures.length) {
  console.error(`Build inválido (${failures.length} problema(s)):\n${failures.map((item) => `- ${item}`).join('\n')}`)
  process.exit(1)
}

console.log(`Build validado: ${allStaticRoutes.length} rotas estáticas, ${articleCount} artigos, página 404, SEO, assets e rastreamento conferidos.`)
