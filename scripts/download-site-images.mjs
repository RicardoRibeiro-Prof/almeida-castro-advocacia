import fs from 'node:fs/promises'
import path from 'node:path'

const rootDir = process.cwd()
const publicDir = path.join(rootDir, 'public')

const images = [
  {
    file: 'images/hero-office.jpg',
    url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&h=1100&q=84&fm=jpg',
  },
  {
    file: 'images/about-office.jpg',
    url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1500&h=1100&q=84&fm=jpg',
  },
  {
    file: 'images/team-rafael.jpg',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1000&h=1250&q=86&fm=jpg',
  },
  {
    file: 'images/team-marina.jpg',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&h=1250&q=86&fm=jpg',
  },
  {
    file: 'images/articles/previdenciario.jpg',
    url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&h=630&q=82&fm=jpg',
  },
  {
    file: 'images/articles/familia.jpg',
    url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&h=630&q=82&fm=jpg',
  },
  {
    file: 'images/articles/trabalhista.jpg',
    url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&h=630&q=82&fm=jpg',
  },
  {
    file: 'images/articles/consumidor.jpg',
    url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&h=630&q=82&fm=jpg',
  },
  {
    file: 'images/articles/civil.jpg',
    url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&h=630&q=82&fm=jpg',
  },
  {
    file: 'images/articles/empresarial.jpg',
    url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&h=630&q=82&fm=jpg',
  },
  {
    file: 'images/articles/general.jpg',
    url: 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?auto=format&fit=crop&w=1200&h=630&q=82&fm=jpg',
  },
]

const minimumBytes = 25_000

async function isUsable(filePath) {
  try {
    const stat = await fs.stat(filePath)
    return stat.isFile() && stat.size >= minimumBytes
  } catch {
    return false
  }
}

async function download({ file, url }) {
  const destination = path.join(publicDir, file)
  if (await isUsable(destination)) {
    console.log(`Imagem existente preservada: ${file}`)
    return
  }

  await fs.mkdir(path.dirname(destination), { recursive: true })
  let lastError

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30_000)

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: 'image/jpeg,image/*;q=0.8',
          'User-Agent': 'AlmeidaCastroSiteBuild/1.0',
        },
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const contentType = response.headers.get('content-type') || ''
      if (!contentType.startsWith('image/')) throw new Error(`Tipo inesperado: ${contentType || 'desconhecido'}`)

      const buffer = Buffer.from(await response.arrayBuffer())
      if (buffer.length < minimumBytes) throw new Error(`Arquivo muito pequeno: ${buffer.length} bytes`)

      const temporary = `${destination}.tmp`
      await fs.writeFile(temporary, buffer)
      await fs.rename(temporary, destination)
      console.log(`Imagem baixada: ${file} (${Math.round(buffer.length / 1024)} KB)`)
      clearTimeout(timeout)
      return
    } catch (error) {
      clearTimeout(timeout)
      lastError = error
      console.warn(`Tentativa ${attempt}/3 falhou para ${file}: ${error.message}`)
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 1500))
    }
  }

  throw new Error(`Não foi possível baixar ${file}: ${lastError?.message || 'erro desconhecido'}`)
}

await Promise.all(images.map(download))
console.log(`${images.length} fotografias verificadas para o site.`)
