import fs from 'node:fs/promises'
import path from 'node:path'
import { ALLOW_INDEXING, IS_DEMO, buildCanonicalUrl } from '../src/config/site.js'

const indexableProduction = ALLOW_INDEXING && !IS_DEMO
const output = indexableProduction
  ? `User-agent: *\nAllow: /\n\nSitemap: ${buildCanonicalUrl('/sitemap.xml')}\n`
  : 'User-agent: *\nAllow: /\n'

const distDir = path.join(process.cwd(), 'dist')
await fs.mkdir(distDir, { recursive: true })
await fs.writeFile(path.join(distDir, 'robots.txt'), output, 'utf8')
console.log(indexableProduction
  ? 'robots.txt de produção gerado com sitemap.'
  : 'robots.txt de demonstração gerado: rastreamento permitido e indexação bloqueada pelos metadados.')
