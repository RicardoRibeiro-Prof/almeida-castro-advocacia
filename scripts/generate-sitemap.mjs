import fs from 'node:fs/promises'
import path from 'node:path'
import { load } from 'js-yaml'
import { ALLOW_INDEXING, IS_DEMO, SITE_URL, buildCanonicalUrl } from '../src/config/site.js'
import { allStaticRoutes } from './site-routes.mjs'

const rootDir = process.cwd()
const outputDir = path.join(rootDir, 'dist')
const contentDir = path.join(rootDir, 'src', 'content', 'articles')
const now = new Date()

function readFrontmatter(raw = '') {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---/)
  return match ? load(match[1]) || {} : {}
}

function xmlEscape(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

if (SITE_URL.includes('seu-dominio.com.br')) {
  throw new Error('Sitemap bloqueado: configure VITE_SITE_URL com a URL pública correta.')
}

let articleRoutes = []
try {
  const files = (await fs.readdir(contentDir)).filter((file) => file.endsWith('.md'))
  const entries = await Promise.all(files.map(async (file) => {
    const raw = await fs.readFile(path.join(contentDir, file), 'utf8')
    const data = readFrontmatter(raw)
    const publishedAt = data.date || data.published_at
    const publishedDate = publishedAt ? new Date(publishedAt) : null
    const isFuture = publishedDate && !Number.isNaN(publishedDate.getTime()) && publishedDate > now
    if (data.published === false || data.noIndex === true || data.no_index === true || isFuture) return null
    const updatedAt = data.updatedAt || data.updated_at || publishedAt
    const updatedDate = updatedAt ? new Date(updatedAt) : null
    return {
      path: `/artigos/${data.slug || file.replace(/\.md$/, '')}`,
      lastmod: updatedDate && !Number.isNaN(updatedDate.getTime()) ? updatedDate.toISOString() : undefined,
    }
  }))
  articleRoutes = entries.filter(Boolean)
} catch (error) {
  throw new Error(`Não foi possível ler os artigos para o sitemap: ${error.message}`)
}

const indexable = ALLOW_INDEXING && !IS_DEMO
const urls = indexable
  ? [...allStaticRoutes.map((route) => ({ path: route.path })), ...articleRoutes]
  : []

if (indexable && urls.length === 0) throw new Error('Sitemap vazio em ambiente com indexação habilitada.')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ path: routePath, lastmod }) => `  <url>
    <loc>${xmlEscape(buildCanonicalUrl(routePath))}</loc>${lastmod ? `
    <lastmod>${lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>
`

await fs.mkdir(outputDir, { recursive: true })
await fs.writeFile(path.join(outputDir, 'sitemap.xml'), xml, 'utf8')
console.log(indexable ? `Sitemap gerado com ${urls.length} URLs.` : 'Sitemap demonstrativo gerado sem URLs indexáveis.')
