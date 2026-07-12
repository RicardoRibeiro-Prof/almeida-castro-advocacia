import { ArrowLeft, CalendarDays, Clock3, MessageCircle, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ArticleCard from '../components/ArticleCard'
import Breadcrumbs from '../components/Breadcrumbs'
import LoadingSpinner from '../components/LoadingSpinner'
import Seo from '../components/Seo'
import SITE, { buildAssetUrl, buildCanonicalUrl } from '../config/site'
import { getPublishedArticleBySlug, getRelatedArticles } from '../services/articleService'
import { formatDate } from '../utils/format'
import { sanitizeHtml } from '../utils/sanitize'
import NotFound from './NotFound'

const FALLBACK_IMAGE = `${import.meta.env.BASE_URL}images/articles/default.svg`

export default function ArticleDetail() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    setError('')
    getPublishedArticleBySlug(slug)
      .then(async (data) => {
        if (!data) {
          setNotFound(true)
          return
        }
        setArticle(data)
        setRelated(await getRelatedArticles(data, 3))
      })
      .catch(() => setError('Não foi possível carregar este artigo.'))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="page-loading"><LoadingSpinner label="Carregando artigo..." /></div>
  if (notFound) return <NotFound />
  if (error) return <div className="container page-error"><p className="status-message status-message--error" role="alert">{error}</p></div>
  if (!article) return null

  const articlePath = `/artigos/${article.slug}`
  const canonical = article.canonical || buildCanonicalUrl(articlePath)
  const shareText = `${article.title} - ${canonical}`
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: buildCanonicalUrl('/') },
        { '@type': 'ListItem', position: 2, name: 'Artigos', item: buildCanonicalUrl('/artigos') },
        { '@type': 'ListItem', position: 3, name: article.title, item: canonical },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: article.title,
      description: article.summary,
      image: buildAssetUrl(article.cover_image_url),
      author: { '@type': 'Person', name: article.author_name },
      publisher: {
        '@type': 'Organization',
        name: SITE.name,
        logo: { '@type': 'ImageObject', url: buildAssetUrl(SITE.logo) },
      },
      datePublished: article.published_at,
      dateModified: article.updated_at,
      articleSection: article.categories?.name,
      mainEntityOfPage: canonical,
    },
  ]

  return (
    <>
      <Seo
        title={article.title}
        description={article.summary}
        path={articlePath}
        image={article.cover_image_url}
        imageAlt={article.cover_alt}
        type="article"
        noIndex={article.no_index}
        author={article.author_name}
        publishedTime={article.published_at}
        modifiedTime={article.updated_at}
        section={article.categories?.name}
        structuredData={structuredData}
      />
      <article className="article-page">
        <header className="article-header">
          <div className="container article-header__inner">
            <Breadcrumbs items={[
              { label: 'Início', to: '/' },
              { label: 'Artigos', to: '/artigos' },
              { label: article.title },
            ]} />
            <Link className="back-link" to="/artigos"><ArrowLeft size={17} aria-hidden="true" /> Voltar aos artigos</Link>
            <span className="category-badge">{article.categories?.name || 'Informações Gerais'}</span>
            <h1>{article.title}</h1>
            <p className="article-header__summary">{article.summary}</p>
            <div className="article-header__meta">
              <span><UserRound size={17} aria-hidden="true" /> {article.author_name}</span>
              <span><CalendarDays size={17} aria-hidden="true" /> <time dateTime={article.published_at}>{formatDate(article.published_at)}</time></span>
              <span><Clock3 size={17} aria-hidden="true" /> {article.reading_time || 3} min de leitura</span>
            </div>
          </div>
        </header>
        <div className="container article-cover">
          <img
            src={article.cover_image_url || FALLBACK_IMAGE}
            alt={article.cover_alt || `Imagem de capa do artigo ${article.title}`}
            width="1200"
            height="630"
            decoding="async"
            fetchPriority="high"
            onError={(event) => { event.currentTarget.src = FALLBACK_IMAGE }}
          />
        </div>
        <div className="container article-layout">
          <div>
            <div className="article-content" dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }} />
            <div className="article-disclaimer"><strong>Aviso</strong><p>Este conteúdo possui caráter meramente informativo e não substitui uma análise jurídica individualizada.</p></div>
            <div className="article-share"><span>Compartilhe este conteúdo:</span><a className="button button--whatsapp button--small" href={shareUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} aria-hidden="true" /> WhatsApp</a></div>
          </div>
          <aside className="article-sidebar" aria-label="Informações sobre o conteúdo">
            <div><span className="eyebrow">Sobre o conteúdo</span><p>Informação jurídica geral produzida para fins educativos, sem promessa de resultado ou recomendação individual.</p></div>
            <Link className="button button--outline" to="/contato">Entrar em contato</Link>
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section section--soft" aria-labelledby="related-title">
          <div className="container"><div className="related-heading"><div><span className="eyebrow">Continue lendo</span><h2 id="related-title">Artigos relacionados</h2></div><Link className="text-link" to="/artigos">Ver todos</Link></div><div className="article-grid">{related.map((item) => <ArticleCard key={item.id} article={item} compact />)}</div></div>
        </section>
      )}
    </>
  )
}
