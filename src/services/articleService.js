import DOMPurify from 'dompurify'
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
  const fallback = 'images/articles/general.jpg'
  const asset = value || fallback
  if (/^(https?:|data:|blob:)/i.test(asset)) return asset
  return `${import.meta.env.BASE_URL}${asset.replace(/^\/+/, '')}`
}

function splitFrontmatter(raw = '') {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/)
  if (!match) return { attributes: {}, body: raw }
  return { attributes: load(match[1]) || {}, body: match[2].trim() }
}

function toIsoDate(value, fallback = new Date().toISOString()) {
  if (!value) return fallback
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? fallback : date.toISOString()
}

function estimateReadingTime(markdown = '') {
  const plainText = stripHtml(marked.parse(markdown))
  const wordCount = plainText.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / 200))
}

function normalizeKeywords(value) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean)
  if (typeof value === 'string') return value.split(',').map((item) => item.trim()).filter(Boolean)
  return []
}

function normalizeArticle(filePath, raw) {
  const { attributes, body } = splitFrontmatter(raw)
  const fileSlug = filePath.split('/').pop().replace(/\.md$/, '')
  const categoryName = attributes.category || 'Informações Gerais'
  const categorySlug = createSlug(categoryName)
  const publishedAt = toIsoDate(attributes.date || attributes.published_at)
  const updatedAt = toIsoDate(attributes.updatedAt || attributes.updated_at, publishedAt)
  const parsedContent = marked.parse(body)

  return {
    id: filePath,
    title: attributes.title || 'Artigo sem título',
    slug: attributes.slug || fileSlug,
    summary: attributes.excerpt || attributes.summary || '',
    excerpt: attributes.excerpt || attributes.summary || '',
    content: DOMPurify.sanitize(parsedContent, { USE_PROFILES: { html: true } }),
    content_markdown: body,
    cover_image_url: resolvePublicAsset(attributes.cover),
    cover_alt: attributes.coverAlt || attributes.cover_alt || `Fotografia ilustrativa do artigo ${attributes.title || fileSlug}`,
    canonical: attributes.canonical || '',
    no_index: Boolean(attributes.noIndex || attributes.no_index),
    keywords: normalizeKeywords(attributes.keywords),
    category_id: categorySlug,
    author_name: attributes.author || 'Almeida & Castro Advocacia',
    reading_time: Number(attributes.readingTime || attributes.reading_time) || estimateReadingTime(body),
    status: attributes.published === false ? 'draft' : 'published',
    featured: Boolean(attributes.featured),
    published_at: publishedAt,
    created_at: toIsoDate(attributes.createdAt || attributes.created_at, publishedAt),
    updated_at: updatedAt,
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
