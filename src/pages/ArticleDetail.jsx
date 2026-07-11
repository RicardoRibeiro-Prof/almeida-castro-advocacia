import { ArrowLeft, CalendarDays, Clock3, MessageCircle, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ArticleCard from '../components/ArticleCard'
import LoadingSpinner from '../components/LoadingSpinner'
import Seo from '../components/Seo'
import { getPublishedArticleBySlug, getRelatedArticles } from '../services/articleService'
import { formatDate } from '../utils/format'
import { sanitizeHtml } from '../utils/sanitize'
import NotFound from './NotFound'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=85'

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
  if (error) return <div className="container page-error"><p className="status-message status-message--error">{error}</p></div>
  if (!article) return null

  const shareText = `${article.title} - ${window.location.href}`
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`

  return (
    <>
      <Seo title={article.title} description={article.summary} image={article.cover_image_url} type="article" />
      <article className="article-page">
        <header className="article-header">
          <div className="container article-header__inner">
            <Link className="back-link" to="/artigos"><ArrowLeft size={17} /> Voltar aos artigos</Link>
            <span className="category-badge">{article.categories?.name || 'Informações Gerais'}</span>
            <h1>{article.title}</h1>
            <p className="article-header__summary">{article.summary}</p>
            <div className="article-header__meta">
              <span><UserRound size={17} /> {article.author_name}</span>
              <span><CalendarDays size={17} /> {formatDate(article.published_at)}</span>
              <span><Clock3 size={17} /> {article.reading_time || 3} min de leitura</span>
            </div>
          </div>
        </header>
        <div className="container article-cover"><img src={article.cover_image_url || FALLBACK_IMAGE} alt={`Imagem de capa do artigo: ${article.title}`} onError={(event) => { event.currentTarget.src = FALLBACK_IMAGE }} /></div>
        <div className="container article-layout">
          <div>
            <div className="article-content" dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }} />
            <div className="article-disclaimer"><strong>Aviso</strong><p>Este conteúdo possui caráter meramente informativo e não substitui uma análise jurídica individualizada.</p></div>
            <div className="article-share"><span>Compartilhe este conteúdo:</span><a className="button button--whatsapp button--small" href={shareUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} /> WhatsApp</a></div>
          </div>
          <aside className="article-sidebar">
            <div><span className="eyebrow">Sobre o conteúdo</span><p>Informação jurídica geral produzida para fins educativos, sem promessa de resultado ou recomendação individual.</p></div>
            <Link className="button button--outline" to="/contato">Entrar em contato</Link>
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section section--soft">
          <div className="container"><div className="related-heading"><div><span className="eyebrow">Continue lendo</span><h2>Artigos relacionados</h2></div><Link className="text-link" to="/artigos">Ver todos</Link></div><div className="article-grid">{related.map((item) => <ArticleCard key={item.id} article={item} compact />)}</div></div>
        </section>
      )}
    </>
  )
}
