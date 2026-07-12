import { ArrowRight, CalendarDays, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDate } from '../utils/format'

const FALLBACK_IMAGE = `${import.meta.env.BASE_URL}images/articles/default.svg`

export default function ArticleCard({ article, compact = false }) {
  const articleUrl = `/artigos/${article.slug}`
  const imageAlt = article.cover_alt || `Ilustração do artigo ${article.title}`

  return (
    <article className={`article-card ${compact ? 'article-card--compact' : ''}`}>
      <Link className="article-card__image" to={articleUrl} aria-label={`Ler o artigo ${article.title}`}>
        <img
          src={article.cover_image_url || FALLBACK_IMAGE}
          alt={imageAlt}
          width="1200"
          height="630"
          loading="lazy"
          decoding="async"
          onError={(event) => { event.currentTarget.src = FALLBACK_IMAGE }}
        />
      </Link>
      <div className="article-card__body">
        <span className="category-badge">{article.categories?.name || 'Informações Gerais'}</span>
        <h3>
          <Link to={articleUrl}>{article.title}</Link>
        </h3>
        <p>{article.summary}</p>
        <div className="article-card__meta">
          <span><CalendarDays size={15} aria-hidden="true" /> <time dateTime={article.published_at}>{formatDate(article.published_at, { month: 'short' })}</time></span>
          <span><Clock3 size={15} aria-hidden="true" /> {article.reading_time || 3} min</span>
        </div>
        <Link className="text-link" to={articleUrl} aria-label={`Continuar lendo: ${article.title}`}>
          Continuar lendo <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}
