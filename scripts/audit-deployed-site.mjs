const configuredBase = String(process.env.AUDIT_SITE_URL || '').trim().replace(/\/+$/, '')
const attempts = Number(process.env.AUDIT_ATTEMPTS || 10)
const delayMs = Number(process.env.AUDIT_DELAY_MS || 6000)
const failures = []

if (!/^https:\/\//.test(configuredBase)) {
  console.error('Defina AUDIT_SITE_URL com a URL HTTPS publicada, sem barra final.')
  process.exit(1)
}

const routes = [
  '/',
  '/sobre/',
  '/areas-de-atuacao/',
  '/areas-de-atuacao/direito-previdenciario/',
  '/equipe/',
  '/artigos/',
  '/contato/',
  '/politica-de-privacidade/',
]

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

function routeUrl(routePath) {
  return routePath === '/' ? `${configuredBase}/` : `${configuredBase}${routePath}`
}

function stripHtml(value = '') {
  return String(value)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extract(html, pattern) {
  return html.match(pattern)?.[1]?.trim() || ''
}

async function fetchWithRetry(url, options = {}) {
  let lastError
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        headers: { 'User-Agent': 'AlmeidaCastroDeploymentAudit/1.0' },
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

async function auditPage(routePath, expectedStatus = 200) {
  const url = routeUrl(routePath)
  let response
  try {
    response = await fetchWithRetry(url)
  } catch (error) {
    failures.push(error.message)
    return null
  }

  if (response.status !== expectedStatus) {
    failures.push(`${routePath}: HTTP ${response.status}; esperado ${expectedStatus}.`)
  }

  const html = await response.text()
  const title = extract(html, /<title>([\s\S]*?)<\/title>/i)
  const canonical = extract(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)
  const h1Count = (html.match(/<h1\b/gi) || []).length
  const rootStart = html.search(/<div\s+id=["']root["'][^>]*>/i)
  const bodyEnd = html.search(/<\/body>/i)
  const rootContent = rootStart >= 0 && bodyEnd > rootStart ? html.slice(rootStart, bodyEnd) : ''
  const expectedCanonical = routePath === '/' ? `${configuredBase}/` : `${configuredBase}${routePath}`

  if (!title) failures.push(`${routePath}: título ausente.`)
  if (h1Count !== 1) failures.push(`${routePath}: esperado um H1; encontrado ${h1Count}.`)
  if (!/data-prerendered=["']true["']/i.test(rootContent)) failures.push(`${routePath}: conteúdo pré-renderizado ausente dentro de #root.`)
  if (stripHtml(rootContent).length < 180) failures.push(`${routePath}: conteúdo textual insuficiente.`)
  if (canonical !== expectedCanonical) failures.push(`${routePath}: canonical ${canonical || '(vazio)'}; esperado ${expectedCanonical}.`)
  if (!/<meta\s+name=["']robots["']\s+content=["']noindex, nofollow["']/i.test(html)) failures.push(`${routePath}: proteção noindex ausente.`)
  if (!/<link[^>]+rel=["']stylesheet["'][^>]+href=["'][^"']+\.css/i.test(html)) failures.push(`${routePath}: CSS principal ausente.`)
  if (!/<script[^>]+type=["']module["'][^>]+src=["'][^"']+\.js/i.test(html)) failures.push(`${routePath}: JavaScript principal ausente.`)
  if (/<div\s+id=["']root["'][^>]*>\s*<\/div>/i.test(html)) failures.push(`${routePath}: HTML depende de #root vazio.`)

  return { routePath, url, html, title, canonical }
}

const auditedPages = []
for (const routePath of routes) {
  const result = await auditPage(routePath)
  if (result) auditedPages.push(result)
}

const articlesPage = auditedPages.find((page) => page.routePath === '/artigos/')
const articleHref = articlesPage
  ? [...articlesPage.html.matchAll(/href=["']([^"']*\/artigos\/[^"'/?#]+\/)["']/gi)]
      .map((match) => match[1])
      .find((href) => !href.endsWith('/artigos/'))
  : ''

if (!articleHref) {
  failures.push('Não foi possível localizar um artigo publicado para auditoria HTTP.')
} else {
  const articleUrl = new URL(articleHref, `${configuredBase}/`)
  const basePath = new URL(`${configuredBase}/`).pathname.replace(/\/$/, '')
  const routePath = articleUrl.pathname.slice(basePath.length) || '/'
  const articleResult = await auditPage(routePath.startsWith('/') ? routePath : `/${routePath}`)
  if (articleResult && !/<article\b/i.test(articleResult.html)) failures.push(`${routePath}: conteúdo completo do artigo ausente.`)
}

const uniqueTitles = new Set()
for (const page of auditedPages) {
  if (uniqueTitles.has(page.title)) failures.push(`${page.routePath}: título duplicado no conjunto auditado.`)
  uniqueTitles.add(page.title)
}

const assetUrls = new Set()
for (const page of auditedPages) {
  for (const match of page.html.matchAll(/(?:src|href)=["']([^"']+\.(?:js|css)(?:[?#][^"']*)?)["']/gi)) {
    assetUrls.add(new URL(match[1], page.url).href)
  }
}
for (const assetUrl of assetUrls) {
  try {
    const response = await fetchWithRetry(assetUrl)
    if (!response.ok) failures.push(`Asset ${assetUrl}: HTTP ${response.status}.`)
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
  if (/^Sitemap:/im.test(robots)) failures.push('robots.txt demonstrativo referencia sitemap.')
} catch (error) {
  failures.push(error.message)
}

try {
  const sitemapResponse = await fetchWithRetry(`${configuredBase}/sitemap.xml`)
  const sitemap = await sitemapResponse.text()
  if (!sitemapResponse.ok) failures.push(`sitemap.xml: HTTP ${sitemapResponse.status}.`)
  if (!/<urlset\s+xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/i.test(sitemap)) failures.push('sitemap.xml publicado é inválido.')
  if (/<url>/i.test(sitemap)) failures.push('sitemap.xml demonstrativo contém URLs indexáveis.')
} catch (error) {
  failures.push(error.message)
}

try {
  const missingResponse = await fetchWithRetry(`${configuredBase}/pagina-inexistente-auditoria/`)
  if (missingResponse.status !== 404) failures.push(`Página inexistente respondeu ${missingResponse.status}; esperado 404.`)
  const missingHtml = await missingResponse.text()
  if (!/data-prerendered=["']true["']/i.test(missingHtml) || !/Página não encontrada/i.test(missingHtml)) failures.push('Página 404 publicada não possui conteúdo pré-renderizado.')
} catch (error) {
  failures.push(error.message)
}

if (failures.length) {
  console.error(`Auditoria do site publicado falhou (${failures.length} problema(s)):\n${failures.map((item) => `- ${item}`).join('\n')}`)
  process.exit(1)
}

console.log([
  'Auditoria HTTP concluída com sucesso.',
  `- ${auditedPages.length} páginas institucionais responderam com HTML próprio`,
  `- ${assetUrls.size} arquivos CSS/JavaScript responderam com sucesso`,
  '- um artigo publicado e a página 404 foram conferidos',
  '- canonicals, títulos, H1, noindex, pré-renderização, robots e sitemap conferidos',
].join('\n'))
