import {
  ALLOW_INDEXING,
  BASE_PATH,
  IS_DEMO,
  SITE_URL,
  buildCanonicalUrl,
} from '../src/config/site.js'
import { allStaticRoutes } from './site-routes.mjs'

const configuredBase = String(process.env.AUDIT_SITE_URL || '').trim().replace(/\/+$/, '')
const attempts = Number(process.env.AUDIT_ATTEMPTS || 10)
const delayMs = Number(process.env.AUDIT_DELAY_MS || 6000)
const failures = []
const auditedPages = []
const auditedAssets = new Set()
const indexableProduction = ALLOW_INDEXING && !IS_DEMO

if (!/^https:\/\//.test(configuredBase)) {
  console.error('Defina AUDIT_SITE_URL com a URL HTTPS publicada, sem barra final.')
  process.exit(1)
}

if (configuredBase !== SITE_URL) {
  failures.push(`AUDIT_SITE_URL (${configuredBase}) difere de VITE_SITE_URL (${SITE_URL}).`)
}

const deploymentUrl = new URL(`${configuredBase}/`)
const deploymentOrigin = deploymentUrl.origin
const deploymentPath = deploymentUrl.pathname.replace(/\/$/, '')
const duplicatedBase = BASE_PATH === '/'
  ? ''
  : `${BASE_PATH}${BASE_PATH.replace(/^\//, '')}`

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

function publicRoutePath(routePath = '/') {
  if (routePath === '/') return '/'
  return `/${String(routePath).replace(/^\/+|\/+$/g, '')}/`
}

function routeUrl(routePath = '/') {
  const normalized = publicRoutePath(routePath)
  return normalized === '/' ? `${configuredBase}/` : `${configuredBase}${normalized}`
}

function normalizeText(value = '') {
  return String(value)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

function extract(html, pattern) {
  return html.match(pattern)?.[1]?.trim() || ''
}

function extractMetaContent(html, key, attribute = 'name') {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return extract(
    html,
    new RegExp(`<meta\\s+${attribute}=["']${escapedKey}["']\\s+content=["']([^"']+)["']`, 'i'),
  )
}

async function fetchWithRetry(url, options = {}) {
  let lastError
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        headers: { 'User-Agent': 'AlmeidaCastroDeploymentAudit/2.0' },
        ...options,
      })
      if (response.ok || response.status === 404) return response
      lastError = new Error(`HTTP ${response.status}`)
    } catch (error) {
      lastError = error
    }
    if (attempt < attempts) await sleep(delayMs)
  }
  throw new Error(`${url}: ${lastError?.message || 'falha de rede'}`)
}

function collectAssetUrls(html, pageUrl) {
  const references = []

  for (const match of html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)) references.push(match[1])
  for (const match of html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)) references.push(match[1])
  for (const match of html.matchAll(/<link[^>]+(?:rel=["'](?:stylesheet|icon|manifest|apple-touch-icon|preload)["'][^>]+href|href=["']([^"']+)["'][^>]+rel=["'](?:stylesheet|icon|manifest|apple-touch-icon|preload)["'])/gi)) {
    const href = match[1] || match[0].match(/href=["']([^"']+)["']/i)?.[1]
    if (href) references.push(href)
  }

  for (const property of ['og:image', 'twitter:image']) {
    const value = extractMetaContent(html, property, property.startsWith('og:') ? 'property' : 'name')
    if (value) references.push(value)
  }

  for (const reference of references) {
    try {
      auditedAssets.add(new URL(reference, pageUrl).href)
    } catch {
      failures.push(`Asset com URL inválida em ${pageUrl}: ${reference}`)
    }
  }
}

function validateInternalPath(url, context) {
  if (url.origin !== deploymentOrigin) return

  if (deploymentPath && !url.pathname.startsWith(`${deploymentPath}/`) && url.pathname !== deploymentPath) {
    failures.push(`${context}: URL interna fora do caminho-base: ${url.href}`)
  }

  if (duplicatedBase && url.pathname.includes(duplicatedBase)) {
    failures.push(`${context}: caminho-base duplicado: ${url.href}`)
  }
}

async function auditPage(route, { article = false } = {}) {
  const routePath = typeof route === 'string' ? route : route.path
  const expectedHeading = typeof route === 'string' ? '' : route.heading
  const url = routeUrl(routePath)
  let response

  try {
    response = await fetchWithRetry(url)
  } catch (error) {
    failures.push(error.message)
    return null
  }

  if (response.status !== 200) failures.push(`${routePath}: HTTP ${response.status}; esperado 200.`)
  if (!String(response.headers.get('content-type') || '').includes('text/html')) {
    failures.push(`${routePath}: Content-Type não é HTML.`)
  }

  const html = await response.text()
  const title = extract(html, /<title>([\s\S]*?)<\/title>/i)
  const description = extractMetaContent(html, 'description')
  const robots = extractMetaContent(html, 'robots')
  const googlebot = extractMetaContent(html, 'googlebot')
  const canonical = extract(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)
  const ogTitle = extractMetaContent(html, 'og:title', 'property')
  const ogUrl = extractMetaContent(html, 'og:url', 'property')
  const ogImage = extractMetaContent(html, 'og:image', 'property')
  const twitterCard = extractMetaContent(html, 'twitter:card')
  const twitterTitle = extractMetaContent(html, 'twitter:title')
  const twitterImage = extractMetaContent(html, 'twitter:image')
  const h1Matches = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)]
  const h1 = normalizeText(h1Matches[0]?.[1] || '')
  const rootOpen = html.match(/<div\s+id=["']root["'][^>]*>/i)
  const rootStart = rootOpen?.index ?? -1
  const bodyEnd = html.search(/<\/body>/i)
  const rootContent = rootStart >= 0 && bodyEnd > rootStart ? html.slice(rootStart, bodyEnd) : ''
  const visibleText = normalizeText(rootContent)
  const internalLinks = [...html.matchAll(/<a\s+[^>]*href=["']([^"']+)["']/gi)]
    .map((match) => match[1])
    .filter((href) => {
      try {
        return new URL(href, url).origin === deploymentOrigin
      } catch {
        return false
      }
    })
  const expectedCanonical = buildCanonicalUrl(routePath)
  const expectedRobots = indexableProduction ? 'index, follow' : 'noindex, nofollow'

  if (!title) failures.push(`${routePath}: título ausente.`)
  if (!description) failures.push(`${routePath}: meta description ausente.`)
  if (!robots.startsWith(expectedRobots)) failures.push(`${routePath}: robots incorreto (${robots || 'ausente'}).`)
  if (!googlebot.startsWith(expectedRobots)) failures.push(`${routePath}: googlebot incorreto (${googlebot || 'ausente'}).`)
  if (!canonical) failures.push(`${routePath}: canonical ausente.`)
  if (canonical !== expectedCanonical) failures.push(`${routePath}: canonical ${canonical || '(vazio)'}; esperado ${expectedCanonical}.`)
  if (ogTitle !== title || ogUrl !== canonical || !ogImage) failures.push(`${routePath}: Open Graph incompleto ou inconsistente.`)
  if (!twitterCard || twitterTitle !== title || !twitterImage) failures.push(`${routePath}: Twitter Cards incompletos ou inconsistentes.`)
  if (h1Matches.length !== 1) failures.push(`${routePath}: esperado um H1; encontrado ${h1Matches.length}.`)
  if (!h1) failures.push(`${routePath}: H1 sem texto.`)
  if (expectedHeading && h1 !== expectedHeading) failures.push(`${routePath}: H1 "${h1}"; esperado "${expectedHeading}".`)
  if (!/data-prerendered=["']true["']/i.test(rootContent)) failures.push(`${routePath}: conteúdo pré-renderizado ausente dentro de #root.`)
  if (/<div\s+id=["']root["'][^>]*>\s*<\/div>/i.test(html)) failures.push(`${routePath}: HTML depende de #root vazio.`)
  if (visibleText.length < (article ? 500 : 180)) failures.push(`${routePath}: conteúdo textual pré-renderizado insuficiente.`)
  if (internalLinks.length < 2) failures.push(`${routePath}: links internos insuficientes.`)
  if (!/<link[^>]+rel=["']stylesheet["'][^>]+href=["'][^"']+\.css/i.test(html)) failures.push(`${routePath}: CSS principal ausente.`)
  if (!/<script[^>]+type=["']module["'][^>]+src=["'][^"']+\.js/i.test(html)) failures.push(`${routePath}: JavaScript principal ausente.`)
  if (html.includes('seu-dominio.com.br')) failures.push(`${routePath}: domínio provisório encontrado.`)
  if (canonical.includes('/almeida-castro-advocacia/almeida-castro-advocacia/')) failures.push(`${routePath}: canonical com caminho-base duplicado.`)

  if (article) {
    if (!/<article\b/i.test(rootContent)) failures.push(`${routePath}: elemento article ausente.`)
    if (extractMetaContent(html, 'og:type', 'property') !== 'article') failures.push(`${routePath}: og:type article ausente.`)
    if (!extractMetaContent(html, 'article:published_time', 'property')) failures.push(`${routePath}: data de publicação ausente.`)
    if (!/<time\s+datetime=/i.test(rootContent)) failures.push(`${routePath}: elemento time ausente.`)
  }

  for (const href of internalLinks) {
    try {
      validateInternalPath(new URL(href, url), routePath)
    } catch {
      failures.push(`${routePath}: link interno inválido: ${href}`)
    }
  }

  collectAssetUrls(html, url)
  const result = { routePath, url, html, title, canonical, h1 }
  auditedPages.push(result)
  return result
}

for (const route of allStaticRoutes) await auditPage(route)

const articlesPage = auditedPages.find((page) => page.routePath === '/artigos')
const articleHref = articlesPage
  ? [...articlesPage.html.matchAll(/href=["']([^"']*\/artigos\/[^"'/?#]+\/)["']/gi)]
      .map((match) => match[1])
      .find((href) => !href.endsWith('/artigos/'))
  : ''

if (!articleHref) {
  failures.push('Não foi possível localizar um artigo publicado para auditoria HTTP.')
} else {
  const articleUrl = new URL(articleHref, articlesPage.url)
  validateInternalPath(articleUrl, 'artigo publicado')
  const routePath = articleUrl.pathname.slice(deploymentPath.length) || '/'
  await auditPage(routePath, { article: true })
}

const uniqueTitles = new Map()
const uniqueCanonicals = new Map()
for (const page of auditedPages) {
  if (uniqueTitles.has(page.title)) failures.push(`${page.routePath}: título duplicado com ${uniqueTitles.get(page.title)}.`)
  else uniqueTitles.set(page.title, page.routePath)

  if (uniqueCanonicals.has(page.canonical)) failures.push(`${page.routePath}: canonical duplicado com ${uniqueCanonicals.get(page.canonical)}.`)
  else uniqueCanonicals.set(page.canonical, page.routePath)
}

try {
  const adminUrl = `${configuredBase}/admin/`
  const response = await fetchWithRetry(adminUrl)
  const html = await response.text()
  if (response.status !== 200) failures.push(`/admin/: HTTP ${response.status}; esperado 200.`)
  if (!/<meta\s+name=["']robots["']\s+content=["']noindex, nofollow["']/i.test(html)) failures.push('/admin/: meta noindex ausente.')
  if (!/<h1\b[^>]*>[\s\S]*?<\/h1>/i.test(html)) failures.push('/admin/: H1 ausente.')
  collectAssetUrls(html, adminUrl)
} catch (error) {
  failures.push(error.message)
}

for (const assetUrl of auditedAssets) {
  let parsed
  try {
    parsed = new URL(assetUrl)
  } catch {
    failures.push(`Asset inválido: ${assetUrl}`)
    continue
  }

  validateInternalPath(parsed, 'asset')
  try {
    const response = await fetchWithRetry(parsed.href)
    if (!response.ok) failures.push(`Asset ${parsed.href}: HTTP ${response.status}.`)
    await response.arrayBuffer()
  } catch (error) {
    failures.push(error.message)
  }
}

try {
  const robotsResponse = await fetchWithRetry(`${configuredBase}/robots.txt`)
  const robots = await robotsResponse.text()
  if (!robotsResponse.ok) failures.push(`robots.txt: HTTP ${robotsResponse.status}.`)
  if (!/^User-agent:\s*\*/im.test(robots) || !/^Allow:\s*\/$/im.test(robots)) failures.push('robots.txt publicado não permite rastreamento.')
  if (/^Disallow:\s*\/$/im.test(robots)) failures.push('robots.txt publicado bloqueia todo o site.')
  if (!indexableProduction && /^Sitemap:/im.test(robots)) failures.push('robots.txt não indexável referencia sitemap.')
  if (indexableProduction && !robots.includes(`Sitemap: ${buildCanonicalUrl('/sitemap.xml')}`)) failures.push('robots.txt de produção possui sitemap incorreto.')
} catch (error) {
  failures.push(error.message)
}

try {
  const sitemapResponse = await fetchWithRetry(`${configuredBase}/sitemap.xml`)
  const sitemap = await sitemapResponse.text()
  if (!sitemapResponse.ok) failures.push(`sitemap.xml: HTTP ${sitemapResponse.status}.`)
  if (!/<urlset\s+xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/i.test(sitemap)) failures.push('sitemap.xml publicado é inválido.')
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
  if (new Set(locations).size !== locations.length) failures.push('sitemap.xml publicado contém URLs duplicadas.')
  if (!indexableProduction && locations.length > 0) failures.push('sitemap.xml não indexável contém URLs públicas.')
  if (indexableProduction && locations.length === 0) failures.push('sitemap.xml de produção está vazio.')
  for (const location of locations) {
    if (!location.startsWith(`${SITE_URL}/`)) failures.push(`sitemap.xml contém URL fora do domínio configurado: ${location}`)
    if (duplicatedBase && new URL(location).pathname.includes(duplicatedBase)) failures.push(`sitemap.xml contém caminho-base duplicado: ${location}`)
  }
} catch (error) {
  failures.push(error.message)
}

try {
  const missingUrl = `${configuredBase}/pagina-inexistente-auditoria/`
  const missingResponse = await fetchWithRetry(missingUrl)
  if (missingResponse.status !== 404) failures.push(`Página inexistente respondeu ${missingResponse.status}; esperado 404.`)
  const missingHtml = await missingResponse.text()
  if (!/data-prerendered=["']true["']/i.test(missingHtml)) failures.push('Página 404 publicada não possui conteúdo pré-renderizado.')
  if (!/<h1\b[^>]*>\s*Página não encontrada\s*<\/h1>/i.test(missingHtml)) failures.push('Página 404 publicada não possui H1 adequado.')
  if (!/<meta\s+name=["']robots["']\s+content=["']noindex, nofollow["']/i.test(missingHtml)) failures.push('Página 404 publicada não possui noindex.')
} catch (error) {
  failures.push(error.message)
}

if (failures.length) {
  console.error(`Auditoria do site publicado falhou (${failures.length} problema(s)):\n${failures.map((item) => `- ${item}`).join('\n')}`)
  process.exit(1)
}

console.log([
  'Auditoria HTTP concluída com sucesso.',
  `- ${auditedPages.length} páginas públicas responderam com HTML próprio`,
  `- ${auditedAssets.size} assets, incluindo CSS, JavaScript, imagens, ícones, manifest e painel, responderam com sucesso`,
  '- títulos, descriptions, robots, googlebot, canonicals, Open Graph, Twitter Cards, H1 e conteúdo pré-renderizado conferidos',
  '- um artigo publicado, página 404, robots.txt e sitemap.xml conferidos',
  `- modo: ${indexableProduction ? 'produção indexável' : 'demonstração/não indexável'}`,
].join('\n'))
