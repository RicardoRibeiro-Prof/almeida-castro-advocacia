import { load } from 'js-yaml'
import { marked } from 'marked'
import { createSlug, stripHtml } from '../utils/format'

const articleFiles = import.meta.glob('../content/articles/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

marked.setOptions({ gfm: true, breaks: false })

function resolvePublicAsset(value) {
  const fallback = 'images/articles/default.jpg'
  const asset = value || fallback
  if (/^(https?:|data:|blob:)/i.test(asset)) return asset
  return `${import.meta.env.BASE_URL}${asset.replace(/^\/+/, '')}`
}

function splitFrontmatter(raw = '') {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/)
  if (!match) return { attributes: {}, body: raw }
  return { attributes: load(match[1]) || {}, body: match[2].trim() }
}

function toIsoDate(value) {
  if (!value) return new Date().toISOString()
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString()
}

function estimateReadingTime(markdown = '') {
  const plainText = stripHtml(marked.parse(markdown))
  const wordCount = plainText.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / 200))
}

function normalizeArticle(filePath, raw) {
  const { attributes, body } = splitFrontmatter(raw)
  const fileSlug = filePath.split('/').pop().replace(/\.md$/, '')
  const categoryName = attributes.category || 'Informações Gerais'
  const categorySlug = createSlug(categoryName)
  const publishedAt = toIsoDate(attributes.date || attributes.published_at)

  return {
    id: filePath,
    title: attributes.title || 'Artigo sem título',
    slug: attributes.slug || fileSlug,
    summary: attributes.summary || '',
    content: marked.parse(body),
    content_markdown: body,
    cover_image_url: resolvePublicAsset(attributes.cover),
    category_id: categorySlug,
    author_name: attributes.author || 'Almeida & Castro Advocacia',
    reading_time: Number(attributes.readingTime || attributes.reading_time) || estimateReadingTime(body),
    status: attributes.published === false ? 'draft' : 'published',
    featured: Boolean(attributes.featured),
    published_at: publishedAt,
    created_at: toIsoDate(attributes.createdAt || publishedAt),
    updated_at: toIsoDate(attributes.updatedAt || publishedAt),
    categories: {
      id: categorySlug,
      name: categoryName,
      slug: categorySlug,
    },
  }
}

const allArticles = Object.entries(articleFiles)
  .map(([filePath, raw]) => normalizeArticle(filePath, raw))
  .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))

function isPublicArticle(article) {
  return article.status === 'published' && new Date(article.published_at) <= new Date()
}

export async function getPublishedArticles() {
  return allArticles.filter(isPublicArticle)
}

export async function getRecentPublishedArticles(limit = 3) {
  return allArticles
    .filter(isPublicArticle)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || new Date(b.published_at) - new Date(a.published_at))
    .slice(0, limit)
}

export async function getPublishedArticleBySlug(slug) {
  return allArticles.find((article) => article.slug === slug && isPublicArticle(article)) || null
}

export async function getRelatedArticles(article, limit = 3) {
  if (!article) return []
  return allArticles
    .filter(
      (item) => isPublicArticle(item) && item.slug !== article.slug && item.category_id === article.category_id,
    )
    .slice(0, limit)
}
