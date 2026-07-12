import fs from 'node:fs/promises'
import path from 'node:path'
import SITE, { BASE_PATH } from '../src/config/site.js'

const manifest = {
  name: SITE.name,
  short_name: SITE.shortName,
  description: SITE.description,
  lang: SITE.language,
  start_url: BASE_PATH,
  scope: BASE_PATH,
  display: 'browser',
  theme_color: '#081a2e',
  background_color: '#ffffff',
  icons: [
    { src: `${BASE_PATH}favicon.svg`, sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    { src: `${BASE_PATH}icons/icon-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: `${BASE_PATH}icons/icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
  ],
}

const distDir = path.join(process.cwd(), 'dist')
await fs.mkdir(distDir, { recursive: true })
await fs.writeFile(path.join(distDir, 'manifest.webmanifest'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
console.log('Manifest gerado.')
