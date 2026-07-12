import fs from 'node:fs/promises'
import path from 'node:path'
import { BASE_PATH, SITE_URL } from '../src/config/site.js'
import { areas, articles } from './moura-queiroz-content.mjs'

const projectSlug = 'moura-queiroz-advocacia'
const projectBase = `${BASE_PATH.replace(/\/$/, '')}/${projectSlug}/`
const projectUrl = new URL(`${projectSlug}/`, `${SITE_URL}/`).href.replace(/\/$/, '')
const distRoot = path.join(process.cwd(), 'dist', projectSlug)
const remoteBase = String(process.env.AUDIT_SITE_URL || '').trim().replace(/\/+$/, '')
const remote = Boolean(remoteBase)
const failures = []
const titles = new Map()
const canonicals = new Map()
const assets = new Set()

const routes = [
  '', 'sobre/', 'areas-de-atuacao/', 'equipe/', 'artigos/', 'contato/', 'politica-de-privacidade/',
  ...areas.map((area) => `areas-de-atuacao/${area.slug}/`),
  ...articles.map((article) => `artigos/${article.slug}/`),
]

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const cleanText = (html = '') => String(html).replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
const extract = (html, pattern) => html.match(pattern)?.[1]?.trim() || ''
const expectedCanonical = (route = '') => new URL(route, `${projectUrl}/`).href

async function exists(filePath) {
  try { await fs.access(filePath); return true } catch { return false }
}

async function fetchRetry(url) {
  let error
  for (let attempt = 1; attempt <= 18; attempt += 1) {
    try {
      const response = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'MouraQueirozAudit/1.0' } })
      if (response.ok || response.status === 404) return response
      error = new Error(`HTTP ${response.status}`)
    } catch (caught) { error = caught }
    if (attempt < 18) await sleep(4000)
  }
  throw error || new Error('Falha de rede')
}

function pageUrl(route = '') {
  const base = remoteBase || projectUrl
  return route ? `${base}/${route}` : `${base}/`
}

function localFile(route = '') {
  return route ? path.join(distRoot, route, 'index.html') : path.join(distRoot, 'index.html')
}

async function loadPage(route = '') {
  if (!remote) {
    const file = localFile(route)
    if (!(await exists(file))) { failures.push(`Página ausente: ${file}`); return null }
    return { html: await fs.readFile(file, 'utf8'), status: 200, url: pageUrl(route) }
  }

  try {
    const response = await fetchRetry(pageUrl(route))
    return { html: await response.text(), status: response.status, url: response.url }
  } catch (error) {
    failures.push(`${route || '/'}: ${error.message}`)
    return null
  }
}

function collectAssets(html, sourceUrl) {
  for (const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/gi)) {
    const value = match[1]
    if (!/\.(?:css|js|svg|jpg|jpeg|png|webp|webmanifest)(?:[?#].*)?$/i.test(value)) continue
    try { assets.add(new URL(value, sourceUrl).href) } catch { failures.push(`Asset inválido: ${value}`) }
  }
  for (const key of ['og:image', 'twitter:image']) {
    const value = extract(html, new RegExp(`<meta\\s+(?:property|name)=["']${key.replace(':', '\\:')}["']\\s+content=["']([^"']+)["']`, 'i'))
    if (value) assets.add(value)
  }
}

async function auditPage(route = '') {
  const loaded = await loadPage(route)
  if (!loaded) return
  const { html, status, url } = loaded
  const title = extract(html, /<title>([\s\S]*?)<\/title>/i)
  const description = extract(html, /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)
  const robots = extract(html, /<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i)
  const googlebot = extract(html, /<meta\s+name=["']googlebot["']\s+content=["']([^"']+)["']/i)
  const canonical = extract(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)
  const h1Count = (html.match(/<h1\b/gi) || []).length
  const bodyText = cleanText(extract(html, /<body[^>]*>([\s\S]*?)<\/body>/i))
  const expected = expectedCanonical(route)

  if (status !== 200) failures.push(`${route || '/'}: HTTP ${status}`)
  if (!title) failures.push(`${route || '/'}: título ausente`)
  if (!description) failures.push(`${route || '/'}: description ausente`)
  if (robots !== 'noindex, nofollow' || googlebot !== 'noindex, nofollow') failures.push(`${route || '/'}: proteção noindex incorreta`)
  if (canonical !== expected) failures.push(`${route || '/'}: canonical ${canonical}; esperado ${expected}`)
  if (!/<meta\s+property=["']og:title["']/i.test(html) || !/<meta\s+property=["']og:image["']/i.test(html)) failures.push(`${route || '/'}: Open Graph incompleto`)
  if (!/<meta\s+name=["']twitter:card["']/i.test(html) || !/<meta\s+name=["']twitter:image["']/i.test(html)) failures.push(`${route || '/'}: Twitter Card incompleto`)
  if (h1Count !== 1) failures.push(`${route || '/'}: esperado um H1, encontrado ${h1Count}`)
  if (bodyText.length < 250) failures.push(`${route || '/'}: conteúdo textual insuficiente`)
  if (!/data-prerendered=["']true["']/i.test(html)) failures.push(`${route || '/'}: marcador pré-renderizado ausente`)
  if (!html.includes(`${projectBase}assets/styles.css`) || !html.includes(`${projectBase}assets/app.js`)) failures.push(`${route || '/'}: CSS ou JavaScript com caminho-base incorreto`)
  if (!html.includes(projectBase)) failures.push(`${route || '/'}: links internos não utilizam o caminho-base`)
  if (html.includes(`${projectBase}${projectSlug}/`)) failures.push(`${route || '/'}: caminho-base duplicado`)
  if (html.includes('seu-dominio.com.br')) failures.push(`${route || '/'}: domínio provisório encontrado`)

  if (titles.has(title)) failures.push(`${route || '/'}: título duplicado com ${titles.get(title)}`)
  else titles.set(title, route || '/')
  if (canonicals.has(canonical)) failures.push(`${route || '/'}: canonical duplicado com ${canonicals.get(canonical)}`)
  else canonicals.set(canonical, route || '/')

  collectAssets(html, url)
}

for (const route of routes) await auditPage(route)

if (!remote) {
  const required = ['404.html', 'manifest.webmanifest', 'sitemap.xml', 'assets/styles.css', 'assets/app.js', 'assets/favicon.svg', 'assets/social-share.svg']
  for (const item of required) if (!(await exists(path.join(distRoot, item)))) failures.push(`Arquivo ausente: ${item}`)

  const sitemap = await fs.readFile(path.join(distRoot, 'sitemap.xml'), 'utf8').catch(() => '')
  if (!/<urlset\s+xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"><\/urlset>/i.test(sitemap.replace(/\s+/g, ''))) failures.push('Sitemap demonstrativo não está vazio ou é inválido')
} else {
  for (const assetUrl of assets) {
    try {
      const parsed = new URL(assetUrl)
      if (parsed.origin === new URL(remoteBase).origin && !parsed.pathname.includes(`/${projectSlug}/`) && !parsed.pathname.includes(`${BASE_PATH}images/`)) failures.push(`Asset fora do caminho esperado: ${assetUrl}`)
      const response = await fetchRetry(assetUrl)
      if (!response.ok) failures.push(`Asset ${assetUrl}: HTTP ${response.status}`)
      await response.arrayBuffer()
    } catch (error) { failures.push(`Asset ${assetUrl}: ${error.message}`) }
  }

  try {
    const response = await fetchRetry(`${remoteBase}/sitemap.xml`)
    const xml = await response.text()
    if (!response.ok || /<url>/i.test(xml)) failures.push('Sitemap publicado deve ser válido e vazio em demonstração')
  } catch (error) { failures.push(`Sitemap publicado: ${error.message}`) }
}

if (failures.length) {
  console.error(`Auditoria Moura & Queiroz falhou (${failures.length}):\n${failures.map((item) => `- ${item}`).join('\n')}`)
  process.exit(1)
}

console.log([
  `Auditoria Moura & Queiroz concluída com sucesso (${remote ? 'publicação' : 'dist'}).`,
  `- ${routes.length} páginas HTML conferidas`,
  `- ${articles.length} artigos e ${areas.length} áreas de atuação`,
  `- ${assets.size} assets referenciados`,
  `- canonical inicial: ${projectUrl}/`,
  '- modo demonstração protegido com noindex, nofollow',
].join('\n'))
