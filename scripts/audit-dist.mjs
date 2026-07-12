import fs from 'node:fs/promises'
import path from 'node:path'
import { load } from 'js-yaml'
import {
  ALLOW_INDEXING,
  BASE_PATH,
  IS_DEMO,
  SITE_URL,
  buildAssetUrl,
  buildCanonicalUrl,
} from '../src/config/site.js'
import { allStaticRoutes } from './site-routes.mjs'

const rootDir = process.cwd()
const distDir = path.join(rootDir, 'dist')
const articlesDir = path.join(rootDir, 'src', 'content', 'articles')
const failures = []
const now = new Date()

const requiredStaticPaths = [
  '/',
  '/sobre',
  '/areas-de-atuacao',
  '/areas-de-atuacao/direito-previdenciario',
  '/equipe',
  '/artigos',
  '/contato',
  '/politica-de-privacidade',
]

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

function fail(message) {
  failures.push(message)
}

function stripHtml(value = '') {
  return String(value)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(?:nbsp|amp|quot|#039);/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extract(html, pattern) {
  return html.match(pattern)?.[1]?.trim() || ''
}

function routeFile(routePath) {
  if (routePath === '/404') return path.join(distDir, '404.html')
  const relative = routePath === '/' ? '' : routePath.replace(/^\/+|\/+$/g, '')
  return path.join(distDir, relative, 'index.html')
}

function localAssetToFile(assetUrl) {
  const pathname = assetUrl.split(/[?#]/)[0]
  if (!pathname.startsWith('/')) return null
  const normalizedBase = BASE_PATH === '/' ? '/' : BASE_PATH
  if (normalizedBase !== '/' && !pathname.startsWith(normalizedBase)) return null
  const relative = normalizedBase === '/'
    ? pathname.replace(/^\/+/, '')
    : pathname.slice(normalizedBase.length).replace(/^\/+/, '')
  return path.join(distDir, relative)
}

async function auditLocalAssets(routePath, html) {
  const attributes = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/gi)].map((match) => match[1])
  const cleanBase = BASE_PATH.replace(/^\/+|\/+$/g, '')
  const duplicatedBase = cleanBase ? `/${cleanBase}/${cleanBase}/` : ''

  for (const value of attributes) {
    if (!value || /^(?:https?:|mailto:|tel:|data:|blob:|#)/i.test(value)) continue
    if (duplicatedBase && value.includes(duplicatedBase)) fail(`${routePath}: caminho-base duplicado em ${value}`)
    if (value.startsWith('/') && BASE_PATH !== '/' && !value.startsWith(BASE_PATH)) {
      fail(`${routePath}: asset ou link absoluto fora do caminho-base: ${value}`)
      continue
    }

    const assetFile = localAssetToFile(value)
    if (!assetFile) continue
    const pathname = value.split(/[?#]/)[0]
    const isDirectoryRoute = pathname.endsWith('/') || !/\.[a-z0-9]{1,12}$/i.test(pathname)
    const candidate = isDirectoryRoute ? path.join(assetFile, 'index.html') : assetFile
    if (!(await exists(candidate))) fail(`${routePath}: destino local inexistente: ${value}`)
  }
}

async function auditHtml(routePath, html, { article = false, noIndex = false, notFound = false } = {}) {
  const title = extract(html, /<title>([\s\S]*?)<\/title>/i)
  const description = extract(html, /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)
  const robots = extract(html, /<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i)
  const googlebot = extract(html, /<meta\s+name=["']googlebot["']\s+content=["']([^"']+)["']/i)
  const canonical = extract(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)
  const h1Count = (html.match(/<h1\b/gi) || []).length
  const internalLinks = [...html.matchAll(/<a\s+[^>]*href=["']([^"']+)["']/gi)]
    .map((match) => match[1])
    .filter((href) => href.startsWith(BASE_PATH) || (BASE_PATH === '/' && href.startsWith('/')))
  const rootOpen = html.match(/<div\s+id=["']root["'][^>]*>/i)
  const rootStart = rootOpen?.index ?? -1
  const rootTagEnd = rootStart >= 0 ? rootStart + rootOpen[0].length : -1
  const bodyEnd = html.search(/<\/body>/i)
  const rootSection = rootStart >= 0 && bodyEnd > rootStart ? html.slice(rootStart, bodyEnd) : ''
  const prerenderedIndex = rootSection.search(/data-prerendered=["']true["']/i)
  const visibleText = stripHtml(rootSection)

  if (!title) fail(`${routePath}: <title> ausente.`)
  if (!description) fail(`${routePath}: meta description ausente.`)
  if (!robots) fail(`${routePath}: meta robots ausente.`)
  if (!googlebot) fail(`${routePath}: meta googlebot ausente.`)
  if (!canonical) fail(`${routePath}: canonical ausente.`)
  if (!/<meta\s+property=["']og:title["']/i.test(html) || !/<meta\s+property=["']og:url["']/i.test(html)) fail(`${routePath}: Open Graph incompleto.`)
  if (!/<meta\s+name=["']twitter:card["']/i.test(html) || !/<meta\s+name=["']twitter:title["']/i.test(html)) fail(`${routePath}: Twitter Cards incompletos.`)
  if (h1Count !== 1) fail(`${routePath}: deve possuir exatamente um H1; encontrado ${h1Count}.`)
  if (rootStart < 0 || rootTagEnd < 0 || bodyEnd < 0) fail(`${routePath}: estrutura #root inválida.`)
  if (prerenderedIndex < 0) fail(`${routePath}: data-prerendered="true" ausente dentro de #root.`)
  if (/<div\s+id=["']root["'][^>]*>\s*<\/div>/i.test(html)) fail(`${routePath}: contém somente #root vazio.`)
  if (visibleText.length < 180) fail(`${routePath}: conteúdo textual insuficiente (${visibleText.length} caracteres).`)
  if (internalLinks.length < 2) fail(`${routePath}: links internos insuficientes.`)
  if (!/<script[^>]+type=["']module["'][^>]+src=["'][^"']+\.js(?:[?#][^"']*)?["']/i.test(html)) fail(`${routePath}: JavaScript principal ausente.`)
  if (!/<link[^>]+rel=["']stylesheet["'][^>]+href=["'][^"']+\.css(?:[?#][^"']*)?["']/i.test(html)) fail(`${routePath}: CSS principal ausente.`)
  if (html.includes('seu-dominio.com.br')) fail(`${routePath}: domínio provisório encontrado.`)

  const expectedCanonical = buildCanonicalUrl(routePath)
  if (canonical !== expectedCanonical) fail(`${routePath}: canonical ${canonical || '(vazio)'}; esperado ${expectedCanonical}.`)
  if (canonical.includes('/almeida-castro-advocacia/almeida-castro-advocacia/')) fail(`${routePath}: canonical com caminho-base duplicado.`)

  const shouldNoIndex = IS_DEMO || noIndex || notFound || !ALLOW_INDEXING
  if (shouldNoIndex && robots !== 'noindex, nofollow') fail(`${routePath}: robots deveria ser noindex, nofollow.`)
  if (shouldNoIndex && googlebot !== 'noindex, nofollow') fail(`${routePath}: googlebot deveria ser noindex, nofollow.`)
  if (!shouldNoIndex && !robots.startsWith('index, follow')) fail(`${routePath}: robots deveria permitir indexação.`)

  if (article) {
    if (!/<meta\s+property=["']og:type["']\s+content=["']article["']/i.test(html)) fail(`${routePath}: og:type article ausente.`)
    if (!/article:published_time/i.test(html) || !/<time\s+datetime=/i.test(html)) fail(`${routePath}: metadados de publicação ausentes.`)
    if (!/<article\b/i.test(rootSection) || stripHtml(rootSection).length < 500) fail(`${routePath}: artigo completo não está pré-renderizado.`)
  }

  await auditLocalAssets(routePath, html)
  return { title, canonical }
}

const articleFiles = (await fs.readdir(articlesDir)).filter((file) => file.endsWith('.md'))
const publishedArticles = []
const excludedArticles = []
for (const file of articleFiles) {
  const raw = await read(path.join(articlesDir, file))
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---/)
  const data = match ? load(match[1]) || {} : {}
  const slug = data.slug || file.replace(/\.md$/, '')
  const routePath = `/artigos/${slug}`
  const publishedDate = data.date || data.published_at ? new Date(data.date || data.published_at) : null
  const future = publishedDate && !Number.isNaN(publishedDate.getTime()) && publishedDate > now
  const entry = { file, slug, routePath, data, future }
  if (data.published === false || future) excludedArticles.push(entry)
  else publishedArticles.push(entry)
}

const requiredArticle = publishedArticles[0]
if (!requiredArticle) fail('Nenhum artigo publicado disponível para a auditoria.')

const pathsToAudit = new Set([...allStaticRoutes.map((route) => route.path), ...requiredStaticPaths])
const titles = new Map()
const canonicals = new Map()

for (const routePath of pathsToAudit) {
  const filePath = routeFile(routePath)
  if (!(await exists(filePath))) {
    fail(`Página ausente: ${path.relative(rootDir, filePath)}`)
    continue
  }
  const result = await auditHtml(routePath, await read(filePath))
  if (result.title) {
    if (titles.has(result.title)) fail(`${routePath}: título duplicado com ${titles.get(result.title)}.`)
    else titles.set(result.title, routePath)
  }
  if (result.canonical) {
    if (canonicals.has(result.canonical)) fail(`${routePath}: canonical duplicado com ${canonicals.get(result.canonical)}.`)
    else canonicals.set(result.canonical, routePath)
  }
}

for (const article of publishedArticles) {
  const filePath = routeFile(article.routePath)
  if (!(await exists(filePath))) {
    fail(`Artigo publicado ausente: ${article.routePath}`)
    continue
  }
  await auditHtml(article.routePath, await read(filePath), {
    article: true,
    noIndex: Boolean(article.data.noIndex || article.data.no_index),
  })
}

for (const article of excludedArticles) {
  if (await exists(routeFile(article.routePath))) fail(`Artigo futuro ou oculto foi exportado: ${article.routePath}`)
}

const notFoundPath = routeFile('/404')
if (!(await exists(notFoundPath))) fail('Página 404 ausente.')
else await auditHtml('/404', await read(notFoundPath), { notFound: true })

const requiredAssets = [
  'favicon.svg',
  'manifest.webmanifest',
  'admin/index.html',
  'admin/admin.css',
  'admin/admin.js',
  'admin/admin-password.js',
  'images/social-share.svg',
  'images/hero-office.jpg',
  'images/about-office.jpg',
  'images/team-rafael.jpg',
  'images/team-marina.jpg',
  'icons/icon-192.png',
  'icons/icon-512.png',
]
for (const asset of requiredAssets) {
  if (!(await exists(path.join(distDir, asset)))) fail(`Asset essencial ausente: ${asset}`)
}

const manifestPath = path.join(distDir, 'manifest.webmanifest')
if (await exists(manifestPath)) {
  try {
    const manifest = JSON.parse(await read(manifestPath))
    if (manifest.start_url !== BASE_PATH || manifest.scope !== BASE_PATH) fail('Manifest não utiliza o caminho-base configurado.')
    for (const icon of manifest.icons || []) {
      if (BASE_PATH !== '/' && !icon.src.startsWith(BASE_PATH)) fail(`Manifest contém ícone fora do caminho-base: ${icon.src}`)
      const iconFile = localAssetToFile(icon.src)
      if (!iconFile || !(await exists(iconFile))) fail(`Ícone do manifest inexistente: ${icon.src}`)
    }
  } catch (error) {
    fail(`Manifest inválido: ${error.message}`)
  }
}

const robotsPath = path.join(distDir, 'robots.txt')
if (!(await exists(robotsPath))) fail('robots.txt ausente.')
else {
  const robots = await read(robotsPath)
  if (!/^User-agent:\s*\*/im.test(robots) || !/^Allow:\s*\/$/im.test(robots)) fail('robots.txt deve permitir rastreamento.')
  if (/^Disallow:\s*\/$/im.test(robots)) fail('robots.txt não pode bloquear todo o site.')
  if (IS_DEMO && /^Sitemap:/im.test(robots)) fail('robots.txt demonstrativo não deve referenciar sitemap.')
  if (!IS_DEMO && ALLOW_INDEXING && !robots.includes(`Sitemap: ${buildCanonicalUrl('/sitemap.xml')}`)) fail('robots.txt de produção possui sitemap incorreto.')
}

const sitemapPath = path.join(distDir, 'sitemap.xml')
if (!(await exists(sitemapPath))) fail('sitemap.xml ausente.')
else {
  const sitemap = await read(sitemapPath)
  if (!/^<\?xml[\s\S]*<urlset\s+xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">[\s\S]*<\/urlset>\s*$/i.test(sitemap)) fail('sitemap.xml não é um XML válido no formato esperado.')
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
  if (new Set(locations).size !== locations.length) fail('sitemap.xml contém URLs duplicadas.')
  if (IS_DEMO && locations.length > 0) fail('sitemap.xml demonstrativo contém URLs indexáveis.')
  if (IS_DEMO && sitemap.includes('seu-dominio.com.br')) fail('sitemap.xml demonstrativo contém domínio provisório.')

  if (!IS_DEMO && ALLOW_INDEXING) {
    const expectedLocations = [
      ...allStaticRoutes.map((route) => buildCanonicalUrl(route.path)),
      ...publishedArticles
        .filter((article) => !(article.data.noIndex || article.data.no_index))
        .map((article) => buildCanonicalUrl(article.routePath)),
    ]
    for (const location of expectedLocations) {
      if (!locations.includes(location)) fail(`sitemap.xml não contém ${location}`)
    }
    for (const article of publishedArticles.filter((entry) => entry.data.noIndex || entry.data.no_index)) {
      if (locations.includes(buildCanonicalUrl(article.routePath))) fail(`sitemap.xml contém artigo noIndex: ${article.routePath}`)
    }
    for (const article of excludedArticles) {
      if (locations.includes(buildCanonicalUrl(article.routePath))) fail(`sitemap.xml contém artigo futuro ou oculto: ${article.routePath}`)
    }
    for (const lastmod of [...sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((match) => match[1])) {
      if (Number.isNaN(new Date(lastmod).getTime())) fail(`sitemap.xml contém lastmod inválido: ${lastmod}`)
    }
  }
}

const expectedHome = `${SITE_URL}/`
const expectedAbout = `${SITE_URL}/sobre/`
if (buildCanonicalUrl('/') !== expectedHome) fail(`Canonical inicial incorreto: ${buildCanonicalUrl('/')}`)
if (buildCanonicalUrl('/sobre') !== expectedAbout) fail(`Canonical interno incorreto: ${buildCanonicalUrl('/sobre')}`)
if (buildCanonicalUrl(`${BASE_PATH}sobre/`) !== expectedAbout) fail('Normalização não remove caminho-base já presente na rota.')
if (buildAssetUrl(`${BASE_PATH}images/hero-office.jpg`) !== `${SITE_URL}/images/hero-office.jpg`) fail('Normalização de asset duplicou ou removeu incorretamente o caminho-base.')

if (failures.length) {
  console.error(`Auditoria da pasta dist falhou (${failures.length} problema(s)):\n${failures.map((item) => `- ${item}`).join('\n')}`)
  process.exit(1)
}

console.log([
  'Auditoria da pasta dist concluída com sucesso.',
  `- ${pathsToAudit.size} páginas estáticas conferidas`,
  `- ${publishedArticles.length} artigos publicados pré-renderizados`,
  `- ${excludedArticles.length} artigos futuros ou ocultos ausentes`,
  '- página 404, canonicals, metadados, conteúdo, assets, manifest, robots e sitemap conferidos',
  `- canonical inicial: ${expectedHome}`,
  `- canonical interno: ${expectedAbout}`,
].join('\n'))
