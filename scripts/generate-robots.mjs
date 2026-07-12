import fs from 'node:fs/promises'
import path from 'node:path'
import { ALLOW_INDEXING, IS_DEMO, buildCanonicalUrl } from '../src/config/site.js'

const output = ALLOW_INDEXING && !IS_DEMO
  ? `User-agent: *\nAllow: /\n\nSitemap: ${buildCanonicalUrl('/sitemap.xml')}\n`
  : 'User-agent: *\nDisallow: /\n'

const distDir = path.join(process.cwd(), 'dist')
await fs.mkdir(distDir, { recursive: true })
await fs.writeFile(path.join(distDir, 'robots.txt'), output, 'utf8')
console.log(ALLOW_INDEXING && !IS_DEMO ? 'robots.txt de produção gerado.' : 'robots.txt de demonstração gerado com bloqueio total.')
