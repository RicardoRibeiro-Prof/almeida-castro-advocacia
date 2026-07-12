import fs from 'node:fs/promises'
import path from 'node:path'
import { BASE_PATH, SITE_URL } from '../src/config/site.js'
import { areas, articles, office } from './moura-queiroz-content.mjs'

const distDir = path.join(process.cwd(), 'dist')
const projectSlug = 'moura-queiroz-advocacia'
const outputDir = path.join(distDir, projectSlug)
const projectBase = `${BASE_PATH.replace(/\/$/, '')}/${projectSlug}/`
const projectUrl = new URL(`${projectSlug}/`, `${SITE_URL}/`).href.replace(/\/$/, '')
const asset = (value) => `${projectBase}assets/${value}`
const parentImage = (value) => `${BASE_PATH}images/${value}`
const link = (value = '') => `${projectBase}${String(value).replace(/^\/+/, '')}`
const canonical = (value = '') => new URL(String(value).replace(/^\/+/, ''), `${projectUrl}/`).href

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;')

const navItems = [
  ['sobre/', 'O escritório', 'sobre'],
  ['areas-de-atuacao/', 'Áreas de atuação', 'areas'],
  ['equipe/', 'Equipe', 'equipe'],
  ['artigos/', 'Artigos', 'artigos'],
  ['contato/', 'Contato', 'contato'],
]

function head({ title, description, route = '', type = 'website', image = asset('social-share.svg'), article }) {
  const url = canonical(route)
  const robots = 'noindex, nofollow'
  const articleMeta = article ? `
    <meta property="article:published_time" content="${article.date}T09:00:00-03:00">
    <meta property="article:modified_time" content="${article.date}T09:00:00-03:00">
    <meta property="article:author" content="${escapeHtml(office.name)}">
    <meta property="article:section" content="${escapeHtml(article.category)}">` : ''
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="${robots}">
  <meta name="googlebot" content="${robots}">
  <meta name="theme-color" content="#173f36">
  <link rel="canonical" href="${url}">
  <link rel="icon" href="${asset('favicon.svg')}" type="image/svg+xml">
  <link rel="manifest" href="${link('manifest.webmanifest')}">
  <link rel="stylesheet" href="${asset('styles.css')}">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="${escapeHtml(office.name)}">
  <meta property="og:type" content="${type}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${image.startsWith('http') ? image : new URL(image.replace(/^\//, ''), `${locationOrigin()}/`).href}">
  <meta property="og:image:alt" content="Identidade visual do projeto demonstrativo ${escapeHtml(office.name)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${image.startsWith('http') ? image : new URL(image.replace(/^\//, ''), `${locationOrigin()}/`).href}">
  <meta name="twitter:image:alt" content="Identidade visual do projeto demonstrativo ${escapeHtml(office.name)}">${articleMeta}
</head>`
}

function locationOrigin() {
  return new URL(SITE_URL).origin
}

function brand() {
  return `<span class="brand"><span class="mark" aria-hidden="true">M&amp;Q</span><span class="brand-copy"><strong>Moura &amp; Queiroz</strong><small>Advocacia</small></span></span>`
}

function header(active = '') {
  const nav = navItems.map(([href, label, key]) => `<a href="${link(href)}"${active === key ? ' aria-current="page"' : ''}>${label}</a>`).join('')
  return `<a class="skip" href="#main-content">Pular para o conteúdo</a>
  <div class="demo"><strong>Projeto demonstrativo:</strong> nomes, profissionais e contatos são fictícios.</div>
  <header class="header"><div class="header-in">
    <a href="${link()}" aria-label="Página inicial de ${escapeHtml(office.name)}">${brand()}</a>
    <button class="menu" type="button" data-menu-button aria-expanded="false" aria-controls="main-navigation" aria-label="Abrir menu">☰</button>
    <nav id="main-navigation" class="nav" data-navigation aria-label="Navegação principal">${nav}<a class="nav-cta" href="${link('contato/')}">Solicitar contato</a></nav>
  </div></header>`
}

function footer() {
  return `<footer class="footer"><div class="container">
    <div class="footer-grid"><div><a class="footer-brand" href="${link()}">${brand()}</a><p class="footer-about">Atendimento jurídico demonstrativo com linguagem clara, organização documental e análise responsável das alternativas possíveis.</p></div>
      <div><h2 class="footer-title">Navegação</h2><div class="footer-links"><a href="${link('sobre/')}">O escritório</a><a href="${link('areas-de-atuacao/')}">Áreas de atuação</a><a href="${link('equipe/')}">Equipe</a><a href="${link('artigos/')}">Artigos</a></div></div>
      <div><h2 class="footer-title">Informações</h2><div class="footer-links"><a href="${link('contato/')}">Contato</a><a href="${link('politica-de-privacidade/')}">Política de privacidade</a><span>${office.city} – ${office.state}</span></div></div>
    </div><div class="footer-bottom"><span>© <span data-current-year>2026</span> ${escapeHtml(office.name)}.</span><span><strong>Projeto fictício para portfólio.</strong> Não representa escritório real.</span></div>
  </div></footer>
  <script src="${asset('app.js')}" defer></script>`
}

function layout({ title, description, route = '', active = '', content, type, article, image }) {
  return `${head({ title, description, route, type, article, image })}
<body data-prerendered="true"><noscript><div class="noscript">O conteúdo permanece disponível. Menu móvel e formulário precisam de JavaScript.</div></noscript>${header(active)}<main id="main-content">${content}</main>${footer()}</body></html>`
}

function breadcrumbs(items) {
  const content = [['', 'Início'], ...items].map(([href, label], index, list) => index === list.length - 1 ? `<span aria-current="page">${label}</span>` : `<a href="${link(href)}">${label}</a><span aria-hidden="true">›</span>`).join('')
  return `<nav class="breadcrumbs" aria-label="Breadcrumb">${content}</nav>`
}

function pageHero(title, intro, crumbs) {
  return `<section class="page-hero"><div class="container">${breadcrumbs(crumbs)}<h1 class="page-title">${title}</h1><p class="page-intro">${intro}</p></div></section>`
}

function areaCards(limit = areas.length) {
  return `<div class="areas">${areas.slice(0, limit).map((area, index) => `<a class="area" href="${link(`areas-de-atuacao/${area.slug}/`)}"><b>0${index + 1}</b><h3>${area.title}</h3><p>${area.description}</p><span class="arrow" aria-hidden="true">→</span></a>`).join('')}</div>`
}

function articleCards() {
  return `<div class="articles">${articles.map((article) => `<article class="article"><img src="${parentImage(article.image)}" width="720" height="450" loading="lazy" decoding="async" alt="Imagem ilustrativa sobre ${escapeHtml(article.category)}"><div class="article-body"><span class="meta">${article.category} · ${article.reading}</span><h3>${article.title}</h3><p>${article.description}</p><a href="${link(`artigos/${article.slug}/`)}">Ler artigo →</a></div></article>`).join('')}</div>`
}

function cta() {
  return `<section class="section"><div class="container"><div class="cta"><div><h2>Converse sobre sua situação com mais clareza.</h2><p>O primeiro passo é organizar informações, documentos e dúvidas.</p></div><div class="actions"><a class="btn btn-light" href="${link('contato/')}">Conhecer os canais</a></div></div></div></section>`
}

const home = layout({
  title: 'Moura & Queiroz Advocacia em São Raimundo Nonato – PI',
  description: office.description,
  content: `<section class="hero"><div class="container hero-grid"><div><span class="eyebrow">Atuação jurídica responsável</span><h1 class="display">Clareza para decisões <em>importantes.</em></h1><p class="lead">Orientação jurídica demonstrativa para pessoas, famílias e empresas, com escuta atenta e explicação objetiva.</p><div class="actions"><a class="btn btn-main" href="${link('contato/')}">Iniciar contato</a><a class="btn btn-line" href="${link('areas-de-atuacao/')}">Conhecer áreas</a></div></div><div class="hero-visual"><div class="hero-photo"><img src="${parentImage('hero-office.jpg')}" width="800" height="1000" fetchpriority="high" alt="Ambiente profissional de escritório"></div><div class="hero-card"><strong>Atendimento organizado</strong><p>Documentos, contexto e alternativas apresentados de forma compreensível.</p></div><div class="stamp">São Raimundo Nonato · PI</div></div></div></section>
  <div class="container trust"><div class="trust-grid"><div class="trust-item"><span class="trust-icon">01</span><div><strong>Escuta cuidadosa</strong><span>Compreensão dos fatos e objetivos.</span></div></div><div class="trust-item"><span class="trust-icon">02</span><div><strong>Análise documental</strong><span>Organização antes da orientação.</span></div></div><div class="trust-item"><span class="trust-icon">03</span><div><strong>Linguagem clara</strong><span>Riscos e caminhos sem promessas.</span></div></div></div></div>
  <section class="section"><div class="container"><div class="heading"><div><span class="eyebrow">Áreas de atuação</span><h2>Atendimento jurídico para diferentes momentos.</h2></div><p>Cada demanda é analisada individualmente, respeitando os documentos, a legislação e os limites éticos da advocacia.</p></div>${areaCards()}</div></section>
  <section class="section soft"><div class="container split"><div class="frame"><img src="${parentImage('about-office.jpg')}" width="800" height="940" loading="lazy" decoding="async" alt="Espaço de reunião do escritório demonstrativo"></div><div class="copy"><span class="eyebrow">Nossa proposta</span><h2>Relações jurídicas tratadas com método e proximidade.</h2><p>O projeto Moura & Queiroz apresenta uma experiência institucional contemporânea, com atendimento acolhedor e comunicação sóbria.</p><ul class="checks"><li>Compreensão do contexto antes da orientação</li><li>Explicação dos riscos e alternativas</li><li>Sigilo e organização em todas as etapas</li></ul><a class="btn btn-line" href="${link('sobre/')}">Conhecer o escritório</a></div></div></section>
  <section class="section dark"><div class="container"><div class="heading"><div><span class="eyebrow">Como funciona</span><h2>Um atendimento construído em quatro etapas.</h2></div><p>O fluxo ajuda a tornar a conversa mais objetiva e evita decisões baseadas em informações incompletas.</p></div><div class="steps"><div class="step"><h3>Escuta</h3><p>Entendimento dos fatos, necessidades e dúvidas.</p></div><div class="step"><h3>Documentos</h3><p>Conferência dos registros relacionados à situação.</p></div><div class="step"><h3>Análise</h3><p>Identificação de riscos e alternativas possíveis.</p></div><div class="step"><h3>Orientação</h3><p>Explicação clara dos próximos passos.</p></div></div></div></section>
  <section class="section"><div class="container"><div class="heading"><div><span class="eyebrow">Conteúdo informativo</span><h2>Artigos para compreender temas jurídicos.</h2></div><p>Informações gerais que não substituem uma análise individualizada.</p></div>${articleCards()}</div></section>${cta()}`,
})

const about = layout({
  title: 'O Escritório | Moura & Queiroz Advocacia', active: 'sobre', route: 'sobre/',
  description: 'Conheça a proposta, os valores e a forma de atendimento do projeto demonstrativo Moura & Queiroz Advocacia.',
  content: `${pageHero('Atuação jurídica com método, escuta e responsabilidade.', 'Uma proposta institucional contemporânea, criada para demonstrar uma experiência profissional de advocacia.', [['sobre/', 'O escritório']])}<section class="section"><div class="container split"><div class="copy"><span class="eyebrow">Identidade</span><h2>Seriedade sem abrir mão de uma comunicação humana.</h2><p>Moura & Queiroz Advocacia é um escritório fictício criado para portfólio. Sua proposta visual e textual prioriza clareza, organização e sobriedade.</p><p>O atendimento apresentado começa pela compreensão do contexto e pela conferência dos documentos antes da indicação de qualquer medida.</p></div><div class="frame"><img src="${parentImage('about-office.jpg')}" width="800" height="940" alt="Ambiente institucional demonstrativo"></div></div></section><section class="section soft"><div class="container"><div class="heading"><div><span class="eyebrow">Princípios</span><h2>Valores que orientam cada etapa do atendimento.</h2></div><p>A experiência foi desenhada para transmitir confiança sem promessas de resultado ou linguagem sensacionalista.</p></div><div class="values"><div class="value"><strong>Clareza</strong><p>Informações apresentadas em linguagem compreensível e objetiva.</p></div><div class="value"><strong>Discrição</strong><p>Cuidado com informações, documentos e particularidades de cada pessoa.</p></div><div class="value"><strong>Responsabilidade</strong><p>Análise dos riscos e limites antes da definição dos próximos passos.</p></div></div></div></section>${cta()}`,
})

const areasPage = layout({
  title: 'Áreas de Atuação | Moura & Queiroz Advocacia', active: 'areas', route: 'areas-de-atuacao/',
  description: 'Conheça as áreas jurídicas apresentadas no projeto demonstrativo Moura & Queiroz Advocacia.',
  content: `${pageHero('Áreas de atuação', 'Atendimento consultivo, preventivo e contencioso definido após a análise dos fatos e documentos.', [['areas-de-atuacao/', 'Áreas de atuação']])}<section class="section"><div class="container">${areaCards()}</div></section>${cta()}`,
})

function areaPage(area) {
  const related = areas.filter((item) => item.slug !== area.slug).slice(0, 4)
  return layout({
    title: area.seoTitle, description: area.description, active: 'areas', route: `areas-de-atuacao/${area.slug}/`,
    content: `${pageHero(area.title, area.intro, [['areas-de-atuacao/', 'Áreas de atuação'], [`areas-de-atuacao/${area.slug}/`, area.title]])}<section class="section"><div class="container content-grid"><article class="prose"><h2>Quando essa área pode ser necessária?</h2><ul>${area.situations.map((item) => `<li>${item}</li>`).join('')}</ul><h2>Forma de atuação</h2><p>${area.approach}</p><blockquote>A orientação depende da análise individual dos fatos. Este projeto não promete resultado, prazo ou decisão favorável.</blockquote><h2>Perguntas frequentes</h2><div class="faq">${area.faqs.map(([question, answer]) => `<details><summary>${question}</summary><p>${answer}</p></details>`).join('')}</div></article><aside class="side"><h3>Outras áreas</h3><p>Conheça também outros conteúdos jurídicos do projeto.</p><div class="side-links">${related.map((item) => `<a href="${link(`areas-de-atuacao/${item.slug}/`)}">${item.title}</a>`).join('')}</div><a class="btn btn-main" href="${link('contato/')}">Entrar em contato</a></aside></div></section>${cta()}`,
  })
}

const team = layout({
  title: 'Equipe | Moura & Queiroz Advocacia', active: 'equipe', route: 'equipe/',
  description: 'Conheça a equipe fictícia apresentada no projeto demonstrativo Moura & Queiroz Advocacia.',
  content: `${pageHero('Uma equipe construída para ouvir, analisar e orientar.', 'Os nomes, registros profissionais e biografias desta página são inteiramente fictícios.', [['equipe/', 'Equipe']])}<section class="section"><div class="container"><div class="team"><article class="person"><img src="${parentImage('team-marina.jpg')}" width="620" height="760" alt="Retrato ilustrativo da profissional fictícia Helena Moura"><div class="person-info"><span class="role">Advogada sócia · perfil fictício</span><h2>Dra. Helena Moura</h2><span class="oab">OAB/PI 00.000</span><p>Atuação demonstrativa em Direito de Família, Civil e Previdenciário, com atenção à comunicação e à organização documental.</p></div></article><article class="person"><img src="${parentImage('team-rafael.jpg')}" width="620" height="760" alt="Retrato ilustrativo do profissional fictício Caio Queiroz"><div class="person-info"><span class="role">Advogado sócio · perfil fictício</span><h2>Dr. Caio Queiroz</h2><span class="oab">OAB/PI 00.000</span><p>Atuação demonstrativa em Direito Empresarial, Trabalhista e contratos, com foco preventivo e análise de riscos.</p></div></article></div></div></section>${cta()}`,
})

const articlesPage = layout({
  title: 'Artigos Jurídicos | Moura & Queiroz Advocacia', active: 'artigos', route: 'artigos/',
  description: 'Conteúdos jurídicos informativos do projeto demonstrativo Moura & Queiroz Advocacia.',
  content: `${pageHero('Artigos jurídicos', 'Informações gerais em linguagem acessível. Os textos não substituem uma orientação individualizada.', [['artigos/', 'Artigos']])}<section class="section"><div class="container">${articleCards()}</div></section>${cta()}`,
})

function articlePage(article) {
  return layout({
    title: `${article.title} | Moura & Queiroz`, description: article.description, active: 'artigos', route: `artigos/${article.slug}/`, type: 'article', article,
    image: new URL(`${BASE_PATH.replace(/^\//, '')}images/${article.image}`, `${locationOrigin()}/`).href,
    content: `<section class="page-hero"><div class="container article-head">${breadcrumbs([['artigos/', 'Artigos'], [`artigos/${article.slug}/`, article.title]])}<span class="eyebrow">${article.category}</span><h1 class="page-title">${article.title}</h1><p class="page-intro">${article.description}</p><div class="byline"><span>Publicado em <time datetime="${article.date}">${new Intl.DateTimeFormat('pt-BR').format(new Date(`${article.date}T12:00:00Z`))}</time></span><span>·</span><span>${article.reading}</span><span>·</span><span>${office.name}</span></div></div></section><div class="cover"><img src="${parentImage(article.image)}" width="1100" height="620" alt="Imagem ilustrativa do artigo ${escapeHtml(article.title)}"></div><section class="container article-layout"><article class="article-content">${article.body}</article><aside><div class="side"><h3>Conteúdo informativo</h3><p>Este artigo apresenta informações gerais e não substitui avaliação individual.</p><a class="btn btn-main" href="${link('contato/')}">Conhecer os canais</a></div></aside></section>`,
  })
}

const contact = layout({
  title: 'Contato | Moura & Queiroz Advocacia', active: 'contato', route: 'contato/',
  description: 'Consulte os canais fictícios de contato do projeto demonstrativo Moura & Queiroz Advocacia.',
  content: `${pageHero('Entre em contato', 'Os dados apresentados são demonstrativos e não correspondem a um escritório real.', [['contato/', 'Contato']])}<section class="section"><div class="container contact"><div class="copy"><span class="eyebrow">Canais demonstrativos</span><h2>Organize sua mensagem antes do atendimento.</h2><p>Informe o assunto de forma resumida e evite enviar documentos sensíveis antes de confirmar o canal adequado.</p><div class="contact-list"><div class="contact-item"><strong>Telefone e WhatsApp</strong><span>${office.phone}</span></div><div class="contact-item"><strong>E-mail</strong><a href="mailto:${office.email}">${office.email}</a></div><div class="contact-item"><strong>Endereço demonstrativo</strong><span>${office.address}</span></div><div class="contact-item"><strong>Horário</strong><span>${office.hours}</span></div></div></div><form class="form" data-contact-form novalidate><h2>Enviar pelo WhatsApp</h2><p>Após a validação, a conversa será aberta no aplicativo. Este site não armazena os dados.</p><div class="form-grid"><div class="field"><label for="name">Nome</label><input id="name" name="name" autocomplete="name" maxlength="80" required></div><div class="field"><label for="phone">Telefone</label><input id="phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" maxlength="20" required></div><div class="field full"><label for="subject">Assunto</label><select id="subject" name="subject" required><option value="">Selecione</option>${areas.map((area) => `<option>${area.title}</option>`).join('')}<option>Outro assunto</option></select></div><div class="field full"><label for="message">Mensagem</label><textarea id="message" name="message" maxlength="1000" required></textarea></div></div><p class="form-note">Ao continuar, você confirma que compreendeu que este é um projeto fictício.</p><div class="feedback" data-form-feedback role="status" aria-live="polite"></div><button class="btn btn-main" type="submit">Abrir WhatsApp</button></form></div></section>`,
})

const privacy = layout({
  title: 'Política de Privacidade | Moura & Queiroz Advocacia', route: 'politica-de-privacidade/',
  description: 'Política de privacidade do projeto demonstrativo Moura & Queiroz Advocacia.',
  content: `${pageHero('Política de privacidade', 'Informações sobre o funcionamento do formulário e o tratamento demonstrativo dos dados.', [['politica-de-privacidade/', 'Política de privacidade']])}<section class="section"><div class="container content-grid"><article class="prose"><h2>Natureza demonstrativa</h2><p>Este site foi criado para portfólio e não representa um escritório real. Os nomes, registros, endereço, telefone e e-mail são fictícios.</p><h2>Formulário de contato</h2><p>O formulário não envia dados a um banco próprio. Após a validação no navegador, ele apenas monta uma mensagem e abre um endereço do WhatsApp.</p><h2>Dados sensíveis</h2><p>Não envie documentos pessoais, informações bancárias, dados de saúde ou conteúdo sigiloso por canais não confirmados.</p><h2>Links externos</h2><p>Ao acessar serviços externos, as respectivas políticas de privacidade e segurança passam a ser aplicáveis.</p></article><aside class="side"><h3>Dúvidas</h3><p>Consulte os canais demonstrativos apresentados na página de contato.</p><a class="btn btn-main" href="${link('contato/')}">Página de contato</a></aside></div></section>`,
})

const notFound = layout({
  title: 'Página não encontrada | Moura & Queiroz Advocacia', route: '404.html',
  description: 'A página solicitada não foi encontrada no projeto demonstrativo Moura & Queiroz Advocacia.',
  content: `<section class="page-hero"><div class="container"><span class="eyebrow">Erro 404</span><h1 class="page-title">Página não encontrada</h1><p class="page-intro">O endereço pode ter sido alterado ou digitado incorretamente.</p><div class="actions"><a class="btn btn-main" href="${link()}">Voltar ao início</a><a class="btn btn-line" href="${link('areas-de-atuacao/')}">Áreas de atuação</a></div></div></section>`,
})

const pages = [
  ['', home], ['sobre/', about], ['areas-de-atuacao/', areasPage], ['equipe/', team], ['artigos/', articlesPage], ['contato/', contact], ['politica-de-privacidade/', privacy],
  ...areas.map((area) => [`areas-de-atuacao/${area.slug}/`, areaPage(area)]),
  ...articles.map((article) => [`artigos/${article.slug}/`, articlePage(article)]),
]

for (const [route, html] of pages) {
  const dir = route ? path.join(outputDir, route) : outputDir
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(path.join(dir, 'index.html'), html, 'utf8')
}

await fs.writeFile(path.join(outputDir, '404.html'), notFound, 'utf8')
await fs.writeFile(path.join(outputDir, 'manifest.webmanifest'), JSON.stringify({
  name: office.name,
  short_name: office.shortName,
  description: office.description,
  start_url: projectBase,
  scope: projectBase,
  display: 'browser',
  background_color: '#f6f1e8',
  theme_color: '#173f36',
  icons: [{ src: asset('favicon.svg'), sizes: 'any', type: 'image/svg+xml' }],
}, null, 2), 'utf8')
await fs.writeFile(path.join(outputDir, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n', 'utf8')

console.log(`Projeto Moura & Queiroz gerado: ${pages.length} páginas públicas e página 404 em ${projectBase}`)
