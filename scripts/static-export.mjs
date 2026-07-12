import fs from 'node:fs/promises'
import path from 'node:path'
import { load } from 'js-yaml'
import { marked } from 'marked'
import SITE, {
  ALLOW_INDEXING,
  BASE_PATH,
  IS_DEMO,
  buildAssetUrl,
  buildCanonicalUrl,
} from '../src/config/site.js'
import { allStaticRoutes, practiceAreas, routeByPath } from './site-routes.mjs'

const rootDir = process.cwd()
const distDir = path.join(rootDir, 'dist')
const articlesDir = path.join(rootDir, 'src', 'content', 'articles')
const now = new Date()

marked.setOptions({ gfm: true, breaks: false })

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;')

const stripHtml = (value = '') => String(value).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

function sanitizeStaticHtml(value = '') {
  return String(value)
    .replace(/<\/?(?:script|style|iframe|object|embed)[^>]*>/gi, '')
    .replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(?:href|src)\s*=\s*(["'])\s*javascript:[\s\S]*?\1/gi, 'href="#"')
}

function splitFrontmatter(raw = '') {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/)
  if (!match) return { data: {}, body: raw }
  return { data: load(match[1]) || {}, body: match[2].trim() }
}

function normalizeDate(value, fallback = now.toISOString()) {
  const date = value ? new Date(value) : new Date(fallback)
  return Number.isNaN(date.getTime()) ? fallback : date.toISOString()
}

function localPath(route = '/') {
  if (/^(?:https?:|mailto:|tel:|data:|blob:|#)/i.test(route)) return route
  const base = BASE_PATH === '/' ? '/' : BASE_PATH
  const pathname = String(route).split(/[?#]/)[0]
  const suffix = String(route).slice(pathname.length)
  const clean = pathname === '/' ? '' : pathname.replace(/^\/+|\/+$/g, '')
  const isFile = /\.[a-z0-9]{1,12}$/i.test(clean)
  const relative = `${clean}${clean && !isFile ? '/' : ''}`
  return `${base}${relative}${suffix}`.replace(/([^:]\/)\/{2,}/g, '$1')
}

function breadcrumbItems(routePath, title) {
  const items = [{ name: 'Início', path: '/' }]
  if (routePath.startsWith('/areas-de-atuacao/')) {
    items.push({ name: 'Áreas de Atuação', path: '/areas-de-atuacao' })
  } else if (routePath.startsWith('/artigos/')) {
    items.push({ name: 'Artigos', path: '/artigos' })
  }
  if (routePath !== '/') items.push({ name: title, path: routePath })
  return items
}

function breadcrumbHtml(items) {
  if (items.length <= 1) return ''
  return `<nav class="ssg-breadcrumb" aria-label="Navegação estrutural"><ol>${items.map((item, index) => {
    const current = index === items.length - 1
    return `<li>${current ? `<span aria-current="page">${escapeHtml(item.name)}</span>` : `<a href="${escapeHtml(localPath(item.path))}">${escapeHtml(item.name)}</a>`}</li>`
  }).join('')}</ol></nav>`
}

function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: buildCanonicalUrl(item.path),
    })),
  }
}

function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LegalService', 'Organization'],
    name: SITE.name,
    alternateName: SITE.shortName,
    url: buildCanonicalUrl('/'),
    logo: buildAssetUrl(SITE.logo),
    image: buildAssetUrl(SITE.shareImage),
    description: SITE.description,
    telephone: SITE.phone,
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address,
      addressLocality: SITE.city,
      addressRegion: SITE.state,
      addressCountry: SITE.country,
    },
    areaServed: `${SITE.city}, ${SITE.stateName}`,
    sameAs: Object.values(SITE.social).filter(Boolean),
  }
}

async function readArticles() {
  let files = []
  try {
    files = (await fs.readdir(articlesDir)).filter((file) => file.endsWith('.md'))
  } catch {
    return []
  }

  const entries = await Promise.all(files.map(async (file) => {
    const raw = await fs.readFile(path.join(articlesDir, file), 'utf8')
    const { data, body } = splitFrontmatter(raw)
    const publishedAt = normalizeDate(data.date || data.published_at)
    const updatedAt = normalizeDate(data.updatedAt || data.updated_at, publishedAt)
    const isFuture = new Date(publishedAt) > now
    if (data.published === false || isFuture) return null
    const slug = data.slug || file.replace(/\.md$/, '')
    const summary = data.excerpt || data.summary || stripHtml(marked.parse(body)).slice(0, 155)
    return {
      slug,
      path: `/artigos/${slug}`,
      title: data.title || 'Artigo sem título',
      summary,
      author: data.author || SITE.author,
      category: data.category || 'Informações Gerais',
      cover: data.cover || '/images/articles/general.jpg',
      coverAlt: data.coverAlt || data.cover_alt || `Fotografia ilustrativa do artigo ${data.title || slug}`,
      publishedAt,
      updatedAt,
      readingTime: Number(data.readingTime || data.reading_time) || 4,
      noIndex: Boolean(data.noIndex || data.no_index),
      canonical: data.canonical || '',
      bodyHtml: sanitizeStaticHtml(marked.parse(body)),
    }
  }))

  return entries.filter(Boolean).sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
}

function pageSpecificContent(route, articles) {
  if (route.path === '/') {
    return `
      <section><h2>Áreas de atuação</h2><p>Orientação consultiva, preventiva e contenciosa, sempre após análise individual.</p>
        <ul class="ssg-card-list">${practiceAreas.map((area) => `<li><a href="${localPath(`/areas-de-atuacao/${area.slug}`)}"><strong>${escapeHtml(area.title)}</strong><span>${escapeHtml(area.description)}</span></a></li>`).join('')}</ul>
      </section>
      <section><h2>Conteúdo jurídico</h2><ul class="ssg-link-list">${articles.slice(0, 4).map((article) => `<li><a href="${localPath(article.path)}">${escapeHtml(article.title)}</a></li>`).join('')}</ul><p><a href="${localPath('/artigos')}">Ver todos os artigos</a></p></section>`
  }

  if (route.path === '/sobre') {
    return `<section><h2>Atendimento humano e organizado</h2><p>A proposta do escritório demonstrativo combina escuta cuidadosa, análise técnica, conferência documental e comunicação acessível.</p><p>As alternativas jurídicas são apresentadas com objetividade, sem promessa de resultado e com atenção aos riscos e às particularidades de cada situação.</p></section><section><h2>Missão, visão e valores</h2><ul><li>Orientação responsável e linguagem clara.</li><li>Ética, discrição e respeito às normas profissionais.</li><li>Organização do atendimento presencial e digital.</li></ul></section>`
  }

  if (route.path === '/areas-de-atuacao') {
    return `<section><h2>Atendimento jurídico por área</h2><ul class="ssg-card-list">${practiceAreas.map((area) => `<li><a href="${localPath(`/areas-de-atuacao/${area.slug}`)}"><strong>${escapeHtml(area.title)}</strong><span>${escapeHtml(area.intro)}</span></a></li>`).join('')}</ul></section>`
  }

  if (route.area) {
    const area = route.area
    const otherAreas = practiceAreas.filter((item) => item.slug !== area.slug).slice(0, 3)
    return `
      <section><h2>Quando esta área pode ser necessária</h2><ul>${area.situations.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section>
      <section><h2>Forma de atuação</h2><p>${escapeHtml(area.approach)}</p></section>
      <section><h2>Perguntas frequentes</h2>${area.faqs.map(([question, answer]) => `<details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join('')}</section>
      <aside class="ssg-notice"><strong>Aviso informativo</strong><p>As informações são gerais, não constituem promessa de resultado e não substituem a análise individual.</p></aside>
      <section><h2>Conheça outras áreas</h2><ul class="ssg-link-list">${otherAreas.map((item) => `<li><a href="${localPath(`/areas-de-atuacao/${item.slug}`)}">${escapeHtml(item.title)}</a></li>`).join('')}</ul></section>
      <p><a class="ssg-button" href="${localPath('/contato')}">Solicitar informações sobre atendimento</a></p>`
  }

  if (route.path === '/artigos') {
    return `<section><h2>Conteúdos publicados</h2><div class="ssg-articles">${articles.map((article) => `<article><h3><a href="${localPath(article.path)}">${escapeHtml(article.title)}</a></h3><p>${escapeHtml(article.summary)}</p><p><small>${escapeHtml(article.category)} · ${article.readingTime} min de leitura</small></p></article>`).join('')}</div></section>`
  }

  if (route.path === '/equipe') {
    return `<section><h2>Profissionais demonstrativos</h2><article><h3>Dr. Rafael Almeida</h3><p>Advogado sócio fictício com atuação demonstrativa em Direito Civil, Empresarial e Contratos.</p></article><article><h3>Dra. Marina Castro</h3><p>Advogada sócia fictícia com atuação demonstrativa em Direito Previdenciário, Trabalhista e de Família.</p></article><p class="ssg-notice">Nomes, registros, formações, imagens e biografias são demonstrativos.</p></section>`
  }

  if (route.path === '/contato') {
    const whatsappUrl = `https://wa.me/${String(SITE.whatsapp).replace(/\D/g, '')}`
    return `<section><h2>Como funciona o contato</h2><p>O formulário interativo precisa de JavaScript e apenas prepara uma mensagem para o WhatsApp. Sem JavaScript, utilize os canais diretos abaixo.</p><address><p>${escapeHtml(SITE.address)}</p><p><a href="tel:${escapeHtml(String(SITE.phone).replace(/\D/g, ''))}">${escapeHtml(SITE.phone)}</a></p><p><a href="mailto:${escapeHtml(SITE.email)}">${escapeHtml(SITE.email)}</a></p><p><a href="${escapeHtml(whatsappUrl)}" rel="noopener noreferrer">Abrir o WhatsApp</a></p></address><p class="ssg-notice">Telefone, endereço e e-mail são dados fictícios utilizados apenas nesta demonstração.</p></section>`
  }

  if (route.path === '/politica-de-privacidade') {
    return `<section><h2>Tratamento das informações</h2><p>Os dados preenchidos no formulário são utilizados apenas para montar a mensagem que será aberta no WhatsApp. Não envie informações sensíveis por este site demonstrativo.</p><h2>Serviços de terceiros</h2><p>Ao prosseguir para o WhatsApp, aplicam-se os termos e políticas do serviço externo.</p><h2>Projeto demonstrativo</h2><p>Antes de transformar este projeto em site real, a política deve ser revisada conforme os canais, ferramentas e tratamentos de dados efetivamente utilizados.</p></section>`
  }

  return `<section><h2>Atendimento institucional</h2><p>Escuta cuidadosa, análise documental, comunicação clara e atuação responsável, sem promessas de resultado.</p><p><a href="${localPath('/areas-de-atuacao')}">Conheça as áreas de atuação</a> ou <a href="${localPath('/contato')}">acesse os canais de contato</a>.</p></section>`
}

function navigationHtml() {
  return `<nav aria-label="Menu principal"><a href="${localPath('/sobre')}">O Escritório</a><a href="${localPath('/areas-de-atuacao')}">Áreas de atuação</a><a href="${localPath('/equipe')}">Equipe</a><a href="${localPath('/artigos')}">Artigos</a><a href="${localPath('/contato')}">Contato</a></nav>`
}

function staticShell({ route, articles, article, notFound = false }) {
  const title = article?.title || route.heading
  const routePath = article?.path || route.path
  const crumbs = breadcrumbItems(routePath, title)

  let mainContent
  if (notFound) {
    mainContent = `<header class="ssg-page-header"><p class="ssg-eyebrow">Almeida &amp; Castro Advocacia</p><h1>${escapeHtml(route.heading)}</h1><p>${escapeHtml(route.intro)}</p></header><section><h2>Continue navegando</h2><p><a href="${localPath('/')}">Ir para a página inicial</a></p><p><a href="${localPath('/areas-de-atuacao')}">Conhecer as áreas de atuação</a> · <a href="${localPath('/artigos')}">Ler os artigos</a> · <a href="${localPath('/contato')}">Entrar em contato</a></p></section>`
  } else if (article) {
    mainContent = `<article class="ssg-article"><header><p class="ssg-eyebrow">${escapeHtml(article.category)}</p><h1>${escapeHtml(article.title)}</h1><p>${escapeHtml(article.summary)}</p><p><small>Por ${escapeHtml(article.author)} · <time datetime="${article.publishedAt}">${new Intl.DateTimeFormat('pt-BR').format(new Date(article.publishedAt))}</time> · ${article.readingTime} min de leitura</small></p></header><img src="${escapeHtml(localPath(article.cover))}" alt="${escapeHtml(article.coverAlt)}" width="1200" height="630" decoding="async"><div class="ssg-prose">${article.bodyHtml}</div><aside class="ssg-notice"><strong>Aviso</strong><p>Conteúdo informativo. Não substitui análise jurídica individualizada.</p></aside><p><a href="${localPath('/artigos')}">Voltar aos artigos</a></p></article>`
  } else {
    mainContent = `<header class="ssg-page-header"><p class="ssg-eyebrow">Almeida &amp; Castro Advocacia</p><h1>${escapeHtml(route.heading)}</h1><p>${escapeHtml(route.intro)}</p></header>${pageSpecificContent(route, articles)}`
  }

  return `<div class="ssg-shell" data-prerendered="true">
    <a class="ssg-skip" href="#main-content">Pular para o conteúdo</a>
    <header class="ssg-header"><div><a href="${localPath('/')}"><strong>Almeida &amp; Castro</strong><span>Advocacia</span></a>${navigationHtml()}</div></header>
    <main id="main-content" class="ssg-main">${breadcrumbHtml(crumbs)}${mainContent}</main>
    <footer class="ssg-footer"><address>${escapeHtml(SITE.address)} · ${escapeHtml(SITE.phone)}</address><p><a href="${localPath('/politica-de-privacidade')}">Política de privacidade</a></p><p>Conteúdo de caráter informativo, sem promessa de resultado.</p>${IS_DEMO ? '<p><strong>Projeto demonstrativo:</strong> escritório, profissionais e dados de contato são fictícios.</p>' : ''}</footer>
  </div>`
}

const criticalCss = `<style id="ssg-critical">.ssg-shell{font-family:Arial,sans-serif;color:#172033;background:#fff;line-height:1.65}.ssg-shell *{box-sizing:border-box}.ssg-skip{position:absolute;left:-9999px}.ssg-skip:focus{left:1rem;top:1rem;background:#fff;padding:.75rem;z-index:999}.ssg-header{background:#081a2e;color:#fff;padding:1rem}.ssg-header>div,.ssg-main,.ssg-footer{max-width:1120px;margin:auto}.ssg-header a{color:inherit;text-decoration:none}.ssg-header strong,.ssg-header span{display:block}.ssg-header nav{display:flex;gap:1rem;flex-wrap:wrap;margin-top:.75rem}.ssg-main{padding:2.5rem 1rem}.ssg-main h1{font-size:clamp(2rem,5vw,3.6rem);line-height:1.1;color:#081a2e}.ssg-main h2{margin-top:2rem;color:#081a2e}.ssg-eyebrow{font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#a77a32}.ssg-breadcrumb ol{display:flex;gap:.5rem;flex-wrap:wrap;list-style:none;padding:0}.ssg-breadcrumb li+li:before{content:'›';margin-right:.5rem}.ssg-card-list,.ssg-link-list{padding-left:1.2rem}.ssg-card-list li{margin:1rem 0}.ssg-card-list a{display:grid}.ssg-card-list span{color:#4b5563}.ssg-articles{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem}.ssg-articles article,.ssg-notice{border:1px solid #dbe2ea;border-radius:.75rem;padding:1rem}.ssg-article img{max-width:100%;height:auto;border-radius:.75rem}.ssg-prose{max-width:760px}.ssg-button{display:inline-block;background:#081a2e;color:#fff;padding:.8rem 1rem;border-radius:.4rem}.ssg-footer{padding:2rem 1rem;border-top:1px solid #dbe2ea;font-size:.9rem}.ssg-footer address{font-style:normal}@media(max-width:720px){.ssg-header nav{display:grid}.ssg-main{padding-top:1.5rem}}</style>`

function buildHead({ title, description, routePath, image, imageAlt, type = 'website', noIndex = false, article, schemas = [] }) {
  const canonical = article?.canonical || buildCanonicalUrl(routePath)
  const absoluteImage = buildAssetUrl(image || SITE.shareImage)
  const robots = noIndex || IS_DEMO || !ALLOW_INDEXING ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'
  const metadata = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}">`,
    `<meta name="robots" content="${robots}">`,
    `<meta name="googlebot" content="${robots}">`,
    `<meta name="author" content="${escapeHtml(article?.author || SITE.author)}">`,
    `<link rel="canonical" href="${escapeHtml(canonical)}">`,
    `<meta property="og:title" content="${escapeHtml(title)}">`,
    `<meta property="og:description" content="${escapeHtml(description)}">`,
    `<meta property="og:type" content="${type}">`,
    `<meta property="og:url" content="${escapeHtml(canonical)}">`,
    `<meta property="og:image" content="${escapeHtml(absoluteImage)}">`,
    `<meta property="og:image:alt" content="${escapeHtml(imageAlt || title)}">`,
    `<meta property="og:site_name" content="${escapeHtml(SITE.name)}">`,
    `<meta property="og:locale" content="${SITE.locale}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${escapeHtml(title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(description)}">`,
    `<meta name="twitter:image" content="${escapeHtml(absoluteImage)}">`,
    `<meta name="twitter:image:alt" content="${escapeHtml(imageAlt || title)}">`,
    article ? `<meta property="article:published_time" content="${article.publishedAt}"><meta property="article:modified_time" content="${article.updatedAt}"><meta property="article:author" content="${escapeHtml(article.author)}"><meta property="article:section" content="${escapeHtml(article.category)}">` : '',
    !IS_DEMO && ALLOW_INDEXING && schemas.length ? `<script type="application/ld+json">${JSON.stringify(schemas.length === 1 ? schemas[0] : schemas).replace(/</g, '\\u003c')}</script>` : '',
    criticalCss,
  ].join('\n')
  return metadata
}

function injectHtml(baseHtml, head, body) {
  let html = baseHtml
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta\s+(?:name|property)=["'](?:description|robots|googlebot|author|og:[^"']+|twitter:[^"']+|article:[^"']+)["'][^>]*>/gi, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*>/gi, '')
    .replace(/<script[^>]+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, '')
  html = html.replace('</head>', `${head}\n</head>`)
  html = html.replace(/<div\s+id=["']root["'][^>]*>\s*<\/div>/i, `<div id="root" data-prerendered="true">${body}</div>`)
  return html
}

function articleSchemas(article) {
  const crumbs = breadcrumbItems(article.path, article.title)
  return [
    breadcrumbSchema(crumbs),
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: article.title,
      description: article.summary,
      image: buildAssetUrl(article.cover),
      author: { '@type': 'Person', name: article.author },
      publisher: { '@type': 'Organization', name: SITE.name, logo: { '@type': 'ImageObject', url: buildAssetUrl(SITE.logo) } },
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      articleSection: article.category,
      mainEntityOfPage: article.canonical || buildCanonicalUrl(article.path),
    },
  ]
}

const baseHtml = await fs.readFile(path.join(distDir, 'index.html'), 'utf8')
const articles = await readArticles()
const routes = [...allStaticRoutes, ...articles.map((article) => ({ path: article.path, article }))]

for (const entry of routes) {
  const article = entry.article
  const route = article ? { path: article.path, heading: article.title, intro: article.summary } : routeByPath.get(entry.path)
  if (!route) continue
  const title = article?.title ? `${article.title} | ${SITE.shortName}` : route.title
  const description = article?.summary || route.description
  const crumbs = breadcrumbItems(route.path, article?.title || route.heading)
  const schemas = article
    ? articleSchemas(article)
    : [breadcrumbSchema(crumbs), ...(route.path === '/' ? [organizationSchema()] : [])]
  const head = buildHead({
    title,
    description,
    routePath: route.path,
    image: article?.cover || SITE.shareImage,
    imageAlt: article?.coverAlt || `${SITE.name} — imagem de compartilhamento`,
    type: article ? 'article' : 'website',
    noIndex: article?.noIndex,
    article,
    schemas,
  })
  const output = injectHtml(baseHtml, head, staticShell({ route, articles, article }))
  const relative = route.path === '/' ? '' : route.path.replace(/^\/+|\/+$/g, '')
  const targetDir = path.join(distDir, relative)
  await fs.mkdir(targetDir, { recursive: true })
  await fs.writeFile(path.join(targetDir, 'index.html'), output, 'utf8')
}

const notFoundRoute = {
  path: '/404',
  title: 'Página não encontrada | Almeida & Castro Advocacia',
  description: 'A página solicitada não foi encontrada.',
  heading: 'Página não encontrada',
  intro: 'O endereço informado pode estar incorreto ou a página pode ter sido removida.',
}
const notFoundHead = buildHead({ title: notFoundRoute.title, description: notFoundRoute.description, routePath: '/404', noIndex: true })
const notFoundOutput = injectHtml(baseHtml, notFoundHead, staticShell({ route: notFoundRoute, articles, notFound: true }))
await fs.writeFile(path.join(distDir, '404.html'), notFoundOutput, 'utf8')

console.log(`Exportação estática concluída: ${routes.length} páginas públicas e página 404.`)
