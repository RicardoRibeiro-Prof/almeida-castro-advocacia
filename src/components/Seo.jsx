import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import SITE, {
  ALLOW_INDEXING,
  IS_DEMO,
  buildAssetUrl,
  buildCanonicalUrl,
  robotsContent,
} from '../config/site'

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }
  Object.entries(attributes).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') element.setAttribute(key, String(value))
  })
}

function upsertLink(selector, attributes) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('link')
    document.head.appendChild(element)
  }
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value))
}

function normalizeTitle(title) {
  if (!title) return SITE.name
  if (title.includes(SITE.name) || title.includes(SITE.shortName)) return title
  return `${title} | ${SITE.name}`
}

function normalizeSchemas(value) {
  if (!value) return []
  return Array.isArray(value) ? value.filter(Boolean) : [value]
}

export default function Seo({
  title,
  description = SITE.description,
  path,
  image = SITE.shareImage,
  imageAlt,
  type = 'website',
  noIndex = false,
  author,
  publishedTime,
  modifiedTime,
  section,
  structuredData,
}) {
  const location = useLocation()

  useEffect(() => {
    const fullTitle = normalizeTitle(title)
    const canonical = buildCanonicalUrl(path || location.pathname)
    const absoluteImage = buildAssetUrl(image)
    const resolvedImageAlt = imageAlt || title || SITE.name
    const shouldNoIndex = noIndex || IS_DEMO || !ALLOW_INDEXING

    document.documentElement.lang = SITE.language
    document.title = fullTitle

    upsertMeta('meta[name="description"]', { name: 'description', content: description })
    upsertMeta('meta[name="robots"]', { name: 'robots', content: robotsContent(shouldNoIndex) })
    upsertMeta('meta[name="googlebot"]', { name: 'googlebot', content: robotsContent(shouldNoIndex) })
    upsertMeta('meta[name="author"]', { name: 'author', content: author || SITE.author })
    upsertMeta('meta[name="theme-color"]', { name: 'theme-color', content: '#081a2e' })

    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: fullTitle })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: absoluteImage })
    upsertMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: resolvedImageAlt })
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE.name })
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: SITE.locale })

    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: fullTitle })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: absoluteImage })
    upsertMeta('meta[name="twitter:image:alt"]', { name: 'twitter:image:alt', content: resolvedImageAlt })

    if (type === 'article') {
      upsertMeta('meta[property="article:published_time"]', { property: 'article:published_time', content: publishedTime })
      upsertMeta('meta[property="article:modified_time"]', { property: 'article:modified_time', content: modifiedTime || publishedTime })
      upsertMeta('meta[property="article:author"]', { property: 'article:author', content: author || SITE.author })
      upsertMeta('meta[property="article:section"]', { property: 'article:section', content: section })
    }

    upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonical })

    const oldJsonLd = document.getElementById('seo-jsonld')
    if (oldJsonLd) oldJsonLd.remove()
    if (!IS_DEMO && ALLOW_INDEXING) {
      const schemas = normalizeSchemas(structuredData)
      if (schemas.length) {
        const script = document.createElement('script')
        script.id = 'seo-jsonld'
        script.type = 'application/ld+json'
        script.textContent = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas)
        document.head.appendChild(script)
      }
    }
  }, [
    author,
    description,
    image,
    imageAlt,
    location.pathname,
    modifiedTime,
    noIndex,
    path,
    publishedTime,
    section,
    structuredData,
    title,
    type,
  ])

  return null
}
