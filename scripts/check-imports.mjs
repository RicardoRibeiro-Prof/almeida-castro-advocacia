import fs from 'node:fs/promises'
import path from 'node:path'

const root = path.join(process.cwd(), 'src')
const extensions = ['', '.js', '.jsx', '.json', '.yml', '.yaml', '.md']
const errors = []

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...(await walk(full)))
    else if (/\.(js|jsx)$/.test(entry.name)) files.push(full)
  }
  return files
}

const files = await walk(root)
const importRegex = /from\s+['"](\.[^'"]+)['"]|import\s+['"](\.[^'"]+)['"]/g

for (const file of files) {
  const content = await fs.readFile(file, 'utf8')
  let match
  while ((match = importRegex.exec(content))) {
    const specifier = match[1] || match[2]
    const cleanSpecifier = specifier.split('?')[0].split('#')[0]
    const base = path.resolve(path.dirname(file), cleanSpecifier)
    let found = false
    for (const ext of extensions) {
      try {
        const stat = await fs.stat(`${base}${ext}`)
        if (stat.isFile()) {
          found = true
          break
        }
      } catch {}
    }
    if (!found) {
      for (const ext of ['.js', '.jsx']) {
        try {
          const stat = await fs.stat(path.join(base, `index${ext}`))
          if (stat.isFile()) {
            found = true
            break
          }
        } catch {}
      }
    }
    if (!found) errors.push(`${path.relative(root, file)} -> ${specifier}`)
  }
}

if (errors.length) {
  console.error('Importações locais não encontradas:')
  errors.forEach((error) => console.error(`- ${error}`))
  process.exit(1)
}

console.log(`Importações locais verificadas em ${files.length} arquivos.`)
