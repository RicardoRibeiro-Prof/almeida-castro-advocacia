import 'dotenv/config'
import fs from 'node:fs/promises'
import path from 'node:path'
import { load } from 'js-yaml'

const rootDir = process.cwd()
const publicDir = path.join(rootDir, 'public')
const contentDir = path.join(rootDir, 'src', 'content', 'articles')
const siteUrl = (process.env.VITE_SITE_URL || 'https://seu-dominio.com.br').replace(/\/$/, '')

const staticRoutes = [
  '/',
  '/sobre',
  '/areas-de-atuacao',
  '/areas-de-atuacao/direito-civil',
  '/areas-de-atuacao/direito-previdenciario',
  '/areas-de-atuacao/direito-trabalhista',
  '/areas-de-atuacao/direito-de-familia',
  '/areas-de-atuacao/direito-do-consumidor',
  '/areas-de-atuacao/direito-empresarial',
  '/equipe',
  '/artigos',
  '/contato',
  '/politica-de-privacidade',
]

function readFrontmatter(raw = '') {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---/)
  return match ? load(match[1]) || {} : {}
}

let articleRoutes = []

try {
  const files = (await fs.readdir(contentDir)).filter((file) => file.endsWith('.md'))
  const entries = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(contentDir, file), 'utf8')
      const data = readFrontmatter(raw)
      const date = data.date ? new Date(data.date) : null
      const isFuture = date && !Number.isNaN(date.getTime()) && date > new Date()

      if (data.published === false || isFuture) return null

      return {
        path: `/artigos/${data.slug || file.replace(/\.md$/, '')}`,
        lastmod: date && !Number.isNaN(date.getTime()) ? date.toISOString() : undefined,
      }
    }),
  )
  articleRoutes = entries.filter(Boolean)
} catch (error) {
  console.warn('Sitemap: não foi possível ler os artigos locais.', error.message)
}

const urls = [
  ...staticRoutes.map((route) => ({ path: route })),
  ...articleRoutes,
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ path: routePath, lastmod }) => `  <url>
    <loc>${siteUrl}${routePath}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
  </url>`,
  )
  .join('\n')}
</urlset>
`

await fs.mkdir(publicDir, { recursive: true })
await fs.writeFile(path.join(publicDir, 'sitemap.xml'), xml, 'utf8')
console.log(`Sitemap gerado com ${urls.length} URLs.`)
